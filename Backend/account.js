const User = require("./model/UserModel");
const quotes = require("./quotes.json");

function fail(status, message) {
  throw Object.assign(new Error(message), { status });
}

function accountView(user) {
  const holdings = user.holdings.map((holding) => {
    const quote = quotes.find((item) => item.name === holding.name);
    const value = Math.round(quote.price * 100) * holding.qty;
    return {
      name: holding.name,
      qty: holding.qty,
      avg: holding.cost / holding.qty / 100,
      price: quote.price,
      value: value / 100,
      investment: holding.cost / 100,
      pnl: (value - holding.cost) / 100,
      day: quote.change,
    };
  });
  const investment = user.holdings.reduce((sum, item) => sum + item.cost, 0);
  const value = holdings.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.qty,
    0,
  );
  return {
    user: { id: user.id, name: user.name, email: user.email },
    cash: user.cash / 100,
    holdings,
    orders: [...user.orders].reverse().map((order) => ({
      id: order.id,
      requestId: order.requestId,
      name: order.name,
      qty: order.qty,
      price: order.price / 100,
      mode: order.mode,
      total: (order.price * order.qty) / 100,
      realizedPnl: order.realizedPnl / 100,
      createdAt: order.createdAt,
    })),
    transfers: [...user.transfers].reverse().map((transfer) => ({
      id: transfer.id,
      amount: transfer.amount / 100,
      mode: transfer.mode,
      createdAt: transfer.createdAt,
    })),
    totals: {
      investment: investment / 100,
      value: value / 100,
      pnl: (value - investment) / 100,
      realizedPnl:
        user.orders.reduce((sum, order) => sum + order.realizedPnl, 0) / 100,
      equity: (user.cash + value) / 100,
    },
  };
}

// One document keeps cash, holdings and history atomic on standalone MongoDB too.
async function updateAccount(userId, authVersion, change) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const user = await User.findById(userId);
    if (!user || user.authVersion !== authVersion)
      fail(401, "Please sign in again.");
    if (!change(user)) return accountView(user);
    try {
      await user.save();
      return accountView(user);
    } catch (error) {
      if (error.name !== "VersionError") throw error;
    }
  }
  fail(409, "Your account changed. Please retry this request.");
}

function validateRequestId(requestId) {
  if (
    typeof requestId !== "string" ||
    !/^[a-zA-Z0-9-]{16,64}$/.test(requestId)
  ) {
    fail(400, "A valid Idempotency-Key header is required.");
  }
}

function trade(user, { name, qty, mode }, requestId) {
  validateRequestId(requestId);
  const quote = quotes.find((item) => item.name === name);
  if (
    !quote ||
    !Number.isSafeInteger(qty) ||
    qty < 1 ||
    qty > 1000000 ||
    !["BUY", "SELL"].includes(mode)
  ) {
    fail(
      400,
      "Choose a listed instrument, a whole quantity from 1 to 1,000,000, and BUY or SELL.",
    );
  }
  const previous = user.orders.find((order) => order.requestId === requestId);
  if (previous) {
    if (
      previous.name !== name ||
      previous.qty !== qty ||
      previous.mode !== mode
    )
      fail(409, "This request key was already used for another order.");
    return false;
  }
  if (user.transfers.some((item) => item.requestId === requestId))
    fail(409, "This request key was already used.");
  const price = Math.round(quote.price * 100);
  const total = price * qty;
  const holding = user.holdings.find((item) => item.name === name);
  let realizedPnl = 0;
  if (mode === "BUY") {
    if (user.cash < total) fail(400, "Insufficient virtual funds.");
    user.cash -= total;
    if (holding) {
      holding.cost += total;
      holding.qty += qty;
    } else {
      user.holdings.push({ name, qty, cost: total });
    }
  } else {
    if (!holding || holding.qty < qty)
      fail(400, "You do not own enough shares to sell.");
    const cost = Math.round((holding.cost * qty) / holding.qty);
    realizedPnl = total - cost;
    holding.qty -= qty;
    holding.cost -= cost;
    user.cash += total;
    if (holding.qty === 0)
      user.holdings = user.holdings.filter((item) => item.name !== name);
  }
  user.orders.push({ name, qty, price, mode, realizedPnl, requestId });
  return true;
}

function transfer(user, { amount, mode }, requestId) {
  validateRequestId(requestId);
  const paise = Math.round(amount * 100);
  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    !Number.isSafeInteger(paise) ||
    Math.abs(amount * 100 - paise) > 0.000001 ||
    paise < 1 ||
    paise > 100000000 ||
    !["DEPOSIT", "WITHDRAW"].includes(mode)
  ) {
    fail(
      400,
      "Enter an amount from ₹0.01 to ₹10,00,000 with at most two decimal places.",
    );
  }
  const previous = user.transfers.find((item) => item.requestId === requestId);
  if (previous) {
    if (previous.amount !== paise || previous.mode !== mode)
      fail(409, "This request key was already used for another transfer.");
    return false;
  }
  if (user.orders.some((item) => item.requestId === requestId))
    fail(409, "This request key was already used.");
  if (mode === "WITHDRAW" && user.cash < paise)
    fail(400, "Insufficient virtual funds.");
  const cash = user.cash + (mode === "DEPOSIT" ? paise : -paise);
  if (!Number.isSafeInteger(cash) || cash > 100000000000)
    fail(400, "Virtual balance limit reached.");
  user.cash = cash;
  user.transfers.push({ amount: paise, mode, requestId });
  return true;
}

module.exports = { accountView, updateAccount, trade, transfer, fail };
