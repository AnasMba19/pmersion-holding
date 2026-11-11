import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const manifest = JSON.parse(readFileSync(new URL("../public-release.json", import.meta.url), "utf8"));
const api = "https://pmersion-pmero-public.pmersion-lab.workers.dev/api/p-mero";

async function guardReadOnlyPmero(page, baseURL) {
  const local = new URL(baseURL).hostname === "127.0.0.1";
  const methods = [];
  await page.route(api, (route) => {
    const method = route.request().method();
    methods.push(method);
    if (method === "POST") return route.abort();
    if (!local) return route.continue();
    return route.fulfill({
      json: { enabled: true, access: "visitor", data_scope: "fictional-demo" },
      headers: { "Access-Control-Allow-Origin": baseURL },
    });
  });
  return () => expect(methods).not.toContain("POST");
}

export async function exactSource(request) {
  await expect.poll(async () => {
    try {
      const response = await request.get("/public-release.json", { timeout: 8000 });
      return response.ok() ? (await response.json()).sourceCommit : null;
    } catch {
      return null;
    }
  }, { timeout: 120_000 }).toBe(manifest.sourceCommit);
}

test("the public Studio connects Hôtel simulation and comparison and preserves the historical link", async ({ page, request, baseURL }) => {
  await exactSource(request);
  const assertReadOnly = await guardReadOnlyPmero(page, baseURL);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Décidez avant de subir." })).toBeVisible();
  const navigation = page.getByRole("navigation", { name: "Outils PMersion" });
  await expect(navigation).toBeVisible();
  await page.getByRole("link", { name: "Explorer le projet Hôtel" }).click();
  await page.getByRole("link", { name: "Simulation", exact: true }).click();
  await expect(page.getByRole("img", { name: "Hôtel fictif de 120 chambres en 3D" })).toBeVisible();
  await page.getByRole("button", { name: "Maintenir", exact: true }).click();
  await page.getByRole("link", { name: "Comparaison", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("ouverture J68");
  await page.reload();
  await expect(page.getByRole("status")).toContainText("ouverture J68");
  await page.getByRole("button", { name: "Poser une question à P-Mero" }).click();
  await expect(page).toHaveURL(/#\/p-mero\?contexte=simulate$/);
  await page.reload();
  await expect(page.getByText("Contexte de l’écran · Simulate")).toBeVisible();
  await navigation.getByRole("link", { name: "P-Mero", exact: true }).click();
  await expect(page.getByText("Contexte de l’écran · Accueil")).toBeVisible();
  await page.goto("/hotel?vue=planning");
  await expect(page).toHaveURL(/\/#\/hotel\?vue=planning$/);
  await expect(navigation).toBeVisible();
  expect(errors).toEqual([]);
  assertReadOnly();
});

test("the public Projects dashboard can be scrolled with the keyboard", async ({ page, request }) => {
  await exactSource(request);
  await page.goto("/#/projects/atelier");
  const planning = page.getByRole("region", { name: "Planning des tâches" });
  await planning.focus();
  await expect(planning).toBeFocused();
  if (await planning.evaluate((element) => element.scrollWidth > element.clientWidth)) {
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => planning.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  }
  const risks = page.getByRole("region", { name: "Risques et décision" });
  await risks.focus();
  await expect(risks).toBeFocused();
});

test("the exact Hôtel model is served and the public P-Mero composer is ready", async ({ page, request, baseURL }) => {
  await exactSource(request);
  const assertReadOnly = await guardReadOnlyPmero(page, baseURL);
  const modelPath = "beta/models/hotel120.glb";
  const model = await request.get(`/${modelPath}`);
  expect(model.ok()).toBe(true);
  expect(createHash("sha256").update(await model.body()).digest("hex")).toBe(manifest.files[modelPath]);
  await page.goto("/");
  await page.getByRole("navigation", { name: "Outils PMersion" }).getByRole("link", { name: "P-Mero", exact: true }).click();
  const panel = page.getByRole("region", { name: "Assistant P-Mero", exact: true });
  const question = panel.getByRole("textbox", { name: "Question à P-Mero" });
  await expect(question).toBeEnabled();
  await expect(question).toHaveAccessibleDescription(/Utilise des données fictives.*transmis\./);
  await expect(panel.getByRole("log", { name: "Conversation P-Mero" })).toBeEmpty();
  await expect(panel.getByRole("button", { name: "Envoyer", exact: true })).toBeDisabled();
  await expect(panel.getByRole("button", { name: "Comment construire un planning fiable ?" })).toBeVisible();
  await page.getByRole("link", { name: "Données et sauvegardes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Données et sauvegardes", exact: true })).toBeVisible();
  await expect(page.getByText(/son service reçoit le message et le contexte de l’échange/)).toBeVisible();
  assertReadOnly();
});

test("discovery has an available LinkedIn preview and an accessible demo entrance", async ({ page, request }) => {
  await exactSource(request);
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://pmersion.com/beta/share-card.png");
  const image = await request.get("/beta/share-card.png");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const bytes = await image.body();
  expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]);
  await page.getByRole("link", { name: "Essayer la démo gratuite" }).click();
  await expect(page.getByRole("heading", { name: "Démo Hôtel gratuite" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Créer mon accès" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Me connecter" })).toBeVisible();
  await expect(page.getByText(/Sur invitation, scénarios supplémentaires et outils de pilotage/)).toBeVisible();
  await page.getByRole("link", { name: "Explorer le projet Hôtel sans compte" }).click();
  await expect(page.getByRole("heading", { name: "Hôtel · 120 chambres" })).toBeVisible();
});
