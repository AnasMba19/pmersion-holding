import { expect, test } from "@playwright/test";

const amount = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
const workshop = "/beta/#/atelier/budget";
async function noOverflow(page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
}
async function capture(page, info, name) {
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true });
  await page.screenshot({ path: info.outputPath(`${name}-viewport.png`) });
}

test("dossier evidence is readable, sourced and navigable", async ({ page }, info) => {
  await page.goto(workshop);
  await expect(page).toHaveTitle("Dossier budget — PMersion");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Le budget dérive.");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await capture(page, info, "01-dossier");
  await noOverflow(page);
  await page.getByRole("button", { name: /Situation financière/ }).click();
  await expect(page.getByRole("article", { name: "Situation financière" })).toContainText(
    amount(420_000),
  );
  await expect(page.getByRole("article", { name: "Situation financière" })).toContainText(
    "ne réduisent pas le coût prévu",
  );
  await page.getByRole("button", { name: /Note des achats/ }).click();
  await expect(page.getByRole("article", { name: "Note des achats" })).toContainText("40 000 €");
  await expect(page.getByRole("article", { name: "Note des achats" })).toContainText(
    "Les coûts restent dus",
  );
  await page.getByRole("link", { name: "Comparer les stratégies" }).click();
  await expect(page).toHaveTitle("Comparaison budget — PMersion");
  await noOverflow(page);
});

test("savings produce a conditional note without changing the existing journey", async ({
  page,
}, info) => {
  const externalRequests = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4180") && !request.url().startsWith("data:"))
      externalRequests.push(request.url());
  });
  await page.goto("/beta/");
  await page.getByRole("link", { name: "Commencer la simulation" }).click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Confirmer ma décision" }).click();
  const original = await page.evaluate(() => localStorage.getItem("pmersion.public-discovery.v1"));
  await page.goto(`${workshop}?vue=comparer`);
  await expect(page.getByTestId("budget-forecast")).toHaveText(amount(1_090_000));
  const slider = page.getByRole("slider");
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveValue("40000");
  await expect(page.getByTestId("budget-forecast")).toHaveText(amount(1_050_000));
  await expect(page.getByTestId("budget-variance")).toHaveText(`+${amount(50_000)}`);
  await slider.press("Home");
  await expect(page.getByTestId("budget-forecast")).toHaveText(amount(1_090_000));
  await slider.press("End");
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await capture(page, info, "02-comparison");
  await noOverflow(page);
  await page.getByRole("button", { name: /Préparer ma note/ }).click();
  await expect(page).toHaveTitle("Note d’arbitrage budget — PMersion");
  await expect(page.getByRole("article")).toContainText(amount(1_050_000));
  await expect(page.getByRole("article")).toContainText("Non enregistrée");
  await capture(page, info, "03-note");
  await noOverflow(page);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".budget-sidebar")).toBeHidden();
  await expect(page.getByRole("article")).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  expect(await page.evaluate(() => localStorage.getItem("pmersion.public-discovery.v1"))).toBe(
    original,
  );
  expect(externalRequests).toEqual([]);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Une hypothèse d’abord.");
  await page.getByRole("link", { name: "Le parcours", exact: true }).click();
  await expect(page.getByText("1 / 6 décisions réalisées", { exact: true })).toBeVisible();
});

test("postponement is never counted as savings and switching strategy clears assumptions", async ({
  page,
}, info) => {
  await page.goto(`${workshop}?vue=comparer`);
  await page.getByRole("radio", { name: /Geler certaines dépenses/ }).check();
  const slider = page.getByRole("slider");
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveValue("60000");
  await expect(page.getByTestId("budget-forecast")).toHaveText(amount(1_090_000));
  await expect(page.getByTestId("budget-postponed")).toHaveText(amount(60_000));
  await expect(page.getByTestId("budget-variance")).toHaveText(`+${amount(90_000)}`);
  await page.getByRole("button", { name: /Préparer ma note/ }).click();
  await expect(page.getByRole("article")).toContainText("Ce montant n’est pas une économie");
  await page.getByRole("link", { name: "Revenir à la comparaison" }).click();
  await expect(slider).toHaveValue("60000");
  await page.getByRole("radio", { name: /Revoir les options/ }).check();
  await expect(slider).toHaveValue("0");
  await page.getByRole("radio", { name: /Absorber plus tard/ }).check();
  await expect(slider).toHaveCount(0);
  await expect(page.getByTestId("budget-forecast")).toHaveText(amount(1_090_000));
  await noOverflow(page);
  await capture(page, info, "04-no-lever");
});
