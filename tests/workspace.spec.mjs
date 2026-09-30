import { expect, test } from "@playwright/test";

const key = "pmersion.public-workspace.v1";
const euro = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
async function capture(page, info, name) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true });
  await page.screenshot({ path: info.outputPath(`${name}-viewport.png`) });
}
test("drafts persist and retained decisions form a common report, independently of later edits", async ({
  page,
}, info) => {
  await page.goto("/beta/#/atelier/synthese");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Votre dossier se construit.");
  await page.goto("/beta/#/atelier/risques");
  await page.getByRole("button", { name: /J5/ }).click();
  await page.getByRole("checkbox", { name: /Alternative qualifiée/ }).check();
  await page.getByRole("button", { name: "Retenir pour la synthèse", exact: true }).click();
  await expect(
    page.getByText("Cette version est dans votre synthèse.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Version retenue pour votre synthèse.");
  await page.goto("/beta/#/atelier/budget?vue=comparer");
  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  await expect(page.getByTestId("budget-forecast")).toHaveText(euro(1050000));
  await page.getByRole("button", { name: /Retenir et préparer ma note/ }).click();
  await expect(page.getByRole("article")).toContainText(euro(1050000));
  await page.goto("/beta/#/atelier/planning");
  await page.getByRole("checkbox", { name: "Interfaces techniques validées" }).check();
  await page.getByRole("checkbox", { name: "Récupération effectivement vérifiée" }).check();
  await page.getByRole("button", { name: "Retenir pour la synthèse", exact: true }).click();
  await expect(
    page.getByText("Cette version est dans votre synthèse.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Version retenue pour votre synthèse.");
  await page.reload();
  await expect(page.getByTestId("planning-finish")).toHaveText("J56");
  await expect(
    page.getByRole("checkbox", { name: "Récupération effectivement vérifiée" }),
  ).toBeChecked();
  await page.getByRole("checkbox", { name: "Récupération effectivement vérifiée" }).uncheck();
  await expect(page.getByTestId("planning-finish")).toHaveText("J60");
  await page.getByRole("link", { name: "Synthèse du comité", exact: true }).click();
  await expect(page.getByTestId("synthesis-cost")).toHaveText(euro(1061000));
  await expect(page.getByTestId("synthesis-date")).toHaveText("J56");
  await expect(page.getByText("8 / 25", { exact: true })).toBeVisible();
  await capture(page, info, "08-my-workspace");
  await page.reload();
  await expect(page.getByTestId("synthesis-date")).toHaveText("J56");
  await page.getByRole("link", { name: "Revoir le planning →", exact: true }).click();
  await page.getByRole("button", { name: "Retenir pour la synthèse", exact: true }).click();
  await expect(
    page.getByText("Cette version est dans votre synthèse.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Version retenue pour votre synthèse.");
  await page.goto("/beta/#/atelier/synthese");
  await expect(page.getByTestId("synthesis-date")).toHaveText("J60");
});
test("local dossier exports and reset preserves discovery and unrelated data", async ({
  page,
}, info) => {
  await page.goto("/beta/#/atelier/budget?vue=comparer");
  await page.getByRole("button", { name: "Retenir pour la synthèse", exact: true }).click();
  await expect(
    page.getByText("Cette version est dans votre synthèse.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Version retenue pour votre synthèse.");
  await page.evaluate(() => {
    localStorage.setItem("unrelated-value", "keep");
  });
  const discovery = await page.evaluate(() => localStorage.getItem("pmersion.public-discovery.v1"));
  await page.goto("/beta/#/donnees");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter mon dossier JSON" }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe("pmersion-synapse-mon-dossier.json");
  const body = await (await import("node:fs/promises")).readFile(await file.path(), "utf8");
  const exported = JSON.parse(body);
  expect(exported.workspace.retained.budget.draft.response).toBe("reforecast_and_options");
  expect(exported.projection).toBeNull();
  await page.getByRole("button", { name: "Réinitialiser les ateliers" }).click();
  await expect(
    page.getByRole("button", { name: "Effacer le dossier d’ateliers", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).not.toBeNull();
  await page.getByRole("button", { name: "Réinitialiser les ateliers" }).click();
  await page.getByRole("button", { name: "Effacer le dossier d’ateliers", exact: true }).click();
  await expect(
    page.getByText("Dossier d’ateliers effacé. Vos six décisions de découverte sont conservées.", {
      exact: true,
    }),
  ).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("pmersion.public-discovery.v1"))).toBe(
    discovery,
  );
  expect(await page.evaluate(() => localStorage.getItem("unrelated-value"))).toBe("keep");
  await capture(page, info, "09-data");
});
test("an outdated tab cannot overwrite a newer workspace", async ({ page, context }) => {
  await page.goto("/beta/#/atelier/budget?vue=comparer");
  const other = await context.newPage();
  await other.goto("/beta/#/atelier/planning");
  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  await expect(page.getByTestId("budget-forecast")).toHaveText(euro(1050000));
  await expect(
    other.getByRole("button", { name: "Charger la version de l’autre onglet" }),
  ).toBeVisible();
  await expect(
    other.getByRole("checkbox", { name: "Interfaces techniques validées" }),
  ).toBeDisabled();
  await other.getByRole("button", { name: "Charger la version de l’autre onglet" }).click();
  await expect(
    other.getByRole("checkbox", { name: "Interfaces techniques validées" }),
  ).toBeEnabled();
  await other.getByRole("checkbox", { name: "Interfaces techniques validées" }).check();
  await expect(
    other.getByRole("checkbox", { name: "Interfaces techniques validées" }),
  ).toBeChecked();
  expect(
    await other.evaluate((key) => JSON.parse(localStorage.getItem(key)).drafts.budget.amount, key),
  ).toBe(40000);
});
test("future storage is protected until explicit reset and unavailable storage remains usable", async ({
  page,
  context,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, '{"version":"future"}');
  }, key);
  await page.goto("/beta/#/atelier/planning");
  await expect(page.getByText(/Ce dossier est illisible/)).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Interfaces techniques validées" }),
  ).toBeDisabled();
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe('{"version":"future"}');
  const unavailable = await context.newPage();
  await unavailable.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  await unavailable.goto("/beta/#/atelier/planning");
  await expect(unavailable.getByText(/Sauvegarde locale indisponible/)).toBeVisible();
  await unavailable.getByRole("checkbox", { name: "Interfaces techniques validées" }).check();
  await unavailable.getByRole("checkbox", { name: "Récupération effectivement vérifiée" }).check();
  await expect(unavailable.getByTestId("planning-finish")).toHaveText("J56");
});
test("method resources adapt questions to sector context and remain readable on mobile", async ({
  page,
}, info) => {
  await page.goto("/beta/#/reperes");
  await page.getByRole("button", { name: /Budget et prévision/ }).click();
  await expect(
    page.getByRole("heading", { name: "Quel coût final est défendable aujourd’hui ?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Construction", exact: true }).click();
  await expect(page.getByRole("heading", { name: /libérer le lot suivant/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /ISO 21502/ })).toHaveAttribute(
    "href",
    "https://www.iso.org/standard/74947.html",
  );
  await capture(page, info, "10-method");
});
