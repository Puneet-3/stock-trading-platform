# Paper Trading Platform

A local stock trading simulator with a React public site, React dashboard, Express API, and MongoDB. It uses fixed sample quotes and virtual funds; it does not send orders to a broker or process real payments.

## Run locally

Use Node.js 22.12+ (Node 22.13.1 was used for verification), npm, and a running MongoDB instance.

From the project root:

```powershell
npm.cmd ci
npm.cmd run install:clients
```

Create `.env` from `.env.example` if you do not already have one. Set `MONGO_URL` to your database connection string and `JWT_SECRET` to a random secret of at least 32 characters. Generate one locally with:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The existing local `.env` was preserved and configured with a random JWT secret during this update. Secrets stay in ignored files.

Start these commands in three terminals, all from the root:

```powershell
npm.cmd run dev:api
npm.cmd run dev:frontend
npm.cmd run dev:dashboard
```

Open **http://localhost:3000**. The dashboard runs on **http://localhost:3001**, and the API on **http://localhost:3002**. Use `localhost` consistently so both apps share the API's session cookie. `npm.cmd start` starts the API without watch mode.

The default local URLs work without client environment files. To change them, copy the relevant client `.env.example` to `.env` and set `VITE_API_URL`, `VITE_DASHBOARD_URL`, or `VITE_SITE_URL`. Update the API's `CLIENT_ORIGINS` to match the two client origins. Restart Vite after changing its environment.

## What works

- Signup, login, logout, and one-day sessions in HttpOnly cookies. Logout invalidates all sessions for that account.
- Private portfolios, normalized emails, hashed passwords, request validation, and throttled authentication attempts.
- Searchable sample watchlist with buy and sell actions.
- Immediate simulated delivery trades at server-owned sample prices. Shares must be whole quantities, purchases must be funded, and sales cannot exceed ownership.
- Persisted holdings, delivery positions, executed order history, account totals, and realized/unrealized profit or loss.
- Virtual deposits and withdrawals, with a transfer ledger and balance checks.
- Stable request keys for safely retrying an order or transfer after a connection failure.
- Responsive layouts, labeled forms, keyboard-accessible order dialogs, help search, and working public navigation.

Every new account starts with ₹1,00,000 virtual cash. Deposits and withdrawals accept ₹0.01–₹10,00,000 per request; the virtual cash balance is capped at ₹1,00,00,00,000. Quotes and their sample daily changes come from `Backend/quotes.json` and remain fixed. Profit or loss is normally zero when buying and selling at the same sample price. No fees or taxes are simulated.

## Verification

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run format:check
```

API tests start an isolated temporary MongoDB instance. The first installation may download a MongoDB test binary. They never connect to `MONGO_URL` or load the root `.env`.

Browser tests use installed Google Chrome and the built `frontend/dist` and `dashboard/dist` directories. They start temporary local servers and a temporary database. Ports 3000, 3001 and 3002 must be free. Test output goes to ignored `test-results/`.

To check dependencies, run `npm.cmd audit` in the root, `frontend`, and `dashboard` directories.

## Vercel preview

The root `vercel.json` builds both apps into one deployment: the public site at `/`, the dashboard at `/dashboard`, and the Node.js API at `/api`. Same-origin requests keep authentication cookies working without a cross-site cookie setup. The API reuses its MongoDB connection between function calls.

Vercel needs a hosted MongoDB database. A connection to `localhost` on your computer cannot serve the hosted app. Set `MONGO_URL` and a random `JWT_SECRET` as sensitive environment variables for the Preview environment. The local `.env.vercel.local` file is ignored and can hold the hosted database URI while configuring it. Uploads explicitly exclude all environment files, legacy dependencies, and local test artifacts.

```powershell
npm.cmd run build:vercel
npm.cmd run test:vercel
vercel.cmd deploy --yes --no-wait
```

These commands use a direct preview deployment and do not require a Git commit or push. See [Vercel's configuration documentation](https://vercel.com/docs/project-configuration/vercel-json) for the routing and function settings.

## Structure and data

- `Backend/app.js`: HTTP endpoints, sessions, validation and error handling.
- `Backend/account.js`: account views and trading/fund operations.
- `Backend/model/UserModel.js`: user account, cash in integer paise, holdings, executed orders and transfers.
- `frontend/`: public React/Vite app and account forms.
- `dashboard/`: authenticated React/Vite app.
- `tests/`: MongoDB integration tests and desktop/mobile browser tests.

Cash, holdings and history live in one account document. Optimistic concurrency with bounded retries prevents concurrent requests from overspending, overselling, or losing history; a single MongoDB write commits each complete operation. This works with standalone MongoDB and does not require a replica set. Embedded history is intended for a small educational app, not unbounded production trading volume.

The previous shared `holdings`, `positions` and `orders` collections are not read by the new app and were not deleted. They had no trustworthy user ownership, so they are not automatically assigned to any account. Existing users retain their password hashes and receive empty private portfolios and the starting practice balance on first use. Old dependency folders were retained as ignored `node_modules.legacy` backups; active packages are installed in fresh `node_modules` directories.

The project does not include live market feeds, brokerage execution, real payments, derivatives, short selling, email verification, or password recovery. It is an independent educational project, not affiliated with Zerodha.
