import { test, expect } from "@playwright/test";
const key = "pmersion.delivery-cases.v1";
test("mission library, filtering and keyboard navigation work without horizontal page overflow", async ({
  page,
}, info) => {
  await page.goto("/beta/#/missions");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Changez de projet");
  await expect(page.locator(".case-card")).toHaveCount(6);
  await page.getByLabel("Filtrer les missions par secteur").selectOption("numerique");
  await expect(page.locator(".case-card")).toHaveCount(1);
  await page.locator(".case-card").press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SIRH · bascule de la paie");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath("mission-sirh.png"), fullPage: true });
});
test("forecast responds to confirmation, note retains and reload restores without touching hotel", async ({
  page,
}, info) => {
  await page.goto("/beta/#/mission/cas/sirh");
  await page.getByLabel("Accélérer la livraison", { exact: true }).check();
  await expect(page.locator(".case-metrics").first()).toContainText("J32");
  await page.getByLabel("Conditions de récupération confirmées", { exact: false }).check();
  await expect(page.locator(".case-metrics").first()).toContainText("J28");
  await page.getByLabel("Les trois contrôles d’acceptation sont planifiés").check();
  await page
    .getByLabel("Votre recommandation", { exact: false })
    .fill(
      "Je retiens l’accélération avec capacité confirmée, pour réduire le retard de quatre jours sans supprimer les essais.",
    );
  await page
    .getByLabel("Condition à vérifier", { exact: false })
    .fill("Confirmation écrite du fournisseur avant engagement.");
  await page.getByLabel("Responsable de l’action").fill("PMO");
  await page
    .getByLabel("Action concrète")
    .fill("Obtenir la confirmation de capacité et de livraison.");
  await page.getByLabel("Échéance", { exact: false }).fill("3");
  await page.getByRole("button", { name: "Retenir cette décision", exact: true }).click();
  await expect(page.getByText("Décision v1", { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Décision v1", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Responsable de l’action")).toHaveValue("PMO");
  expect(
    await page.evaluate(() => localStorage.getItem("pmersion.construction-hotel.v1")),
  ).toBeNull();
  expect(
    await page.evaluate(() => localStorage.getItem("pmersion.public-discovery.v1")),
  ).toBeNull();
  await page.getByLabel("Configuration du projet").selectOption("tendu");
  await expect(page.getByText("Aucune décision retenue", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Responsable de l’action")).toHaveValue("");
  await page.getByLabel("Configuration du projet").selectOption("standard");
  await expect(page.getByLabel("Responsable de l’action")).toHaveValue("PMO");
  await page.screenshot({ path: info.outputPath("mission-sirh-retained.png"), fullPage: true });
  await page.goto("/beta/#/");
  await expect(page.locator(".case-dashboard-summary")).toContainText(
    "SIRH · bascule de la paie · v1",
  );
});
test("invalid data stays preserved, unknown routes are recoverable and required note focuses", async ({
  page,
}) => {
  await page.goto("/beta/#/mission/cas/sirh");
  await page.getByRole("button", { name: "Retenir cette décision", exact: true }).click();
  await expect(page.getByLabel("Votre recommandation", { exact: false })).toBeFocused();
  await expect(page.getByRole("alert")).toContainText("Complétez");
  await page.evaluate((k) => localStorage.setItem(k, '{"format":"future"}'), key);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Retenir cette décision", exact: true }),
  ).toBeDisabled();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe('{"format":"future"}');
  await page.goto("/beta/#/mission/cas/inconnue");
  await expect(
    page.getByRole("heading", { name: "Cette mission ou cette variante n’existe pas" }),
  ).toBeVisible();
});
test("stale tab blocks writes and explicit reload restores the newer draft", async ({
  page,
  context,
}) => {
  await page.goto("/beta/#/mission/cas/sirh");
  const second = await context.newPage();
  await second.goto("/beta/#/mission/cas/sirh");
  await second.getByLabel("Responsable de l’action").fill("Autre PMO");
  await expect(
    page.getByRole("button", { name: "Retenir cette décision", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Relire la sauvegarde des missions" }).click();
  await expect(page.getByLabel("Responsable de l’action")).toHaveValue("Autre PMO");
});
