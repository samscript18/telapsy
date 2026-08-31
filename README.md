# Telapsy

![Telapsy banner](public/og.png)

> **Objects with gravity. Software with proof.**
>
> Telapsy is a polished e-commerce experience where every important state transition—from account creation to cart arithmetic and order history—can be exercised in a real browser by Kane CLI and repaired by Codex when the evidence reveals a regression.

[![Live product](https://img.shields.io/badge/Live_product-telapsy.vercel.app-e8b96a?style=flat-square)](https://telapsy.vercel.app) [![Demo video](https://img.shields.io/badge/Demo-YouTube-e94242?style=flat-square)](https://youtu.be/kPcvMASwonM?si=IGK3D41BgxWjgacM) [![Verified with Kane](https://img.shields.io/badge/KaneAI-closed_loop_pass-1f9d73?style=flat-square)](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M166H7J8BZMJV9ZRDHF9CDQ3/dashboard/share/US_NJEYVAFWWSTL2OMKIZ0WYY0I5S09MZH8GN60XFDT3Q6PFC3B8WP2AXCC4K69HYBO?type=summary&agentView=true&fqdn=summary-page) [![Source](https://img.shields.io/badge/Source-GitHub-2d2d2d?style=flat-square)](https://github.com/samscript18/telapsy)

**Live product:** [telapsy.vercel.app](https://telapsy.vercel.app)

**Demo video:** [Watch the three-minute walkthrough on YouTube](https://youtu.be/kPcvMASwonM?si=IGK3D41BgxWjgacM)

**Source code:** [github.com/samscript18/telapsy](https://github.com/samscript18/telapsy)

## Why Telapsy exists

E-commerce looks simple until its state has to remain correct across the entire journey. A quantity changes in the cart; the line total, subtotal, promotion, checkout amount, account balance, confirmation page, and stored order must all agree. Authentication adds another boundary: sessions must be secure, carts must belong to the right account, Google and password identities must not be silently mixed, and one shopper must never see another shopper's history.

Those properties make commerce a useful proving ground for agent-written software. A coding agent can generate a plausible interface quickly, but plausibility is not proof. Telapsy closes that gap by making real-browser verification part of the development loop: Codex changes the product, Kane CLI exercises the user journey, Codex reads the structured result and evidence, and the same flow runs again after the repair.

The storefront is intentionally a real product rather than a testing dashboard. Shoppers get a responsive, cinematic catalogue and a complete simulated purchase flow; developers and judges get inspectable evidence that the critical behavior was actually exercised.

## The submission in one sentence

Telapsy is an AI-verified e-commerce application for shoppers who want a refined end-to-end buying experience and developers who want proof that agent-written software works: Codex built the Next.js product, invokes Kane CLI to test meaningful journeys in a real browser, reads Kane's structured failure evidence, repairs legitimate regressions, and reruns the same flow to a passing result.

## What makes Telapsy AI-verified

Telapsy is not a storefront with a browser test added at the end. The verification bridge is part of the repository and the working method:

```text
Codex changes Telapsy
        ↓
lint + types + business-logic tests
        ↓
scripts/verify-kane.ts invokes Kane CLI with --agent
        ↓
Kane drives the real application in Chrome
        ↓
the authoritative result and evidence return to Codex
        ↓
classify the failure → repair the product → rerun the same flow
```

The wrapper checks that Telapsy is reachable, launches a bounded browser objective, parses Kane's terminal NDJSON result, preserves the raw run output locally, prints a concise diagnosis, and exits non-zero unless the verification passed.

## Closed-loop proof: cart regression to repair

The clearest demonstration is a controlled cart regression exercised on 29 August 2026.

1. The cart's one-click quantity contract was deliberately corrupted.
2. Codex asked for approval and invoked Kane against the real local application.
3. Kane created a new account, opened Velocity Sneakers, added one item, and confirmed the correct initial quantity and `$68.00` totals.
4. After Kane clicked the correct increase control once, the cart did not reach the required quantity `2` and `$136.00` totals. Kane classified the behavior as a confirmed major functional defect.
5. Codex inspected the run evidence, repaired the increment handler, and ran lint, typecheck, and all 18 business-logic tests.
6. After a second approval, Kane replayed the journey and passed with quantity `2`, line total `$136.00`, and subtotal `$136.00`.

| Stage              | Result                                                                           | Evidence                                                                                                                                                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Regression present | Kane confirmed the cart failed its one-click quantity and pricing contract       | [Open failed run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M1660R88EPK29XWV9M4QTZ78/dashboard/share/US_DFSFBFXO084M8LHCI9PZD5VSDUMNLLJYZEZX2C7CZZZ31AYGCM1VUZI3GEL5GBYT?type=summary&agentView=true&fqdn=summary-page)  |
| Codex repair       | One increase again means exactly one additional unit; local quality gates passed | Repository history and local checks                                                                                                                                                                                                                                 |
| Same journey rerun | Quantity `2`, line total `$136.00`, and subtotal `$136.00`                       | [Open passing run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M166H7J8BZMJV9ZRDHF9CDQ3/dashboard/share/US_NJEYVAFWWSTL2OMKIZ0WYY0I5S09MZH8GN60XFDT3Q6PFC3B8WP2AXCC4K69HYBO?type=summary&agentView=true&fqdn=summary-page) |

This is the closed loop the project is built to demonstrate: the agent did not merely write a test or report a bug; it used Kane's browser evidence to repair the application and prove the repair.

## The end-to-end experience

### 1. Discover a curated catalogue

The public experience introduces Telapsy through a responsive editorial landing page, featured objects, category shortcuts, product search, trust sections, and FAQs. The catalogue contains exactly forty products—ten each in Fashion, Electronics, Home, and Accessories—with committed, optimized local photography so a demo is not dependent on fragile image hosts.

Public visitors can search, filter, paginate, and preview products. Product interactions lead naturally into account creation, and an authenticated shopper returns to the product they intended to view.

### 2. Create a secure account

Users can register with a validated password or explicitly sign up with Google. Passwords are hashed, sessions are stored and represented by signed HTTP-only cookies, and session records can be inspected or revoked per device.

Provider identity is strict by design: a Google-created account cannot sign in through the password route, Google sign-in only accepts an account originally created with Google, and an existing password identity is never silently linked by matching email alone. Every new account receives a fictional `$1,000.00` Telapsy Balance.

### 3. Shop inside the authenticated product

Authenticated shoppers browse a dedicated in-app product catalogue and product details experience. They can search, filter by category, paginate, choose an available quantity, add an item once, inspect related products, and move through the app without being routed back into the public preview experience.

### 4. Build a deterministic, account-scoped cart

The Zustand cart is persisted per account rather than globally, preventing one user from inheriting another user's selections. Quantity controls respect stock, line totals and summary totals update immediately, and an item already in the cart cannot be added repeatedly through the product action.

Both `KANE` and `KANE2026` are case-insensitive aliases for the same deterministic promotion: 20% off the merchandise subtotal. The discount persists from cart to checkout, confirmation, and the immutable order snapshot.

### 5. Complete a simulated checkout

Checkout collects contact and delivery details, can reuse delivery addresses from prior orders, and presents a canonical order summary. Registered shoppers can use fictional Telapsy Balance or a deterministic simulated card path; no real payment processor is called and no card information is persisted.

The server—not the browser—reloads product prices, validates quantities, recalculates promotions and totals, checks stock and balance, and guards duplicate submissions with an idempotency key. If order creation fails after a balance deduction, the balance is restored.

### 6. Keep continuity after purchase

Successful checkout creates a human-readable order number, immutable item and price snapshots, delivery details, payment state, and an order notification. Shoppers can search, filter, and paginate order history, open a detailed record, and see the same amounts that appeared at checkout.

The authenticated workspace also includes a dashboard, notifications, profile image management through Cloudinary, profile preferences, password changes, active-session controls, sign-out everywhere, account export, and account deletion controls.

## Competitive advantage

### 1. The verification target is a state graph, not a landing page

Telapsy's most valuable assertions cross screens and persistence boundaries: a promotion must survive checkout, a balance must be deducted exactly once, an order must preserve purchase-time prices, and carts must remain isolated by identity. Kane therefore verifies behavior that is materially more meaningful than “the page loaded.”

### 2. The agent and browser evidence form one workflow

The repository includes the executable bridge between Codex and Kane. A failed browser run is classified as an application defect, objective problem, or environment problem before code changes are made. Only legitimate regressions are repaired, and the affected journey is rerun.

### 3. Determinism is part of the product design

The catalogue seed is safely rerunnable, product assets are local, promotion rules are fixed, payment is simulated, prices use integer cents, and checkout is recalculated server-side. That makes demonstrations repeatable without reducing the application to static mock data.

### 4. Authentication and commerce share the same trust model

Strict provider boundaries, database-backed device sessions, account-owned carts, owner-scoped orders, server-authoritative totals, and immutable purchase snapshots work together. Security is not treated as a separate settings page while shopping state remains untrusted.

### 5. Product craft remains visible

The consumer surface uses a black, ivory, and warm-gold editorial system, Manrope typography, restrained depth, responsive layouts, purposeful motion, session transitions, loading states, disabled states, and reduced-motion fallbacks. The verification layer supports the product; it does not replace the experience.

## Technical strategy

```text
Next.js App Router
       │
       ├── React + Tailwind CSS product interface
       ├── React Query for server state
       ├── Zustand for account-scoped cart state
       └── Route Handlers + Zod validation
                    │
                    ▼
             MongoDB + Mongoose
                    │
       ┌────────────┼─────────────┐
       ▼            ▼             ▼
 Google OAuth     Brevo       Cloudinary

Codex ── invokes ──> Kane CLI ── drives ──> real Chrome session
  ▲                                      │
  └──── structured result + evidence ────┘
```

### Reliability and security posture

- Passwords are hashed with bcryptjs and never stored in plain text.
- Session cookies are HTTP-only, same-site, signed, and secure in production.
- Database-backed session records support per-device revocation and sign-out everywhere.
- Google OAuth uses authorization code flow with PKCE, state, nonce, and verified OpenID Connect tokens.
- Protected product, account, notification, checkout, and order surfaces resolve the authenticated user server-side.
- Product prices, stock, quantities, promotions, and final totals are authoritative on the server.
- Monetary values use integer cents.
- Checkout uses idempotency protection and compensates a deducted demo balance when order creation fails.
- Orders snapshot purchase-time names, quantities, unit prices, totals, delivery details, and payment state.
- Profile uploads are server-controlled through Cloudinary.
- Password-reset delivery uses Brevo when configured and a development-only local fallback otherwise.
- Secrets stay in ignored local environment files and are never required in the browser bundle.

## Repository layout

```text
telapsy/
├── src/
│   ├── app/                    # Public, authenticated, checkout, order, and API routes
│   ├── components/             # Storefront, account shell, forms, cards, and summaries
│   ├── lib/                    # Auth, pricing, catalogue, database, email, and integrations
│   ├── models/                 # User, Product, Order, Notification, and AuthSession
│   ├── store/                  # Account-scoped Zustand cart and tests
│   └── types/                  # Shared application contracts
├── public/products/            # Forty local product photographs and attribution
├── scripts/
│   ├── seed.ts                 # Deterministic forty-product database seed
│   ├── fetch-product-images.ts # Product asset refresh utility
│   └── verify-kane.ts          # Codex-to-Kane NDJSON verification bridge
├── tests/kane/                 # Persisted Kane scenarios and generated evidence
├── verification/               # Consolidated reports and local run output
└── .env.example                # Environment contract; never commit local secrets
```

## Run locally

### Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas or a compatible MongoDB instance
- A random `SESSION_SECRET` of at least 32 characters
- Optional Google, Brevo, and Cloudinary credentials for their respective integrations

```bash
git clone https://github.com/samscript18/telapsy.git
cd telapsy
npm install
cp .env.example .env.local
```

Add the required MongoDB URI and session secret to `.env.local`, then seed and start Telapsy:

```bash
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build and start:

```bash
npm run build
npm start
```

The seed is deterministic and safely rerunnable. It upserts the canonical forty products, removes obsolete catalogue records, and reports the final per-category totals.

## Environment

| Variable                |  Required  | Purpose                                                                     |
| ----------------------- | :--------: | --------------------------------------------------------------------------- |
| `MONGODB_URI`           |    Yes     | MongoDB connection for users, products, sessions, notifications, and orders |
| `SESSION_SECRET`        |    Yes     | Random secret of at least 32 characters used to sign session state          |
| `NEXT_PUBLIC_APP_URL`   |    Yes     | Exact application origin and Google OAuth callback base                     |
| `GOOGLE_CLIENT_ID`      |  Optional  | Google OAuth client identifier                                              |
| `GOOGLE_CLIENT_SECRET`  |  Optional  | Server-only Google OAuth client secret                                      |
| `BREVO_API_KEY`         |  Optional  | Transactional password-reset delivery                                       |
| `BREVO_SENDER_EMAIL`    | With Brevo | Verified password-reset sender address                                      |
| `BREVO_SENDER_NAME`     | With Brevo | Human-readable sender name                                                  |
| `CLOUDINARY_CLOUD_NAME` |  Optional  | Cloudinary account name for profile images                                  |
| `CLOUDINARY_API_KEY`    |  Optional  | Server-side Cloudinary API identifier                                       |
| `CLOUDINARY_API_SECRET` |  Optional  | Server-only Cloudinary secret                                               |

See [.env.example](.env.example) for the blank configuration contract. `.env.local` is ignored and must never be committed or printed.

## Verification

Run the deterministic local quality gates:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

With Telapsy running on port `3000` and Kane CLI installed and authenticated:

```bash
npm run verify:kane -- storefront
npm run verify:kane -- registration
npm run verify:kane -- registeredCart
npm run verify:kane -- promoKane
npm run verify:kane -- checkoutBalance
npm run verify:kane -- orderHistory
npm run verify:kane -- submissionDemo
```

The wrapper invokes `kane-cli run ... --agent --headless`, waits for the authoritative terminal event, writes the NDJSON stream under `verification/runs/`, prints a concise result, and exits non-zero unless Kane passed.

Additional passing evidence is summarized in [verification/reports/critical-flows.md](verification/reports/critical-flows.md):

| Verified journey      | What Kane proved                                                                  | Evidence                                                                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Registration          | An authenticated account starts with exactly `$1,000.00`                          | [Open run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZDCQ4E2ECNA4BK2P8E3FGB/dashboard/share/US_2Z9F1CCXXTP5HNXPHOCQJ6KTQV7W8YYUFP6XZNZG0SRTD0YZ1A79EVNW287ZCTI1?type=summary&agentView=true&fqdn=summary-page) |
| Product discovery     | Search opened the expected Electronics product                                    | [Open run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZCVWXR0PYT3TXZWPJ6ZYDP/dashboard/share/US_EMW17VG7HBDIMT4ELRV6N16XETKM3XG3WH7W67LMNCM7397XI9Q2C2PZDTKMBNXP?type=summary&agentView=true&fqdn=summary-page) |
| Promotion consistency | `KANE` produced a `$13.60` discount and `$54.40` checkout total                   | [Open run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZDN34DC84KB1GD0PC78PDZ/dashboard/share/US_UGJTCVXMZ2IF197K5PPHMO6AN4H42J23OAP0MUHT730A15MBA1GNW7HY9M70RWFF?type=summary&agentView=true&fqdn=summary-page) |
| Balance checkout      | `$1,000.00 − $54.40 = $945.60` across checkout and account state                  | [Open run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZET3WX13XKY676CQQSQJH0/dashboard/share/US_KBVI9YL0KCCDHB3A6NWBXPYW5XYQ39XU00OD07NF4DGV8XBN8UW129VC8JHFBJGI?type=summary&agentView=true&fqdn=summary-page) |
| Order history         | The latest order retained product, quantity, delivery, payment, total, and status | [Open run](https://test-manager.lambdatest.com/projects/01M0ZBG3VRA74FVD9643N6Z5GJ/test-cases/01M0ZF07E9EB781MBDNE30RD5D/dashboard/share/US_UBRNK6KM8Q0KB4JJQK5RMR4S9RU7NK176ZVQ261U20DX72HBYP2Q1YOZBFTDJQKT?type=summary&agentView=true&fqdn=summary-page) |

## Design direction

Telapsy uses near-black surfaces, ivory type, warm metallic gold, fine borders, soft radial light, product photography, and restrained kinetic effects. Public pages feel like an editorial luxury catalogue; authenticated pages become a precise operating space for products, cart, orders, account state, and notifications. Motion is progressive enhancement, and reduced-motion preferences remove nonessential animation without weakening the interface.

Product photography is stored locally for reliable demonstrations. Image sources and photographer credits are recorded in [public/products/ATTRIBUTION.md](public/products/ATTRIBUTION.md).
