# Deploying to Bluehost (cPanel)

## Why this architecture

Bluehost shared hosting is built for **PHP + MySQL managed through cPanel** (PHP 8.1 is the minimum on shared plans; MySQL 8). Bluehost does not document a Node.js application runtime for shared plans and points Node.js workloads to a VPS. The original site needed a Node/Cloudflare Worker runtime for server rendering, so this version is:

- the React site built as **static files** (served by Apache), plus
- a **PHP API** and a **MySQL database** for everything that needs a server.

This runs on any Bluehost plan (shared, WordPress-free, VPS or dedicated) without extra software.

## What you upload

`npm run build` produces `dist/client/`. Its contents go into your site's document root (normally `public_html/`):

```
public_html/
├── .htaccess          SPA routing, HTTPS redirect, caching, security headers
├── index.html         the app shell
├── assets/            hashed JS/CSS
├── media/             brand and project images
├── api/               PHP API (+ its own .htaccess)
└── uploads/           admin image uploads (+ .htaccess that blocks scripts)
```

## One-time setup

### 1. Build locally

```bash
npm ci
npm run build
```

### 2. Create the database

1. cPanel → **MySQL Databases** → create a database (e.g. `cpuser_together`) and a user with a strong password; add the user to the database with **ALL PRIVILEGES**.
2. cPanel → **phpMyAdmin** → select the database → **Import** → `database/schema.sql`, then import `database/seed.sql` (the 23 existing projects and site settings exported from the original site).

### 3. Upload the files

Use cPanel → **File Manager** (upload a zip of the *contents* of `dist/client/` and extract it in `public_html/`), or SFTP. Make sure the hidden `.htaccess` files are included — zip them from the folder rather than selecting visible files only.

### 4. Configure the API

Create `/home/CPANELUSER/tsw-config.php` — **one level above `public_html`**, so it can never be served — from `public_html/api/config.example.php`, and fill in the database name, user and password. See [ENVIRONMENT.md](ENVIRONMENT.md).

(Placing it at `public_html/api/config.php` also works; `api/.htaccess` blocks direct access to it.)

### 5. PHP version and extensions

cPanel → **MultiPHP Manager**: set the domain to **PHP 8.1 or newer**. cPanel → **Select PHP Version / PHP Extensions** (if shown): make sure `pdo_mysql`, `fileinfo` and `mbstring` are enabled (they are on by default on Bluehost).

### 6. Create the first admin

cPanel → **Terminal** (or SSH):

```bash
php ~/public_html/api/create-admin.php you@yourdomain.com "Your Name"
```

It prompts for a password (12+ characters). Run it again with the same email to reset a password; that also signs the account out everywhere.

If Terminal/SSH is not available on your plan, enable SSH in cPanel → **Security → SSH Access**, or ask Bluehost support to run the command.

### 7. SSL

cPanel → **SSL/TLS Status** → run AutoSSL for the domain. `.htaccess` redirects HTTP to HTTPS; if the certificate is not active yet, comment out the three `HTTPS` lines in `public_html/.htaccess` until it is.

### 8. Check

- `https://yourdomain.com/` loads; `/projects` lists the projects; refreshing on `/about` still works (routing).
- `https://yourdomain.com/api/site-state` returns JSON.
- `https://yourdomain.com/api/config.php` and `/api/bootstrap.php` return **403/404**.
- Submit the contact form, then sign in at `/admin`.

## Updating the site later

1. `npm run build`
2. Upload the new `dist/client/` contents over `public_html/`. **Do not delete `public_html/uploads/`** (admin-uploaded images) or your config file.
3. If `database/schema.sql` changed, apply the change in phpMyAdmin.

## Backups

- Database: cPanel → phpMyAdmin → Export, or Bluehost's backup tool.
- Files: `public_html/uploads/` holds every image uploaded through the content manager.

## Contact enquiries

Enquiries are stored in the `contact_inquiries` table (view in phpMyAdmin, or `GET /api/admin/inquiries` when signed in as admin). Set `notify_email` in the config to also receive each one by email.

## Moving to a subfolder or another host

The site expects to live at the domain root. Any Apache + PHP 8.1 + MySQL host works the same way. For Nginx, recreate the two `.htaccess` rule sets (SPA fallback to `index.html`; `/api/*` → `api/index.php`; deny `api/*.php` except `index.php`; no script execution in `uploads/`).
