import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const PROJECTS_KEY = "pmersion.projects.v1";
const RECOVERY_KEY = "pmersion.projects.draft.v1";
const LAB_KEY = "pmersion.decision-lab.v1";
const historical = {
  "pmersion.hotel-mission.v3": "historique fictif à conserver, octets inchangés",
  "pmersion.hotel-scenario.v4": "étude fictive indépendante de Projects",
};

async function start(page, context) {
  await context.addInitScript((values) => {
    for (const [key, value] of Object.entries(values))
      if (localStorage.getItem(key) === null) localStorage.setItem(key, value);
  }, historical);
  await page.goto("./#/projects");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Piloter le projet");
}

const raw = (page, key = PROJECTS_KEY) => page.evaluate((key) => localStorage.getItem(key), key);
const recovery = (page) =>
  page.evaluate((key) => JSON.parse(sessionStorage.getItem(key) || "null"), RECOVERY_KEY);

async function portableExport(page) {
  const waiting = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter le projet", exact: true }).click();
  const download = await waiting;
  expect(download.suggestedFilename()).toBe("pmersion-projects-demo.json");
  const path = await download.path();
  expect(path).not.toBeNull();
  return JSON.parse(await readFile(path, "utf8"));
}

function importedCopy(exported, title = "Projet restauré fictif") {
  const value = structuredClone(exported);
  value.project.title = title;
  value.project.description = "Hypothèse de restauration de données fictives uniquement.";
  return value;
}

async function openImport(page) {
  await page.getByRole("button", { name: "Importer un projet", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Importer un projet", exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function selectFile(dialog, value, name = "projet-fictif.json") {
  const choosing = dialog.page().waitForEvent("filechooser");
  await dialog.getByRole("button", { name: "Choisir un fichier", exact: true }).click();
  const chooser = await choosing;
  expect(chooser.isMultiple()).toBe(false);
  await chooser.setFiles({
    name,
    mimeType: "application/json",
    buffer: Buffer.from(typeof value === "string" ? value : JSON.stringify(value)),
  });
}

async function ready(dialog, value) {
  await selectFile(dialog, value);
  await expect(dialog.getByText(value.project.title, { exact: true })).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }),
  ).toBeEnabled();
}

async function isolated(page) {
  for (const [key, value] of Object.entries(historical)) expect(await raw(page, key)).toBe(value);
}

test("Projects export can be previewed and cancelled without replacing draft, reference or histories", async ({
  page,
  context,
}) => {
  await start(page, context);
  const exported = await portableExport(page);
  const incoming = importedCopy(exported);
  const reference = await raw(page);
  const beforeRecovery = await recovery(page);
  const requests = [];
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()))
      requests.push(request.method());
  });
  const dialog = await openImport(page);
  await ready(dialog, incoming);
  expect(await raw(page)).toBe(reference);
  expect(await recovery(page)).toEqual(beforeRecovery);
  await dialog.getByRole("button", { name: "Fermer la fenêtre", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText(exported.project.title, { exact: true })).toBeVisible();
  expect(await portableExport(page)).toEqual(exported);
  expect(await raw(page)).toBe(reference);
  // An identical portable project is still inspectable/restorable. It must
  // remain a no-op for persistence, and its undo must preserve the same state.
  await openImport(page);
  await ready(dialog, exported);
  await dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByText(
      "Le projet restauré est identique à la référence affichée. Aucune différence de projet à sauvegarder.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sauvegarder le projet", exact: true }),
  ).toBeDisabled();
  expect(await raw(page)).toBe(reference);
  expect(await recovery(page)).toEqual(beforeRecovery);
  expect(await portableExport(page)).toEqual(exported);
  await page.getByRole("button", { name: "Annuler la restauration", exact: true }).click();
  expect(await portableExport(page)).toEqual(exported);
  expect(await raw(page)).toBe(reference);
  expect(await recovery(page)).toEqual(beforeRecovery);
  expect(await raw(page, LAB_KEY)).toBeNull();
  expect(requests).toEqual([]);
  await isolated(page);
});

test("Projects restoration can be undone with its unfinished form and prior task status intact", async ({
  page,
  context,
}) => {
  await start(page, context);
  const exported = await portableExport(page);
  const incoming = importedCopy(exported);
  const movable = exported.project.tasks.find(
    (task) =>
      task.status === "blocked" &&
      task.dependsOn.every((id) =>
        exported.project.tasks.some(
          (predecessor) => predecessor.id === id && predecessor.status === "done",
        ),
      ),
  );
  expect(movable).toBeTruthy();
  await page.getByLabel(`Déplacer ${movable.title}`, { exact: true }).selectOption("in_progress");
  await page.getByRole("button", { name: "Nouvelle tâche", exact: true }).click();
  const unfinished = "Formulaire fictif encore incomplet";
  await page.getByLabel("Titre de la tâche", { exact: true }).fill(unfinished);
  await page.getByLabel("Responsable", { exact: true }).fill("Rôle fictif à confirmer");
  const before = (await recovery(page)).draft;
  const reference = await raw(page);
  const dialog = await openImport(page);
  await ready(dialog, incoming);
  await dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText(incoming.project.title, { exact: true })).toBeVisible();
  await expect(page.getByLabel("Titre de la tâche", { exact: true })).toHaveCount(0);
  expect(await raw(page)).toBe(reference);
  expect((await recovery(page)).draft.project).toEqual(incoming.project);
  await page.getByRole("button", { name: "Annuler la restauration", exact: true }).click();
  await expect(page.getByLabel("Titre de la tâche", { exact: true })).toHaveValue(unfinished);
  await expect(page.getByLabel("Responsable", { exact: true })).toHaveValue(
    "Rôle fictif à confirmer",
  );
  await expect(page.getByLabel(`Déplacer ${movable.title}`, { exact: true })).toHaveValue(
    "in_progress",
  );
  expect((await recovery(page)).draft).toEqual(before);
  expect(await raw(page)).toBe(reference);
  expect(await raw(page, LAB_KEY)).toBeNull();
  await isolated(page);
});

test("Restored project retains exported links and history, saves explicitly and supplies a detached Lab copy", async ({
  page,
  context,
}) => {
  await start(page, context);
  await page.getByRole("button", { name: "Nouvelle tâche", exact: true }).click();
  await page.getByLabel("Titre de la tâche", { exact: true }).fill("Trace exportée fictive");
  await page.getByLabel("Responsable", { exact: true }).fill("Rôle QA fictif");
  await page.getByRole("button", { name: "Enregistrer la tâche", exact: true }).click();
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(page.getByText("Version sauvegardée : 1.", { exact: true })).toBeVisible();
  const reference = await raw(page);
  const incoming = importedCopy(await portableExport(page), "Dossier de transfert fictif");
  expect(incoming.project.history).toHaveLength(1);
  expect(incoming.project.history[0].kind).toBe("task_created");
  const dialog = await openImport(page);
  await ready(dialog, incoming);
  await dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  expect(await raw(page)).toBe(reference);
  await page.getByRole("button", { name: "Sauvegarder le projet", exact: true }).click();
  await expect(page.getByText("Version sauvegardée : 2.", { exact: true })).toBeVisible();
  const saved = await raw(page);
  expect(JSON.parse(saved).project).toEqual(incoming.project);
  const clearedRecovery = {
    format: "draft-recovery.1",
    owner: RECOVERY_KEY,
    baseline: saved,
    draft: null,
  };
  await expect.poll(() => recovery(page)).toEqual(clearedRecovery);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Piloter le projet");
  expect(await portableExport(page)).toEqual(incoming);
  expect(await recovery(page)).toEqual(clearedRecovery);
  await page
    .getByRole("button", { name: "Explorer Decision Lab sans modifier le projet", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comparer avant d’engager");
  await expect(
    page.getByRole("heading", { level: 2, name: incoming.project.title, exact: true }),
  ).toBeVisible();
  expect(await raw(page)).toBe(saved);
  expect(await raw(page, LAB_KEY)).toBeNull();
  await page.getByRole("link", { name: "Ouvrir Projects", exact: true }).click();
  await expect(page.getByText("Version sauvegardée : 2.", { exact: true })).toBeVisible();
  expect(await portableExport(page)).toEqual(incoming);
  await isolated(page);
});

test("Project import rejects corrupt, future, recovery and non-fictional inputs without a replacement", async ({
  page,
  context,
}) => {
  await start(page, context);
  const exported = await portableExport(page);
  const reference = await raw(page);
  const future = { ...exported, format: "projects-local.99" };
  const nonFictional = structuredClone(exported);
  nonFictional.project.dataBasis = "real-project";
  const rejected = [
    ["vide.json", ""],
    ["corrompu.json", "{"],
    ["futur.json", future],
    ["brouillon.json", { format: "draft-recovery.1", draft: { project: exported.project } }],
    ["autre-perimetre.json", nonFictional],
  ];
  const dialog = await openImport(page);
  for (const [name, value] of rejected) {
    await selectFile(dialog, value, name);
    await expect(dialog.getByRole("alert")).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }),
    ).toBeDisabled();
    expect(await raw(page)).toBe(reference);
    expect(await recovery(page)).toBeNull();
  }
  await page.evaluate(() => {
    const original = File.prototype.text;
    File.prototype.text = async function () {
      if (this.name === "lecture-refusee.json")
        throw new DOMException("Lecture fictive refusée", "NotReadableError");
      return original.call(this);
    };
  });
  await selectFile(dialog, exported, "lecture-refusee.json");
  await expect(dialog.getByRole("alert")).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }),
  ).toBeDisabled();
  expect(await raw(page)).toBe(reference);
  await dialog.getByRole("button", { name: "Retirer le fichier", exact: true }).click();
  await expect(dialog.getByLabel("Fichier de projet PMersion", { exact: true })).toHaveValue("");
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await expect(
    dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }),
  ).toBeDisabled();
  const valid = importedCopy(exported);
  await ready(dialog, valid);
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Fermer la fenêtre", exact: true }).click();
  expect(await portableExport(page)).toEqual(exported);
  await isolated(page);
});

test("An import preview cannot overwrite a new saved reference from another tab", async ({
  page,
  context,
}) => {
  await start(page, context);
  const exported = await portableExport(page);
  const dialog = await openImport(page);
  await ready(dialog, importedCopy(exported));
  const other = await context.newPage();
  await other.goto("./#/projects");
  await expect(other.getByRole("heading", { level: 1 })).toHaveText("Piloter le projet");
  const newer = importedCopy(exported, "Référence fictive modifiée dans un autre onglet");
  newer.revision = 1;
  const newerRaw = JSON.stringify(newer);
  await other.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: PROJECTS_KEY,
    value: newerRaw,
  });
  await expect(
    dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Fermer la fenêtre", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Importer un projet", exact: true }),
  ).toBeDisabled();
  expect(await raw(page)).toBe(newerRaw);
  await expect(page.getByText(exported.project.title, { exact: true })).toBeVisible();
  await isolated(page);
  await other.close();
});

test("Restoration rereads the reference even when its replacement has not delivered a storage event", async ({
  page,
  context,
}) => {
  await start(page, context);
  const exported = await portableExport(page);
  const incoming = importedCopy(exported, "Import fictif devenu périmé");
  const dialog = await openImport(page);
  await ready(dialog, incoming);
  const newer = importedCopy(exported, "Référence fictive remplacée avant sa notification");
  newer.revision = 1;
  const newerRaw = JSON.stringify(newer);
  // A write by this document deliberately emits no StorageEvent. The application
  // must recheck the actual bytes at commit, not depend solely on notification.
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: PROJECTS_KEY,
    value: newerRaw,
  });
  const apply = dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true });
  await expect(apply).toBeEnabled();
  await apply.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toContainText(/sauvegarde|changé|aperçu/i);
  await expect(apply).toBeDisabled();
  await expect(
    page.locator(".projects-heading").getByText(exported.project.title, { exact: true }),
  ).toBeVisible();
  expect(await raw(page)).toBe(newerRaw);
  expect(await recovery(page)).toBeNull();
  expect(await raw(page, LAB_KEY)).toBeNull();
  await isolated(page);
});

test("Import preview owns keyboard focus and fits the supported viewport without an accidental application", async ({
  page,
  context,
}, info) => {
  await start(page, context);
  const exported = await portableExport(page);
  const incoming = importedCopy(
    exported,
    "Projet fictif avec un titre long à examiner avant restauration",
  );
  const trigger = page.getByRole("button", { name: "Importer un projet", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Importer un projet", exact: true });
  const close = dialog.getByRole("button", { name: "Fermer la fenêtre", exact: true });
  await expect(close).toBeFocused();
  await ready(dialog, incoming);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(
    await dialog.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return (
        bounds.left >= -1 &&
        bounds.right <= innerWidth + 1 &&
        bounds.top >= -1 &&
        bounds.bottom <= innerHeight + 1
      );
    }),
  ).toBe(true);
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  const focusedInside = await dialog.evaluate((node) => node.contains(document.activeElement));
  expect(focusedInside).toBe(true);
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  if (["phone-390", "desktop-1280"].includes(info.project.name))
    await page.screenshot({
      path: info.outputPath("projects-restore-preview.png"),
      fullPage: false,
    });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await portableExport(page)).toEqual(exported);
  expect(await raw(page)).toBeNull();
  await isolated(page);
});

test("A delayed file read cannot replace a newer preview or reopen a closed import", async ({
  page,
  context,
}) => {
  await start(page, context);
  const exported = await portableExport(page);
  const slow = importedCopy(exported, "Ancien fichier fictif lent");
  const recent = importedCopy(exported, "Fichier fictif choisi ensuite");
  await page.evaluate(() => {
    const original = File.prototype.text;
    window.__restoreSlowReadCount = 0;
    File.prototype.text = async function () {
      const text = await original.call(this);
      if (this.name !== "lent.json") return text;
      window.__restoreSlowReadCount += 1;
      return new Promise((resolve) => {
        window.__releaseSlowProjectText = () => resolve(text);
      });
    };
  });
  const dialog = await openImport(page);
  await selectFile(dialog, slow, "lent.json");
  await expect.poll(() => page.evaluate(() => window.__restoreSlowReadCount)).toBe(1);
  await expect(
    dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }),
  ).toBeDisabled();
  await ready(dialog, recent);
  await page.evaluate(() => window.__releaseSlowProjectText());
  await expect(dialog.getByText(recent.project.title, { exact: true })).toBeVisible();
  await expect(dialog.getByText(slow.project.title, { exact: true })).toHaveCount(0);
  await selectFile(dialog, slow, "lent.json");
  await expect.poll(() => page.evaluate(() => window.__restoreSlowReadCount)).toBe(2);
  await dialog.getByRole("button", { name: "Fermer la fenêtre", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.evaluate(() => window.__releaseSlowProjectText());
  await openImport(page);
  await expect(dialog.getByText(slow.project.title, { exact: true })).toHaveCount(0);
  await expect(dialog.getByText(recent.project.title, { exact: true })).toHaveCount(0);
  await expect(
    dialog.getByRole("button", { name: "Restaurer dans le brouillon", exact: true }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Fermer la fenêtre", exact: true }).click();
  expect(await portableExport(page)).toEqual(exported);
  expect(await raw(page)).toBeNull();
  await isolated(page);
});
