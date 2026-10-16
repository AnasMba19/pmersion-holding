import { expect, test } from "@playwright/test";
import { effectiveTextContrast } from "./contrast-helper.mjs";

const fit = async (page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
const evidenceRow = (page) =>
  page.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: /acoustique/i }),
  });
const publicTheme = async (page) =>
  page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.display = "none";
    document.body.append(probe);
    const resolve = (token) => {
      probe.style.backgroundColor = `var(${token})`;
      return getComputedStyle(probe).backgroundColor;
    };
    const canonical = {
      canvas: resolve("--pub-canvas"),
      surface: resolve("--pm-brand-white"),
      action: resolve("--pub-action"),
    };
    const studio = document.querySelector(".studio.generated-screen");
    const nav = document.querySelector(studio ? "#viewport-1-winner-nav" : ".product-rail");
    const actual = {
      canvas: getComputedStyle(studio ?? document.body).backgroundColor,
      surface: nav ? getComputedStyle(nav).backgroundColor : null,
    };
    const luminance = (value) => {
      const channels = value
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number)
        .map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const lightness = {
      canvas: luminance(actual.canvas),
      surface: actual.surface ? luminance(actual.surface) : 0,
    };
    probe.remove();
    return { canonical, actual, lightness };
  });
const legacyRaw = JSON.stringify({
  format: "hotel-mission-local.3",
  revision: 1,
  history: [
    {
      id: "independent-legacy-001",
      version: 1,
      model: "hotel-mission.3",
      inputs: {
        plan: { supply: "wait", prepare: false, checks: true },
        deliveryShift: 0,
        dailyMargin: 5000,
        evidence: [],
      },
      reasoning: "Étude historique conservée avec son hypothèse aval de dix-huit jours.",
      recordedAt: "2026-10-10T19:00:00Z",
    },
  ],
});

test("primary CTA has effective contrast in both states, uses the canonical SVG and precedes the model", async ({
  page,
}, info) => {
  if (info.project.name === "desktop-1280")
    await page.setViewportSize({ width: 1440, height: 900 });
  const requested = [];
  page.on("request", (request) => requested.push(request.url()));
  await page.goto("/beta/#/studio");
  const primary = page.getByRole("link", { name: "Ouvrir la mission Hôtel", exact: true });
  await expect(primary).toBeVisible();
  const normal = await effectiveTextContrast(primary);
  expect(normal.ratio, JSON.stringify(normal)).toBeGreaterThanOrEqual(4.5);
  await primary.hover();
  const hovered = await effectiveTextContrast(primary);
  expect(hovered.ratio, JSON.stringify(hovered)).toBeGreaterThanOrEqual(4.5);
  const logo = page.getByRole("img", { name: "PMersion", exact: true });
  const logoSource = await logo.getAttribute("src");
  expect(logoSource).toMatch(/\.svg(?:\?|$)|^data:image\/svg\+xml[;,]/);
  let svg;
  if (logoSource.startsWith("data:")) {
    const comma = logoSource.indexOf(",");
    const metadata = logoSource.slice(0, comma);
    const encoded = logoSource.slice(comma + 1);
    svg = /;base64(?:;|$)/i.test(metadata)
      ? Buffer.from(encoded, "base64").toString("utf8")
      : decodeURIComponent(encoded);
  } else {
    const response = await page.request.get(logoSource);
    expect(response.ok()).toBe(true);
    svg = await response.text();
  }
  expect(svg).toMatch(/<svg\b/);
  expect(svg).not.toMatch(/PIEOTAGE|PROUET/i);
  const disclosure = page.locator("details.studio-model-disclosure");
  await expect(disclosure).toHaveCount(1);
  await expect(disclosure).toHaveJSProperty("open", false);
  await expect(page.locator(".studio-model-panel")).toHaveCount(0);
  expect(requested.filter((url) => /hotel-planning-scene(?:\.ts|-)/.test(url))).toEqual([]);
  expect(
    await primary.evaluate((node) => {
      const model = document.querySelector(".studio-model-disclosure");
      return Boolean(
        model && node.compareDocumentPosition(model) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
  ).toBe(true);
  const studioTheme = await publicTheme(page);
  expect(studioTheme.actual.canvas).toBe(studioTheme.canonical.canvas);
  expect(studioTheme.actual.surface).toBe(studioTheme.canonical.surface);
  expect(studioTheme.lightness.canvas).toBeGreaterThan(0.65);
  expect(studioTheme.lightness.surface).toBeGreaterThanOrEqual(studioTheme.lightness.canvas);
  await page.mouse.move(0, 0);
  await expect(primary).toHaveCSS("background-color", studioTheme.canonical.action);
  await expect(primary).toHaveCSS("color", studioTheme.canonical.surface);
  await page.goto("/beta/#/missions");
  await expect(page.locator(".product-shell")).toBeVisible();
  const siblingTheme = await publicTheme(page);
  expect(siblingTheme.canonical).toEqual(studioTheme.canonical);
  expect(siblingTheme.actual).toEqual(studioTheme.actual);
  expect(siblingTheme.lightness).toEqual(studioTheme.lightness);
  await page.goto("/beta/#/studio");
  await expect(primary).toBeVisible();
  await fit(page);
  if (["phone-390", "desktop-1280"].includes(info.project.name)) {
    await page.mouse.move(0, 0);
    await page.screenshot({ path: info.outputPath("correction-accueil.png"), fullPage: true });
  }
  await primary.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hôtel 120 chambres");
  const supply = page.getByLabel("Approvisionnement", { exact: true });
  await supply.scrollIntoViewIfNeeded();
  await expect(supply).toBeInViewport();
  const bounds = await supply.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize().width);
  await supply.selectOption("alternative");
  await expect(supply).toHaveValue("alternative");
  expect(
    await supply.evaluate((node) => {
      const disclosure = document.querySelector(".studio-model-disclosure");
      return Boolean(
        disclosure && node.compareDocumentPosition(disclosure) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
  ).toBe(true);
  await fit(page);
  if (["phone-390", "desktop-1280"].includes(info.project.name)) {
    await page.screenshot({ path: info.outputPath("correction-atelier.png"), fullPage: true });
    for (const [view, title] of [
      ["planning", "Planning et impact économique"],
      ["qualite", "Qualité et preuves"],
      ["revue", "Défendre votre décision"],
    ]) {
      await page.goto(`/beta/#/hotel?vue=${view}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await fit(page);
      await page.screenshot({ path: info.outputPath(`correction-${view}.png`), fullPage: true });
    }
  }
});

test("the six-step guide navigates the hotel and every reference plan exposes three distinct MOA objections", async ({
  page,
}) => {
  await page.goto("/beta/#/studio");
  const guideSummary = page.getByText("Explorer le cas Hôtel en six étapes", { exact: true });
  await guideSummary.click();
  const guide = guideSummary.locator("..");
  const steps = guide.locator(":scope > ol > li");
  await expect(steps).toHaveCount(6);
  const links = steps.getByRole("link");
  await expect(links).toHaveCount(6);
  const hrefs = await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(
    hrefs.every((href) => /^#\/hotel(?:\?vue=(?:planning|qualite|revue|bilan))?$/.test(href)),
  ).toBe(true);
  const reviewLink = guide.getByRole("link", {
    name: "Défendre une condition devant la MOA",
    exact: true,
  });
  await reviewLink.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Défendre votre décision");
  const summary = page.getByText("Objections pour les quatre plans", { exact: true });
  await summary.click();
  const plans = summary.locator("..").locator(":scope > details");
  await expect(plans).toHaveCount(4);
  const questions = [];
  for (const plan of await plans.all()) {
    await plan.locator(":scope > summary").focus();
    await page.keyboard.press("Enter");
    await expect(plan).toHaveJSProperty("open", true);
    const objections = plan.locator(":scope > ol > li");
    await expect(objections).toHaveCount(3);
    for (const objection of await objections.all()) {
      const question = (await objection.getByRole("heading", { level: 3 }).innerText()).trim();
      expect(question.length).toBeGreaterThan(30);
      questions.push(question);
      await expect(objection.locator("p")).toHaveCount(2);
      for (const paragraph of await objection.locator("p").all()) {
        const detail = await paragraph.evaluate((node) =>
          [...node.childNodes]
            .filter((child) => child.nodeType === Node.TEXT_NODE)
            .map((child) => child.textContent)
            .join("")
            .trim(),
        );
        expect(detail.length).toBeGreaterThan(20);
      }
    }
  }
  expect(new Set(questions).size).toBe(12);
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-scenario.v4"))).toBeNull();
  await fit(page);
});

test("planning exposes real dated bars with a keyboard-readable dependency table", async ({
  page,
}) => {
  await page.goto("/beta/#/hotel?vue=planning");
  const planning = page.getByRole("figure", { name: "Planning prévisionnel Hôtel" });
  await expect(planning).toBeVisible();
  expect(await planning.locator(".studio-gantt-bar").count()).toBeGreaterThanOrEqual(3);
  for (const bar of await planning.locator(".studio-gantt-bar").all()) {
    const bounds = await bar.boundingBox();
    expect(bounds.width).toBeGreaterThan(0);
  }
  const calendar = page.getByRole("table", { name: "Calendrier et dépendances du plan affiché" });
  await expect(calendar).toBeVisible();
  expect(await calendar.getByRole("row").count()).toBeGreaterThanOrEqual(4);
  await expect(calendar).toContainText(/J\d+/);
  await expect(calendar).toContainText(/dépendance|prédécesseur/i);
  const calendarRegion = page.getByRole("region", { name: "Calendrier Hôtel, tableau défilant" });
  await calendarRegion.focus();
  await expect(calendarRegion).toBeFocused();
  const overflows = await calendarRegion.evaluate((node) => node.scrollWidth > node.clientWidth);
  if (overflows) {
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => calendarRegion.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  }
  await fit(page);
});

test("a selected document cannot turn an incompatible product or failed acoustic test into a pass", async ({
  page,
}) => {
  await page.goto("/beta/#/hotel");
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("alternative");
  await page.getByRole("link", { name: "Qualité", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "Choisir une pièce du dossier" }),
  ).toBeVisible();
  await expect(page.getByLabel("Mesure d’isolement acoustique")).toHaveCount(0);
  await expect(page.getByLabel("Référence de la preuve")).toHaveCount(0);
  await page.getByLabel("Contrôle", { exact: true }).selectOption("acoustics");
  const document = page.getByLabel("Pièce du dossier", { exact: true });
  const record = page.getByRole("button", { name: "Ajouter la pièce à l’étude", exact: true });
  await document.selectOption("HOT-AC-REF");
  await record.click();
  await expect(evidenceRow(page)).toContainText(/incompatible|autre produit|ne correspond/i);
  await expect(evidenceRow(page)).not.toContainText("Conforme au critère d’exercice");
  await document.selectOption("HOT-AC-ALT-INITIAL");
  await record.click();
  await expect(evidenceRow(page)).toContainText("38");
  await expect(evidenceRow(page)).toContainText(/NC ouverte|Échec/);
  await document.selectOption("HOT-AC-ALT-REPRISE");
  await record.click();
  await expect(evidenceRow(page)).toContainText("42");
  await expect(evidenceRow(page)).toContainText(/Conforme|Satisfait/);
  await expect(page.getByText("Preuve manquante", { exact: true })).toHaveCount(3);
  await fit(page);
});

test("MOA choices have distinct consequences and restarting the draft preserves the retained study", async ({
  page,
}) => {
  await page.goto("/beta/#/hotel?vue=revue");
  const questions = page.locator("fieldset").filter({ has: page.getByRole("radio") });
  await expect(questions).toHaveCount(3);
  const first = questions.first();
  await first.locator('input[value="accept"]').check();
  const firstReaction = await first.getByRole("status").innerText();
  await first.locator('input[value="verify"]').check();
  await expect(first.getByRole("status")).not.toHaveText(firstReaction);
  expect((await first.getByRole("status").innerText()).trim().length).toBeGreaterThan(20);
  for (const question of await questions.all())
    await question.locator('input[value="verify"]').check();
  await page
    .getByLabel("Votre recommandation")
    .fill("Je demande les pièces compatibles et une confirmation de capacité avant de m’engager.");
  await page.getByRole("button", { name: "Conserver l’étude Hôtel", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const value = localStorage.getItem("pmersion.hotel-scenario.v4");
        return value ? JSON.parse(value).revision : 0;
      }),
    )
    .toBe(1);
  const retained = await page.evaluate(() => localStorage.getItem("pmersion.hotel-scenario.v4"));
  await page.getByRole("link", { name: "Atelier", exact: true }).click();
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("alternative");
  await page.getByLabel("Préparer les tâches hors zone").check();
  await page.getByRole("link", { name: "Revue MOA", exact: true }).click();
  const draftNote =
    "Nouvel arbitrage à préserver : alternative, préparation et essais propres au produit.";
  await page.getByLabel("Votre recommandation").fill(draftNote);
  await page.getByRole("link", { name: "Atelier", exact: true }).click();
  await page.getByRole("button", { name: "Recommencer le brouillon", exact: true }).click();
  await expect(page.getByLabel("Approvisionnement", { exact: true })).toHaveValue("wait");
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-scenario.v4"))).toBe(
    retained,
  );
  await page.getByRole("button", { name: "Annuler le nouvel essai", exact: true }).click();
  await expect(page.getByLabel("Approvisionnement", { exact: true })).toHaveValue("alternative");
  await expect(page.getByLabel("Préparer les tâches hors zone")).toBeChecked();
  await page.getByRole("link", { name: "Revue MOA", exact: true }).click();
  await expect(page.getByLabel("Votre recommandation")).toHaveValue(draftNote);
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-scenario.v4"))).toBe(
    retained,
  );
  await page.getByRole("link", { name: "Atelier", exact: true }).click();
  await page.getByRole("button", { name: "Recommencer le brouillon", exact: true }).click();
  await page.getByRole("link", { name: "Bilan", exact: true }).click();
  await expect(page.getByText("hotel-scenario.4", { exact: false })).toBeVisible();
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-scenario.v4"))).toBe(
    retained,
  );
});

test("historical .3 results remain readable under their original model without rewriting their storage", async ({
  page,
}) => {
  await page.goto("/beta/#/studio");
  await page.evaluate((raw) => {
    localStorage.setItem("pmersion.hotel-mission.v3", raw);
  }, legacyRaw);
  await page.reload();
  await page.goto("/beta/#/hotel?vue=bilan");
  await page.getByText("Relire les études de l’ancien modèle Hôtel .3", { exact: true }).click();
  await expect(page.getByText("hotel-mission.3", { exact: false })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Ancienne prévision J68/ }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-mission.v3"))).toBe(
    legacyRaw,
  );
  await page.getByRole("link", { name: "Atelier", exact: true }).click();
  await page.getByLabel("Approvisionnement", { exact: true }).selectOption("alternative");
  await page.getByRole("button", { name: "Recommencer le brouillon", exact: true }).click();
  await page.getByRole("link", { name: "Revue MOA", exact: true }).click();
  await page
    .getByLabel("Votre recommandation")
    .fill(
      "Je conserve une nouvelle étude avec le calendrier explicite sans modifier mon ancienne décision.",
    );
  await page.getByRole("button", { name: "Conserver l’étude Hôtel", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const value = localStorage.getItem("pmersion.hotel-scenario.v4");
        return value ? JSON.parse(value).revision : 0;
      }),
    )
    .toBe(1);
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-mission.v3"))).toBe(
    legacyRaw,
  );
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem("pmersion.hotel-mission.v3"))).toBe(
    legacyRaw,
  );
  await fit(page);
});
