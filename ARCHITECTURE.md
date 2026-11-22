# Architecture

```
Browser ──► Apache (Bluehost)
             ├── /, /about, /projects, /divisions/:slug, …  → index.html + /assets/*.js (React app)
             ├── /media/*, /uploads/*                       → static images
             └── /api/*                                     → api/index.php ──► MySQL
```

## Frontend (`src/`)

React 19 + TanStack Router (file routes in `src/routes/`), Tailwind CSS, shadcn/ui. Built with **TanStack Start in SPA mode**: `vite build` prerenders one HTML shell (`dist/client/index.html`) and the browser renders every route. `public/.htaccess` sends unknown paths to `index.html` so deep links and refreshes work.

| Area | Files |
| --- | --- |
| Pages | `src/routes/*.jsx` — home, about, projects, leadership, partners, contact, `divisions.$division`, `admin`, `login` |
| Layout & chrome | `src/components/site/` |
| Built-in content (EN/AR) | `src/lib/content.js`, `divisions.js`, `media.js`, `i18n.jsx` |
| Managed content overrides | `src/lib/site-content.jsx` merges published overrides over the built-in content |
| API client | `src/api/client.js` (projects, enquiries, upload, auth), `src/lib/site-api.js` (content manager, maintenance) |
| Session | `src/lib/AuthContext.jsx` — token in `localStorage`, sent as `X-Auth-Token` |
| Content manager | `src/components/admin/` |

## Backend (`public/api/`)

Plain PHP 8.1, no framework or Composer dependencies. `index.php` routes requests; `bootstrap.php` holds config, PDO, JSON and auth helpers; `upload.php` handles images.

| Endpoint | Access | Replaces |
| --- | --- | --- |
| `GET /api/site-state` | public | `getPublicSiteState` server function |
| `GET /api/projects?division=&year=&featured=&limit=` | public | `Project.filter / list` |
| `POST /api/projects`, `PUT/DELETE /api/projects/:id` | admin | `Project.create / update / delete` |
| `POST /api/inquiries` | public (5 per IP / 10 min) | `ContactInquiry.create` |
| `GET /api/admin/inquiries` | admin | Base44 dashboard data view |
| `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | — | Base44 auth |
| `GET /api/admin/access` | any | `getAdminAccess` |
| `GET /api/admin/manager`, `/admin/draft`, `/admin/published` | admin | content manager server functions |
| `POST /api/admin/draft`, `/admin/publish`, `/admin/discard`, `/admin/maintenance` | admin | content manager server functions |
| `POST /api/admin/upload` | admin | `Core.UploadFile` |

Access rules are the original Base44 entity rules: projects are publicly readable and admin-writable; enquiries are public-create, admin-read; the draft is admin-only; published content and settings are public-read, admin-write. During maintenance mode the public endpoint returns only the maintenance page's wording, never site content.

### Security

- Passwords: `password_hash` (bcrypt). Sessions: random 256-bit tokens, stored only as SHA-256 hashes, 14-day expiry, revoked on logout and on password reset.
- Login throttling: 10 failed attempts per IP per 15 minutes.
- All SQL uses prepared statements; all input is validated and length-bounded (content documents ≤ 400 KB).
- Uploads: type detected from file bytes (PNG/JPG/WebP/GIF/SVG only), random file names, 10 MB cap; `uploads/.htaccess` disables script execution and sandboxes SVGs with a CSP.
- `api/.htaccess` denies direct access to every PHP file except `index.php`.

## Database (`database/`)

`schema.sql` (MySQL 8; also runs on SQLite for local dev) and `seed.sql` (the 23 public projects and site settings exported from the original site on 2026-11-22). Ids keep Base44's 24-hex format.

| Table | Base44 entity |
| --- | --- |
| `projects` | Project |
| `contact_inquiries` | ContactInquiry |
| `site_content_draft` / `site_content_published` | SiteContentDraft / SiteContentPublished |
| `site_settings` | SiteSetting |
| `users`, `sessions`, `login_attempts` | User (+ Base44 auth) |

## What changed from the Base44 version, and why

| Change | Reason |
| --- | --- |
| Server rendering → static SPA shell | Bluehost shared hosting has no Node.js runtime. Page content is unchanged; crawlers that don't run JavaScript now see the shell (title and description) rather than full page text. |
| Base44 SDK, Vite plugin, Cloudflare plugin, Wrangler removed | Platform-specific; replaced by `src/api/client.js` with the same call shapes. |
| Server functions → PHP endpoints | Same names, inputs and outputs (`src/lib/site-api.js`). |
| Base44 login (Google sign-in, self-registration, MFA, password-reset email) → email + password at `/login` | Those flows were provided by Base44's hosted auth service. The site only needs admin sign-in, so accounts are created with `api/create-admin.php`. |
| Base44 error reporting (`error-capture*`, `src/server.js`) removed | It reported to Base44's dashboard. PHP errors go to the server's error log (cPanel → Errors). |
| Base44 AI gateway helper (`ai.server.js`, `@tanstack/ai*`) removed | Not used by any page, and the gateway is Base44-only. |
| Unused auth boilerplate in `src/components/auth/` removed (kept `AuthLayout`) | It only worked against Base44's auth API and nothing imported it. |
| Images moved from `media.base44.com` to `public/media/` | No dependency on the old platform's CDN. Base44's on-the-fly image resizing no longer applies; images are served as stored. |
| Site state is fetched in the browser instead of a server loader | There is no server render. Until it arrives (one small request) the built-in content shows, so maintenance mode appears a moment after first paint; `noindex` is still set while maintenance is on. |

## Local development

`npm run api` runs PHP's built-in server with `scripts/dev-router.php` (stands in for Apache) against SQLite; `npm run dev` runs Vite and proxies `/api` and `/uploads` to it. `npm run test:api` runs end-to-end checks of every endpoint and access rule.
