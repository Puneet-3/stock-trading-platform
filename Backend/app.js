const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/UserModel");
const quotes = require("./quotes.json");
const {
  accountView,
  updateAccount,
  trade,
  transfer,
  fail,
} = require("./account");

function createApp({
  secret = process.env.JWT_SECRET,
  origins = process.env.CLIENT_ORIGINS ||
    "http://localhost:3000,http://localhost:3001",
  secure = process.env.NODE_ENV === "production",
} = {}) {
  if (!secret || secret.length < 32)
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  const allowedOrigins = origins.split(",").map((origin) => origin.trim());
  const app = express();
  const cookie = { httpOnly: true, secure, sameSite: "lax", path: "/" };
  app.disable("x-powered-by");
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.set("X-Content-Type-Options", "nosniff");
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      if (req.headers.origin && !allowedOrigins.includes(req.headers.origin))
        return res.status(403).json({ message: "Origin is not allowed." });
      if (!req.is("application/json"))
        return res.status(415).json({ message: "Use application/json." });
    }
    next();
  });
  app.use(express.json({ limit: "16kb" }));
  app.use(cookieParser());

  const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many sign-in attempts. Try again later." },
  });
  function signIn(res, user, status = 200) {
    const token = jwt.sign(
      { userId: user.id, version: user.authVersion },
      secret,
      { expiresIn: "1d", algorithm: "HS256" },
    );
    res.cookie("session", token, { ...cookie, maxAge: 86400000 });
    res
      .status(status)
      .json({ user: { id: user.id, name: user.name, email: user.email } });
  }
  function credentials(body, minimumLength = 1) {
    const { email, password } = body || {};
    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length < minimumLength ||
      Buffer.byteLength(password) > 72
    ) {
      fail(
        400,
        `Enter a valid email and a password of at least ${minimumLength} characters (maximum 72 bytes).`,
      );
    }
    return { email: email.trim().toLowerCase(), password };
  }

  app.get("/health", (req, res) => res.json({ status: "ok", mode: "paper" }));
  app.post("/signup", authLimit, async (req, res) => {
    const { email, password } = credentials(req.body, 8);
    const name = req.body.name;
    if (typeof name !== "string" || !name.trim() || name.trim().length > 80)
      fail(400, "Enter a name of 1 to 80 characters.");
    if (
      await User.findOne({ email })
        .select("_id")
        .collation({ locale: "en", strength: 2 })
    )
      fail(409, "An account with this email already exists. Please log in.");
    const user = await User.create({
      name: name.trim(),
      email,
      password: await bcrypt.hash(password, 12),
    });
    signIn(res, user, 201);
  });
  app.post("/login", authLimit, async (req, res) => {
    const { email, password } = credentials(req.body);
    const user = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      fail(401, "Email or password is incorrect.");
    signIn(res, user);
  });

  app.use(async (req, res, next) => {
    let payload;
    try {
      payload = jwt.verify(req.cookies.session || "", secret, {
        algorithms: ["HS256"],
      });
    } catch {
      return res.status(401).json({ message: "Please sign in to continue." });
    }
    if (
      typeof payload.userId !== "string" ||
      !/^[a-f\d]{24}$/i.test(payload.userId)
    )
      fail(401, "Please sign in again.");
    const user = await User.findById(payload.userId);
    if (!user || user.authVersion !== payload.version)
      fail(401, "Your session has expired. Please sign in again.");
    req.user = user;
    next();
  });
  app.get("/me", (req, res) => res.json(accountView(req.user).user));
  app.post("/logout", async (req, res) => {
    // Prevent an in-flight trade from restoring the old authentication version.
    await User.updateOne(
      { _id: req.user._id },
      { $inc: { authVersion: 1, __v: 1 } },
    );
    res.clearCookie("session", cookie).sendStatus(204);
  });
  app.get("/quotes", (req, res) => res.json(quotes));
  app.get("/account", (req, res) => res.json(accountView(req.user)));
  app.get("/allHoldings", (req, res) =>
    res.json(accountView(req.user).holdings),
  );
  app.get("/allPositions", (req, res) =>
    res.json(accountView(req.user).holdings),
  );
  app.get("/allOrders", (req, res) => res.json(accountView(req.user).orders));
  app.post("/newOrder", async (req, res) => {
    const account = await updateAccount(
      req.user.id,
      req.user.authVersion,
      (user) => trade(user, req.body || {}, req.get("Idempotency-Key")),
    );
    res.json(account);
  });
  app.post("/funds", async (req, res) => {
    const account = await updateAccount(
      req.user.id,
      req.user.authVersion,
      (user) => transfer(user, req.body || {}, req.get("Idempotency-Key")),
    );
    res.json(account);
  });
  app.use((req, res) => res.status(404).json({ message: "Route not found." }));
  app.use((error, req, res, next) => {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    const status =
      error.status || (error.name === "ValidationError" ? 400 : 500);
    if (status >= 500) console.error(error);
    res.status(status).json({
      message:
        status >= 500
          ? "Something went wrong. Please try again."
          : error.message,
    });
  });
  return app;
}

module.exports = { createApp };
