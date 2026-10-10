import { expect, test } from "@playwright/test";
const fit = async (page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
test("new studio exposes eight honest dossiers and a complete hotel workflow", async ({ page }) => {
  await page.goto("/beta/#/studio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Pratiquer le pilotage de projet",
  );
  await fit(page);
  await page.getByRole("link", { name: "Explorer les huit archétypes" }).click();
  await expect(page.locator(".studio-archetypes article")).toHaveCount(8);
  await expect(page.getByText("Dossier de contexte · moteur à développer")).toHaveCount(2);
  await page.getByRole("link", { name: "Examiner les trois pièces" }).first().click();
  await expect(page.locator(".studio-document")).toHaveCount(3);
  await page.goto("/beta/#/hotel");
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("alternative");
  await page.getByLabel("Préparer les tâches hors zone").check();
  await expect(page.locator(".studio-facts")).toContainText("J27");
  await fit(page);
  await page.screenshot({ path: test.info().outputPath("studio-hotel.png"), fullPage: true });
  await page.getByRole("link", { name: "Qualité", exact: true }).click();
  await page.getByRole("button", { name: "Ajouter le constat à l’étude" }).click();
  await expect(page.getByRole("cell", { name: "NC ouverte", exact: true })).toBeVisible();
  await page.getByLabel("Mesure d’isolement acoustique").fill("42");
  await page.getByLabel("Référence de la preuve").fill("HOT-Q02 · relevé fictif de reprise");
  await page.getByRole("button", { name: "Ajouter le constat à l’étude" }).click();
  await expect(page.getByRole("cell", { name: "NC ouverte", exact: true })).toHaveCount(0);
  await expect(page.getByText("Preuve manquante", { exact: true })).toHaveCount(3);
  await page.getByRole("link", { name: "Revue MOA", exact: true }).click();
  await expect(page.locator(".studio-objections li")).toHaveCount(3);
  await page
    .getByLabel("Votre recommandation")
    .fill(
      "Je qualifie la substitution sous réserve des interfaces et de l’accord de l’exploitant.",
    );
  await page.getByRole("button", { name: "Conserver l’étude Hôtel" }).click();
  await expect(
    page.getByText("Étude et preuves déclarées conservées sur ce navigateur."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Bilan", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Ouverture J58");
  await page.reload();
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Ouverture J58");
  await expect(page.getByText("0 NC constatées ; 3 preuves manquantes.")).toBeVisible();
  const data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("pmersion.hotel-mission.v3")),
  );
  expect(data.history).toHaveLength(1);
  expect(data.history[0].inputs.plan.supply).toBe("alternative");
  await fit(page);
});
test("quality fallback, unknown dossiers and future data remain usable without overwrite", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
    localStorage.setItem("pmersion.hotel-mission.v3", '{"format":"future"}');
  });
  await page.goto("/beta/#/hotel");
  await expect(page.getByText("La vue 3D est indisponible", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Approvisionnement", { exact: true })).toBeDisabled();
  await page.getByRole("link", { name: "Revue MOA", exact: true }).click();
  await expect(page.getByRole("button", { name: "Conserver l’étude Hôtel" })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-mission.v3"))).toBe(
    '{"format":"future"}',
  );
  await page.goto("/beta/#/projets/absent");
  await expect(page.getByRole("link", { name: "Revenir aux archétypes" })).toBeVisible();
  await fit(page);
});
