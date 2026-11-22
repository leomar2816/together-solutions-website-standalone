/* global process, fetch, console, Buffer, FormData, Blob */
// End-to-end check of the PHP API against a running server (default http://127.0.0.1:8044).
//   npm run db:init && npm run api   (in another terminal)
//   TSW_TEST_EMAIL=... TSW_TEST_PASSWORD=... npm run test:api
// Uses the local dev database only: it writes and deletes a test project and an enquiry.
import assert from "node:assert/strict";

const BASE = process.env.TSW_API ?? "http://127.0.0.1:8044/api";
const { TSW_TEST_EMAIL: email, TSW_TEST_PASSWORD: password } = process.env;

async function call(path, { method = "GET", body, token, form } = {}) {
  const headers = token ? { "X-Auth-Token": token } : {};
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(BASE + path, { method, headers, body: form ?? (body && JSON.stringify(body)) });
  return { status: res.status, data: await res.json().catch(() => null) };
}

// Public reads
let r = await call("/site-state");
assert.equal(r.status, 200);
assert.equal(r.data.maintenance, false);
r = await call("/projects?featured=true&limit=4");
assert.equal(r.status, 200);
assert.ok(r.data.items.length > 0 && r.data.items.every((p) => p.featured === true));
r = await call("/projects?division=sports");
assert.ok(r.data.items.every((p) => p.division === "sports"));

// Access control: anonymous callers cannot write or read admin data
assert.equal((await call("/projects", { method: "POST", body: { title: "x", year: 2025, division: "camp" } })).status, 401);
assert.equal((await call("/admin/manager")).status, 401);
assert.equal((await call("/admin/inquiries")).status, 401);
assert.deepEqual((await call("/admin/access")).data, { isAdmin: false, signedIn: false });
assert.equal((await call("/auth/login", { method: "POST", body: { email: "nobody@example.test", password: "wrong" } })).status, 401);

// Public contact form + validation
assert.equal((await call("/inquiries", { method: "POST", body: { name: "A", email: "not-an-email", message: "hi" } })).status, 422);
assert.equal((await call("/inquiries", { method: "POST", body: { name: "Smoke Test", email: "smoke@example.test", message: "Hello" } })).status, 201);

if (!email || !password) {
  console.log("Public checks passed. Set TSW_TEST_EMAIL / TSW_TEST_PASSWORD to run the admin checks.");
  process.exit(0);
}

// Admin flow
r = await call("/auth/login", { method: "POST", body: { email, password } });
assert.equal(r.status, 200);
const token = r.data.token;
assert.equal(r.data.user.role, "admin");
assert.equal((await call("/auth/me", { token })).data.email, email.toLowerCase());
assert.equal((await call("/admin/access", { token })).data.isAdmin, true);

r = await call("/projects", { method: "POST", token, body: { title: "Smoke project", year: 2025, division: "camp", images: [], featured: false } });
assert.equal(r.status, 200);
const id = r.data.id;
assert.equal((await call(`/projects/${id}`, { method: "PUT", token, body: { ...r.data, title: "Smoke project 2" } })).data.title, "Smoke project 2");
assert.equal((await call("/projects", { method: "POST", token, body: { title: "Bad", year: 1800, division: "camp" } })).status, 422);
assert.equal((await call(`/projects/${id}`, { method: "DELETE", token })).status, 200);

// Content manager: draft -> preview -> publish -> discard, maintenance hides content
const content = { texts: { en: { "home.hero.title": "Smoke title", "maintenance.title": "Back soon" }, ar: {} } };
assert.equal((await call("/admin/draft", { method: "POST", token, body: { content } })).status, 200);
assert.deepEqual((await call("/admin/draft", { token })).data.content, content);
assert.deepEqual((await call("/site-state")).data.content, {}, "draft must not be public");
assert.equal((await call("/admin/publish", { method: "POST", token, body: { content } })).status, 200);
assert.equal((await call("/site-state")).data.content.texts.en["home.hero.title"], "Smoke title");
assert.equal((await call("/admin/maintenance", { method: "POST", token, body: { enabled: true } })).status, 200);
r = await call("/site-state");
assert.equal(r.data.maintenance, true);
assert.deepEqual(r.data.content.texts.en, { "maintenance.title": "Back soon" }, "maintenance must only expose maintenance text");
assert.equal((await call("/admin/manager", { token })).data.maintenance, true);
await call("/admin/maintenance", { method: "POST", token, body: { enabled: false } });
await call("/admin/publish", { method: "POST", token, body: { content: {} } });

// Upload: a PNG is accepted, a PHP file disguised as an image is not
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
let form = new FormData();
form.append("file", new Blob([png], { type: "image/png" }), "dot.png");
r = await call("/admin/upload", { method: "POST", token, form });
assert.equal(r.status, 200);
assert.match(r.data.file_url, /^\/uploads\/\d{4}\/\d{2}\/[a-f0-9]{16}\.png$/);
form = new FormData();
form.append("file", new Blob(["<?php echo 1; ?>"], { type: "image/png" }), "evil.png");
assert.equal((await call("/admin/upload", { method: "POST", token, form })).status, 415);

assert.ok((await call("/admin/inquiries", { token })).data.items.some((i) => i.email === "smoke@example.test"));
await call("/auth/logout", { method: "POST", token });
assert.equal((await call("/auth/me", { token })).status, 401);
console.log("All API checks passed.");
