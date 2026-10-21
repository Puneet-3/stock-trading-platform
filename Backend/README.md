# API

Install and run the API from the project root. See [the project README](../README.md) for setup, environment variables and tests.

`GET /health` is public. `POST /signup` and `POST /login` create an HttpOnly session cookie. All remaining endpoints require that cookie:

| Method | Path            | Purpose                                   |
| ------ | --------------- | ----------------------------------------- |
| GET    | `/me`           | Signed-in identity                        |
| POST   | `/logout`       | Revoke sessions and clear the cookie      |
| GET    | `/quotes`       | Fixed sample instruments and prices       |
| GET    | `/account`      | User, cash, portfolio, totals and history |
| GET    | `/allHoldings`  | This user's holdings                      |
| GET    | `/allPositions` | This user's open delivery shares          |
| GET    | `/allOrders`    | This user's executed orders, newest first |
| POST   | `/newOrder`     | Execute a paper trade                     |
| POST   | `/funds`        | Add or withdraw virtual cash              |

Mutations require JSON. `/newOrder` accepts `{ "name": "INFY", "qty": 1, "mode": "BUY" }` (or `SELL`). The server selects the execution price; client price fields are ignored. `/funds` accepts `{ "amount": 100, "mode": "DEPOSIT" }` (or `WITHDRAW`). Both return the updated account and require an `Idempotency-Key` header: a unique 16–64 character alphanumeric/hyphen key, such as a UUID. Reuse it for retries of the same operation; conflicting reuse returns HTTP 409.

Read/write amounts in JSON are rupees. Stored cash, cost, prices and realized profit/loss use integer paise. CORS permits only `CLIENT_ORIGINS`; browser requests must include credentials. The default cookie works with the two localhost clients on different ports. No server secrets belong in client environment variables.
