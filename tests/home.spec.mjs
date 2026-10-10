import { expect, test } from '@playwright/test';
test('the project plan leads to the real planning workshop with matching consequences', async ({page},info) => {
 await page.goto('/classique.html');
 await expect(page.getByRole('heading',{level:1})).toContainText('Voyez le projet.');
 await expect(page.locator('.galaxy,.big-planet,.space-layer')).toHaveCount(0);
 await page.locator('[data-decision-choice=recover]').focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('#decision-finish')).toHaveText('J56');
 await expect(page.locator('#decision-next')).toHaveAttribute('href','/beta/#/atelier/planning');
 await expect(page.locator('#home-project-plan [data-plan-task]')).toHaveCount(5);
 await expect(page.locator('#home-project-plan [data-plan-edge]')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.screenshot({path:info.outputPath('plan-vivant-home.png'),fullPage:true});
 await page.locator('#decision-next').click();
 await expect(page.getByTestId('planning-finish')).toHaveText('J60');
 await page.getByLabel('Interfaces techniques validées',{exact:true}).check();
 await page.getByLabel('Récupération effectivement vérifiée',{exact:true}).check();
 await expect(page.getByTestId('planning-finish')).toHaveText('J56');
 await page.getByRole('button',{name:'Voir le plan ↓',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Une date, avec ses conditions.',exact:true})).toBeFocused();
 await expect(page.locator('.project-plan')).toBeVisible();
 await page.screenshot({path:info.outputPath('plan-vivant-workshop.png'),fullPage:true});
});
test('one homepage demonstration retains readable facts without JavaScript',async({browser},info)=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4180/classique.html');
 await expect(page.getByRole('heading',{level:1})).toContainText('Voyez le projet.');
 await expect(page.locator('#decision-cost')).toHaveText('1 090 000 €');
 await expect(page.locator('#home-project-plan svg')).toBeVisible();
 await expect(page.locator('[data-decision-choice=recover]')).toBeDisabled();
 await expect(page.getByRole('link',{name:/Essayer la bêta PMersion/})).toHaveAttribute('href','/beta/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await context.close();
});

test('legacy unversioned module responses cannot mix with the current release', async ({page}) => {
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/decision-data.js', route => route.fulfill({contentType:'application/javascript',body:'throw new Error("legacy module loaded")'}));
 await page.route('**/project-plan.js', route => route.fulfill({contentType:'application/javascript',body:'throw new Error("legacy renderer loaded")'}));
 await page.goto('/classique.html');
 await page.locator('[data-decision-choice=recover]').click();
 await expect(page.locator('#decision-finish')).toHaveText('J56');
 await expect(page.locator('[data-plan-task="acceptance"] .project-plan__date')).toHaveText('J51 → J56');
 await expect(page.locator('[data-plan-finish-label]')).toHaveText('Fin J56');
 expect(errors).toEqual([]);
});

