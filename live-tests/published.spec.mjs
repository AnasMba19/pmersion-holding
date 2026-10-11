import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const release = JSON.parse(readFileSync(new URL("../beta/release.json", import.meta.url), "utf8"));
const KEY = "pmersion.construction-hotel.v1";
async function published(request) {
  await expect.poll(async () => {
    try {
      const response = await request.get("/beta/release.json", { timeout: 15000 });
      if (!response.ok()) return null;
      const remote = await response.json();
      return remote.sourceCommit === release.sourceCommit ? remote.version : null;
    } catch { return null; }
  }, { timeout: 120000, intervals: [2000, 5000, 10000] }).toBe(release.version);
}
async function stored(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key) || "null"), KEY);
}

test("published homepage and project hierarchy use the qualified release", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/classique.html");
  await expect(page.locator("[data-world-family] option")).toHaveCount(22);
  await expect(page.locator(".header-cta,.final-cta .button")).toHaveCount(2);
  await page.getByLabel("Secteur d’activité", { exact: true }).selectOption("numerique");
  await page.getByLabel("Type de projet", { exact: true }).selectOption("sirh");
  await page.getByLabel("Phase du projet", { exact: true }).selectOption("reception");
  await page.locator('[data-world-interface="2"]').click();
  await expect(page.getByLabel("Secteur d’activité", { exact: true })).toHaveValue("numerique");
  await expect(page.getByLabel("Type de projet", { exact: true })).toHaveValue("sirh");
  await expect(page.getByLabel("Phase du projet", { exact: true })).toHaveValue("reception");
  await expect(page.locator("[data-world-kicker]")).toHaveText("Réception et transition");
  await expect(page.locator('[data-world-interface="2"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-world-focus]")).toHaveText("Paramétrage → reprise fictive → recette → transition. Quelle preuve permet d’accepter le résultat et de passer le relais ?");
  await expect(page.locator("[data-world-open]")).toHaveAttribute("href", /\/beta\/#\/univers\/numerique\?environnement=sirh&phase=reception$/);
  await expect.poll(() => page.locator(".world-model").evaluate(model => {
    const last = model.querySelector(".context-map li:last-child").getBoundingClientRect();
    const scene = model.querySelector("[data-world-scene]").getBoundingClientRect();
    const label = model.querySelector(".world-model-label").getBoundingClientRect();
    return last.bottom <= scene.bottom + 1 && scene.bottom <= label.top + 1 &&
      label.bottom <= model.getBoundingClientRect().bottom + 1;
  })).toBe(true);
  await page.locator(".world-model").screenshot({ path: info.outputPath("published-diagram.png") });
  await page.screenshot({ path: info.outputPath("published-home.png"), fullPage: false });
  await page.locator("[data-world-open]").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SIRH");
  await expect(page.getByText("Un dossier de contexte, sans simulation chiffrée pour ce projet.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-context.png"), fullPage: false });
});

test("published Hotel decision is retained and survives a normal reload", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/beta/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Le projet avance");
  await page.screenshot({ path: info.outputPath("published-studio.png"), fullPage: false });
  await page.getByRole("link", { name: "Ouvrir la mission chantier", exact: false }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Un retard fournisseur");
  await page.getByRole("radio", { name: /Accélérer le fournisseur/ }).check();
  const recovery = page.getByLabel(/Récupération demandée/);
  await recovery.focus();
  await recovery.press("ArrowRight");
  await expect(recovery).toHaveValue("1");
  await page.locator("#construction-justification").fill("Essai fictif : obtenir un engagement écrit du fabricant avant de retenir la récupération proposée.");
  await page.locator("#construction-assumptions").fill("Transport et dossier de contrôle restent à confirmer dans cette simulation.");
  await page.locator("#construction-owner").fill("Responsable achats fictif");
  await page.locator("#construction-action").fill("Confirmer la capacité et le dossier des essais.");
  const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  await page.locator("#construction-date").fill(date);
  await expect.poll(async () => (await stored(page))?.draft.action.dueDate).toBe(date);
  expect((await stored(page)).twin.version).toBe(0);
  await page.getByRole("button", { name: /Retenir le plan/ }).click();
  await expect.poll(async () => (await stored(page))?.twin.version).toBe(1);
  const trace = (await stored(page)).twin.history[0];
  expect(trace.after.schedule.finishDay).toBe(49);
  await page.reload();
  await expect(page.locator(".studio-history>li")).toHaveCount(1);
  await expect(page.locator(".studio-history blockquote")).toContainText("engagement écrit");
  expect((await stored(page)).twin.history[0]).toEqual(trace);
  await page.getByRole("link", { name: "← Studio de simulation" }).click();
  await expect(page.locator(".studio-version").first()).toContainText("v1");
  await expect(page.locator(".studio-next")).toContainText("Responsable achats fictif");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-studio-retained.png"), fullPage: false });
});


test("published sector mission retains a conditional forecast and resumes the dossier", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/beta/#/missions");
  await expect(page.locator(".case-card")).toHaveCount(6);
  await page.getByLabel("Filtrer les missions par secteur").selectOption("numerique");
  await page.locator(".case-card").press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SIRH · bascule de la paie");
  await page.getByLabel("Accélérer la livraison", { exact: true }).check();
  await expect(page.locator(".case-metrics").first()).toContainText("J32");
  await page.getByLabel("Conditions de récupération confirmées", { exact: false }).check();
  await expect(page.locator(".case-metrics").first()).toContainText("J28");
  await page.getByLabel("Votre recommandation", { exact: false }).fill("Je retiens une accélération confirmée pour récupérer quatre jours, en maintenant la recette de paie et la validation finale.");
  await page.getByLabel("Condition à vérifier", { exact: false }).fill("Confirmation écrite de la capacité de livraison.");
  await page.getByLabel("Responsable de l’action").fill("PMO de simulation");
  await page.getByLabel("Action concrète").fill("Obtenir l’engagement écrit du fournisseur.");
  await page.getByLabel("Échéance", { exact: false }).fill("3");
  await page.getByRole("button", { name: "Retenir cette décision", exact: true }).click();
  await expect(page.getByText("Décision v1", { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Décision v1", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("sector-sirh-live.png"), fullPage: true });
});


test("published studio retains selected proof and MOA responses while preserving the historical .3 study", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pratiquer le pilotage de projet");
  const archive = JSON.stringify({
    format: "hotel-mission-local.3",
    revision: 1,
    history: [{
      id: "published-archive-001",
      version: 1,
      model: "hotel-mission.3",
      inputs: {
        plan: { supply: "wait", prepare: false, checks: true },
        deliveryShift: 0,
        dailyMargin: 5000,
        evidence: [],
      },
      reasoning: "Étude historique fictive : préserver le modèle utilisé lors de cet arbitrage.",
      recordedAt: "2026-10-10T19:00:00Z",
    }],
  });
  // Write the fixture once. A reload must expose, rather than mask, an accidental overwrite.
  await page.evaluate(raw => localStorage.setItem("pmersion.hotel-mission.v3", raw), archive);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pratiquer le pilotage de projet");
  await page.getByRole("link", { name: "Ouvrir la mission Hôtel", exact: true }).click();
  await expect(page.locator("details.studio-model-disclosure")).toHaveJSProperty("open", false);
  const modelSummary = page.getByText("Explorer la maquette cible, en complément du dossier", { exact: true });
  await modelSummary.click();
  await expect(page.getByLabel("Chambre", { exact: true }).locator("option")).toHaveCount(120);
  await modelSummary.click();
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("alternative");
  await page.getByLabel("Préparer les tâches hors zone").check();
  await page.getByRole("link", { name: "Qualité", exact: true }).click();
  await page.getByLabel("Pièce du dossier", { exact: true }).selectOption("HOT-AC-ALT-INITIAL");
  await page.getByRole("button", { name: "Ajouter la pièce à l’étude", exact: true }).click();
  await expect(page.getByText("NC ouverte", { exact: true })).toBeVisible();
  await page.getByLabel("Pièce du dossier", { exact: true }).selectOption("HOT-AC-ALT-REPRISE");
  await page.getByRole("button", { name: "Ajouter la pièce à l’étude", exact: true }).click();
  await expect(page.getByText("NC ouverte", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Revue MOA", exact: true }).click();
  const questions = page.locator("fieldset").filter({ has: page.getByRole("radio") });
  await expect(questions).toHaveCount(3);
  for (const question of await questions.all()) await question.locator('input[value="verify"]').check();
  await page.getByLabel("Votre recommandation").fill("Je prépare la substitution avec ses réserves ; les interfaces et le standard du témoin restent à vérifier.");
  await page.getByRole("button", { name: "Conserver l’étude Hôtel", exact: true }).click();
  await expect(page.getByText("Étude, pièces choisies et réponses MOA conservées sur ce navigateur.")).toBeVisible();
  await page.getByRole("link", { name: "Bilan", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Votre étude conservée");
  await page.reload();
  await expect(page.getByRole("heading", { level: 2, name: /Ouverture J58/ })).toBeVisible();
  await expect(page.getByText(/0 NC constatées ; 3 preuves manquantes\./)).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("pmersion.hotel-scenario.v4")));
  expect(saved.history).toHaveLength(1);
  expect(saved.history[0].model).toBe("hotel-scenario.4");
  expect(saved.history[0].inputs.evidence).toEqual([{ id: "acoustics", documentId: "HOT-AC-ALT-REPRISE" }]);
  expect(saved.history[0].inputs.responses).toHaveLength(3);
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-mission.v3"))).toBe(archive);
  await page.getByText("Relire les études de l’ancien modèle Hôtel .3", { exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: /Ancienne prévision J68/ })).toBeVisible();
  await expect(page.getByText("hotel-mission.3", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-mission.v3"))).toBe(archive);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-new-studio.png"), fullPage: true });
});
