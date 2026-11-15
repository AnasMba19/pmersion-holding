import { expect, test } from "@playwright/test";
import { exactSource } from "../tests/published-d.spec.mjs";

const pmeroApi = "https://pmersion-pmero-public.pmersion-lab.workers.dev/api/p-mero";

async function verifyQuotaFallback(panel, request, info) {
  const health = await request.get(pmeroApi, { headers: { Origin: "https://pmersion.com" } });
  expect(health.status()).toBe(200);
  const status = await health.json();
  expect(status.enabled).toBe(true);
  expect(status.budget.remaining).toBe(0);
  await expect(panel.getByRole("status").filter({ hasText: "Quota quotidien partagé épuisé." })).toBeVisible();
  await expect(panel.getByRole("button", { name: "Envoyer", exact: true })).toBeDisabled();
  await panel.getByRole("button", { name: "Afficher les calculs locaux" }).click();
  await expect(panel.getByText("Ouverture calculée à J58.")).toBeVisible();
  info.annotations.push({ type: "inference", description: "Daily free quota exhausted. Deterministic fallback verified." });
}

test("production P-Mero verifies a real reply or the explicit exhausted-quota fallback", async ({ page, request }, info) => {
  test.skip(info.project.name !== "live-desktop-1280", "One inference per release keeps the visitor budget bounded.");
  await exactSource(request);
  await page.goto("/beta/#/simulate");
  const simulation = page.getByRole("region", { name: "Simulate", exact: true });
  await expect(simulation.getByText("J58", { exact: true })).toBeVisible();
  await simulation.getByText("Assistant PMersion · Aide locale", { exact: true }).click();
  await simulation.getByRole("button", { name: "Ouvrir P-Mero", exact: true }).click();
  const panel = page.getByRole("region", { name: "P-Mero", exact: true });
  await expect(panel.getByText("Contexte de l’écran · Simulate")).toBeVisible();
  const availability = panel.locator(".d-pmero-status");
  await expect(availability).toHaveAttribute("data-state", /^(ready|exhausted)$/);
  if (await availability.getAttribute("data-state") === "exhausted") {
    await verifyQuotaFallback(panel, request, info);
    return;
  }

  const input = panel.getByRole("textbox", { name: "Question à P-Mero" });
  await expect(input).toBeEnabled();
  await input.fill("Pour Hôtel, compare le jour d’ouverture du scénario sélectionné au plan de référence et indique l’écart en jours ouvrés.");
  const [reply] = await Promise.all([
    page.waitForResponse((response) =>
      response.url() === pmeroApi && response.request().method() === "POST",
    ),
    panel.getByRole("button", { name: "Envoyer", exact: true }).click(),
  ]);
  if (reply.status() === 429) {
    expect((await reply.json()).error.code).toBe("DAILY_QUOTA_REACHED");
    await expect(panel.getByRole("alert")).toContainText("Le quota gratuit partagé est épuisé.");
    await verifyQuotaFallback(panel, request, info);
    return;
  }
  expect(reply.status()).toBe(200);
  const conversation = panel.getByRole("log", { name: "Conversation P-Mero" });
  await expect(conversation.locator(".d-pmero-answer")).toContainText(/J58.*J68|J68.*J58/s, { timeout: 30_000 });
  const evidence = conversation.locator(".d-pmero-evidence");
  await evidence.getByText("Calculs et sources", { exact: true }).click();
  await expect(evidence.getByText(/10 jours ouvrés avant le plan de référence/)).toBeVisible();
});

test("the public Worker refuses a visitor on the advanced demo endpoint", async ({ request }, info) => {
  test.skip(info.project.name !== "live-desktop-1280", "The server access check is viewport-independent.");
  await exactSource(request);
  const response = await request.get(
    "https://pmersion-pmero-public.pmersion-lab.workers.dev/api/demo/catalog",
    { headers: { Origin: "https://pmersion.com" } },
  );
  expect(response.status()).toBe(401);
  expect((await response.json()).error.code).toBe("DEMO_SESSION_REQUIRED");
});
