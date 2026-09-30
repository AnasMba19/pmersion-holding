import { expect, test } from "@playwright/test";
test("homepage previews lead to the real workshops and remain keyboard operable", async ({page}, info) => {
  await page.goto("/");
  await expect(page.getByRole("heading",{level:1})).toContainText("La gestion de projet");
  await expect(page.locator(".galaxy,.big-planet,.space-layer")).toHaveCount(0);
  await page.getByRole("button",{name:/02 Planning/}).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#metric-value")).toHaveText("J60");
  await expect(page.locator("#preview-link")).toHaveAttribute("href","/beta/#/atelier/planning");
  await page.getByRole("button",{name:/03 Risques/}).click();
  await expect(page.locator("#metric-value")).toHaveText("20 / 25");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath("home-risk-preview.png")});
  await page.locator("#preview-link").click();
  await expect(page.getByRole("heading",{level:1})).toContainText("Un risque se pilote");
  await page.getByRole("link",{name:"Synthèse du comité",exact:true}).click();
  await expect(page.getByTestId("synthesis-cost")).toBeVisible();
});
