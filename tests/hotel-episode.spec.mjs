import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const KEY = "pmersion.hotel-episode.v1";
const DRAFT_KEY = "pmersion.hotel-episode.draft.v1";
const TITLE = "Le fournisseur change la donne";
const REASON = "Justifier la recommandation";
const INITIAL =
  "Hypothèse fictive : attendre la livraison en conservant les contrôles et les pièces du produit de référence.";
const REVISED =
  "Hypothèse fictive : solliciter une accélération du même produit, sous réserve de confirmer les ressources.";
const historical = {
  "pmersion.construction-hotel.v1": "Archive Hôtel fictive indépendante, octets à préserver.",
  "pmersion.hotel-mission.v3": "Première mission fictive, octets à préserver.",
  "pmersion.hotel-scenario.v4": "Étude Hôtel .4 fictive, octets à préserver.",
  "pmersion.projects.v1": "Projet fictif indépendant, octets à préserver.",
  "pmersion.decision-lab.v1": "Analyse fictive indépendante, octets à préserver.",
};
const proofs = [
  ["Zone témoin fermée et protégée", "HOT-ZONE-REPRISE"],
  ["Performance acoustique du produit proposé", "HOT-AC-REF"],
  ["Interfaces et dimensions visées", "HOT-IF-REF"],
  ["Standard témoin approuvé pour le produit proposé", "HOT-TEM-REF"],
];

const raw = (page) => page.evaluate((key) => localStorage.getItem(key), KEY);
const saved = async (page) => JSON.parse((await raw(page)) || "null");
const recovered = (page) =>
  page.evaluate((key) => JSON.parse(sessionStorage.getItem(key) || "null"), DRAFT_KEY);

async function seed(context) {
  await context.addInitScript((values) => {
    for (const [key, value] of Object.entries(values))
      if (localStorage.getItem(key) === null) localStorage.setItem(key, value);
  }, historical);
}
async function start(page) {
  await page.goto("./#/simulate/hotel-episode");
  await expect(page.getByRole("heading", { level: 1, name: TITLE, exact: true })).toBeVisible();
}
async function isolated(page) {
  const values = await page.evaluate((keys) => {
    return Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)]));
  }, Object.keys(historical));
  expect(values).toEqual(historical);
}
async function fit(page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
}
async function portableExport(page) {
  const waiting = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter l’épisode", exact: true }).click();
  const download = await waiting;
  expect(download.suggestedFilename()).toBe("pmersion-hotel-episode.json");
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = JSON.parse(await readFile(path, "utf8"));
  expect(exported.format).toBe("hotel-episode-local.1");
  expect(exported.workspace.episode.model).toBe("hotel-episode.1");
  expect(exported.workspace.episode.dataBasis).toBe("fictional-demo");
  expect(exported.workspace.episode.scope).toBe("pre-engagement");
  return exported;
}
async function selectReferenceProofs(page) {
  await openProofs(page);
  for (const [label, value] of proofs)
    await page.getByLabel(`Pièce pour : ${label}`, { exact: true }).selectOption(value);
}
async function openProofs(page) {
  const summary = page.locator("summary").filter({ hasText: "Examiner les pièces de contrôle" });
  if ((await summary.locator("..").getAttribute("open")) === null) await summary.click();
  await expect(summary.locator("..")).toHaveJSProperty("open", true);
}
async function initial(page, { persist = true } = {}) {
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("wait");
  await page.getByLabel("Préparer une autre zone", { exact: true }).uncheck();
  await page.getByLabel("Planifier les contrôles", { exact: true }).check();
  await expect(
    page.getByLabel("Marge quotidienne hypothétique, en euros", { exact: true }),
  ).toHaveValue("5000");
  await selectReferenceProofs(page);
  await page.getByLabel(REASON, { exact: true }).fill(INITIAL);
  await page
    .getByRole("button", { name: "Conserver la recommandation initiale", exact: true })
    .click();
  if (persist) {
    await expect.poll(async () => (await saved(page))?.workspace.episode.events.length).toBe(1);
    await expect(
      page.getByText("Épisode sauvegardé sur ce navigateur.", { exact: true }),
    ).toBeVisible();
  }
}
async function notice(page, info) {
  const summary = page.locator("summary").filter({ hasText: "Ouvrir la notification fournisseur" });
  await summary.click();
  await expect(summary.locator("..")).toHaveJSProperty("open", true);
  if (info && ["phone-390", "desktop-1280"].includes(info.project.name)) {
    await page
      .getByRole("article", { name: "Notification fournisseur fictive", exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: info.outputPath("hotel-episode-notice.png"),
      animations: "disabled",
    });
  }
  await page
    .getByRole("button", { name: "Prendre en compte la notification", exact: true })
    .click();
  await expect.poll(async () => (await saved(page))?.workspace.episode.events.length).toBe(2);
}
async function revise(page) {
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("expedite");
  await openProofs(page);
  // The same MENU-REF product must keep its evidence when wait becomes expedite.
  for (const [label, value] of proofs)
    await expect(page.getByLabel(`Pièce pour : ${label}`, { exact: true })).toHaveValue(value);
  await page.getByLabel(REASON, { exact: true }).fill(REVISED);
  await page
    .getByRole("button", { name: "Conserver la recommandation révisée", exact: true })
    .click();
  await expect.poll(async () => (await saved(page))?.workspace.episode.events.length).toBe(3);
  await expect(
    page.getByRole("table", {
      name: "Projections calculées sur les trois situations conservées.",
      exact: true,
    }),
  ).toBeVisible();
}
async function canonicalComparison(page) {
  const table = page.getByRole("table", {
    name: "Projections calculées sur les trois situations conservées.",
    exact: true,
  });
  // Golden fixture calculated once with canonical hotel-scenario.4, not an external fact:
  // hypothetical daily margin 5000, wait/prepare:false/checks:true, four REF proofs,
  // then absolute shift 4 and same-product expedite. No domain import in this portable spec.
  const rows = [
    [
      "Ouverture prévisionnelle",
      [
        /13\s+janv\.\s+2027\s+·\s+J68/,
        /19\s+janv\.\s+2027\s+·\s+J72/,
        /30\s+déc\.\s+2026\s+·\s+J58/,
      ],
    ],
    ["Coûts supplémentaires supposés", ["38 200 €", "45 400 €", "42 400 €"]],
    ["Marge d’exploitation perdue supposée", ["60 000 €", "90 000 €", "0 €"]],
    ["Impact économique total supposé", ["98 200 €", "135 400 €", "42 400 €"]],
    ["Exposition pédagogique au risque", ["4 800 €", "4 800 €", "8 800 €"]],
    ["Créance fournisseur potentielle", ["10 000 €", "10 000 €", "9 000 €"]],
    ["Pénalité encaissée", ["0 €", "0 €", "0 €"]],
    [
      "Dossier qualité",
      [
        "Conditions satisfaites dans l’exercice",
        "Conditions satisfaites dans l’exercice",
        "Conditions satisfaites dans l’exercice",
      ],
    ],
  ];
  for (const [label, values] of rows) {
    const row = table
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader", { name: label, exact: true }) });
    await expect(row).toHaveCount(1);
    await expect(row.getByRole("cell")).toHaveText(values);
  }
  for (const [label, values] of [
    ["Information nouvelle", ["+4 j ouvré(s)", "+37 200 €"]],
    ["Révision de la recommandation", ["-14 j ouvré(s)", "-93 000 €"]],
    ["Écart total depuis le départ", ["-10 j ouvré(s)", "-55 800 €"]],
  ]) {
    const effect = page.getByRole("heading", { name: label, exact: true }).locator("..");
    await expect(effect.locator("dd")).toHaveText(values);
  }
}
async function reload(page) {
  const accept = async (dialog) => {
    expect(dialog.type()).toBe("beforeunload");
    await dialog.accept();
  };
  page.on("dialog", accept);
  try {
    await page.reload();
  } finally {
    page.off("dialog", accept);
  }
  await expect(page.getByRole("heading", { level: 1, name: TITLE, exact: true })).toBeVisible();
}

test("Hotel episode preserves the initial recommendation, applies a product-specific notice and reloads the revised comparison", async ({
  page,
  context,
}, info) => {
  await seed(context);
  const errors = [];
  const mutations = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()))
      mutations.push(request.method());
  });
  await start(page);
  expect(await raw(page)).toBeNull();
  const empty = await portableExport(page);
  expect(empty.workspace.episode.events).toEqual([]);
  await initial(page);
  const first = structuredClone((await saved(page)).workspace.episode.events[0]);
  expect(first.kind).toBe("recommendation");
  expect(first.reasoning).toBe(INITIAL);
  expect(first.inputs.evidence).toEqual(
    proofs.map(([, documentId], index) => ({
      id: ["protection", "acoustics", "interfaces", "sample"][index],
      documentId,
    })),
  );
  await notice(page, info);
  const notified = (await saved(page)).workspace.episode;
  expect(notified.events[0]).toEqual(first);
  expect(notified.events[1]).toMatchObject({
    kind: "supplier_notice",
    productId: "MENU-REF",
    deliveryShift: 4,
  });
  await expect(
    page.getByLabel("Marge quotidienne hypothétique, en euros", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText(/La notification remplace le décalage par 4 jours ouvrés\./),
  ).toContainText(/produit MENU-REF et la marge quotidienne de 5\s*000\s*€ restent fixes/);
  await expect(
    page.getByLabel("Approvisionnement", { exact: true }).locator('option[value="alternative"]'),
  ).toBeDisabled();
  await revise(page);
  const final = (await saved(page)).workspace;
  expect(final.episode.events[0]).toEqual(first);
  expect(final.episode.events[2]).toMatchObject({
    kind: "recommendation",
    reasoning: REVISED,
    basisEventIds: [final.episode.events[1].id],
    inputs: {
      deliveryShift: 4,
      dailyMargin: first.inputs.dailyMargin,
      plan: { supply: "expedite" },
    },
  });
  expect((await portableExport(page)).workspace).toEqual(final);
  const beforeReload = await raw(page);
  await reload(page);
  expect(await raw(page)).toBe(beforeReload);
  expect((await portableExport(page)).workspace).toEqual(final);
  const table = page.getByRole("table", {
    name: "Projections calculées sur les trois situations conservées.",
    exact: true,
  });
  for (const name of ["Initiale", "Même plan après notification", "Plan révisé"])
    await expect(table.getByRole("columnheader", { name, exact: true })).toBeVisible();
  await canonicalComparison(page);
  await isolated(page);
  await fit(page);
  expect(errors).toEqual([]);
  expect(mutations).toEqual([]);
});

test("Short recommendation is refused without advancing or losing the selected levers and evidence", async ({
  page,
  context,
}) => {
  await seed(context);
  await start(page);
  await page.getByLabel("Préparer une autre zone", { exact: true }).check();
  await selectReferenceProofs(page);
  await page.getByLabel("Planifier les contrôles", { exact: true }).uncheck();
  const projection = page.getByRole("complementary", {
    name: "Projection du brouillon",
    exact: true,
  });
  await expect(projection).toContainText(
    "Contrôles non planifiés. 0 pièce(s) manquante(s), 0 insuffisante(s)",
  );
  await expect(
    projection.getByText("Conditions satisfaites dans l’exercice", { exact: true }),
  ).toHaveCount(0);
  await page.getByLabel(REASON, { exact: true }).fill("Trop court");
  await page
    .getByRole("button", { name: "Conserver la recommandation initiale", exact: true })
    .click();
  await expect(
    page.getByText("Écrivez au moins 20 caractères pour conserver votre recommandation.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByLabel(REASON, { exact: true })).toBeFocused();
  await expect(page.getByLabel(REASON, { exact: true })).toHaveValue("Trop court");
  await expect(page.getByLabel("Préparer une autre zone", { exact: true })).toBeChecked();
  expect(await raw(page)).toBeNull();
  const exported = await portableExport(page);
  expect(exported.workspace.episode.events).toEqual([]);
  expect(exported.workspace.draft.reasoning).toBe("Trop court");
  expect(exported.workspace.draft.inputs.evidence).toHaveLength(4);
  expect(exported.workspace.draft.inputs.plan.checks).toBe(false);
  await isolated(page);
  await fit(page);
});

test("An incomplete episode draft survives a real reload and becomes durable only after explicit save", async ({
  page,
  context,
}) => {
  await seed(context);
  await start(page);
  const note = "Brouillon fictif encore incomplet";
  await page.getByLabel(REASON, { exact: true }).fill(note);
  await page.getByLabel("Préparer une autre zone", { exact: true }).check();
  await expect.poll(async () => (await recovered(page))?.draft?.draft.reasoning).toBe(note);
  expect(await raw(page)).toBeNull();
  await reload(page);
  await expect(
    page.getByText(
      "Brouillon d’épisode repris dans cet onglet. La sauvegarde n’a pas été modifiée.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByLabel(REASON, { exact: true })).toHaveValue(note);
  await expect(page.getByLabel("Préparer une autre zone", { exact: true })).toBeChecked();
  expect(await raw(page)).toBeNull();
  await page.getByRole("button", { name: "Sauvegarder l’épisode", exact: true }).click();
  await expect(
    page.getByText("Épisode sauvegardé sur ce navigateur.", { exact: true }),
  ).toBeVisible();
  const reference = await raw(page);
  expect(JSON.parse(reference).workspace.draft.reasoning).toBe(note);
  expect(JSON.parse(reference).workspace.episode.events).toEqual([]);
  await expect.poll(async () => (await recovered(page))?.draft).toBeNull();
  expect((await recovered(page)).baseline).toBe(reference);
  await reload(page);
  await expect(page.getByLabel(REASON, { exact: true })).toHaveValue(note);
  expect(await raw(page)).toBe(reference);
  await isolated(page);
});

test("Corrupt and future episode saves remain byte-for-byte protected and cannot become a silent new reference", async ({
  page,
  context,
}) => {
  await seed(context);
  await start(page);
  const valid = await portableExport(page);
  const futureStore = { ...valid, format: "hotel-episode-local.2" };
  const futureModel = structuredClone(valid);
  futureModel.workspace.episode.model = "hotel-episode.2";
  for (const incoming of ["{corrompu", JSON.stringify(futureStore), JSON.stringify(futureModel)]) {
    const protectedPage = await context.newPage();
    await protectedPage.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
      key: KEY,
      value: incoming,
    });
    await start(protectedPage);
    await expect(
      protectedPage.getByText(
        "La sauvegarde est protégée. Exportez votre travail avant de relire la version disponible.",
        { exact: true },
      ),
    ).toBeVisible();
    expect(await raw(protectedPage)).toBe(incoming);
    const save = protectedPage.getByRole("button", { name: "Sauvegarder l’épisode", exact: true });
    await expect(save).toBeDisabled();
    await expect(
      protectedPage.getByRole("button", {
        name: "Conserver la recommandation initiale",
        exact: true,
      }),
    ).toBeDisabled();
    expect(await raw(protectedPage)).toBe(incoming);
    const recoveryDownload = protectedPage.waitForEvent("download");
    await protectedPage
      .getByRole("button", { name: "Exporter la version lue", exact: true })
      .click();
    const original = await recoveryDownload;
    expect(original.suggestedFilename()).toBe("pmersion-hotel-episode-recovery.json");
    const originalPath = await original.path();
    expect(originalPath).not.toBeNull();
    expect(await readFile(originalPath, "utf8")).toBe(incoming);
    const local = await portableExport(protectedPage);
    expect(local.workspace.episode.model).toBe("hotel-episode.1");
    expect(await raw(protectedPage)).toBe(incoming);
    await isolated(protectedPage);
    await fit(protectedPage);
    await protectedPage.close();
  }
});

test("A real second-tab save blocks stale writes and cancelling a reread keeps the first draft exportable", async ({
  page,
  context,
}) => {
  await seed(context);
  await start(page);
  const firstNote = "Brouillon fictif du premier onglet à préserver sans écrasement.";
  await page.getByLabel(REASON, { exact: true }).fill(firstNote);
  const other = await context.newPage();
  await start(other);
  const secondNote = "Brouillon fictif conservé par le deuxième onglet, référence indépendante.";
  await other.getByLabel(REASON, { exact: true }).fill(secondNote);
  await other.getByRole("button", { name: "Sauvegarder l’épisode", exact: true }).click();
  await expect(
    other.getByText("Épisode sauvegardé sur ce navigateur.", { exact: true }),
  ).toBeVisible();
  const reference = await raw(other);
  await expect(
    page.getByText(
      "La sauvegarde est protégée. Exportez votre travail avant de relire la version disponible.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByLabel(REASON, { exact: true })).toHaveValue(firstNote);
  expect((await portableExport(page)).workspace.draft.reasoning).toBe(firstNote);
  expect(await raw(page)).toBe(reference);
  await page.getByRole("button", { name: "Relire la sauvegarde", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCount(1);
  await dialog.getByRole("button", { name: "Fermer la fenêtre", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel(REASON, { exact: true })).toHaveValue(firstNote);
  expect(await raw(page)).toBe(reference);
  expect((await portableExport(page)).workspace.draft.reasoning).toBe(firstNote);
  await isolated(page);
  await other.close();
});

test("Quota refusal preserves the advanced episode, incomplete form and export without claiming a durable save", async ({
  page,
  context,
}) => {
  await seed(context);
  await context.addInitScript((key) => {
    // Cover the synchronous fallback as well as the separate deferred-lock test below:
    // repeated identical quota errors can be React-batched without a new text value.
    Object.defineProperty(navigator, "locks", { configurable: true, value: undefined });
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (this === localStorage && name === key)
        throw new DOMException("Quota fictif QA", "QuotaExceededError");
      return write.call(this, name, value);
    };
  }, KEY);
  await start(page);
  await initial(page, { persist: false });
  await expect(
    page.getByText("Épisode sauvegardé sur ce navigateur.", { exact: true }),
  ).toHaveCount(0);
  const failure = page.getByRole("region", { name: "Erreur dans l’épisode", exact: true });
  const failureText =
    "La sauvegarde n’est pas disponible. Votre travail reste affiché. Exportez l’épisode pour le conserver.";
  await expect(failure.getByRole("alert")).toHaveCount(1);
  await expect(failure.getByRole("alert")).toHaveText(failureText);
  await expect(failure).toBeFocused();
  await expect(failure).toBeInViewport({ ratio: 1 });
  expect(await raw(page)).toBeNull();
  const exported = await portableExport(page);
  expect(exported.workspace.episode.events).toHaveLength(1);
  expect(exported.workspace.episode.events[0].reasoning).toBe(INITIAL);
  await expect
    .poll(async () => (await recovered(page))?.draft?.episode.events)
    .toEqual(exported.workspace.episode.events);
  await expect(failure.getByRole("alert")).toHaveText(failureText);
  await page.getByRole("button", { name: "Sauvegarder l’épisode", exact: true }).click();
  // The footer retry must bring the same error back into view and announce it again.
  await expect(failure.getByRole("alert")).toHaveCount(1);
  await expect(failure.getByRole("alert")).toHaveText(failureText);
  await expect(failure).toBeFocused();
  await expect(failure).toBeInViewport({ ratio: 1 });
  expect(await raw(page)).toBeNull();
  expect((await portableExport(page)).workspace.episode.events).toEqual(
    exported.workspace.episode.events,
  );
  await isolated(page);
  await fit(page);
});

test("The episode works by keyboard, keeps documentary evidence distinct and fits its comparison at every viewport", async ({
  page,
  context,
}, info) => {
  await seed(context);
  await start(page);
  await expect(page.getByRole("heading", { level: 1, name: TITLE, exact: true })).toBeFocused();
  // Check the resolved public variant, not only its class; no pointer hover on this control.
  await page.mouse.move(0, 0);
  const exportAction = page.getByRole("button", { name: "Exporter l’épisode", exact: true });
  await expect(exportAction).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(exportAction).toHaveCSS("color", "rgb(77, 63, 196)");
  await expect(exportAction).toHaveCSS("box-shadow", "none");
  if (page.viewportSize().width <= 430)
    await expect(page.getByLabel("Approvisionnement", { exact: true })).toBeInViewport({
      ratio: 1,
    });
  if (["phone-390", "desktop-1280"].includes(info.project.name))
    await page.screenshot({
      path: info.outputPath("hotel-episode-viewport.png"),
      animations: "disabled",
    });
  await selectReferenceProofs(page);
  const saveAction = page.getByRole("button", { name: "Sauvegarder l’épisode", exact: true });
  await expect(saveAction).toBeEnabled();
  await saveAction.hover();
  await expect(saveAction).toHaveCSS("background-color", "rgb(234, 231, 244)");
  await expect(saveAction).toHaveCSS("color", "rgb(36, 29, 53)");
  await page.mouse.move(0, 0);
  const source = page
    .locator("summary")
    .filter({ hasText: "Lire : Constat contradictoire après fermeture" });
  await source.focus();
  await page.keyboard.press("Enter");
  await expect(source.locator("..")).toHaveJSProperty("open", true);
  await expect(source.locator("..")).toContainText("Pièce fictive.");
  await page.keyboard.press("Space");
  await expect(source.locator("..")).toHaveJSProperty("open", false);
  await initial(page);
  const letter = page.locator("summary").filter({ hasText: "Ouvrir la notification fournisseur" });
  await letter.focus();
  await page.keyboard.press("Enter");
  await expect(letter.locator("..")).toHaveJSProperty("open", true);
  await expect(letter.locator("..")).toContainText(/hypothèse|ficti/i);
  const action = page.getByRole("button", {
    name: "Prendre en compte la notification",
    exact: true,
  });
  await action.focus();
  await page.keyboard.press("Enter");
  await expect.poll(async () => (await saved(page))?.workspace.episode.events.length).toBe(2);
  await revise(page);
  const comparison = page.getByRole("region", {
    name: "Comparer les trois situations",
    exact: true,
  });
  await expect(comparison).toBeVisible();
  await comparison.scrollIntoViewIfNeeded();
  await fit(page);
  await isolated(page);
});

test("A deferred save freezes controls and retains the exact workspace only after the cooperative lock resolves", async ({
  page,
  context,
}) => {
  await seed(context);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "locks", {
      configurable: true,
      value: {
        request: (...args) =>
          new Promise((resolve, reject) => {
            const action = args.at(-1);
            window.__qaReleaseEpisodeLock = () => {
              Promise.resolve()
                .then(() => action())
                .then(resolve, reject);
            };
          }),
      },
    });
  });
  await start(page);
  const note =
    "Hypothèse fictive figée pendant la sauvegarde retenue, sans effacement du brouillon.";
  await page.getByLabel(REASON, { exact: true }).fill(note);
  await page.getByLabel("Préparer une autre zone", { exact: true }).check();
  const before = (await portableExport(page)).workspace;
  await page.getByRole("button", { name: "Sauvegarder l’épisode", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sauvegarder l’épisode", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Conserver la recommandation initiale", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel(REASON, { exact: true })).toBeDisabled();
  await expect(page.getByLabel("Approvisionnement", { exact: true })).toBeDisabled();
  expect(await raw(page)).toBeNull();
  await expect
    .poll(() => page.evaluate(() => typeof window.__qaReleaseEpisodeLock))
    .toBe("function");
  await page.evaluate(() => window.__qaReleaseEpisodeLock());
  await expect(
    page.getByText("Épisode sauvegardé sur ce navigateur.", { exact: true }),
  ).toBeVisible();
  expect((await saved(page)).workspace).toEqual(before);
  await expect(page.getByLabel(REASON, { exact: true })).toBeEnabled();
  await expect(page.getByLabel(REASON, { exact: true })).toHaveValue(note);
  await expect.poll(async () => (await recovered(page))?.draft).toBeNull();
  await isolated(page);
});
