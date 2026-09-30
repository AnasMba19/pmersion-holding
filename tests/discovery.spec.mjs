import { expect, test } from "@playwright/test";

const key = "pmersion.public-discovery.v1";
async function fit(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}
async function decide(page, option = 0) {
  await expect(page.getByRole("button", { name: "Confirmer ma décision" })).toBeDisabled();
  await page.getByRole("radio").nth(option).check();
  await page.getByRole("button", { name: "Confirmer ma décision" }).click();
  await expect(page.getByRole("heading", { name: "Votre décision et ses effets", exact: true })).toBeVisible();
  await fit(page);
}

test("a public visitor reaches a real six-decision summary without an account", async ({ page, context }, testInfo) => {
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (!request.url().startsWith("http://127.0.0.1:4180/") && !request.url().startsWith("data:")) external.push(request.url()); });
  await page.goto("/");
  await expect(page.getByText("Accessible sans compte", { exact: true })).toBeVisible();
  await fit(page);
  await page.screenshot({ path: testInfo.outputPath("01-public-home.png"), fullPage: true });
  await page.getByRole("link", { name: "Essayer la bêta PMersion" }).click();
  await expect(page.getByRole("heading", { name: "Vos décisions donnent forme au projet." })).toBeVisible();
  await fit(page);
  await page.screenshot({ path: testInfo.outputPath("02-beta-entry.png"), fullPage: true });
  await page.getByRole("link", { name: "Commencer la simulation" }).click();
  await fit(page);
  await page.screenshot({ path: testInfo.outputPath("03-decision.png"), fullPage: true });
  for (let index = 0; index < 6; index++) {
    await decide(page);
    if (index === 0) {
      await page.screenshot({ path: testInfo.outputPath("04-consequence.png"), fullPage: true });
      await page.reload();
      await expect(page.getByText("Clarifier avant d'engager", { exact: true }).first()).toBeVisible();
    }
    await page.getByRole("link", { name: index === 5 ? "Découvrir mon bilan" : "Passer à la décision suivante" }).click();
  }
  await expect(page.getByRole("heading", { name: "Votre bilan de simulation." })).toBeVisible();
  await expect(page.getByRole("meter")).toHaveCount(6);
  await expect(page.getByRole("meter", { name: "Clarté du périmètre" })).toHaveAttribute("value", "92");
  await expect(page.getByRole("meter", { name: "Exposition au risque" })).toHaveAttribute("value", "0");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Votre bilan de simulation." })).toBeVisible();
  await fit(page);
  await page.screenshot({ path: testInfo.outputPath("05-summary.png"), fullPage: true });
  await page.getByRole("link", { name: "Relire le raisonnement" }).first().click();
  await expect(page.getByRole("meter", { name: "Clarté du périmètre" })).not.toHaveAttribute("value", "92");
  await expect(page.getByRole("button", { name: "Confirmer ma décision" })).toHaveCount(0);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  expect(await context.cookies()).toEqual([]);
});

test("locked routes and unknown routes stay recoverable", async ({ page }) => {
  await page.goto("/beta/#/situation/6");
  await expect(page.getByRole("heading", { name: "Reprenons au bon endroit." })).toBeVisible();
  await page.getByRole("link", { name: "Reprendre le parcours" }).click();
  await expect(page.getByRole("heading", { name: "Cadrer le mandat", exact: true })).toBeVisible();
  await page.goto("/beta/#/bilan");
  await expect(page.getByRole("heading", { name: "Votre bilan se construit." })).toBeVisible();
  await page.goto("/beta/#/unknown");
  await expect(page.getByRole("link", { name: "Reprendre le parcours" })).toBeVisible();
});

test("corrupted progress requires a confirmed reset and preserves unrelated data", async ({ page }) => {
  await page.goto("/beta/");
  await page.evaluate((key) => { localStorage.setItem(key, "broken"); localStorage.setItem("unrelated", "keep"); }, key);
  await page.reload();
  await expect(page.getByText(/La sauvegarde est illisible/)).toBeVisible();
  await page.getByRole("link", { name: "Recommencez la simulation", exact: true }).click();
  await page.getByRole("button", { name: "Recommencer ma simulation", exact: true }).click();
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe("broken");
  await page.getByRole("button", { name: "Recommencer ma simulation", exact: true }).click();
  await page.getByRole("button", { name: "Effacer et recommencer", exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(null);
  expect(await page.evaluate(() => localStorage.getItem("unrelated"))).toBe("keep");
  await page.getByRole("link", { name: "Commencer la simulation" }).click();
  await decide(page, 1);
});

test("storage denial allows a clearly labeled session without crashing", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new DOMException("denied", "SecurityError"); } }); });
  await page.goto("/beta/");
  await expect(page.getByText(/La sauvegarde est indisponible/)).toBeVisible();
  await page.getByRole("link", { name: "Commencer la simulation" }).click();
  await decide(page, 2);
  await expect(page.getByText(/La sauvegarde sur ce navigateur est indisponible/)).toBeVisible();
  await page.getByRole("link", { name: "Passer à la décision suivante" }).click();
  await decide(page);
});

test("another tab cannot overwrite a newer decision and keyboard controls work", async ({ page, context }) => {
  await page.goto("/beta/#/situation/1");
  const second = await context.newPage();
  await second.goto("/beta/#/situation/1");
  await page.getByRole("radio").first().focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Confirmer ma décision" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Votre décision et ses effets", exact: true })).toBeFocused();
  await expect(second.getByRole("heading", { name: "Votre décision et ses effets", exact: true })).toBeVisible();
  expect(await second.evaluate((key) => JSON.parse(localStorage.getItem(key)).choices.length, key)).toBe(1);
  await second.close();
});
