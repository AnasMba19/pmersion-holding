import { expect, test } from "@playwright/test";
import { exactSource } from "../tests/published-d.spec.mjs";

test("production P-Mero verifies a real reply or the explicit exhausted-quota fallback", async ({ page, request }, info) => {
  test.skip(info.project.name !== "live-desktop-1280", "One inference per release keeps the visitor budget bounded.");
  await exactSource(request);
  await page.goto("/");
  await page.getByRole("link", { name: "Explorer le projet Hôtel" }).click();
  await page.getByRole("link", { name: "Comparaison", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("ouverture J58");
  await page.getByRole("button", { name: "Poser une question à P-Mero" }).click();
  const input = page.getByRole("textbox", { name: "Question à P-Mero" });
  await expect(input).toBeEnabled();
  await input.fill("Pour Hôtel, compare le jour d’ouverture du scénario sélectionné au plan de référence et indique l’écart en jours ouvrés.");
  const transport = page.waitForResponse((response) =>
    response.url().endsWith("/api/p-mero") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Envoyer", exact: true }).click();
  const reply = await transport;
  if (reply.status() === 429) {
    expect((await reply.json()).error.code).toBe("DAILY_QUOTA_REACHED");
    const health = await request.get(reply.url(), { headers: { Origin: "https://pmersion.com" } });
    expect(health.status()).toBe(200);
    const status = await health.json();
    expect(status.enabled).toBe(true);
    expect(status.budget.remaining).toBe(0);
    await expect(page.getByRole("alert")).toContainText("La limite gratuite de requêtes est atteinte.");
    await page.getByRole("button", { name: "Afficher les calculs locaux" }).click();
    await expect(page.getByText("Ouverture calculée à J58.")).toBeVisible();
    info.annotations.push({ type: "inference", description: "Daily free quota exhausted. Deterministic fallback verified." });
    console.log("P-Mero live model response was unavailable at the verified daily free cap. Hôtel fallback passed.");
    return;
  }
  expect(reply.status()).toBe(200);
  const conversation = page.getByRole("list", { name: "Conversation P-Mero" });
  await expect(conversation.locator(".d-pmero-answer")).toContainText(/J58.*J68|J68.*J58/s, { timeout: 30_000 });
  await conversation.getByText("Calculs et sources", { exact: true }).click();
  await expect(conversation.getByText(/10 jours ouvrés avant le plan de référence/)).toBeVisible();
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
