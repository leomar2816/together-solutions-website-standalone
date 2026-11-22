# Environment and configuration

There are no secrets in the frontend build, and no `.env` file is needed to build or run the site.

## API configuration (server-side, secret)

The PHP API reads a PHP array from the first file that exists:

1. the path in the `TSW_CONFIG` environment variable (used by local dev),
2. `tsw-config.php` one directory **above** the web root (recommended on Bluehost: `/home/CPANELUSER/tsw-config.php`),
3. `public_html/api/config.php` (blocked from the web by `api/.htaccess`).

Template: [`public/api/config.example.php`](public/api/config.example.php).

| Key | Required | Example | Purpose |
| --- | --- | --- | --- |
| `db_dsn` | yes | `mysql:host=localhost;dbname=cpuser_together;charset=utf8mb4` | PDO connection string. Bluehost MySQL host is `localhost`. |
| `db_user` | yes (MySQL) | `cpuser_together` | Database user from cPanel → MySQL Databases |
| `db_pass` | yes (MySQL) | — | That user's password |
| `notify_email` | no | `info@togethersolutions.com` | Email each new contact enquiry here (PHP `mail()`); `''` disables |
| `mail_from` | no | `website@yourdomain.com` | From address for those emails; use a mailbox on your domain so they are not marked as spam |

Never commit the real file: `config.php` and `tsw-config.php` are in `.gitignore`.

## Frontend build variables (public)

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Where the browser calls the API. Only change it if the API lives on another origin. |

Anything prefixed `VITE_` is compiled into the public JavaScript, so never put a secret in one.

## Local development

`scripts/dev-config.php` points at a SQLite file (`.data/dev.sqlite`); `npm run api` sets `TSW_CONFIG` to it automatically via `scripts/dev-router.php`. To run `create-admin.php` locally, set it yourself:

```bash
TSW_CONFIG=scripts/dev-config.php php public/api/create-admin.php you@example.com "Your Name"
```

`create-admin.php` also accepts the password from `TSW_ADMIN_PASSWORD` (for scripts); interactively it prompts instead, which keeps it out of shell history.

## Removed Base44 variables

`VITE_BASE44_APP_ID`, `VITE_BASE44_APP_BASE_URL`, `VITE_BASE44_FUNCTIONS_VERSION` and the `base44 secrets` store are no longer used.
