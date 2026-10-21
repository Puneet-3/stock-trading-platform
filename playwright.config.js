const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "e2e.spec.js",
  workers: 1,
  timeout: 60000,
  use: {
    channel: "chrome",
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "node tests/serve.js",
    url: "http://localhost:3002/health",
    timeout: 180000,
    reuseExistingServer: false,
  },
});
