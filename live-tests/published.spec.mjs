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
  await page.goto("/");
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

