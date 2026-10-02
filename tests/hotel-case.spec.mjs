import { test, expect } from "@playwright/test";

test.describe("hotel menuiseries deep case", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cases/hotel-menuiseries.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("exposes the complete construction context and three tradeoffs", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Hôtel 120 chambres/ })).toBeVisible();
    await expect(page.getByText(/retard fournisseur · 4 semaines/i)).toBeVisible();
    await expect(page.getByText(/Aucune option ne masque le glissement résiduel/i)).toBeVisible();
    await expect(page.locator(".case-option")).toHaveCount(3);
    await expect(page.getByText(/PLN-MX-021 · Rev C/)).toBeVisible();
    await expect(page.getByText(/SUP-MX-014 · Rev A/)).toBeVisible();
  });

  test("applies the re-sequencing decision to the Twin without promising J42", async ({ page }) => {
    await page.locator('.case-option[data-option="resequence"]').click();
    await page.getByRole("button", { name: "Appliquer au Twin" }).click();

    await expect(page.locator("#twin-date")).toHaveText("J49");
    await expect(page.locator("#impact-schedule")).toHaveText("+7 j");
    await expect(page.locator("#impact-cost")).toHaveText("+48 k€");
    await expect(page.locator("#twin-quality")).toHaveText("2");
    await expect(page.locator("#twin-risk")).toHaveText("54 / 100");
    await expect(page.locator("#proof-date")).toHaveText("J42 → J49 (+7 j)");
  });

  test("uses visible weights and can change the calculated recommendation", async ({ page }) => {
    await expect(page.locator("#recommendation-title")).toHaveText("Re-séquencer + accélération ciblée");

    await page.locator('[data-weight="quality"]').fill("50");
    await page.locator('[data-weight="cost"]').fill("50");
    await page.locator('[data-weight="schedule"]').fill("0");
    await page.locator('[data-weight="risk"]').fill("0");
    await page.locator('[data-weight="stakeholder"]').fill("0");

    await expect(page.locator("#weight-note")).toContainText("Total 100 %");
    await expect(page.locator("#recommendation-title")).toHaveText("Accepter le glissement et sécuriser la qualité");
    await expect(page.locator("#recommendation-score")).toContainText("/ 100");
  });

  test("keeps the draft local and restores it", async ({ page }) => {
    await page.locator("#justification").fill("Je recommande une réponse conditionnelle, avec contrôle des interfaces, suivi fournisseur et seuil de nouvel arbitrage.");
    await page.locator('.case-option[data-option="resequence"]').click();
    await page.reload();

    await expect(page.locator("#justification")).toHaveValue(/Je recommande une réponse conditionnelle/);
    await expect(page.locator("#proof-option")).toContainText("Re-séquencer");
    await expect(page.locator("#draft-status")).toContainText("Brouillon local");
  });
});
