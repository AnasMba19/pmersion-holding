import { expect, test } from '@playwright/test';

test('sector entry opens a distinct dossier and interactive model without changing stored work', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Nucléaire', exact: false }).click();
  await expect(page.locator('[data-world-title]')).toHaveText('Nucléaire');
  await expect(page.locator('[data-world-scene] svg')).toHaveAttribute('data-sector-scene', 'nucleaire');
  await page.locator('[data-world-open]').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projets du secteur nucléaire');
  await expect(page).toHaveTitle(/nucléaire.*PMersion/);
  const stored = await page.evaluate(() => JSON.stringify(Object.entries(localStorage)));
  const original = await page.locator('.sector-detail-scene').innerHTML();
  await page.getByRole('button', { name: 'Tourner la maquette', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({hasText:'Vue 2 sur 4'})).toBeVisible();
  expect(await page.locator('.sector-detail-scene').innerHTML()).not.toBe(original);
  await page.getByRole('button', { name: 'Séparer les volumes', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Séparer les volumes', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.sector-document summary').first().click();
  await expect(page.locator('.sector-document').first()).toHaveAttribute('open','');
  await page.screenshot({path:info.outputPath('sector-nuclear-detail.png'),fullPage:true});
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projets du secteur nucléaire');
  await expect(page.getByRole('button', { name: 'Séparer les volumes', exact: true })).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage)))).toBe(stored);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
  await page.getByRole('link',{name:'Ouvrir l’atelier Synapse'}).click();
  await expect(page.locator('.lab-heading')).toBeVisible();
  expect(errors).toEqual([]);
});

test('all six sector pages share the visual system, preserve dossier and handle unknown routes',async ({page},info)=>{
  await page.goto('/beta/#/secteurs');
  await expect(page.locator('.sector-card')).toHaveCount(6);
  const hrefs=await page.locator('.sector-card').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  const stored=await page.evaluate(()=>JSON.stringify(Object.entries(localStorage)));
  await page.screenshot({path:info.outputPath('sector-catalog.png'),fullPage:true});
  for(const href of hrefs){
    await page.goto(`/beta/${href}`);
    await expect(page.locator('.sector-detail-scene svg')).toBeVisible();
    await expect(page.locator('.sector-document')).toHaveCount(3);
    await expect(page.locator('.sector-questions li')).toHaveCount(3);
    expect(await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Barlow Condensed');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    expect(await page.evaluate(()=>JSON.stringify(Object.entries(localStorage)))).toBe(stored);
    await page.screenshot({path:info.outputPath(`sector-${href.split('/').pop()}.png`)});
  }
  await page.goto('/beta/#/secteurs/inconnu');
  await expect(page.getByRole('heading',{level:1})).toContainText('Ce secteur');
  await page.getByRole('link',{name:'Revenir aux univers de projet'}).click();
  await expect(page.locator('.sector-card')).toHaveCount(6);
});

test('homepage sector geometry settles, manual reduction stops motion and static entry remains readable',async ({page},info)=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
  await page.screenshot({path:info.outputPath('sector-home-desktop-phone.png')});
  await page.locator('[data-world-turn]').click();
  await page.getByRole('button',{name:'Réduire les animations',exact:true}).click();
  await page.locator('[data-world-sector=robotique]').click();
  await expect(page.locator('[data-world-scene] svg')).toHaveAttribute('data-sector-scene','robotique');
  await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
