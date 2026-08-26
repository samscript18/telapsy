# Telapsy

Telapsy is a polished full-stack demo store built to show a real Codex ↔ Kane verification and repair loop. It uses Next.js App Router, TypeScript, Tailwind CSS, React Query, Zustand, MongoDB/Mongoose, signed HTTP-only sessions, and deterministic simulated payments.

## Local setup

1. Copy `.env.example` to `.env.local` and set a strong `SESSION_SECRET`.
2. Ensure MongoDB is running locally.
3. Run `npm install`.
4. Run `npm run seed` (safely rerunnable; creates exactly 40 products).
5. Run `npm run dev` and open `http://localhost:3000`.

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
