import { expect, test } from "@playwright/test";

test("all twenty-two domains expose two read-only project illustrations", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/beta/#/univers/agriculture");
  const selector = page.getByLabel("Secteur d’activité", { exact: true });
  const domains = await selector
    .locator("option")
    .evaluateAll((options) => options.map((option) => option.value));
  expect(domains).toHaveLength(22);
  for (const id of domains) {
    await selector.selectOption(id);
    const cards = page.locator("[data-domain-example]");
    await expect(cards).toHaveCount(2);
    await expect(page.locator("[data-domain-illustrations]")).toHaveAttribute(
      "data-domain-illustrations",
      id,
    );
    await expect(cards.first().locator("details:not([data-example-option])")).toHaveCount(3);
    await expect(cards.first().locator("[data-example-option]")).toHaveCount(3);
  }
  expect(errors).toEqual([]);
});

test("fictional documents and qualitative options open without saving a decision", async ({
  page,
}) => {
  await page.goto("/beta/#/univers/agriculture");
  const card = page.locator("[data-domain-example]").first();
  await expect(card).toBeVisible();
  const stored = await page.evaluate(() => JSON.stringify(Object.entries(localStorage)));
  const document = card.locator("details:not([data-example-option])").first();
  await document.locator("summary").click();
  await expect(document.locator(".sector-document-body")).toBeVisible();
  await expect(document).toContainText("Question à examiner");
  const option = card.locator("[data-example-option]").first();
  await option.locator("summary").click();
  await expect(option.locator(".sector-document-body")).toBeVisible();
  await expect(option).toContainText("Conditions à confirmer");
  expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage)))).toBe(stored);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({
    path: test.info().outputPath("domain-illustrations.png"),
    fullPage: true,
  });
});

test("an unknown domain keeps the existing recovery instead of inventing illustrations", async ({
  page,
}) => {
  await page.goto("/beta/#/univers/domaine-inconnu");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ce domaine n’a pas de dossier ici.",
  );
  await expect(page.locator("[data-domain-example]")).toHaveCount(0);
  await page.getByRole("link", { name: "Revenir aux domaines" }).click();
  await expect(page.locator(".project-domain-grid a")).toHaveCount(22);
});
