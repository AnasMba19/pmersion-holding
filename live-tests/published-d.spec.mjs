import { expect, test } from "@playwright/test";
import { exactSource } from "../tests/published-d.spec.mjs";

test("production P-Mero explains the selected Hôtel plan with live inference", async ({ page, request }, info) => {
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
  await page.getByRole("button", { name: "Envoyer", exact: true }).click();
  const conversation = page.getByRole("list", { name: "Conversation P-Mero" });
  await expect(conversation.locator(".d-pmero-answer")).toContainText(/J58.*J68|J68.*J58/s, { timeout: 30_000 });
  await conversation.getByText("Calculs et sources", { exact: true }).click();
  await expect(conversation.getByText(/10 jours ouvrés avant le plan de référence/)).toBeVisible();
});
