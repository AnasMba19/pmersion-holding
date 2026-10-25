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

async function contextualAssistant(page) {
  const assistant = page.getByRole("complementary", { name: "Assistant PMersion", exact: true });
  await expect(assistant).toHaveCount(1);
  const disclosure = assistant.locator("details");
  const summary = disclosure.locator(":scope > summary");
  await expect(disclosure).toHaveJSProperty("open", false);
  await expect(summary).toContainText("Assistant IA");
  await expect(summary).toContainText("En cours");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveJSProperty("open", true);
  await expect(assistant).toContainText("Cette aide est rédigée à l’avance. L’IA est en préparation. Aucune analyse par IA ni aucun entraînement sur vos données n’est actif.");
  await expect(assistant.locator("input, textarea, input[type=file]")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await summary.focus();
  await page.keyboard.press("Space");
  await expect(disclosure).toHaveJSProperty("open", false);
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
  await page.goto("/beta/#/mission/overview");
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
  await page.goto("/#/studio");
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

test("published deeper archetype paths recover from a missing dossier through keyboard navigation", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const id of ["absent", "ouverture"]) {
    await page.goto(`/#/projets/${id}/sous-route`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dossier indisponible");
    await expect(page.getByText("Ce dossier n’existe pas", { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`published-missing-dossier-${id}.png`), fullPage: true });
    const back = page.getByRole("link", { name: "Revenir aux archétypes", exact: true });
    await back.focus();
    await expect(back).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choisir un enjeu de projet");
    await expect(page.locator(".studio-archetypes article")).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("published Next saves a fictional project and compares a detached copy without rewriting it", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const projectsKey = "pmersion.projects.v1";
  const labKey = "pmersion.decision-lab.v1";
  const raw = key => page.evaluate(name => localStorage.getItem(name), key);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Comprendre\s*avant d’agir\./);
  await expect(page.locator(".next-universe")).toHaveCount(3);
  await contextualAssistant(page);
  await page.getByRole("navigation", { name: "Univers PMersion" }).getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Piloter le projet");
  await expect(page.getByText("Données fictives uniquement.", { exact: true })).toBeVisible();
  await contextualAssistant(page);
  const views = page.getByRole("navigation", { name: "Vues du projet" });
  const beforeProject = await raw(projectsKey);
  await views.getByRole("link", { name: "Tableau Kanban", exact: true }).click();
  const title = "Vérification de publication fictive";
  await page.getByRole("button", { name: "Nouvelle tâche", exact: true }).click();
  await page.getByLabel("Titre de la tâche", { exact: true }).fill(title);
  await page.getByLabel("Responsable", { exact: true }).fill("Responsable fictif de la démonstration");
  await page.getByLabel("Date de début", { exact: true }).fill("2026-10-18");
  await page.getByLabel("Échéance", { exact: true }).fill("2026-10-21");
  await page.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  await page.getByLabel(`Déplacer ${title}`, { exact: true }).selectOption("done");
  await views.getByRole("link", { name: "Pilotage", exact: true }).click();
  await page.getByRole("button", { name: "Comparer une hypothèse dans Decision Lab", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  const beforeUrl = page.url();
  const beforeDocument = await page.evaluate(() => performance.timeOrigin);
  const dialogPromise = page.waitForEvent("dialog", { timeout: 5_000 });
  const reloadPromise = page.evaluate(() => window.location.reload());
  const dialog = await dialogPromise;
  expect(dialog.type()).toBe("beforeunload");
  await dialog.dismiss();
  await reloadPromise;
  await expect(page).toHaveURL(beforeUrl);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(beforeDocument);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  expect(await raw(projectsKey)).toBe(beforeProject);
  await page.getByRole("link", { name: "Ouvrir Projects", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Piloter le projet");
  await views.getByRole("link", { name: "Tableau Kanban", exact: true }).click();
  await expect(page.getByLabel(`Déplacer ${title}`, { exact: true })).toHaveValue("done");
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(page.getByText("Projet sauvegardé sur ce navigateur. Cette version sera reprise après rechargement.", { exact: true })).toBeVisible();
  const savedProject = await raw(projectsKey);
  expect(JSON.parse(savedProject).project.tasks.find(task => task.title === title).status).toBe("done");
  await page.reload();
  await expect(page.getByLabel(`Déplacer ${title}`, { exact: true })).toHaveValue("done");
  expect(await raw(projectsKey)).toBe(savedProject);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: info.outputPath("published-next-projects.png"), fullPage: false });
  await views.getByRole("link", { name: "Pilotage", exact: true }).click();
  await page.getByRole("button", { name: "Comparer une hypothèse dans Decision Lab", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  await expect(page).toHaveTitle("Decision Lab · PMersion");
  await contextualAssistant(page);
  const table = page.getByRole("table", { name: /Calcul sur la copie de révision / });
  const total = table.getByRole("row").filter({ has: page.getByRole("rowheader", { name: "Total sous hypothèses", exact: true }) });
  await expect(total.getByRole("cell")).toHaveText(["Non renseigné", "Non renseigné", "Non renseigné"]);
  expect(await raw(projectsKey)).toBe(savedProject);
  const note = "Hypothèse fictive de publication : comparer les variantes sans appliquer de changement au projet de référence.";
  await page.getByRole("textbox", { name: "Pourquoi cette variante, sous quelles réserves ?", exact: true }).fill(note);
  await page.getByRole("button", { name: "Conserver l’analyse", exact: true }).click();
  await expect(page.getByText(/Analyse \d+ conservée dans ce navigateur\. Le projet de référence n’a pas été modifié\./)).toBeVisible();
  const savedAnalysis = await raw(labKey);
  const analysis = JSON.parse(savedAnalysis).analyses.at(-1);
  expect(analysis.model).toBe("decision-lab.1");
  expect(analysis.note).toBe(note);
  expect(analysis.source.origin).toBe("projects");
  expect(analysis.source.reference).toEqual(JSON.parse(savedProject).project);
  expect(await raw(projectsKey)).toBe(savedProject);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  await expect(page.getByRole("textbox", { name: "Pourquoi cette variante, sous quelles réserves ?", exact: true })).toHaveValue(note);
  expect(await raw(labKey)).toBe(savedAnalysis);
  expect(await raw(projectsKey)).toBe(savedProject);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-next-lab.png"), fullPage: false });
});

test("published contextual assistance stays truthful and usable across the three public shells", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of ["learn", "simulate", "enterprise", "studio", "hotel", "atelier/planning", "donnees", "page-indisponible"]) {
    await page.goto(`/#/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await contextualAssistant(page);
    await expect(page.getByRole("main")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-contextual-assistant.png"), fullPage: false });
});

test("published recovery preserves an unsaved project and an unretained Lab note across confirmed reloads", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const raw = key => page.evaluate(name => localStorage.getItem(name), key);
  async function leaveAndReload() {
    const dialogPromise = page.waitForEvent("dialog", { timeout: 5000 });
    const reloadPromise = page.reload();
    const dialog = await dialogPromise;
    expect(dialog.type()).toBe("beforeunload");
    await dialog.accept();
    await reloadPromise;
  }
  await page.goto("/#/projects");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Piloter le projet");
  const before = await raw("pmersion.projects.v1");
  const title = "Récupération fictive de publication";
  await page.getByRole("button", { name: "Nouvelle tâche", exact: true }).click();
  await page.getByLabel("Titre de la tâche", { exact: true }).fill(title);
  await page.getByLabel("Responsable", { exact: true }).fill("Rôle fictif de vérification");
  await expect(page.getByText(/Copie de récupération enregistrée dans cet onglet\./)).toBeVisible();
  await leaveAndReload();
  await expect(page.getByLabel("Titre de la tâche", { exact: true })).toHaveValue(title);
  await expect(page.getByText("Brouillon repris dans cet onglet. La version sauvegardée n’a pas été modifiée.", { exact: true })).toBeVisible();
  expect(await raw("pmersion.projects.v1")).toBe(before);
  await page.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(page.getByText("Projet sauvegardé sur ce navigateur. Cette version sera reprise après rechargement.", { exact: true })).toBeVisible();
  const reference = await raw("pmersion.projects.v1");
  await page.getByRole("navigation", { name: "Vues du projet", exact: true }).getByRole("link", { name: "Pilotage", exact: true }).click();
  await page.getByRole("button", { name: "Comparer une hypothèse dans Decision Lab", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  const history = await raw("pmersion.decision-lab.v1");
  const note = "Hypothèse fictive en cours de rédaction : vérifier les moyens avant de retenir la comparaison.";
  await page.getByRole("textbox", { name: "Pourquoi cette variante, sous quelles réserves ?", exact: true }).fill(note);
  await expect(page.getByText(/Copie de récupération enregistrée dans cet onglet\./)).toBeVisible();
  await page.getByRole("navigation", { name: "Univers PMersion", exact: true }).getByRole("link", { name: "Learn", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Une méthode devient utile\s*quand on la pratique\./);
  await leaveAndReload();
  await page.getByRole("navigation", { name: "Univers PMersion", exact: true }).getByRole("link", { name: "Decision Lab", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  await expect(page.getByRole("textbox", { name: "Pourquoi cette variante, sous quelles réserves ?", exact: true })).toHaveValue(note);
  await expect(page.getByText("Brouillon d’analyse repris dans cet onglet. L’historique conservé et le projet de référence n’ont pas été modifiés.", { exact: true })).toBeVisible();
  expect(await raw("pmersion.projects.v1")).toBe(reference);
  expect(await raw("pmersion.decision-lab.v1")).toBe(history);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-next-recovered-note.png"), fullPage: false });
});

test("published Projects restores a portable export into a draft before an explicit save", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const key = "pmersion.projects.v1";
  const raw = () => page.evaluate(name => localStorage.getItem(name), key);
  await page.goto("/#/projects");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Piloter le projet");
  const reference = await raw();
  const waiting = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter le projet", exact: true }).click();
  const download = await waiting;
  const path = await download.path();
  expect(path).not.toBeNull();
  const original = JSON.parse(readFileSync(path, "utf8"));
  const incoming = structuredClone(original);
  incoming.project.title = "Restauration fictive de publication";
  async function inspect() {
    await page.getByRole("button", { name: "Importer un projet", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Importer un projet", exact: true });
    await dialog.getByLabel("Fichier de projet PMersion", { exact: true }).setInputFiles({ name: "projet-fictif.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(incoming)) });
    await expect(dialog.getByText(incoming.project.title, { exact: true })).toBeVisible();
    expect(await raw()).toBe(reference);
    await dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(incoming.project.title, { exact: true })).toBeVisible();
    expect(await raw()).toBe(reference);
  }
  await inspect();
  await page.getByRole("button", { name: "Annuler la restauration", exact: true }).click();
  await expect(page.getByText(original.project.title, { exact: true })).toBeVisible();
  expect(await raw()).toBe(reference);
  await inspect();
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(page.getByText("Projet sauvegardé sur ce navigateur. Cette version sera reprise après rechargement.", { exact: true })).toBeVisible();
  const saved = await raw();
  expect(JSON.parse(saved).project).toEqual(incoming.project);
  await page.reload();
  await expect(page.getByText(incoming.project.title, { exact: true })).toBeVisible();
  expect(await raw()).toBe(saved);
  await page.getByRole("button", { name: "Explorer Decision Lab sans modifier le projet", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  await expect(page.getByRole("heading", { level: 2, name: incoming.project.title, exact: true })).toBeVisible();
  expect(await raw()).toBe(saved);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-project-restored.png"), fullPage: false });
});

test("published Hotel episode preserves two recommendations and reloads their causal comparison", async ({ page, request }, info) => {
  await published(request);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/#/simulate/hotel-episode");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Le fournisseur change la donne");
  const keys = ["pmersion.hotel-scenario.v4", "pmersion.projects.v1", "pmersion.decision-lab.v1"];
  const snapshots = () => page.evaluate(names => Object.fromEntries(names.map(name => [name, localStorage.getItem(name)])), keys);
  const before = await snapshots();
  const episode = async () => JSON.parse(await page.evaluate(() => localStorage.getItem("pmersion.hotel-episode.v1")) || "null");
  await page.getByText("Examiner les pièces de contrôle", { exact: true }).click();
  for (const [label, value] of [
    ["Zone témoin fermée et protégée", "HOT-ZONE-REPRISE"],
    ["Performance acoustique du produit proposé", "HOT-AC-REF"],
    ["Interfaces et dimensions visées", "HOT-IF-REF"],
    ["Standard témoin approuvé pour le produit proposé", "HOT-TEM-REF"]
  ]) await page.getByLabel(`Pièce pour : ${label}`, { exact: true }).selectOption(value);
  const projection = page.getByRole("complementary", { name: "Projection du brouillon", exact: true });
  await expect(projection.getByText("Recommandation conditionnelle", { exact: true })).toBeVisible();
  await page.getByText("Répondre aux objections de la MOA", { exact: true }).click();
  await page.locator("#hotel-episode-response-preparation").selectOption("accept");
  await expect(projection.getByText("Recommandation bloquée dans l’exercice", { exact: true })).toBeVisible();
  await page.getByLabel("Justifier la recommandation", { exact: true }).fill("Hypothèse fictive : maintenir la livraison et les contrôles, sous réserve de confirmer le dossier.");
  await page.getByRole("button", { name: "Conserver la recommandation initiale", exact: true }).click();
  await expect.poll(async () => (await episode())?.workspace.episode.revision).toBe(1);
  const first = structuredClone((await episode()).workspace.episode.events[0]);
  await page.getByText("Ouvrir la notification fournisseur", { exact: true }).click();
  await page.getByRole("button", { name: "Prendre en compte la notification", exact: true }).click();
  await expect.poll(async () => (await episode())?.workspace.episode.revision).toBe(2);
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("expedite");
  const objections = page.locator("summary").filter({ hasText: "Répondre aux objections de la MOA" });
  if ((await objections.locator("..").getAttribute("open")) === null) await objections.click();
  await page.locator("#hotel-episode-response-preparation").selectOption("verify");
  await page.getByLabel("Justifier la recommandation", { exact: true }).fill("Hypothèse fictive : demander une accélération du même produit, sous réserve de confirmation écrite.");
  await page.getByRole("button", { name: "Conserver la recommandation révisée", exact: true }).click();
  await expect.poll(async () => (await episode())?.workspace.episode.revision).toBe(3);
  await expect(page.getByText("Épisode sauvegardé sur ce navigateur.", { exact: true })).toBeVisible();
  const final = await episode();
  expect(final.workspace.episode.events[0]).toEqual(first);
  expect(final.workspace.episode.events[1]).toMatchObject({ kind: "supplier_notice", productId: "MENU-REF", deliveryShift: 4 });
  expect(final.workspace.episode.events[2].inputs.evidence).toEqual(first.inputs.evidence);
  expect(final.workspace.episode.events[2].inputs.dailyMargin).toBe(first.inputs.dailyMargin);
  await page.reload();
  const table = page.getByRole("table", { name: "Projections calculées sur les trois situations conservées.", exact: true });
  await expect(table).toBeVisible();
  for (const name of ["Initiale", "Même plan après notification", "Plan révisé"]) await expect(table.getByRole("columnheader", { name, exact: true })).toBeVisible();
  await expect(table.getByRole("row", { name: /Dossier qualité/ }).getByRole("cell")).toHaveText([
    "Pièces suffisantes pour l’exercice", "Pièces suffisantes pour l’exercice", "Pièces suffisantes pour l’exercice"
  ]);
  await expect(table.getByRole("row", { name: "Recommandation", exact: false }).getByRole("cell")).toHaveText([
    "Recommandation bloquée dans l’exercice", "Recommandation bloquée dans l’exercice", "Recommandation conditionnelle"
  ]);
  expect(await episode()).toEqual(final);
  expect(await snapshots()).toEqual(before);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: info.outputPath("published-hotel-episode.png"), fullPage: false });
});
