const { before, after, test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { chromium } = require("@playwright/test");

let database, server, browser, base;

before(
  async () => {
    database = await MongoMemoryServer.create();
    process.env.MONGO_URL = database.getUri();
    process.env.JWT_SECRET =
      "isolated-vercel-test-secret-at-least-thirty-two-characters";
    const app = express();
    const output = path.resolve(__dirname, "../dist");
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    base = `http://localhost:${server.address().port}`;
    process.env.CLIENT_ORIGINS = base;
    const handler = require("../api/index");
    app.use((req, res, next) =>
      req.path.startsWith("/api/") ? handler(req, res) : next(),
    );
    app.use(express.static(output));
    app.get(/^\/dashboard(?:\/.*)?$/, (req, res) =>
      res.sendFile(path.join(output, "dashboard/index.html")),
    );
    app.get(/.*/, (req, res) => res.sendFile(path.join(output, "index.html")));
    browser = await chromium.launch({ channel: "chrome", headless: true });
  },
  { timeout: 180000 },
);

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (database) await database.stop();
});

test("hosted API entry point exposes health and protects account endpoints", async () => {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok", mode: "paper" });
  assert.equal((await fetch(`${base}/api/account`)).status, 401);
});

test("combined deployment keeps signup, trades and deep links on one origin", async () => {
  const page = await browser.newPage();
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      request.url().startsWith("http") &&
      !request.url().startsWith(`${base}/`)
    )
      external.push(request.url());
  });
  await page.goto(`${base}/signup`);
  await page.getByLabel("Full name").fill("Hosted Trader");
  await page.getByLabel("Email address").fill("hosted@example.test");
  await page
    .getByLabel("Password", { exact: true })
    .fill("hosted-test-password");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.waitForURL(`${base}/dashboard/`);
  await page.getByRole("heading", { name: "Hi, Hosted Trader!" }).waitFor();
  const cookies = await page.context().cookies();
  assert.ok(
    cookies.some(
      (cookie) => cookie.name === "session" && cookie.httpOnly && cookie.secure,
    ),
  );
  await page.getByRole("button", { name: "Buy INFY", exact: true }).click();
  await page.getByRole("button", { name: "Confirm buy" }).click();
  await page.getByRole("status").filter({ hasText: "Bought 1 INFY" }).waitFor();
  await page.getByRole("link", { name: "Orders", exact: true }).click();
  assert.equal(new URL(page.url()).pathname, "/dashboard/orders");
  await page.reload();
  await page.getByRole("row").filter({ hasText: "INFY" }).waitFor();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await page
    .getByRole("heading", { name: "Welcome to paper trading" })
    .waitFor();
  await page.getByRole("link", { name: "Log in", exact: true }).click();
  assert.equal(page.url(), `${base}/login`);
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await page.close();
});
