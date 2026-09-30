import { expect, test } from "@playwright/test";

const amount = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
async function capture(page, info, name) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true });
  await page.screenshot({ path: info.outputPath(`${name}-viewport.png`) });
}
test("planning only applies recovery after its conditions and resets incompatible assumptions", async ({
  page,
}, info) => {
  await page.goto("/beta/#/atelier/planning");
  await expect(page.getByTestId("planning-finish")).toHaveText("J60");
  const verified = page.getByRole("checkbox", { name: "Récupération effectivement vérifiée" });
  await expect(verified).toBeDisabled();
  await page.getByRole("checkbox", { name: "Interfaces techniques validées" }).check();
  await expect(page.getByTestId("planning-finish")).toHaveText("J60");
  await verified.check();
  await expect(page.getByTestId("planning-finish")).toHaveText("J56");
  await expect(page.getByTestId("planning-delay")).toHaveText("9 j");
  await capture(page, info, "05-planning");
  await page.getByRole("radio", { name: /Chevaucher/ }).check();
  await expect(verified).not.toBeChecked();
  await expect(page.getByTestId("planning-finish")).toHaveText("J60");
  await page.getByRole("checkbox", { name: "Interfaces techniques validées" }).check();
  await verified.check();
  await expect(page.getByTestId("planning-finish")).toHaveText("J55");
  await page.getByRole("radio", { name: /Maintenir/ }).check();
  await expect(verified).toBeDisabled();
  await expect(page.getByTestId("planning-finish")).toHaveText("J60");
  await page.reload();
  await expect(page.getByTestId("planning-finish")).toHaveText("J60");
});
test("risk qualification has a time boundary and an incident is never displayed as zero", async ({
  page,
}, info) => {
  await page.goto("/beta/#/atelier/risques");
  const qualified = page.getByRole("checkbox", { name: /Alternative qualifiée/ });
  await expect(qualified).toBeDisabled();
  await expect(page.getByTestId("risk-exposure")).toHaveText("20 / 25");
  await page.getByRole("button", { name: /J4/ }).click();
  await expect(qualified).toBeDisabled();
  await page.getByRole("button", { name: /J5/ }).click();
  await expect(page.getByTestId("risk-exposure")).toHaveText("20 / 25");
  await qualified.focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("risk-exposure")).toHaveText("8 / 25");
  await capture(page, info, "06-risks");
  await page.getByRole("button", { name: /J6/ }).click();
  await expect(page.getByTestId("risk-exposure")).toHaveText("Incident");
  await page.getByRole("radio", { name: /Accepter avec une réserve/ }).check();
  await expect(qualified).toBeDisabled();
  await expect(page.getByTestId("risk-exposure")).toHaveText("Incident");
  await page.getByRole("button", { name: /J0/ }).click();
  await expect(page.getByTestId("risk-exposure")).toHaveText("20 / 25");
});
test("common synthesis includes actions once and keeps unknown cost and date incomplete", async ({
  page,
}, info) => {
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4180/") && !request.url().startsWith("data:"))
      external.push(request.url());
  });
  await page.goto("/beta/#/atelier/synthese");
  await page.getByRole("button", { name: "Exemple guidé", exact: true }).click();
  await expect(page.getByTestId("synthesis-cost")).toHaveText(amount(1101000));
  await expect(page.getByTestId("synthesis-date")).toHaveText("J60");
  await page.getByRole("radio", { name: /Effets vérifiés/ }).check();
  await expect(page.getByTestId("synthesis-cost")).toHaveText(amount(1061000));
  await expect(page.getByTestId("synthesis-date")).toHaveText("J56");
  await capture(page, info, "07-synthesis");
  await page.getByRole("radio", { name: /Incident à chiffrer/ }).check();
  await expect(page.getByTestId("synthesis-cost")).toHaveText("À compléter");
  await expect(page.getByTestId("synthesis-date")).toHaveText("À compléter");
  await expect(page.getByText("Sous-total connu", { exact: true })).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".product-rail")).toBeHidden();
  await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
