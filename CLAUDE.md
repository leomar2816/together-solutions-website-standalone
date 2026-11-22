# Notes for coding agents

Read `ARCHITECTURE.md` first. Key rules:

- The site must stay deployable to Bluehost shared hosting: static files + PHP 8.1 + MySQL 8. No Node.js at runtime, no SSR.
- Every `/api` endpoint is public; admin endpoints must call `require_admin()`. Validate all input in PHP.
- Never commit `public/api/config.php` or `tsw-config.php` (database credentials).
- `database/schema.sql` must keep running on both MySQL 8 and SQLite (local dev).
- After API changes run `npm run api` + `npm run test:api`; after frontend changes run `npm run lint` and `npm run build`.
