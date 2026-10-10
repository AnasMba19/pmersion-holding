import { expect, test } from '@playwright/test';

test('activity and project context open the right dossier without changing stored work', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/classique.html');
  await page.getByLabel('Secteur d’activité', { exact: true }).selectOption('energie');
  await page.getByLabel('Type de projet', { exact: true }).selectOption('nucleaire');
  await expect(page.locator('[data-world-title]')).toHaveText('Projet nucléaire');
  await expect(page.locator('[data-world-scene] .context-map li')).toHaveCount(3);
  await expect(page.locator('[data-world-turn]')).toBeHidden();
  await expect(page.locator('[data-world-explode]')).toBeHidden();
  await page.locator('[data-world-open]').click();
  await expect(page).toHaveURL(/univers\/energie\?environnement=nucleaire&phase=realisation/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projet nucléaire');
  const stored = await page.evaluate(() => JSON.stringify(Object.entries(localStorage)));
  await page.getByRole('button', { name: '2 · Chaîne d’interfaces', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.sector-model-caption')).toContainText('Réalisation et intégration');
  await page.locator('.sector-document summary').first().click();
  await expect(page.locator('.sector-document').first()).toHaveAttribute('open', '');
  await page.screenshot({ path: info.outputPath('sector-nuclear-context.png'), fullPage: true });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projet nucléaire');
  await expect(page.getByRole('button', { name: '1 · Objet et acteurs', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage)))).toBe(stored);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.getByRole('link', { name: 'Examiner les pièces complémentaires de ce contexte →' }).click();
  await page.getByRole('link', { name: 'Ouvrir l’atelier Synapse' }).click();
  await expect(page.locator('.lab-heading')).toBeVisible();
  expect(errors).toEqual([]);
});

test('six inherited document routes stay readable while the catalogue has twenty-two unique sectors', async ({ page }, info) => {
  await page.goto('/beta/#/secteurs');
  await expect(page.locator('.project-domain-grid a')).toHaveCount(22);
  await expect(page.locator('.sector-card')).toHaveCount(0);
  const stored = await page.evaluate(() => JSON.stringify(Object.entries(localStorage)));
  await page.screenshot({ path: info.outputPath('sector-catalog.png'), fullPage: true });
  for (const slug of ['construction', 'nucleaire', 'robotique', 'si-data', 'industrie', 'services-sante']) {
    await page.goto(`/beta/#/secteurs/${slug}`);
    await expect(page.locator('.sector-document')).toHaveCount(3);
    await expect(page.locator('.sector-questions li')).toHaveCount(3);
    await expect(page.locator('.sector-model-controls button')).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Tourner la maquette', exact: true })).toHaveCount(0);
    await page.locator('.sector-model-controls button').nth(1).click();
    await expect(page.locator('.sector-model-controls button').nth(1)).toHaveAttribute('aria-pressed', 'true');
    expect(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily)).toContain('Barlow Condensed');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage)))).toBe(stored);
    await page.screenshot({ path: info.outputPath(`sector-${slug}.png`) });
  }
  await page.goto('/beta/#/secteurs/inconnu');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ce secteur');
  await page.getByRole('link', { name: 'Revenir aux univers de projet' }).click();
  await expect(page.locator('.project-domain-grid a')).toHaveCount(22);
});

test('manual motion reduction settles the Hotel model and context diagrams without horizontal overflow', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/classique.html');
  await expect(page.locator('.hotel-scene')).toHaveAttribute('data-renderer', 'webgl');
  const canvas = page.locator('.hotel-scene-canvas canvas');
  await expect(canvas).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  await page.screenshot({ path: info.outputPath('sector-home-desktop-phone.png') });
  const complete = await canvas.screenshot({ path: info.outputPath('hotel-webgl-default.png') });
  await page.locator('[data-world-explode]').click();
  await expect(page.locator('[data-world-explode]')).toHaveAttribute('aria-pressed', 'true');
  const cutaway = await canvas.screenshot({ path: info.outputPath('hotel-webgl-cutaway.png') });
  expect(complete.equals(cutaway)).toBe(false);
  await page.locator('[data-world-turn]').click();
  await page.getByRole('button', { name: 'Réduire les animations', exact: true }).click();
  await page.getByLabel('Secteur d’activité', { exact: true }).selectOption('industrie');
  await page.getByLabel('Type de projet', { exact: true }).selectOption('cellule');
  await expect(page.locator('[data-world-title]')).toHaveText('Cellule robotisée');
  await expect(page.locator('[data-world-scene] .context-map li')).toHaveCount(3);
  await expect(page.locator('[data-world-turn]')).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('unavailable WebGL keeps Hotel facts and the simulation accessible without retaining a decision', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return /^webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  });
  await page.goto('/classique.html');
  const before = await page.evaluate(() => JSON.stringify(Object.entries(localStorage)));
  await expect(page.locator('.hotel-scene')).toHaveAttribute('data-renderer', 'diagram');
  await expect(page.locator('.hotel-scene-fallback svg')).toBeVisible();
  await page.locator('[data-world-interface="3"]').click();
  await expect(page.locator('[data-world-focus]')).toContainText('20 jours ouvrés de retard');
  await expect(page.locator('[data-world-open]')).toHaveAttribute('href', '/beta/#/mission/construction');
  expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage)))).toBe(before);
  await page.locator('[data-world-open]').click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Un retard fournisseur');
  await expect(page.locator('#construction-justification')).toBeEditable();
  await expect(page.locator('.studio-version').first()).toContainText('v0');
});
