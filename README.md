# Together Solutions website (standalone)

The Together Solutions corporate website — bilingual (English / Arabic), six division pages, a projects archive, a contact form and an admin content manager — packaged to run on **ordinary shared hosting (Bluehost cPanel)** with no platform lock-in.

It was a Base44 app (TanStack Start rendered on a Cloudflare Worker, with Base44's database, login and file storage). This copy is fully independent:

| Part | Original (Base44) | Standalone |
| --- | --- | --- |
| Frontend | TanStack Start, server-rendered in a Cloudflare Worker | Same React code, built as static files (TanStack Start SPA mode) |
| Backend | Base44 entities + TanStack server functions | PHP 8.1+ JSON API (`public/api/`) |
| Database | Base44-managed | MySQL 8 (`database/schema.sql`) |
| Admin login | Base44 hosted login | Email + password, `/login` |
| Image uploads | Base44 file storage | `/uploads/` on your server |
| Images & brand assets | `media.base44.com` | Bundled in `public/media/` |

Design, branding, pages, navigation, responsiveness and features are unchanged. See [ARCHITECTURE.md](ARCHITECTURE.md) for what changed and why.

## Quick start (local)

Requirements: Node.js 20+, PHP 8.1+ with `pdo_sqlite` (local) / `pdo_mysql` (production), `fileinfo`, `mbstring`.

```bash
npm ci
npm run db:init                      # creates .data/dev.sqlite from database/schema.sql + seed.sql
TSW_CONFIG=scripts/dev-config.php php public/api/create-admin.php you@example.com "Your Name"
npm run api                          # PHP API on http://127.0.0.1:8044 (terminal 1)
npm run dev                          # site at the URL Vite prints (terminal 2); proxies /api
```

Open `/admin` to sign in to the content manager.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (proxies `/api` and `/uploads` to :8044) |
| `npm run api` | PHP built-in server for the API, using a local SQLite DB |
| `npm run db:init` | (Re)create the local SQLite database with seed data |
| `npm run build` | Production build into `dist/client/` — the folder you upload |
| `npm run lint` | ESLint |
| `npm run test:api` | End-to-end API checks against a running `npm run api` (set `TSW_TEST_EMAIL` / `TSW_TEST_PASSWORD` for the admin checks) |

## Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) — step-by-step Bluehost cPanel deployment
- [ARCHITECTURE.md](ARCHITECTURE.md) — how it fits together, and what changed from the Base44 version
- [ENVIRONMENT.md](ENVIRONMENT.md) — configuration and secrets
