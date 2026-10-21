# Project completion report

Completed locally on 21 October 2026 as a **paper-trading simulator**.

## Changes made

- **Authentication:** added login and logout, replaced the hardcoded JWT secret with environment configuration, moved sessions into HttpOnly cookies, revoked sessions on logout, normalized new email addresses, and added input validation and authentication throttling. Existing password hashes still work, including older accounts with mixed-case email addresses.
- **Private accounts:** protected the dashboard and API endpoints. Each account now owns its cash, holdings, orders and transfer history. New accounts start with ₹1,00,000 virtual cash.
- **Trading:** completed buy and sell execution at server-controlled sample prices. Added whole-share validation, insufficient-funds and ownership checks, duplicate-request protection, and safe concurrent updates. Cash, holdings and history commit in one database write. Money is stored in integer paise; partial sales preserve cost basis and realized profit/loss.
- **Dashboard:** connected order history, holdings, delivery positions, account totals and profit/loss to persisted data. Added virtual deposits/withdrawals and transfer history, watchlist search, order filtering, useful loading/error/empty states, and logout. Removed hardcoded balances and inactive trading controls.
- **Public site:** connected account buttons and navigation, added a separate login page and searchable help, fixed account forms for mobile screens, and replaced dead links and unsupported brokerage claims with accurate simulator information.
- **Code and tooling:** removed obsolete models, duplicate backend manifests, unused dependencies, large blocks of commented code, and placeholder components. Replaced Create React App with Vite, used `.jsx` for React components, bundled styling locally, regenerated lockfiles, and formatted the source consistently.
- **Setup:** added environment examples, local development/build/test scripts, API documentation, and updated setup instructions. Your existing MongoDB configuration was preserved; a random JWT secret was configured in the ignored root `.env`.

## Verification results

| Check                        | Result                     |
| ---------------------------- | -------------------------- |
| API integration tests        | 13 passed                  |
| Desktop/mobile browser tests | 4 passed                   |
| Public-site production build | Passed                     |
| Dashboard production build   | Passed                     |
| Formatting check             | Passed                     |
| Whitespace/diff check        | Passed                     |
| Root dependency audit        | 0 reported vulnerabilities |
| Public-site dependency audit | 0 reported vulnerabilities |
| Dashboard dependency audit   | 0 reported vulnerabilities |

Tests covered signup/login/logout, legacy accounts, private data, forged/expired sessions, invalid orders, buys and partial/full sells, persisted history, concurrent overspending/overselling, duplicate requests, transfer precision, cost basis, authentication throttling, public navigation, help search, and page reloads. Desktop and mobile layouts were also visually inspected.

Tests used disposable MongoDB instances and temporary local servers. They did not connect to your configured database. Existing shared trading collections were left intact and are not automatically assigned to users. Old generated dependencies were retained in ignored `node_modules.legacy` folders; fresh active dependencies use `node_modules`.

## Scope and local use

Prices are fixed samples, and funds/trades are virtual. Live market data, broker execution, real payments, email verification and password recovery are not included. The account document model is intended for an educational app with modest history volume.

See [README.md](README.md) for the three local startup commands and [Backend/README.md](Backend/README.md) for the API. Client URLs are configurable through Vite's [environment variables](https://vite.dev/guide/env-and-mode.html).

## Vercel preview deployment — 21 October 2026

At your later request, the app was deployed directly to the existing Vercel project. No Git commit or GitHub push was made.

- [Preview deployment](https://stock-trading-platform-9uo0klrsd-puneet-s-projects46.vercel.app)
- [Vercel deployment details](https://vercel.com/puneet-s-projects46/stock-trading-platform/8Ze6jJKm9nfvmV2HbHCgdPFLrCR6)
- Vercel reports the deployment as **Ready**. It retains the project's Vercel authentication protection.
- Public pages use `/`, the dashboard `/dashboard`, and the serverless API `/api`. The API reuses MongoDB connections and sets secure HttpOnly cookies.
- Added `vercel.json`, an explicit upload exclusion list, a combined build command, and two passing local tests for the hosted API entry point and complete single-origin workflow. All 13 API integration tests also passed again.
- Created a separate sensitive JWT secret for the Vercel Preview environment. Local environment files, credentials, old dependencies and test artifacts were excluded from upload.

The hosted MongoDB URI is now configured as a sensitive `MONGO_URL` variable for Vercel Preview. Database authentication and a database ping succeeded from the local machine, and the new Vercel deployment finished with status **Ready**. The existing local database was not migrated or exposed. Hosted application flows have not been exercised against this deployment.
