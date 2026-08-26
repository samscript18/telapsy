# Telapsy

Telapsy is a polished full-stack demo store built to show a real Codex ↔ Kane verification and repair loop. It uses Next.js App Router, TypeScript, Tailwind CSS, React Query, Zustand, MongoDB/Mongoose, signed HTTP-only sessions, and deterministic simulated payments.

## Local setup

1. Copy `.env.example` to `.env.local` and set a strong `SESSION_SECRET`.
2. Ensure MongoDB is running locally.
3. Run `npm install`.
4. Run `npm run seed` (safely rerunnable; creates exactly 40 products).
5. Run `npm run dev` and open `http://localhost:3000`.

### Authentication providers

Password authentication works with only MongoDB and `SESSION_SECRET` configured.

For Google sign-in, create a Google OAuth 2.0 Web application and set:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Register `http://localhost:3000/api/auth/google/callback` as the local authorized redirect URI. The implementation uses authorization code flow, PKCE, state, nonce, and verified OpenID Connect ID tokens. A Google identity is not silently linked to an existing password account with the same email.

Password-reset messages use Brevo's transactional email API. Verify the sender in Brevo and set:

```env
BREVO_API_KEY=
BREVO_SENDER_EMAIL=noreply@example.com
BREVO_SENDER_NAME=Telapsy
```

When Brevo is not configured in local development, Telapsy displays a local-only reset preview link. Production responses never expose reset tokens and remain deliberately generic to prevent account enumeration.

## Quality and verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run verify:kane -- storefront
npm run verify:kane -- search
```

The Kane wrapper waits for the application, invokes `kane-cli run ... --agent --headless`, parses the authoritative terminal event, stores raw NDJSON under `verification/runs/`, and exits non-zero unless the run passed.

Promo codes `KANE` and `KANE2026` both grant 20% off. Payments and Telapsy Balance are fictional; no real card data or payment provider is used.
