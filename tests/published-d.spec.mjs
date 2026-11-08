import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const manifest = JSON.parse(readFileSync(new URL("../public-release.json", import.meta.url), "utf8"));
const api = "https://pmersion-pmero-public.pmersion-lab.workers.dev/api/p-mero";

async function exactSource(request) {
  await expect.poll(async () => {
    try {
      const response = await request.get("/public-release.json", { timeout: 8000 });
      return response.ok() ? (await response.json()).sourceCommit : null;
    } catch {
      return null;
    }
  }, { timeout: 120_000 }).toBe(manifest.sourceCommit);
}

test("Direction D is the public default and the Hôtel direct link preserves its view", async ({ page, request }) => {
  await exactSource(request);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pmersion-workspace", "d");
  const dock = page.getByRole("navigation", { name: "Outils PMersion" });
  await expect(dock).toBeVisible();
  await dock.getByRole("button", { name: "Simulate", exact: true }).click();
  const simulation = page.getByRole("region", { name: "Simulate", exact: true });
  await simulation.getByRole("button", { name: "Maintenir", exact: true }).click();
  await expect(simulation.getByText("J68", { exact: true })).toBeVisible();
  await page.goto("/hotel?vue=planning");
  await expect(page).toHaveURL(/\/#\/hotel\?vue=planning$/);
  await expect(dock).toBeVisible();
  expect(errors).toEqual([]);
});

test("the exact 3D file is served and the public P-Mero panel is ready", async ({ page, request, baseURL }) => {
  await exactSource(request);
  const modelPath = "beta/models/hotel120.glb";
  const model = await request.get(`/${modelPath}`);
  expect(model.ok()).toBe(true);
  expect(createHash("sha256").update(await model.body()).digest("hex")).toBe(manifest.files[modelPath]);
  if (baseURL.startsWith("http://127.0.0.1")) {
    await page.route(api, (route) => route.fulfill({ json: { enabled: true, access: "visitor" }, headers: { "Access-Control-Allow-Origin": baseURL } }));
  }
  await page.goto("/");
  await page.getByRole("navigation", { name: "Outils PMersion" }).getByRole("button", { name: "P-Mero", exact: true }).click();
  const panel = page.getByRole("region", { name: "P-Mero", exact: true });
  await expect(panel.getByRole("textbox", { name: "Question à P-Mero" })).toBeEnabled();
  await expect(panel.getByText(/Aucune donnée réelle|N’envoie aucune donnée réelle/)).toBeVisible();
});
