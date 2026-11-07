# LightPay

LightPay is a mobile-first peer-to-peer payments prototype built with React, TypeScript, Vite, and Node.js. The current wallet uses a simulated USDT balance and in-memory transaction history. It does not connect to a bank, Google account, Tether service, or blockchain.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

This starts the Node.js API and Vite frontend. Open the URL printed by Vite. The frontend proxies `/api` requests to `http://localhost:3001`. To run only the API, use `npm run dev:api`.

The demo API stores its balance and activity in memory; restarting the server resets them. Set `API_PORT` to change the API port and update the `/api` proxy in `vite.config.ts` to use the same port.

## Implemented demo API

All responses are JSON. These routes are currently implemented and are not authenticated.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Returns service status and `mode: "demo"`. |
| `GET` | `/api/summary` | Returns the demo balance, currency, and network label. |
| `GET` | `/api/activity` | Returns the in-memory transfer list. |
| `POST` | `/api/transfers` | Validates and records a simulated P2P transfer. |

Example transfer request:

```json
{
  "recipient": "Amina Yusuf",
  "phone": "+234 803 442 1180",
  "amount": 12.5
}
```

On success, the API responds with HTTP `201` and a JSON object containing `transfer`, the updated `summary`, and `simulated: true`. Invalid input or an amount above the demo balance returns HTTP `400` with an `error` message. The endpoint does not send USDT or create an on-chain transaction.

## Google sign-in: planned

Google authentication is not implemented yet. For a production login, add a server-side OpenID Connect authorization-code flow. The browser should start login through the backend; the backend should validate the callback and establish an application session. Do not put a Google client secret in frontend code.

Google setup and endpoints to use:

1. Create a Google OAuth client of type **Web application** in Google Cloud Console and configure authorized JavaScript origins and redirect URIs for local development and production.
2. Use Google's OpenID Connect discovery document at `https://accounts.google.com/.well-known/openid-configuration` to obtain the current authorization, token, and user-info endpoints.
3. Implement these application routes on the Node.js backend:
   - `GET /api/auth/google` starts sign-in, generates and stores `state` and `nonce`, then redirects to Google.
   - `GET /api/auth/google/callback` validates `state`, exchanges the authorization code, validates the ID token, and creates or finds the local user.
   - `GET /api/me` returns the signed-in user's safe profile, or `401` if there is no session.
   - `POST /api/auth/logout` ends the local session.
4. Request only the `openid`, `email`, and `profile` scopes needed by the app. Use a vetted OpenID Connect library, validate tokens server-side, and use an `HttpOnly`, `Secure`, appropriately `SameSite` session cookie in production. Protect state-changing routes against CSRF.

Suggested server-only environment variables (names are a planned convention, not currently read by the demo server):

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=
```

Keep real values in an untracked `.env` file or deployment secret manager. Never commit credentials. Add `.env` to `.gitignore` before adding local secrets.

## Tether and stablecoin integration: planned

The Tether challenge statement and integration resources have not been provided yet. There is no single Tether API URL that should be assumed for every network and custody setup. Confirm the supported USDT network, token contract, wallet custody model, and required provider with the challenge materials before implementing live payments.

The production backend will need provider or wallet-service capabilities for:

- Creating or associating a user wallet and deposit address.
- Fetching supported networks, token balances, and transaction history.
- Quoting transfer amount, exchange rate (if local currency is used), fees, and expiry.
- Submitting an authorized USDT transfer and returning a transaction identifier.
- Checking transaction status and confirmations.
- Receiving and verifying provider webhooks for deposits and transfer updates.
- Applying limits and any required identity, sanctions, or compliance checks.

Keep signing keys and provider credentials on the server or in a managed custody/signing service. Verify webhook signatures, make transfer requests idempotent, and do not report a payment as settled until the selected network/provider confirms it. The current `/api/transfers` route is demo-only and must not be presented as a real transfer endpoint.

## Checks

```sh
npm run lint
npm run build
```