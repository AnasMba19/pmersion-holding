import { expect, test } from "@playwright/test";

const KEY = "pmersion.construction-hotel.v1";
const storage = (page) =>
  page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, KEY);
async function ready(page) {
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Un retard fournisseur");
}
async function draftPlan(page) {
  await page.getByRole("radio", { name: /Accélérer le fournisseur/ }).check();
  const recovery = page.getByLabel(/Récupération demandée/);
  await recovery.focus();
  await recovery.press("ArrowRight");
  await expect(recovery).toHaveValue("1");
  await page
    .locator("#construction-justification")
    .fill(
      "Accélérer sous réserve d’un engagement écrit du fabricant et maintenir le contrôle des interfaces.",
    );
  await page
    .locator("#construction-assumptions")
    .fill("La capacité de transport et les essais restent à confirmer par le fournisseur.");
  await page.locator("#construction-owner").fill("Responsable achats");
  await page
    .locator("#construction-action")
    .fill("Obtenir une confirmation écrite de la capacité et du plan de contrôle.");
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  await page.locator("#construction-date").fill(tomorrow);
  await expect.poll(async () => (await storage(page))?.draft.action.dueDate).toBe(tomorrow);
}

test("studio opens a shared mission, retains an argued plan and preserves historical snapshots", async ({
  page,
}, testInfo) => {
  await page.goto("/beta/#/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Le projet avance");
  await expect(page.locator(".studio-nav-tile")).toHaveCount(7);
  await expect(page.locator(".studio-nav-tile:visible")).toHaveCount(3);
  await expect(page.locator(".studio-complementary .studio-nav-tile")).toHaveCount(4);
  await page.screenshot({
    path: testInfo.outputPath("construction-dashboard.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Ouvrir la mission chantier", exact: false }).click();
  await ready(page);
  await page.locator("#weight-quality").fill("40");
  await expect(page.getByRole("button", { name: "Appliquer les pondérations" })).toBeDisabled();
  await page.locator("#weight-delay").fill("20");
  await page.getByRole("button", { name: "Appliquer les pondérations" }).click();
  await expect.poll(async () => (await storage(page))?.draft.inputs.weights.quality).toBe(40);
  await draftPlan(page);
  expect((await storage(page)).twin.version).toBe(0);
  await page.getByRole("button", { name: /Retenir le plan/ }).click();
  await expect.poll(async () => (await storage(page))?.twin.version).toBe(1);
  const first = (await storage(page)).twin.history[0];
  expect(first.before.schedule.finishDay).toBe(50);
  expect(first.after.schedule.finishDay).toBe(49);
  await page.reload();
  await ready(page);
  await expect(page.locator(".studio-history>li")).toHaveCount(1);
  await expect(page.locator(".studio-history blockquote")).toContainText("engagement écrit");
  await page.getByRole("radio", { name: /Qualifier une alternative locale/ }).check();
  await page.getByRole("button", { name: /Retenir le plan/ }).click();
  await expect.poll(async () => (await storage(page))?.twin.version).toBe(2);
  expect((await storage(page)).twin.history[0]).toEqual(first);
  await page.screenshot({ path: testInfo.outputPath("construction-mission.png"), fullPage: true });
  await page.getByRole("link", { name: "← Studio de simulation" }).click();
  await expect(page.locator(".studio-version").first()).toContainText("v2");
  await expect(page.locator(".studio-next")).toContainText("Responsable achats");
});

test("draft and scene controls do not silently mutate the retained project", async ({ page }) => {
  await page.goto("/beta/#/mission/construction");
  await ready(page);
  await draftPlan(page);
  const before = (await storage(page)).twin;
  const raw = await page.evaluate((key) => localStorage.getItem(key), KEY);
  await page.getByRole("button", { name: "Tourner la maquette", exact: true }).click();
  await page.getByRole("button", { name: "Séparer les volumes", exact: true }).click();
  await page.getByRole("button", { name: /3Zone témoin|3 Zone témoin/ }).click();
  await expect(page.locator(".studio-model-reading")).toContainText("J50");
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(raw);
  await page.getByRole("button", { name: "Note d’arbitrage", exact: true }).click();
  await expect(page).toHaveURL(/#\/mission\/construction$/);
  await page.reload();
  await expect(page.locator("#construction-justification")).toHaveValue(/engagement écrit/);
  expect((await storage(page)).twin).toEqual(before);
  await expect(
    page.getByRole("button", { name: "Séparer les volumes", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
});

test("empty reasoning yields associated inline errors and keyboard focus", async ({ page }) => {
  await page.goto("/beta/#/mission/construction");
  await ready(page);
  await page.getByRole("button", { name: /Retenir le plan/ }).click();
  await expect(page.locator("#construction-justification")).toBeFocused();
  await expect(page.locator("#construction-justification")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#error-justification")).toBeVisible();
  await expect(page.locator(".studio-history>li")).toHaveCount(0);
});

test("invalid storage is protected from editing and commit", async ({ page }) => {
  const bad = '{"format":"future.99"}';
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), {
    key: KEY,
    raw: bad,
  });
  await page.goto("/beta/#/mission/construction");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Cette sauvegarde ne peut pas être ouverte",
  );
  await expect(page.getByRole("button", { name: /Retenir le plan/ })).toHaveCount(0);
  await expect(page.locator(".studio-qcdr")).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(bad);
});

test("a cross-tab write blocks stale commit until explicit reload", async ({ page, context }) => {
  await page.goto("/beta/#/mission/construction");
  await ready(page);
  await draftPlan(page);
  const second = await context.newPage();
  await second.goto("/beta/#/mission/construction");
  await ready(second);
  await page
    .locator("#construction-assumptions")
    .fill("Une nouvelle capacité transport doit être confirmée avant lancement.");
  await expect(second.getByText(/Le dossier a changé dans un autre onglet/)).toBeVisible();
  await expect(second.getByRole("button", { name: /Retenir le plan/ })).toBeDisabled();
  await second.getByRole("button", { name: "Relire la sauvegarde" }).click();
  await expect(second.locator("#construction-assumptions")).toHaveValue(/nouvelle capacité/);
  await expect(second.getByRole("button", { name: /Retenir le plan/ })).toBeEnabled();
});

test("export contains actual draft and immutable decision trace", async ({ page }) => {
  await page.goto("/beta/#/mission/construction");
  await draftPlan(page);
  await page.getByRole("button", { name: /Retenir le plan/ }).click();
  await expect.poll(async () => (await storage(page))?.twin.version).toBe(1);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter le dossier JSON" }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe("pmersion-hotel-v1.json");
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const result = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  expect(JSON.stringify(result)).toContain("engagement écrit");
  expect(JSON.stringify(result)).toContain('"version":1');
});

test("narrow and reduced-motion screens retain usable model and table navigation", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/beta/#/mission/construction");
  await ready(page);
  await page.getByRole("button", { name: "Tourner la maquette", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Séparer les volumes", exact: true }).click();
  await expect(page.locator(".studio-model-drawing canvas:visible, .studio-model-drawing svg:visible").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.getByRole("button", { name: "Comparer les plans", exact: true }).click();
  await expect(page.locator("#mission-options")).toBeFocused();
  const matrix = page.getByRole("region", { name: /Comparaison des quatre plans/ });
  await matrix.focus();
  await expect(matrix).toBeFocused();
  await page.screenshot({
    path: testInfo.outputPath("construction-comparison.png"),
    fullPage: false,
  });
  expect(
    await page
      .locator(".studio-model-drawing")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

