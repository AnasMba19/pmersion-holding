import { expect, test } from "@playwright/test";

test("hierarchy has seventeen families and links a selected environment and phase without mixing simulation coverage", async ({
  page,
}, info) => {
  await page.goto("/beta/#/secteurs");
  await expect(page.locator(".project-domain-grid a")).toHaveCount(17);
  await expect(page.locator("#project-domain option")).toHaveCount(17);
  await page.getByLabel("Domaine", { exact: true }).selectOption("numerique");
  await page.getByLabel("Environnement", { exact: true }).selectOption("sirh");
  await page.getByLabel("Phase", { exact: true }).selectOption("reception");
  await expect(page.locator(".project-world-selection")).toContainText("moteur spécifique");
  await page.getByRole("link", { name: "Ouvrir ce dossier", exact: false }).click();
  await expect(page).toHaveURL(/univers\/numerique\?environnement=sirh&phase=reception/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SIRH");
  await expect(page.locator(".sector-model-caption")).toContainText("RH");
  await page.getByRole("button", { name: "2 · Chaîne d’interfaces", exact: true }).click();
  await expect(page.locator(".sector-model-caption")).toContainText("Réception et transition");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath("domain-hierarchy.png"), fullPage: true });
  await page.goto("/beta/#/univers/construction?environnement=hotel&phase=realisation");
  await page.getByRole("link", { name: "Instruire cette mission", exact: false }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Un retard fournisseur");
});

test("hotel reset confirms its exact scope and preserves both Synapse dossiers", async ({
  page,
}) => {
  await page.goto("/beta/#/mission/construction");
  await page.locator("#construction-justification").fill("Argumentation fictive pour le chantier.");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("pmersion.construction-hotel.v1")))
    .not.toBeNull();
  await page.evaluate(() => {
    localStorage.setItem("unrelated-keep", "yes");
  });
  const others = await page.evaluate(() => ({
    journey: localStorage.getItem("pmersion.public-discovery.v1"),
    workshops: localStorage.getItem("pmersion.public-workspace.v1"),
  }));
  await page.goto("/beta/#/donnees");
  await page.getByRole("button", { name: "Réinitialiser la mission Hôtel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Annuler l’effacement Hôtel", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Annuler l’effacement Hôtel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Réinitialiser la mission Hôtel", exact: true }),
  ).toBeFocused();
  expect(
    await page.evaluate(() => localStorage.getItem("pmersion.construction-hotel.v1")),
  ).not.toBeNull();
  await page.getByRole("button", { name: "Réinitialiser la mission Hôtel", exact: true }).click();
  await page
    .getByRole("button", { name: "Effacer uniquement la mission Hôtel", exact: true })
    .click();
  await expect(
    page.getByText("Simulation Hôtel effacée. Les autres dossiers sont conservés.", {
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("pmersion.construction-hotel.v1")),
  ).toBeNull();
  expect(
    await page.evaluate(() => ({
      journey: localStorage.getItem("pmersion.public-discovery.v1"),
      workshops: localStorage.getItem("pmersion.public-workspace.v1"),
    })),
  ).toEqual(others);
  expect(await page.evaluate(() => localStorage.getItem("unrelated-keep"))).toBe("yes");
});

test("an unsupported domain has a genuine recovery route", async ({ page }) => {
  await page.goto("/beta/#/univers/inconnu");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ce domaine");
  await page.getByRole("link", { name: "Revenir aux domaines", exact: false }).click();
  await expect(page.locator(".project-domain-grid a")).toHaveCount(17);
});

test("homepage hierarchy connects seventeen families, phases and three readings with two beta calls", async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await expect(page.locator("[data-world-family] option")).toHaveCount(17);
  await expect(page.locator(".header-cta,.final-cta .button")).toHaveCount(2);
  await expect(page.locator(".header-cta")).toHaveAttribute("href","/beta/");
  await expect(page.locator(".final-cta .button")).toHaveAttribute("href","/beta/");
  const before=await page.evaluate(()=>JSON.stringify(Object.entries(localStorage)));
  await page.locator("[data-world-family]").selectOption("numerique");
  await page.locator("[data-world-environment]").selectOption("sirh");
  await page.locator("[data-world-phase]").selectOption("reception");
  await expect(page.locator("[data-world-open]")).toHaveAttribute("href",/univers\/numerique\?environnement=sirh&phase=reception/);
  await expect(page.locator("[data-world-interface]")).toHaveCount(3);
  const readings=[];
  for(const number of [1,2,3]) {
    const button=page.locator(`[data-world-interface="${number}"]`);
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed","true");
    readings.push(await page.locator("[data-world-focus]").innerText());
    await expect(page.locator(`[data-scene-interface="${number}"] circle`)).toHaveAttribute("r","20");
  }
  expect(new Set(readings).size).toBe(3);
  await page.locator("[data-world-turn]").click();
  await page.locator("[data-world-explode]").click();
  await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length)).toBe(0);
  expect(await page.evaluate(()=>JSON.stringify(Object.entries(localStorage)))).toBe(before);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
