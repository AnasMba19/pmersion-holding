import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.mjs",
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 180000,
  outputDir: "../test-results/live-beta",
  reporter: [["line"], ["html", { outputFolder: "../live-beta-report", open: "never" }]],
  use: {
    baseURL: "https://pmersion.com",
    locale: "fr-FR",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "live-phone-390", use: { viewport: { width: 390, height: 844 } } },
    { name: "live-desktop-1280", use: { viewport: { width: 1280, height: 900 } } }
  ]
});
