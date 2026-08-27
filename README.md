# Telapsy

**An AI-verified e-commerce experience built by Codex and verified in a real browser with Kane CLI.**

Telapsy is a complete shopping application for the [Kane CLI Online Hackathon](https://luma.com/kanecli-online). It turns commerce into a demanding verification surface: authentication, product discovery, cart ownership, promotion arithmetic, simulated payments, balance deductions, checkout, notifications, and immutable order history all have to agree across pages and sessions.

## The hackathon story

Codex did not stop after writing the application. It invoked Kane CLI against the running Telapsy site, read Kane's machine-readable NDJSON result, and used that result to decide whether a failure required an application repair, an objective correction, or an environment retry. The project-level `AGENTS.md` makes that Codex ↔ Kane loop part of the development contract, while `scripts/verify-kane.ts` provides the executable bridge.

```text
Codex changes Telapsy
        ↓
static and business-logic checks
        ↓
Kane CLI drives the real browser
        ↓
run result and evidence return to Codex
        ↓
diagnose → repair → rerun
```

Submission description:

> Telapsy is an AI-verified e-commerce application for shoppers who want a polished end-to-end storefront and developers who want proof that agent-written software actually works. Codex built the Next.js application and calls Kane CLI to exercise critical journeys in a real browser, parse the terminal result, preserve evidence, and feed failures back into the repair loop before rerunning the same flow.

## What works

- Password and strict Google-provider authentication
- Brevo-powered password reset with safe local fallback
- Secure HTTP-only, database-backed sessions and device revocation
- Forty products: exactly ten each in Fashion, Electronics, Home, and Accessories
- Forty product-specific photographs stored locally for reliable demos
- Search, category filters, pagination, product details, and related products
- Account-isolated persistent carts and deterministic quantity calculations
- `KANE` and `KANE2026` promotion aliases for 20% off
- Saved delivery-address selection
- Simulated card checkout and fictional Telapsy Credits
- Server-authoritative pricing, idempotent checkout, and order snapshots
- Dashboard, Cloudinary profile images, settings, notifications, and order history
- Responsive public and authenticated experiences with reduced-motion support

No real card information or money is collected. Every new account receives a fictional `$1,000.00` Telapsy balance.

## Kane verification evidence

Ten meaningful browser flows have authoritative passing terminal results under `verification/runs/`. The consolidated evidence report is in [`verification/reports/critical-flows.md`](verification/reports/critical-flows.md).

| Verified journey | What Kane proved | Evidence |
|---|---|---|
| Registration | Authenticated account starts with exactly `$1,000.00` | [Open Kane run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZDCQ4E2ECNA4BK2P8E3FGB/dashboard/share/US_2Z9F1CCXXTP5HNXPHOCQJ6KTQV7W8YYUFP6XZNZG0SRTD0YZ1A79EVNW287ZCTI1?type=summary&agentView=true&fqdn=summary-page) |
| Product discovery | Search opened the exact expected Electronics product | [Open Kane run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZCVWXR0PYT3TXZWPJ6ZYDP/dashboard/share/US_EMW17VG7HBDIMT4ELRV6N16XETKM3XG3WH7W67LMNCM7397XI9Q2C2PZDTKMBNXP?type=summary&agentView=true&fqdn=summary-page) |
| Promo consistency | `KANE` produced a `$13.60` discount and `$54.40` checkout total | [Open Kane run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZDN34DC84KB1GD0PC78PDZ/dashboard/share/US_UGJTCVXMZ2IF197K5PPHMO6AN4H42J23OAP0MUHT730A15MBA1GNW7HY9M70RWFF?type=summary&agentView=true&fqdn=summary-page) |
| Balance checkout | `$1,000.00 − $54.40 = $945.60` across checkout and account state | [Open Kane run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZET3WX13XKY676CQQSQJH0/dashboard/share/US_KBVI9YL0KCCDHB3A6NWBXPYW5XYQ39XU00OD07NF4DGV8XBN8UW129VC8JHFBJGI?type=summary&agentView=true&fqdn=summary-page) |
| Order history | Latest order retained product, quantity, delivery, payment, total, and status | [Open Kane run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZF07E9EB781MBDNE30RD5D/dashboard/share/US_UBRNK6KM8Q0KB4JJQK5RMR4S9RU7NK176ZVQ261U20DX72HBYP2Q1YOZBFTDJQKT?type=summary&agentView=true&fqdn=summary-page) |

The repository was initialized on 26 August 2026, inside the hackathon's 19–31 August build window.

## Run locally

Prerequisites: Node.js 20+, npm, MongoDB, and a valid `SESSION_SECRET`.

```bash
git clone https://github.com/samscript18/telapsy.git
cd telapsy
npm install
cp .env.example .env.local
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The seed is deterministic and safely rerunnable. It upserts the forty catalogue products, removes obsolete product records, and reports the final per-category counts. Product photography is already committed; `npm run assets:products` refreshes the optimized local Unsplash assets and attribution when needed.

## Environment

| Variable | Required | Purpose |
|---|---:|---|
| `MONGODB_URI` | Yes | MongoDB connection used by users, products, sessions, and orders |
| `SESSION_SECRET` | Yes | At least 32 characters; signs secure session state |
| `NEXT_PUBLIC_APP_URL` | Yes | Public application origin and OAuth callback base |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Strict Google signup and login |
| `BREVO_API_KEY` / sender values | Optional | Transactional password-reset email |
| `CLOUDINARY_*` | Optional | Authenticated profile-image uploads |

Google OAuth uses authorization code flow with PKCE, state, nonce, and verified OpenID Connect tokens. A Google-created account cannot sign in with a normal password, and a password account is not silently linked to Google.

## Verify Telapsy

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

With Telapsy running at `http://localhost:3000` and Kane CLI authenticated:

```bash
npm run verify:kane -- storefront
npm run verify:kane -- registration
npm run verify:kane -- submissionDemo
```

The wrapper invokes `kane-cli run ... --agent --headless`, reads the authoritative terminal event, writes raw NDJSON into `verification/runs/`, prints a concise result, and exits non-zero unless Kane passed.

## Architecture

```text
Next.js App Router
├── React + Tailwind CSS interface
├── React Query server-state cache
├── Zustand account-scoped cart
├── Route Handlers + Zod validation
├── MongoDB + Mongoose persistence
├── signed HTTP-only session cookies
└── Kane CLI browser verification wrapper
```

Canonical pricing is recalculated server-side before order creation. Orders retain purchase-time product, delivery, payment, promotion, and price snapshots. Simulated payment fields are never persisted.

