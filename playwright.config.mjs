import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  forbidOnly: true,
  timeout: 45_000,
  reporter: [["line"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4180",
    locale: "fr-FR",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "phone-390", use: { viewport: { width: 390, height: 844 } } },
    { name: "phone-430", use: { viewport: { width: 430, height: 932 } } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: "python3 -m http.server 4180 --bind 127.0.0.1",
    url: "http://127.0.0.1:4180",
    reuseExistingServer: false,
  },
});
