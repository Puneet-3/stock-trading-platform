const { before, after, test } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createApp } = require("../Backend/app");
const User = require("../Backend/model/UserModel");

const secret = "test-secret-that-is-longer-than-thirty-two-characters";
let database, server, base;

before(
  async () => {
    database = await MongoMemoryServer.create();
    await mongoose.connect(database.getUri());
    await User.init();
    server = createApp({ secret }).listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  },
  { timeout: 180000 },
);

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (database) await database.stop();
});

async function call(path, { body, cookie, key, origin, raw } = {}) {
  const response = await fetch(`${base}${path}`, {
    method: body === undefined && raw === undefined ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
      ...(origin ? { Origin: origin } : {}),
    },
    body:
      raw === undefined
        ? body === undefined
          ? undefined
          : JSON.stringify(body)
        : raw,
  });
  return {
    status: response.status,
    cookie: response.headers.get("set-cookie"),
    body: response.status === 204 ? null : await response.json(),
  };
}

async function signup(email = `${randomUUID()}@example.test`) {
  const result = await call("/signup", {
    body: { name: "Test User", email, password: "a-strong-password" },
  });
  assert.equal(result.status, 201);
  return { cookie: result.cookie.split(";")[0], user: result.body.user };
}

const buy = (cookie, qty, key = randomUUID()) =>
  call("/newOrder", { cookie, key, body: { name: "INFY", qty, mode: "BUY" } });

test("signup normalizes email, hashes passwords, and issues a private session", async () => {
  const email = `Case-${randomUUID()}@Example.Test`;
  const result = await call("/signup", {
    body: { name: "  Alice  ", email, password: "a-strong-password" },
  });
  assert.equal(result.status, 201);
  assert.match(result.cookie, /HttpOnly/);
  assert.match(result.cookie, /SameSite=Lax/);
  assert.equal(result.body.user.name, "Alice");
  assert.equal(result.body.user.email, email.toLowerCase());
  assert.equal(result.body.token, undefined);
  const stored = await User.findById(result.body.user.id).select("+password");
  assert.notEqual(stored.password, "a-strong-password");
  const duplicate = await call("/signup", {
    body: {
      name: "Other",
      email: email.toLowerCase(),
      password: "a-strong-password",
    },
  });
  assert.equal(duplicate.status, 409);
});

test("login rejects invalid credentials and logout revokes old cookies", async () => {
  const { cookie, user } = await signup();
  assert.equal(
    (
      await call("/login", {
        body: { email: user.email, password: "wrong-password" },
      })
    ).status,
    401,
  );
  const login = await call("/login", {
    body: { email: user.email, password: "a-strong-password" },
  });
  assert.equal(login.status, 200);
  assert.equal((await call("/me", { cookie })).body.id, user.id);
  assert.equal((await call("/logout", { cookie, body: {} })).status, 204);
  assert.equal((await call("/account", { cookie })).status, 401);
  assert.equal(
    (await call("/account", { cookie: login.cookie.split(";")[0] })).status,
    401,
  );
});

test("protected routes reject anonymous, forged and expired sessions", async () => {
  for (const path of [
    "/account",
    "/allHoldings",
    "/allPositions",
    "/allOrders",
    "/quotes",
    "/me",
  ]) {
    assert.equal((await call(path)).status, 401);
  }
  assert.equal((await buy(undefined, 1)).status, 401);
  const { user } = await signup();
  const expired = jwt.sign({ userId: user.id, version: 0 }, secret, {
    expiresIn: -1,
  });
  assert.equal(
    (await call("/account", { cookie: `session=${expired}` })).status,
    401,
  );
  assert.equal(
    (await call("/account", { cookie: "session=forged" })).status,
    401,
  );
});

test("buy and partial/full sell persist balances, holdings, and order history", async () => {
  const { cookie, user } = await signup();
  let result = await buy(cookie, 3);
  assert.equal(result.status, 200);
  assert.equal(result.body.cash, 95333.65);
  assert.equal(result.body.holdings[0].qty, 3);
  assert.equal(result.body.holdings[0].investment, 4666.35);
  assert.equal(result.body.orders.length, 1);
  assert.equal(result.body.totals.equity, 100000);
  assert.equal((await User.findById(user.id)).cash, 9533365);
  result = await call("/newOrder", {
    cookie,
    key: randomUUID(),
    body: { name: "INFY", qty: 1, mode: "SELL" },
  });
  assert.equal(result.body.holdings[0].qty, 2);
  assert.equal(result.body.cash, 96889.1);
  result = await call("/newOrder", {
    cookie,
    key: randomUUID(),
    body: { name: "INFY", qty: 2, mode: "SELL" },
  });
  assert.equal(result.body.cash, 100000);
  assert.equal(result.body.holdings.length, 0);
  assert.equal(result.body.orders.length, 3);
  assert.equal((await call("/allOrders", { cookie })).body.length, 3);
});

test("order input and purchasing power are validated without changing the account", async () => {
  const { cookie } = await signup();
  for (const body of [
    {},
    { name: "INFY", qty: -1, mode: "BUY" },
    { name: "INFY", qty: 1.5, mode: "BUY" },
    { name: "INFY", qty: "1", mode: "BUY" },
    { name: "UNKNOWN", qty: 1, mode: "BUY" },
    { name: "INFY", qty: 1, mode: "INVALID" },
    { name: "INFY", qty: 1, mode: "SELL" },
    { name: "INFY", qty: 1000000, mode: "BUY" },
  ]) {
    assert.equal(
      (await call("/newOrder", { cookie, key: randomUUID(), body })).status,
      400,
    );
  }
  assert.equal(
    (
      await call("/newOrder", {
        cookie,
        body: { name: "INFY", qty: 1, mode: "BUY" },
      })
    ).status,
    400,
  );
  const before = await call("/account", { cookie });
  assert.equal(before.body.cash, 100000);
  assert.equal(before.body.orders.length, 0);
  const manipulated = await call("/newOrder", {
    cookie,
    key: randomUUID(),
    body: { name: "INFY", qty: 1, price: 0.01, mode: "BUY" },
  });
  assert.equal(manipulated.body.orders[0].price, 1555.45);
});

test("users cannot see or mutate another account", async () => {
  const first = await signup();
  const second = await signup();
  await buy(first.cookie, 2);
  const result = await call("/newOrder", {
    cookie: second.cookie,
    key: randomUUID(),
    body: { name: "ONGC", qty: 1, mode: "BUY", userId: first.user.id },
  });
  assert.equal(result.body.user.id, second.user.id);
  assert.deepEqual(
    result.body.holdings.map((stock) => stock.name),
    ["ONGC"],
  );
  const own = (await call("/account", { cookie: first.cookie })).body;
  assert.deepEqual(
    own.holdings.map((stock) => stock.name),
    ["INFY"],
  );
  assert.equal(own.orders.length, 1);
  assert.equal(JSON.stringify(own).includes("password"), false);
});

test("concurrent retries execute once and conflicting request keys are rejected", async () => {
  const { cookie } = await signup();
  const key = randomUUID();
  const results = await Promise.all([buy(cookie, 2, key), buy(cookie, 2, key)]);
  assert.deepEqual(
    results.map((result) => result.status),
    [200, 200],
  );
  const account = (await call("/account", { cookie })).body;
  assert.equal(account.orders.length, 1);
  assert.equal(account.holdings[0].qty, 2);
  assert.equal((await buy(cookie, 1, key)).status, 409);
});

test("concurrent trades cannot overspend or oversell", async () => {
  const first = await signup();
  const purchases = await Promise.all([
    buy(first.cookie, 40),
    buy(first.cookie, 40),
  ]);
  assert.deepEqual(purchases.map((result) => result.status).sort(), [200, 400]);
  let account = (await call("/account", { cookie: first.cookie })).body;
  assert.equal(account.holdings[0].qty, 40);
  assert.ok(account.cash >= 0);
  const sells = await Promise.all(
    [1, 2].map(() =>
      call("/newOrder", {
        cookie: first.cookie,
        key: randomUUID(),
        body: { name: "INFY", qty: 30, mode: "SELL" },
      }),
    ),
  );
  assert.deepEqual(sells.map((result) => result.status).sort(), [200, 400]);
  account = (await call("/account", { cookie: first.cookie })).body;
  assert.equal(account.holdings[0].qty, 10);
  assert.equal(account.totals.equity, 100000);
});

test("virtual transfers preserve cents, validate limits, and are idempotent", async () => {
  const { cookie } = await signup();
  const key = randomUUID();
  const deposit = { cookie, key, body: { amount: 10.01, mode: "DEPOSIT" } };
  assert.equal((await call("/funds", deposit)).body.cash, 100010.01);
  assert.equal((await call("/funds", deposit)).body.cash, 100010.01);
  assert.equal(
    (
      await call("/funds", {
        cookie,
        key,
        body: { amount: 20, mode: "DEPOSIT" },
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await call("/funds", {
        cookie,
        key: randomUUID(),
        body: { amount: 10.01, mode: "WITHDRAW" },
      })
    ).body.cash,
    100000,
  );
  for (const body of [
    { amount: -1, mode: "DEPOSIT" },
    { amount: 0.001, mode: "DEPOSIT" },
    { amount: "100", mode: "DEPOSIT" },
    { amount: 1000001, mode: "DEPOSIT" },
    { amount: 100001, mode: "WITHDRAW" },
  ]) {
    assert.equal(
      (await call("/funds", { cookie, key: randomUUID(), body })).status,
      400,
    );
  }
  const account = (await call("/account", { cookie })).body;
  assert.equal(account.transfers.length, 2);
  assert.equal(account.cash, 100000);
});

test("bad JSON, foreign origins and invalid signup input return safe errors", async () => {
  assert.equal((await call("/login", { raw: "{" })).status, 400);
  assert.equal(
    (await call("/login", { body: {}, origin: "https://untrusted.example" }))
      .status,
    403,
  );
  for (const body of [
    { name: "", email: "valid@example.test", password: "password123" },
    { name: "Test", email: { $ne: null }, password: "password123" },
    { name: "Test", email: "valid@example.test", password: "short" },
  ]) {
    assert.equal((await call("/signup", { body })).status, 400);
  }
  assert.throws(() => createApp({ secret: "secretkey" }), /JWT_SECRET/);
});

test("legacy users keep access and gain a private paper account", async () => {
  const email = `Legacy-${randomUUID()}@Example.Test`;
  const old = await User.collection.insertOne({
    name: "Legacy",
    email,
    password: await bcrypt.hash("short", 10),
    __v: 0,
  });
  const login = await call("/login", {
    body: { email: email.toLowerCase(), password: "short" },
  });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.id, old.insertedId.toString());
  const cookie = login.cookie.split(";")[0];
  const result = await buy(cookie, 1);
  assert.equal(result.status, 200);
  assert.equal(result.body.cash, 98444.55);
  assert.equal(result.body.holdings[0].qty, 1);
  const duplicate = await call("/signup", {
    body: {
      name: "Other",
      email: email.toLowerCase(),
      password: "password123",
    },
  });
  assert.equal(duplicate.status, 409);
});

test("partial sales preserve cost basis and calculate realized profit in paise", async () => {
  const { cookie, user } = await signup();
  await User.updateOne(
    { _id: user.id },
    {
      $set: {
        cash: 9989999,
        holdings: [{ name: "ONGC", qty: 3, cost: 10001 }],
      },
    },
  );
  let result = await call("/newOrder", {
    cookie,
    key: randomUUID(),
    body: { name: "ONGC", qty: 1, mode: "SELL" },
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.totals.realizedPnl, 83.46);
  assert.equal(result.body.holdings[0].investment, 66.67);
  assert.equal(result.body.totals.pnl, 166.93);
  assert.equal(result.body.totals.equity, 100250.39);
  result = await call("/newOrder", {
    cookie,
    key: randomUUID(),
    body: { name: "ONGC", qty: 2, mode: "SELL" },
  });
  assert.equal(result.body.holdings.length, 0);
  assert.equal(result.body.cash, 100250.39);
  assert.equal(result.body.totals.realizedPnl, 250.39);
});

test("repeated authentication attempts are throttled", async () => {
  let status;
  for (let attempt = 0; attempt < 31; attempt += 1)
    status = (await call("/login", { body: {} })).status;
  assert.equal(status, 429);
});
