# Cloud Agent Starter Skill (Pixea)

This is the practical "first 15 minutes" runbook for Cloud agents working in this repository.
Use this file first, then go deeper into code.

## 1) Quick bootstrap (always do this first)

### Install + baseline checks

```bash
npm ci
npm run lint
npm run build
```

If `lint` and `build` both pass, the project is generally healthy enough for feature work.

### Start the app

```bash
npm run dev
```

- App runs on `http://localhost:3000`.
- This app uses locale-prefixed routes (`/en`, `/sk`).
- Hitting `/` redirects to the default locale.

Open one of these right away:
- `http://localhost:3000/en`
- `http://localhost:3000/sk`

### Required env vars (copy from injected secrets to `.env.local`)

The code expects:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_RESEND_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GOOGLE_GENERATIVE_AI_MODEL`
- `S3_KEY_ID`
- `S3_KEY`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`

If `.env.local` is missing or incomplete, most server-rendered pages will fail because DB/auth/S3 clients are created from env at runtime.

---

## 2) Login and role workflow (Auth + admin access)

Code areas:
- `src/auth.ts`
- `src/app/[locale]/auth/*`
- `src/app/api/auth/[...nextauth]/route.ts`

### Standard login flow

1. Open `/en/auth`.
2. Enter email and submit.
3. Enter verification code on `/en/auth/verify`.

Notes:
- Auth uses NextAuth with Resend email provider.
- Without a working `AUTH_RESEND_KEY`, email-code login cannot complete normally.

### Accessing admin pages

Admin-only pages redirect non-admin users back to auth:
- `/[locale]/users`
- `/[locale]/products`
- `/[locale]/orders`

Role check is `session?.user.role !== "admin"` in those pages/actions.

### Fast role promotion (when you have DB access)

After logging in once with a test email, promote that user:

```sql
UPDATE "user"
SET role = 'admin'
WHERE email = 'your-test-email@example.com';
```

Then revisit `/en/users`, `/en/products`, `/en/orders`.

### If login is blocked by missing email provider

Treat auth-gated flows as "integration-blocked" and focus on:
- public storefront routes
- order/cart guest flow
- lint/build/static checks

Document the block in your PR notes with the missing env variable.

---

## 3) Database + schema workflow (Drizzle + Postgres)

Code areas:
- `src/db/schema.ts`
- `src/db/index.ts`
- `drizzle.config.ts`
- `drizzle/*`

### Commands

```bash
npm run db:generate
npm run db:migrate
```

Use when schema files change.

### Concrete testing workflow for DB-related changes

1. Run `npm run db:generate`.
2. Run `npm run db:migrate`.
3. Run `npm run build` (catches type/runtime integration issues).
4. Open affected pages and verify reads/writes manually in UI.

This repo does not currently include an automated unit/integration test suite, so manual verification + lint/build are the default guardrails.

---

## 4) Storefront + i18n routing workflow

Code areas:
- `src/proxy.ts`
- `src/i18n/routing.ts`
- `src/app/[locale]/*`

### What to verify

1. `/` redirects correctly to locale route.
2. English and Slovak routes both render.
3. Localized pathname mapping still works (for example `/en/order` vs `/sk/objednavka`).

### Concrete testing workflow

1. Start dev server.
2. Open:
   - `/en`
   - `/sk`
   - `/en/order`
   - `/sk/objednavka`
3. Confirm navigation links resolve to localized paths.
4. Run `npm run lint` before finishing.

---

## 5) Cart, order item, and upload workflow (S3-backed)

Code areas:
- `src/hooks/useCart/actions.ts`
- `src/app/api/s3/[segment]/route.ts`
- `src/app/[locale]/order/item/[id]/files/*`
- `src/utils/s3.ts`

### Behavior to know immediately

- Guest users can upload only up to `MAX_UNAUTHENTICATED_FILE_SIZE`.
- Auth users can upload much larger files.
- Uploads use S3 presigned URLs (single-part + multipart endpoints).

### Concrete testing workflow

1. Go to `/en/order`.
2. Add an item via `/en/order/selection`.
3. Open item detail `/en/order/item/[id]`.
4. Upload a small image and verify it appears in the file grid.
5. (Optional) Test a larger file to validate multipart path.

### Common failure signatures

- Missing S3 env (`S3_*`) -> 500s from `/api/s3/*`.
- Missing/invalid bucket config -> presign or completion errors.
- If blocked, still test non-upload order flow and note upload integration block explicitly.

---

## 6) Products/admin workflow (+ AI draft generation)

Code areas:
- `src/app/[locale]/products/*`
- `src/app/[locale]/products/actions.ts`

### Runtime "feature flag" equivalent in this repo

There is no centralized feature flag system yet. In practice, these env vars act as toggles:

- `GOOGLE_GENERATIVE_AI_API_KEY`
  - Missing key intentionally disables AI product draft generation (action returns a clear error).
- `GOOGLE_GENERATIVE_AI_MODEL`
  - Optional model override; fallback default is used otherwise.

### Concrete testing workflow

1. Ensure test user is admin.
2. Open `/en/products`.
3. Create or edit a product and save.
4. Trigger AI draft generation:
   - with key present -> expect generated JSON or validation issues
   - with key removed -> expect "Missing GOOGLE_GENERATIVE_AI_API_KEY" error path
5. Re-run `npm run lint` and `npm run build`.

For "mocking flags" in this codebase, the safest method is to run with/without relevant env vars rather than adding temporary code switches.

---

## 7) Email template workflow (magic link/code)

Code areas:
- `emails/*`
- `src/emails/*`
- `src/auth.ts`

### Dev preview

```bash
npm run email:dev
```

Use this to iterate on React Email templates without going through full auth login.

### Concrete testing workflow

1. Run `npm run email:dev`.
2. Preview verification email template changes.
3. If auth env is available, perform one real `/auth` login flow to verify end-to-end behavior.

---

## 8) Minimal "done" checklist for most Cloud-agent tasks

Use this checklist unless task explicitly says otherwise:

1. `npm run lint`
2. `npm run build`
3. Manual verification in impacted UI area(s)
4. Note any env/integration blockers in PR description

---

## 9) How to update this skill when new runbook knowledge is discovered

Keep this file short and practical. When you discover a new trick:

1. Add it to the relevant codebase area section above (not as random notes).
2. Include:
   - exact route(s) or file(s)
   - exact command(s)
   - expected success/failure signal
3. Prefer "copy/paste runnable" snippets over prose.
4. If the trick is about a temporary workaround, label it clearly as temporary.
5. In the same PR, update this skill alongside the code change so future agents inherit the knowledge immediately.

