import { expect, test } from "@playwright/test";

// Fictitious acceptance fixture. Expected counts and dates below are calculated
// independently of packages/domain/projects.ts, not imported from that engine.
const PROJECTS_KEY = "pmersion.projects.v1";
const LAB_KEY = "pmersion.decision-lab.v1";
const HOTEL_KEY = "pmersion.hotel-scenario.v4";
const hotelRaw = JSON.stringify({ format: "hotel-scenario-local.4", revision: 0, history: [] });
const legacyRaw = JSON.stringify({ format: "hotel-mission-local.3", revision: 0, history: [] });
const task = (id, title, startDate, dueDate, status = "todo", dependsOn = []) => ({
  id,
  title,
  description: "Hypothèse fictive de test.",
  owner: "Rôle QA fictif",
  priority: "medium",
  status,
  startDate,
  dueDate,
  dependsOn,
  milestoneId: "m-cible",
});
const projectFixture = () => ({
  model: "pmersion-projects.1",
  id: "qa-next-fictional",
  title: "Projet QA fictif",
  description: "Données fictives, sans organisation ni personne réelle.",
  dataBasis: "fictional-demo",
  referenceDate: "2026-10-18",
  startDate: "2026-10-12",
  targetDate: "2026-10-20",
  revision: 0,
  tasks: [
    task("a", "Cadrage fictif", "2026-10-12", "2026-10-13", "done"),
    task("b", "Préparation fictive", "2026-10-14", "2026-10-16", "todo", ["a"]),
    task("c", "Revue fictive", "2026-10-15", "2026-10-17", "todo", ["b"]),
    task("d", "Logistique fictive", "2026-10-18", "2026-10-19", "blocked"),
  ],
  milestones: [
    { id: "m-cible", title: "Cible fictive", dueDate: "2026-10-20" },
    { id: "m-vide", title: "Jalon sans tâches", dueDate: "2026-10-17" },
  ],
  risks: [
    {
      id: "r-qa",
      title: "Moyen fictif à confirmer",
      owner: "Rôle QA fictif",
      priority: "high",
      status: "open",
      response: "",
      taskIds: ["d"],
    },
  ],
  decisions: [
    {
      id: "d-qa",
      title: "Périmètre fictif à choisir",
      problem: "Deux possibilités non instruites.",
      choice: "",
      rationale: "",
      owner: "Rôle QA fictif",
      date: "2026-10-18",
      status: "open",
      taskIds: ["c"],
    },
  ],
  history: [],
});
const envelope = (project = projectFixture()) =>
  JSON.stringify({ format: "projects-local.1", revision: 0, project });
async function seed(context, raw = envelope()) {
  await context.addInitScript(
    ({ key, raw, hotelKey, hotelRaw, legacyRaw }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
      if (localStorage.getItem(hotelKey) === null) localStorage.setItem(hotelKey, hotelRaw);
      if (localStorage.getItem("pmersion.hotel-mission.v3") === null)
        localStorage.setItem("pmersion.hotel-mission.v3", legacyRaw);
    },
    { key: PROJECTS_KEY, raw, hotelKey: HOTEL_KEY, hotelRaw, legacyRaw },
  );
}
const savedRaw = (page, key = PROJECTS_KEY) =>
  page.evaluate((key) => localStorage.getItem(key), key);
const heading = (page, name) => expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
async function fit(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("main")).toHaveCount(1);
}
async function screenshot(page, info, name) {
  if (["phone-390", "desktop-1280"].includes(info.project.name)) {
    await page.screenshot({ path: info.outputPath(`next-${name}.png`), fullPage: true });
    if (name === "decision-lab")
      await page
        .getByRole("heading", { name: "Dates, coûts et conditions", exact: true })
        .evaluate((node) => node.scrollIntoView({ block: "start" }));
    else await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`next-${name}-viewport.png`), fullPage: false });
  }
}
function watchErrors(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}
function watchMutations(page) {
  const mutations = [];
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()))
      mutations.push({ method: request.method(), url: request.url() });
  });
  return mutations;
}
async function unchangedHotel(page) {
  expect(await savedRaw(page, HOTEL_KEY)).toBe(hotelRaw);
  expect(await savedRaw(page, "pmersion.hotel-mission.v3")).toBe(legacyRaw);
}
async function projectView(page, name) {
  await page
    .getByRole("navigation", { name: "Vues du projet" })
    .getByRole("link", { name, exact: true })
    .click();
}
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const metric = (page, name) =>
  page
    .locator("dt")
    .filter({ hasText: new RegExp(`^${escapeRegExp(name)}$`) })
    .locator("..")
    .locator("dd");
async function addTask(page, title, due = "2026-10-21") {
  await page.getByRole("button", { name: "Nouvelle tâche", exact: true }).click();
  await page.getByLabel("Titre de la tâche", { exact: true }).fill(title);
  await page.getByLabel("Responsable", { exact: true }).fill("Responsable QA fictif");
  await page.getByLabel("Date de début", { exact: true }).fill("2026-10-18");
  await page.getByLabel("Échéance", { exact: true }).fill(due);
  await page.getByRole("combobox", { name: "Priorité", exact: true }).selectOption("high");
  await page.getByRole("combobox", { name: "Jalon rattaché", exact: true }).selectOption("m-cible");
  await page.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Créer une tâche", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Nouvelle tâche", exact: true })).toBeFocused();
}

test("Next portal gives keyboard access to three usable universes and keeps the public identity", async ({
  page,
  context,
}, info) => {
  await seed(context);
  const errors = watchErrors(page);
  await page.goto("/beta/#/accueil");
  await heading(page, /Comprendre\s*avant d’agir\./);
  await fit(page);
  await expect(page.getByRole("navigation", { name: "Univers PMersion" })).toBeVisible();
  const logo = page.getByRole("img", { name: "PMersion", exact: true });
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute("src", /\.svg(?:\?|$)|^data:image\/svg\+xml[;,]/);
  const tokens = await page.locator(".next-shell").evaluate((element) => {
    const probe = document.createElement("span");
    element.append(probe);
    probe.style.backgroundColor = "var(--pub-canvas)";
    const canonical = getComputedStyle(probe).backgroundColor;
    probe.remove();
    let surface = element;
    while (
      surface.parentElement &&
      getComputedStyle(surface).backgroundColor === "rgba(0, 0, 0, 0)"
    )
      surface = surface.parentElement;
    return { canonical, actual: getComputedStyle(surface).backgroundColor };
  });
  expect(tokens.actual).toBe(tokens.canonical);
  await page.getByRole("button", { name: "Choisir mon univers", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Votre prochain mouvement.", exact: true }),
  ).toBeFocused();
  await screenshot(page, info, "portail");
  for (const [name, route, title] of [
    ["Ouvrir Learn", "/learn", /Une méthode devient utile\s*quand on la pratique\./],
    ["Ouvrir Simulate", "/simulate", /Le dossier est ouvert\.\s*À vous de construire le plan\./],
    ["Ouvrir Projects", "/projects", "Piloter le projet"],
  ]) {
    await page.goto("/beta/#/accueil");
    const link = page.getByRole("link", { name: new RegExp(name) });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${route}$`));
    await heading(page, title);
    await fit(page);
  }
  await unchangedHotel(page);
  expect(await savedRaw(page)).toBe(envelope());
  expect(errors).toEqual([]);
});

test("Learn exposes reasoning without claiming assessment, Enterprise stays limited, and Hotel remains reachable", async ({
  page,
  context,
}) => {
  await seed(context);
  const errors = watchErrors(page);
  await page.goto("/beta/#/learn");
  const lessons = page.locator(".next-lesson");
  await expect(lessons).toHaveCount(3);
  for (const lesson of await lessons.all()) {
    const exercise = lesson.locator(":scope > div > details");
    await expect(exercise).toHaveJSProperty("open", false);
    await exercise.locator(":scope > summary").focus();
    await page.keyboard.press("Enter");
    await expect(exercise).toHaveJSProperty("open", true);
    const answer = exercise.locator(":scope > details");
    await answer.locator(":scope > summary").focus();
    await page.keyboard.press("Enter");
    await expect(answer).toHaveJSProperty("open", true);
    await expect(answer).toContainText("pas une évaluation de votre compétence");
    await expect(lesson.getByRole("link")).toHaveAttribute("href", /^#\/atelier\//);
  }
  await fit(page);
  await page.getByRole("link", { name: "Espace professionnel", exact: true }).click();
  await heading(page, /Un cadre commun\.\s*Un espace pour votre organisation\./);
  await expect(page.getByRole("main")).toContainText(
    "ni collaboration, ni séparation entre organisations, ni sauvegarde serveur",
  );
  await expect(page.getByRole("main")).toContainText(
    "Aucun document d’entreprise ou renseignement confidentiel",
  );
  await expect(page.locator("input[type=file], input[type=password], form")).toHaveCount(0);
  await fit(page);
  await page.goto("/beta/#/studio");
  await expect(
    page.getByRole("link", { name: "Ouvrir la mission Hôtel", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Ouvrir la mission Hôtel", exact: true }).click();
  await heading(page, "Hôtel 120 chambres");
  await expect(page.getByLabel("Approvisionnement", { exact: true })).toBeVisible();
  await unchangedHotel(page);
  expect(await savedRaw(page, LAB_KEY)).toBeNull();
  expect(errors).toEqual([]);
});

test("Projects creates, edits and moves one stable task, derives its views, then explicitly saves and reloads", async ({
  page,
  context,
}, info) => {
  await seed(context);
  const errors = watchErrors(page);
  const mutations = watchMutations(page);
  await page.goto("/beta/#/projects");
  await heading(page, "Piloter le projet");
  await expect(page.getByText("Données fictives uniquement.", { exact: true })).toBeVisible();
  await projectView(page, "Pilotage");
  await expect(metric(page, "Tâches terminées")).toHaveText("1 / 4");
  await expect(metric(page, "Bloquées ou dépendantes")).toHaveText("2");
  await expect(metric(page, "Échéances dépassées")).toHaveText("2");
  await expect(metric(page, "Marge calendaire calculée")).toHaveText("1 jour(s)");
  await expect(
    page.getByRole("progressbar", { name: "Part des tâches terminées" }),
  ).toHaveAttribute("value", "25");
  await projectView(page, "Planning");
  const planning = page.getByRole("table", { name: "Planning et dépendances du projet" });
  const review = planning
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: "Revue fictive", exact: true }) });
  // B ends 16 Oct; C starts the following day and retains its inclusive 3-day duration.
  await expect(review.getByRole("cell").nth(2)).toHaveText(/17 oct\. 2026/);
  await expect(review.getByRole("cell").nth(3)).toHaveText(/19 oct\. 2026/);
  const scrollTable = page.getByRole("region", {
    name: "Dates et dépendances, tableau défilant",
    exact: true,
  });
  await scrollTable.focus();
  await expect(scrollTable).toBeFocused();
  if (await scrollTable.evaluate((node) => node.scrollWidth > node.clientWidth)) {
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => scrollTable.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  }
  const emptyMilestone = page
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: "Jalon sans tâches", exact: true }) });
  await expect(emptyMilestone).toContainText("Non déterminée");
  await expect(emptyMilestone).toContainText("Sans tâche rattachée");
  await projectView(page, "Tableau Kanban");
  const title = '<img src=x onerror="window.__nextXss=1"> Répétition fictive';
  await addTask(page, title);
  await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__nextXss)).toBeUndefined();
  await expect(page.locator(".projects-task img, .projects-task script")).toHaveCount(0);
  expect(await savedRaw(page)).toBe(envelope());
  await page.getByRole("button", { name: `Modifier la tâche ${title}`, exact: true }).click();
  await page.getByLabel("Échéance", { exact: true }).fill("2026-10-22");
  await page.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Modifier la tâche", exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByRole("button", { name: "Nouvelle tâche", exact: true })).toBeFocused();
  const move = page.getByLabel(`Déplacer ${title}`, { exact: true });
  await move.focus();
  await expect(move).toBeFocused();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(move).toHaveValue("done");
  await fit(page);
  await screenshot(page, info, "projects-kanban");
  await projectView(page, "Pilotage");
  await expect(metric(page, "Tâches terminées")).toHaveText("2 / 5");
  await expect(metric(page, "Décalage après la cible")).toHaveText("2 jour(s)");
  await expect(
    page.getByRole("progressbar", { name: "Part des tâches terminées" }),
  ).toHaveAttribute("value", "40");
  await projectView(page, "Liste");
  await page.getByLabel("Rechercher une tâche", { exact: true }).fill("repetition");
  const list = page.getByRole("table", { name: "Tâches du projet affiché" });
  await expect(list.getByRole("row")).toHaveCount(2);
  await expect(list.getByRole("rowheader")).toHaveText(title);
  await expect(list).toContainText("Responsable QA fictif");
  await expect(list).toContainText("Haute");
  await page.getByRole("button", { name: "Effacer la recherche", exact: true }).click();
  await expect(page.getByLabel("Rechercher une tâche", { exact: true })).toBeFocused();
  await expect(list.getByRole("row")).toHaveCount(6);
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(
    page.getByText(
      "Projet sauvegardé sur ce navigateur. Cette version sera reprise après rechargement.",
      { exact: true },
    ),
  ).toBeVisible();
  const persisted = JSON.parse(await savedRaw(page));
  const created = persisted.project.tasks.find((task) => task.title === title);
  expect(created).toMatchObject({
    owner: "Responsable QA fictif",
    priority: "high",
    status: "done",
    dueDate: "2026-10-22",
  });
  expect(persisted.project.revision).toBe(3);
  expect(persisted.project.history.map((event) => event.entityId)).toEqual([
    created.id,
    created.id,
    created.id,
  ]);
  await page.reload();
  await expect(
    page
      .getByRole("table", { name: "Tâches du projet affiché" })
      .getByRole("rowheader", { name: title, exact: true }),
  ).toBeVisible();
  expect(
    JSON.parse(await savedRaw(page)).project.tasks.find((task) => task.id === created.id),
  ).toEqual(created);
  await fit(page);
  await unchangedHotel(page);
  expect(await savedRaw(page, LAB_KEY)).toBeNull();
  expect(mutations).toEqual([]);
  expect(errors).toEqual([]);
});

test("Projects rejects a dependency cycle and premature start, while cancelling recovery preserves the unsaved form", async ({
  page,
  context,
}) => {
  await seed(context);
  await page.goto("/beta/#/projects");
  await heading(page, "Piloter le projet");
  const move = page.getByLabel("Déplacer Revue fictive", { exact: true });
  await move.selectOption("in_progress");
  await expect(move).toHaveValue("todo");
  await expect(
    page.getByText("Terminez les tâches précédentes avant de commencer ou terminer cette tâche.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Modifier la tâche Préparation fictive", exact: true })
    .click();
  await page.getByRole("checkbox", { name: "Revue fictive", exact: true }).check();
  await page.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await expect(page.locator(".projects-editor").getByRole("alert")).toContainText(
    "Ces dépendances créent une boucle.",
  );
  expect(await savedRaw(page)).toBe(envelope());
  await page.getByRole("button", { name: "Reprendre la sauvegarde", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("checkbox", { name: "Revue fictive", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Reprendre la sauvegarde", exact: true }).click();
  await dialog.getByRole("button", { name: "Reprendre la sauvegarde", exact: true }).click();
  await expect(page.getByLabel("Titre de la tâche", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Déplacer Revue fictive", { exact: true })).toHaveValue("todo");
  expect(await savedRaw(page)).toBe(envelope());
  await fit(page);
});

test("Projects preserves future and corrupt saves instead of silently replacing their exact bytes", async ({
  page,
  context,
}) => {
  const errors = watchErrors(page);
  await seed(context);
  for (const raw of [
    JSON.stringify({ format: "projects-local.99", future: "à conserver" }),
    '{"project":corrompu',
  ]) {
    await page.goto("/beta/#/accueil");
    await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key: PROJECTS_KEY,
      raw,
    });
    await page.goto("/beta/#/projects");
    await page.reload();
    await heading(page, "Piloter le projet");
    await expect(page.getByRole("button", { name: "Nouvelle tâche", exact: true })).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Sauvegarder le projet", exact: true }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Exporter les données à récupérer", exact: true }),
    ).toBeEnabled();
    expect(await savedRaw(page)).toBe(raw);
    const downloadPromise = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Exporter les données à récupérer", exact: true })
      .click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    expect(Buffer.concat(chunks).toString("utf8")).toBe(raw);
    expect(await savedRaw(page)).toBe(raw);
    await fit(page);
  }
  await unchangedHotel(page);
  expect(errors).toEqual([]);
});

test("Projects detects a second tab's save and refuses stale writes until explicit recovery", async ({
  page,
  context,
}) => {
  await seed(context);
  await page.goto("/beta/#/projects");
  await heading(page, "Piloter le projet");
  const other = await context.newPage();
  await other.goto("/beta/#/projects");
  await heading(other, "Piloter le projet");
  await addTask(other, "Tâche fictive de l’autre onglet");
  await other.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(
    other.getByText(
      "Projet sauvegardé sur ce navigateur. Cette version sera reprise après rechargement.",
      { exact: true },
    ),
  ).toBeVisible();
  const firstSave = await savedRaw(other);
  await expect(page.getByRole("button", { name: "Nouvelle tâche", exact: true })).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Sauvegarder le projet", exact: true }),
  ).toBeDisabled();
  expect(await savedRaw(page)).toBe(firstSave);
  await page.getByRole("button", { name: "Reprendre la sauvegarde", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tâche fictive de l’autre onglet", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Nouvelle tâche", exact: true })).toBeEnabled();
  expect(await savedRaw(page)).toBe(firstSave);
  await unchangedHotel(page);
  await other.close();
});

test("Projects records a response, a reasoned decision and an empty milestone without inventing completion", async ({
  page,
  context,
}) => {
  await seed(context);
  await page.goto("/beta/#/projects?vue=registres");
  await heading(page, "Piloter le projet");
  await page
    .getByRole("button", { name: "Modifier le risque Moyen fictif à confirmer", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "État du risque", exact: true })
    .selectOption("mitigated");
  await page.getByRole("button", { name: "Enregistrer le risque", exact: true }).click();
  await expect(page.getByLabel("Titre du risque", { exact: true })).toBeVisible();
  await expect(page.locator(".projects-register-form").getByRole("alert")).toContainText(
    "une réponse",
  );
  await page
    .getByLabel("Réponse au risque", { exact: true })
    .fill("Hypothèse : réserver un moyen de secours fictif. Son exécution reste à confirmer.");
  await page.getByRole("button", { name: "Enregistrer le risque", exact: true }).click();
  await expect(page.getByLabel("Titre du risque", { exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Modifier la décision Périmètre fictif à choisir", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "État de la décision", exact: true })
    .selectOption("decided");
  await page
    .getByLabel("Choix retenu", { exact: true })
    .fill("Préparer le périmètre réduit fictif.");
  await page
    .getByLabel("Motif et hypothèses", { exact: true })
    .fill(
      "Hypothèse : le moyen principal reste indisponible. La disponibilité du secours doit être vérifiée.",
    );
  await page.getByRole("button", { name: "Enregistrer la décision", exact: true }).click();
  await expect(page.getByLabel("Titre de la décision", { exact: true })).toHaveCount(0);
  await projectView(page, "Planning");
  await page.getByRole("button", { name: "Nouveau jalon", exact: true }).click();
  await page.getByLabel("Titre du jalon", { exact: true }).fill("Jalon QA non instruit");
  await page.getByLabel("Date cible du jalon", { exact: true }).fill("2026-10-22");
  await page.getByRole("button", { name: "Enregistrer le jalon", exact: true }).click();
  const milestone = page
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: "Jalon QA non instruit", exact: true }) });
  await expect(milestone).toContainText("Non déterminée");
  await expect(milestone).toContainText("Sans tâche rattachée");
  await page
    .getByRole("button", { name: "Modifier le jalon Jalon QA non instruit", exact: true })
    .click();
  await page.getByLabel("Date cible du jalon", { exact: true }).fill("2026-10-23");
  await page.getByRole("button", { name: "Enregistrer le jalon", exact: true }).click();
  await expect(milestone).toContainText("23 oct. 2026");
  await projectView(page, "Pilotage");
  await expect(page.getByText("0 risque(s) sans réponse.", { exact: true })).toBeVisible();
  await expect(page.getByText("0 décision(s) ouverte(s).", { exact: true })).toBeVisible();
  await expect(metric(page, "Risques ouverts")).toHaveText("1");
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(
    page.getByText(
      "Projet sauvegardé sur ce navigateur. Cette version sera reprise après rechargement.",
      { exact: true },
    ),
  ).toBeVisible();
  const saved = JSON.parse(await savedRaw(page)).project;
  expect(saved.history.map((event) => event.kind)).toEqual([
    "risk_updated",
    "decision_updated",
    "milestone_created",
    "milestone_updated",
  ]);
  expect(saved.revision).toBe(4);
  await projectView(page, "Historique");
  for (const event of saved.history)
    await expect(page.getByText(event.summary, { exact: true })).toBeVisible();
  await page.reload();
  expect(JSON.parse(await savedRaw(page)).project).toEqual(saved);
  await unchangedHotel(page);
  await fit(page);
});

test("Projects remains editable and exportable when browser storage is unavailable, without promising persistence", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Blocked for QA", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked for QA", "SecurityError");
    };
  });
  const errors = watchErrors(page);
  await page.goto("/beta/#/projects");
  await heading(page, "Piloter le projet");
  await expect(page.getByText(/Le stockage n’est pas disponible\./)).toBeVisible();
  await page.getByRole("button", { name: "Nouvelle tâche", exact: true }).click();
  await page.getByLabel("Titre de la tâche", { exact: true }).fill("Travail fictif sans stockage");
  await page.getByLabel("Responsable", { exact: true }).fill("Rôle fictif hors stockage");
  await page.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Travail fictif sans stockage", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(
    page.getByText(
      "La sauvegarde n’est pas disponible. Le brouillon reste dans cette session ; exportez-le pour le conserver.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Exporter le projet", exact: true })).toBeEnabled();
  await fit(page);
  expect(errors).toEqual([]);
});

test("Decision Lab compares explicit hypotheses on a detached Projects copy and preserves it after source changes", async ({
  page,
  context,
}, info) => {
  const source = projectFixture();
  source.tasks.push(task("e", "Contrôle fictif principal", "2026-10-20", "2026-10-24"));
  const sourceRaw = envelope(source);
  await seed(context, sourceRaw);
  const errors = watchErrors(page);
  const mutations = watchMutations(page);
  await page.goto("/beta/#/projects?vue=pilotage");
  await heading(page, "Piloter le projet");
  await page
    .getByRole("button", { name: "Comparer une hypothèse dans Decision Lab", exact: true })
    .click();
  await heading(page, "Comparer avant d’engager");
  await expect(page).toHaveTitle("Decision Lab · PMersion");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(
    page.getByRole("heading", { level: 2, name: "Projet QA fictif", exact: true }),
  ).toBeVisible();
  await page.getByLabel(/^Tâche à accélérer/).selectOption("e");
  const table = page.getByRole("table", { name: /Calcul sur la copie de révision 0/ });
  const row = (name) =>
    table.getByRole("row").filter({ has: page.getByRole("rowheader", { name, exact: true }) });
  await expect(row("Total sous hypothèses").getByRole("cell")).toHaveText([
    "Non renseigné",
    "Non renseigné",
    "Non renseigné",
  ]);
  await expect(row("Fin projet calculée").getByRole("cell")).toHaveText([
    "24 oct. 2026",
    "23 oct. 2026",
    "22 oct. 2026",
  ]);
  await expect(row("Gain global sur la référence").getByRole("cell")).toHaveText([
    "0 jours",
    "1 jours",
    "2 jours",
  ]);
  await page
    .getByText("Renseigner les coûts et la contrainte de contrôle", { exact: true })
    .click();
  await page.getByLabel(/^Budget de base, en euros/).fill("1000");
  await page.getByLabel(/^Coût par jour de retard, en euros/).fill("100");
  await page.getByLabel(/^Action ciblée, coût supplémentaire en euros/).fill("250");
  await page.getByLabel(/^Action renforcée, coût supplémentaire en euros/).fill("600");
  await page.getByLabel(/^Tâche de contrôle/).selectOption("e");
  await page.getByLabel(/^Durée minimale supposée du contrôle, en jours/).fill("4");
  // Inclusive durations 5/4/3 days; delays 4/3/2 days beyond 20 Oct.
  // Total = 1000 + action + delay*100. The fastest plan breaks the assumed minimum.
  await expect(row("Total sous hypothèses").getByRole("cell")).toHaveText([
    /1\s400(?:,00)?\s€/,
    /1\s550(?:,00)?\s€/,
    /1\s800(?:,00)?\s€/,
  ]);
  await expect(row("Contrainte de contrôle").getByRole("cell")).toHaveText([
    "Durée planifiée conservée",
    "Durée planifiée conservée",
    "Durée insuffisante",
  ]);
  await expect(row("État de la variante").getByRole("cell")).toHaveText([
    "Conditionnelle",
    "Conditionnelle",
    "Non applicable",
  ]);
  await page.getByRole("radio", { name: "Réaffectation ciblée", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("radio", { name: "Réaffectation ciblée", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByText("Les résultats et leur approbation restent à obtenir.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel(/^Gain ciblé demandé, en jours/).fill("999");
  await expect(page.getByLabel(/^Gain ciblé demandé, en jours/)).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "Conserver l’analyse", exact: true }),
  ).toBeDisabled();
  await expect(table).toHaveCount(0);
  await page.getByLabel(/^Gain ciblé demandé, en jours/).fill("1");
  await expect(table).toBeVisible();
  const note =
    "Hypothèse : retenir la variante ciblée, sous réserve de capacité et de résultats de contrôle. Cette note ne vaut pas une autorisation.";
  await page
    .getByRole("textbox", { name: "Pourquoi cette variante, sous quelles réserves ?", exact: true })
    .fill(note);
  expect(await savedRaw(page)).toBe(sourceRaw);
  expect(await savedRaw(page, LAB_KEY)).toBeNull();
  await page.getByRole("button", { name: "Conserver l’analyse", exact: true }).click();
  await expect(
    page.getByText(
      "Analyse 1 conservée dans ce navigateur. Le projet de référence n’a pas été modifié.",
      { exact: true },
    ),
  ).toBeVisible();
  const analysisRaw = await savedRaw(page, LAB_KEY);
  const analysis = JSON.parse(analysisRaw).analyses[0];
  expect(analysis.source.reference).toEqual(source);
  expect(analysis).toMatchObject({
    model: "decision-lab.1",
    version: 1,
    selectedVariant: "targeted",
    note,
  });
  expect(analysis.source.origin).toBe("projects");
  expect(await savedRaw(page)).toBe(sourceRaw);
  await fit(page);
  await screenshot(page, info, "decision-lab");
  await page.reload();
  await heading(page, "Comparer avant d’engager");
  await expect(
    page.getByRole("textbox", {
      name: "Pourquoi cette variante, sous quelles réserves ?",
      exact: true,
    }),
  ).toHaveValue(note);
  await expect(
    page.getByRole("radio", { name: "Réaffectation ciblée", exact: true }),
  ).toBeChecked();
  await expect(row("Total sous hypothèses").getByRole("cell")).toHaveText([
    /1\s400(?:,00)?\s€/,
    /1\s550(?:,00)?\s€/,
    /1\s800(?:,00)?\s€/,
  ]);
  const other = await context.newPage();
  await other.goto("/beta/#/projects");
  await heading(other, "Piloter le projet");
  await other
    .getByRole("button", { name: "Modifier la tâche Contrôle fictif principal", exact: true })
    .click();
  await other.getByLabel("Échéance", { exact: true }).fill("2026-10-25");
  await other.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await other.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(
    other.getByText(
      "Projet sauvegardé sur ce navigateur. Cette version sera reprise après rechargement.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText(/Cette analyse conserve sa copie de la révision 0/)).toBeVisible();
  expect(await savedRaw(page, LAB_KEY)).toBe(analysisRaw);
  await expect(row("Fin projet calculée").getByRole("cell")).toHaveText([
    "24 oct. 2026",
    "23 oct. 2026",
    "22 oct. 2026",
  ]);
  await unchangedHotel(page);
  await other.close();
  expect(mutations).toEqual([]);
  expect(errors).toEqual([]);
});

test("Decision Lab reloads an explicitly loaded demo and keeps a later Projects handoff separate", async ({
  page,
  context,
}) => {
  await seed(context);
  const errors = watchErrors(page);
  await page.goto("/beta/#/projects?vue=pilotage");
  await heading(page, "Piloter le projet");
  await page
    .getByRole("button", { name: "Comparer une hypothèse dans Decision Lab", exact: true })
    .click();
  await heading(page, "Comparer avant d’engager");
  await expect(
    page.getByRole("heading", { level: 2, name: "Projet QA fictif", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Charger le dossier fictif", exact: true }).click();
  const demoTitle = "Intégration fournisseur · dossier fictif";
  await expect(page.getByRole("heading", { level: 2, name: demoTitle, exact: true })).toBeVisible();
  const note =
    "Hypothèse propre au dossier fictif : conserver la référence, avec confirmation des ressources et des résultats de contrôle encore attendue.";
  await page
    .getByRole("textbox", { name: "Pourquoi cette variante, sous quelles réserves ?", exact: true })
    .fill(note);
  await page.getByRole("button", { name: "Conserver l’analyse", exact: true }).click();
  await expect(
    page.getByText(
      "Analyse 1 conservée dans ce navigateur. Le projet de référence n’a pas été modifié.",
      { exact: true },
    ),
  ).toBeVisible();
  const analysisRaw = await savedRaw(page, LAB_KEY);
  const analysis = JSON.parse(analysisRaw).analyses[0];
  expect(analysis.source.origin).toBe("demo");
  expect(analysis.source.projectId).toBe("decision-lab-supply-demo");
  expect(analysis.note).toBe(note);
  expect(await savedRaw(page)).toBe(envelope());
  await page.reload();
  await heading(page, "Comparer avant d’engager");
  await expect(page.getByRole("heading", { level: 2, name: demoTitle, exact: true })).toBeVisible();
  await expect(
    page.getByRole("textbox", {
      name: "Pourquoi cette variante, sous quelles réserves ?",
      exact: true,
    }),
  ).toHaveValue(note);
  expect(await savedRaw(page, LAB_KEY)).toBe(analysisRaw);
  await page.getByRole("link", { name: "Ouvrir Projects", exact: true }).click();
  await heading(page, "Piloter le projet");
  await projectView(page, "Pilotage");
  await page
    .getByRole("button", { name: "Comparer une hypothèse dans Decision Lab", exact: true })
    .click();
  await heading(page, "Comparer avant d’engager");
  await expect(
    page.getByRole("heading", { level: 2, name: "Projet QA fictif", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", {
      name: "Pourquoi cette variante, sous quelles réserves ?",
      exact: true,
    }),
  ).toHaveValue("");
  expect(await savedRaw(page, LAB_KEY)).toBe(analysisRaw);
  expect(await savedRaw(page)).toBe(envelope());
  await unchangedHotel(page);
  await fit(page);
  expect(errors).toEqual([]);
});
