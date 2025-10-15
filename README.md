# MVP App — Bookmark Manager

A monetizable MVP built with Next.js 15, TypeScript, Prisma, NextAuth, Stripe, Tailwind.

## Tech
- Next.js (App Router), React 19, TS
- Prisma + SQLite (dev)
- NextAuth (Credentials + Google)
- Stripe Checkout + Customer Portal + Webhooks
- Tailwind v4
- Resend (emails)

## Getting Started
1. Install Node.js LTS.
2. Clone this folder and install deps:
   ```bash
   npm install
   ```
3. Create `.env` (see `.env.example`) and fill keys.
4. Run DB migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment
See `.env.example` for required variables.

## Stripe
- Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`.
- Expose local webhook:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

## Deploy
- Vercel recommended. Set all env vars in the dashboard.
- Use a managed Postgres in production; update `DATABASE_URL` and run migrations.

## License
MIT
