# Pixea — Photo Printing E-Commerce App

## Cursor Cloud specific instructions

### Overview

Pixea is a Next.js 16 e-commerce application for photo printing services (pixea.sk). Single project (not a monorepo). Uses npm as the package manager.

### Services

| Service | How to run | Notes |
|---|---|---|
| Next.js dev server | `npm run dev` | Runs on port 3000 with Turbopack. Auto-redirects `/` to `/en` or `/sk` (i18n). |
| PostgreSQL | External (Nile `thenile.dev`) | Connection via `DATABASE_URL` env var. No local DB needed. |
| Email preview | `npm run email:dev` | Optional — previews React Email templates locally. |

### Key commands

- **Lint:** `npm run lint` (ESLint on `src/`)
- **Build:** `npm run build`
- **DB migrations:** `npm run db:migrate` (Drizzle Kit)
- **DB schema generation:** `npm run db:generate`

### Environment variables

All secrets are injected as environment variables. Create `.env.local` from them:
`DATABASE_URL`, `AUTH_SECRET`, `AUTH_RESEND_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GOOGLE_GENERATIVE_AI_MODEL`, `S3_KEY_ID`, `S3_KEY`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`.

### Gotchas

- The DATABASE_URL points to an external PostgreSQL service (Nile/thenile.dev), not a local database. No local PostgreSQL setup is needed.
- The app uses `next-intl` with locale-prefixed routes (`/en/...`, `/sk/...`). The root `/` redirects (307) to the default locale.
- PostgreSQL client tools (`psql`, `pg_isready`) need to be installed via `sudo apt-get install -y postgresql-client` if direct DB access is needed.
