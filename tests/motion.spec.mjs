import {test,expect} from '@playwright/test';
test.use({video:{mode:'on',size:{width:1280,height:900}}});
test('art direction stays usable through scroll motion and manual reduction',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-motion','full');
 await expect(page.getByRole('link',{name:'Essayer la bêta PMersion',exact:true})).toBeVisible();
 await page.evaluate(()=>document.fonts.ready);
 await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
 await page.screenshot({path:info.outputPath('art-01-hero.png')});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.locator('#signature-scene').scrollIntoViewIfNeeded();
 await expect.poll(()=>page.locator('#signature-scene').evaluate(e=>Number(e.style.getPropertyValue('--scene-progress')))).toBeGreaterThan(0);
 await page.screenshot({path:info.outputPath('art-02-signature.png'),animations:'disabled'});
 await page.locator('.gallery-composition').scrollIntoViewIfNeeded();
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
 await page.screenshot({path:info.outputPath('art-03-gallery.png')});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.getByRole('button',{name:'Réduire les animations',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');
 await page.locator('[data-decision-choice=savings]').click();
 await expect(page.locator('#decision-cost')).toHaveText('1 050 000 €');
 expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
 await expect(page.getByRole('button',{name:'Activer les animations',exact:true})).toHaveAttribute('aria-pressed','true');
});
test('static art direction exposes complete content with scripts disabled',async({browser},info)=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport});
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:4180/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Voyez le projet.');
 await expect(page.locator('#signature-title')).toBeVisible();
 await expect(page.locator('#decision-cost')).toHaveText('1 090 000 €');
 await expect(page.locator('#home-project-plan svg')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await context.close();
});

