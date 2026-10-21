const { test, expect } = require("@playwright/test");

test("signup, trade, transfer, sell, logout and login", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const email = `browser-${testInfo.project.name}-${Date.now()}@example.test`;
  await page.goto("/");
  await page.getByRole("link", { name: "Get started", exact: true }).click();
  await page.getByLabel("Full name").fill("Paper Trader");
  await page.getByLabel("Email address").fill(email);
  await page
    .getByLabel("Password", { exact: true })
    .fill("practice-password-123");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.waitForURL("http://localhost:3001/");
  await expect(
    page.getByRole("heading", { name: "Hi, Paper Trader!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Buy INFY", exact: true }).click();
  await page.getByLabel("Quantity", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Confirm buy" }).click();
  await expect(page.getByRole("status")).toContainText("Bought 2 INFY");
  await page.getByRole("link", { name: "Holdings", exact: true }).click();
  await expect(page.getByRole("row").filter({ hasText: "INFY" })).toContainText(
    "3,110.90",
  );
  await page.screenshot({
    path: testInfo.outputPath("holdings.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Orders", exact: true }).click();
  await expect(page.getByRole("row")).toHaveCount(2);
  await page.getByLabel("Order type").selectOption("SELL");
  await expect(
    page.getByText("No sell orders yet.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Funds", exact: true }).click();
  await page.getByLabel("Amount (₹)").fill("25.25");
  await page.getByRole("button", { name: "Confirm transfer" }).click();
  await expect(page.getByRole("status")).toContainText("25.25");
  await expect(page.getByRole("row")).toHaveCount(2);
  await page.getByRole("link", { name: "Holdings", exact: true }).click();
  await page.getByRole("button", { name: "Sell", exact: true }).click();
  await page.getByLabel("Quantity", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Confirm sell" }).click();
  await expect(
    page.getByText("Your portfolio is empty.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(
    page.getByText("₹1,00,025.25", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome to paper trading" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Log in", exact: true }).click();
  await page.getByLabel("Email address").fill(email);
  await page
    .getByLabel("Password", { exact: true })
    .fill("practice-password-123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await page.waitForURL("http://localhost:3001/");
  await page.getByRole("link", { name: "Orders", exact: true }).click();
  await expect(page.getByRole("row")).toHaveCount(3);
  await page.reload();
  await expect(page.getByRole("row")).toHaveCount(3);
  await expect(
    page.getByRole("link", { name: "Orders", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  expect(errors).toEqual([]);
});

test("public navigation and searchable help work", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile)
    await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Help", exact: true })
    .click();
  await page.getByLabel("Search help").fill("withdraw");
  await expect(page.locator("details")).toHaveCount(1);
  await page.locator("summary").click();
  await expect(
    page.getByText("Withdrawals cannot exceed your available cash.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByLabel("Search help").fill("does-not-exist");
  await expect(page.getByRole("status")).toContainText("No answers match");
  await page.goto("/unknown-page");
  await expect(
    page.getByRole("heading", { name: "404 Not Found" }),
  ).toBeVisible();
});
