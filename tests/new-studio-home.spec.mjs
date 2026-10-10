import { expect, test } from "@playwright/test";
test("main entry opens the professional studio and every hotel view with the same draft", async ({ page, request }, info) => {
  const errors=[];page.on("pageerror", e=>errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading",{level:1})).toHaveText("Pratiquer le pilotage de projet");
  await expect(page.getByLabel("Chambre",{exact:true}).locator("option")).toHaveCount(120);
  await page.screenshot({path:info.outputPath("new-studio-accueil.png"),fullPage:false});
  await page.getByRole("link",{name:"Explorer les huit archétypes"}).click();
  await expect(page.locator(".studio-archetypes article")).toHaveCount(8);
  await page.screenshot({path:info.outputPath("new-studio-projets.png"),fullPage:false});
  await page.getByRole("link",{name:"Atelier",exact:true}).click();
  await page.getByLabel("Approvisionnement",{exact:true}).selectOption("alternative");
  await page.getByLabel("Préparer les tâches hors zone").check();
  for(const [view,title] of [["Atelier","Hôtel 120 chambres"],["Dossier","Les pièces du dossier"],["Planning","Planning et impact économique"],["Qualité","Qualité et preuves"],["Revue MOA","Défendre votre décision"],["Bilan","Votre étude conservée"]]) {
    await page.getByRole("link",{name:view,exact:true}).click();
    await expect(page.getByRole("heading",{level:1})).toHaveText(title);
    await expect(page).toHaveTitle(`${title} · PMersion`);
    await expect(page.locator(".studio-facts").first()).toContainText("J27");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.screenshot({path:info.outputPath(`new-studio-${view.replaceAll(" ","-")}.png`),fullPage:false});
  }
  expect(await page.evaluate(()=>localStorage.getItem("pmersion.hotel-mission.v3"))).toBeNull();
  const manifest=await (await request.get("/beta/models/manifest.json")).json();
  expect(manifest.rooms).toHaveLength(120);
  const glb=await request.get("/beta/models/hotel120.glb");expect(glb.ok()).toBe(true);
  const b=await glb.body();expect(b.readUInt32LE(0)).toBe(0x46546c67);
  const data=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString("utf8"));
  expect(data.nodes.filter(n=>/^room-\d+$/.test(n.name||""))).toHaveLength(120);
  expect(errors).toEqual([]);
});
test("main entry has an honest reading route with scripts disabled",async({browser},info)=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport});
  const page=await context.newPage();await page.goto("http://127.0.0.1:4180/");
  await expect(page.getByRole("heading",{level:1})).toHaveText("Pratiquer le pilotage de projet");
  await page.getByRole("link",{name:"Lire la présentation accessible sans JavaScript"}).click();
  await expect(page.locator("#home-project-plan svg")).toBeVisible();
  await context.close();
});
