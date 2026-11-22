<?php
// JSON API for the Together website. Replaces the Base44 entities, auth, file upload
// and the TanStack Start server functions. Access rules match the original entity RLS:
//   Project: public read, admin write.        ContactInquiry: public create, admin read.
//   SiteContentDraft: admin only.             SiteContentPublished / SiteSetting: public read, admin write.
declare(strict_types=1);
define('TSW_API', true);
require __DIR__ . '/bootstrap.php';

const DIVISIONS = ['solutions', 'sports', 'real-estate', 'green', 'camp', 'global'];

set_exception_handler(function (Throwable $e) {
    error_log('[tsw-api] ' . $e);
    fail(500, 'Server error');
});

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$route = trim(preg_replace('#^.*?/api/#', '', $path) ?? '', '/');
$parts = explode('/', $route);

// ---------- singleton documents (key = 'site') ----------

function doc(string $table): ?array
{
    $row = q("SELECT * FROM $table WHERE `key` = ?", [SITE_KEY])->fetch();
    if (!$row) return null;
    if (array_key_exists('content', $row)) $row['content'] = json_decode($row['content'] ?: '{}') ?: new stdClass();
    return $row;
}

function save_doc(string $table, array $fields): void
{
    if (array_key_exists('content', $fields)) $fields['content'] = json_encode($fields['content'] ?: new stdClass(), JSON_UNESCAPED_UNICODE);
    $fields['updated_date'] = now();
    if (doc($table)) {
        $set = implode(', ', array_map(fn($k) => "`$k` = ?", array_keys($fields)));
        q("UPDATE $table SET $set WHERE `key` = ?", [...array_values($fields), SITE_KEY]);
    } else {
        $fields = ['id' => new_id(), 'key' => SITE_KEY, 'created_date' => now()] + $fields;
        $cols = implode(', ', array_map(fn($k) => "`$k`", array_keys($fields)));
        $marks = implode(', ', array_fill(0, count($fields), '?'));
        q("INSERT INTO $table ($cols) VALUES ($marks)", array_values($fields));
    }
}

function content_of(?array $doc) { return $doc['content'] ?? new stdClass(); }

// ---------- projects ----------

function project_out(array $r): array
{
    $r['images'] = json_decode($r['images'] ?: '[]', true) ?: [];
    $r['year'] = (int) $r['year'];
    $r['featured'] = $r['featured'] === null ? null : (bool) $r['featured'];
    $r['created_date'] = iso($r['created_date']);
    $r['updated_date'] = iso($r['updated_date']);
    return $r;
}

function project_in(array $d): array
{
    $division = $d['division'] ?? null;
    if (!in_array($division, DIVISIONS, true)) fail(422, 'division is invalid');
    $year = $d['year'] ?? null;
    if (!is_int($year) || $year < 1990 || $year > 2100) fail(422, 'year is invalid');
    $images = $d['images'] ?? [];
    if (!is_array($images) || count($images) > 30) fail(422, 'images is invalid');
    foreach ($images as $img) if (!is_string($img) || strlen($img) > 1000) fail(422, 'images is invalid');
    return [
        'title' => str_field($d, 'title', 300, true),
        'title_ar' => str_field($d, 'title_ar', 300),
        'client' => str_field($d, 'client', 300),
        'client_ar' => str_field($d, 'client_ar', 300),
        'summary' => str_field($d, 'summary', 5000),
        'summary_ar' => str_field($d, 'summary_ar', 5000),
        'division' => $division,
        'year' => $year,
        'year_label' => str_field($d, 'year_label', 50),
        'video_url' => str_field($d, 'video_url', 1000),
        'featured' => isset($d['featured']) ? (int) (bool) $d['featured'] : null,
        'images' => json_encode(array_values($images), JSON_UNESCAPED_SLASHES),
    ];
}

function list_projects(): void
{
    $where = [];
    $params = [];
    if (isset($_GET['division'])) { $where[] = 'division = ?'; $params[] = (string) $_GET['division']; }
    if (isset($_GET['year'])) { $where[] = 'year = ?'; $params[] = (int) $_GET['year']; }
    if (isset($_GET['featured'])) { $where[] = 'featured = ?'; $params[] = $_GET['featured'] === 'true' ? 1 : 0; }
    $limit = max(1, min(500, (int) ($_GET['limit'] ?? 200)));
    $sql = 'SELECT * FROM projects' . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
        . " ORDER BY year DESC, created_date DESC LIMIT $limit";
    respond(['items' => array_map('project_out', q($sql, $params)->fetchAll())]);
}

function write_project(?string $id): void
{
    require_admin();
    $data = project_in(body());
    $data['updated_date'] = now();
    if ($id) {
        if (!q('SELECT id FROM projects WHERE id = ?', [$id])->fetch()) fail(404, 'Not found');
        $set = implode(', ', array_map(fn($k) => "$k = ?", array_keys($data)));
        q("UPDATE projects SET $set WHERE id = ?", [...array_values($data), $id]);
    } else {
        $id = new_id();
        $data = ['id' => $id, 'created_date' => now()] + $data;
        $cols = implode(', ', array_keys($data));
        q("INSERT INTO projects ($cols) VALUES (" . implode(', ', array_fill(0, count($data), '?')) . ')', array_values($data));
    }
    respond(project_out(q('SELECT * FROM projects WHERE id = ?', [$id])->fetch()));
}

// ---------- contact enquiries ----------

function create_inquiry(): void
{
    // Light abuse guard: at most 5 enquiries per IP per 10 minutes.
    $since = gmdate('Y-m-d H:i:s', time() - 600);
    if ((int) q('SELECT COUNT(*) FROM contact_inquiries WHERE ip = ? AND created_date > ?', [client_ip(), $since])->fetchColumn() >= 5) {
        fail(429, 'Too many enquiries. Please try again later.');
    }
    $d = body();
    $email = str_field($d, 'email', 254, true);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(422, 'email is invalid');
    $division = str_field($d, 'division', 50);
    if ($division !== null && !in_array($division, DIVISIONS, true)) $division = null;
    $row = [
        'id' => new_id(),
        'name' => str_field($d, 'name', 200, true),
        'organisation' => str_field($d, 'organisation', 200),
        'email' => $email,
        'phone' => str_field($d, 'phone', 50),
        'division' => $division,
        'message' => str_field($d, 'message', 5000, true),
        'ip' => client_ip(),
        'created_date' => now(),
    ];
    q('INSERT INTO contact_inquiries (' . implode(', ', array_keys($row)) . ') VALUES (' . implode(', ', array_fill(0, count($row), '?')) . ')', array_values($row));

    $to = config()['notify_email'] ?? '';
    if ($to) {
        $text = "New enquiry from the website\n\nName: {$row['name']}\nOrganisation: {$row['organisation']}\nEmail: {$row['email']}\nPhone: {$row['phone']}\nDivision: {$row['division']}\n\n{$row['message']}\n";
        $from = config()['mail_from'] ?? '';
        $headers = ['Content-Type' => 'text/plain; charset=utf-8', 'Reply-To' => $email] + ($from ? ['From' => $from] : []);
        @mail($to, '=?UTF-8?B?' . base64_encode('Website enquiry: ' . $row['name']) . '?=', $text, $headers);
    }
    respond(['id' => $row['id']], 201);
}

// ---------- auth ----------

function login(): void
{
    $since = gmdate('Y-m-d H:i:s', time() - 900);
    if ((int) q('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND attempted_at > ?', [client_ip(), $since])->fetchColumn() >= 10) {
        fail(429, 'Too many sign-in attempts. Wait 15 minutes and try again.');
    }
    $d = body();
    $email = strtolower(str_field($d, 'email', 254, true));
    $password = $d['password'] ?? '';
    if (!is_string($password) || $password === '' || strlen($password) > 200) fail(422, 'password is required');

    $user = q('SELECT * FROM users WHERE email = ?', [$email])->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        q('INSERT INTO login_attempts (ip, attempted_at) VALUES (?, ?)', [client_ip(), now()]);
        fail(401, 'Incorrect email or password.');
    }
    q('DELETE FROM login_attempts WHERE ip = ?', [client_ip()]);
    q('DELETE FROM sessions WHERE expires_at < ?', [now()]);
    $token = bin2hex(random_bytes(32));
    q('INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)', [
        hash('sha256', $token), $user['id'], now(), gmdate('Y-m-d H:i:s', time() + SESSION_DAYS * 86400),
    ]);
    respond(['token' => $token, 'user' => public_user($user)]);
}

// ---------- routes ----------

switch (true) {
    case $route === 'auth/login' && $method === 'POST':
        login();
    case $route === 'auth/logout' && $method === 'POST':
        if ($t = bearer_token()) q('DELETE FROM sessions WHERE token_hash = ?', [hash('sha256', $t)]);
        respond(['ok' => true]);
    case $route === 'auth/me' && $method === 'GET':
        respond(public_user(require_user()));

    // Public: maintenance flag + published content. During maintenance only the maintenance wording is sent.
    case $route === 'site-state' && $method === 'GET':
        $maintenance = (bool) (doc('site_settings')['maintenance_enabled'] ?? false);
        $content = content_of(doc('site_content_published'));
        if ($maintenance) {
            $texts = (array) (((array) $content)['texts'] ?? []);
            $only = fn($dict) => (object) array_filter((array) $dict, fn($k) => str_starts_with((string) $k, 'maintenance.'), ARRAY_FILTER_USE_KEY);
            $content = ['texts' => ['en' => $only($texts['en'] ?? []), 'ar' => $only($texts['ar'] ?? [])]];
        }
        respond(['maintenance' => $maintenance, 'content' => $content]);

    case $route === 'admin/access' && $method === 'GET':
        $u = current_user();
        respond($u ? ['isAdmin' => $u['role'] === 'admin', 'signedIn' => true, 'name' => display_name($u)] : ['isAdmin' => false, 'signedIn' => false]);
    case $route === 'admin/published' && $method === 'GET':
        require_admin();
        respond(['content' => content_of(doc('site_content_published'))]);
    case $route === 'admin/draft' && $method === 'GET':
        require_admin();
        respond(['content' => content_of(doc('site_content_draft'))]);
    case $route === 'admin/manager' && $method === 'GET':
        require_admin();
        $draft = doc('site_content_draft');
        $pub = doc('site_content_published');
        $set = doc('site_settings');
        respond([
            'draft' => content_of($draft), 'draftUpdatedAt' => iso($draft['updated_date'] ?? null), 'draftUpdatedBy' => $draft['updated_by_name'] ?? null,
            'published' => content_of($pub), 'publishedAt' => iso($pub['published_at'] ?? null), 'publishedBy' => $pub['published_by_name'] ?? null,
            'maintenance' => (bool) ($set['maintenance_enabled'] ?? false), 'maintenanceBy' => $set['changed_by_name'] ?? null,
        ]);
    case $route === 'admin/draft' && $method === 'POST':
        $u = require_admin();
        save_doc('site_content_draft', ['content' => content_field(), 'updated_by_name' => display_name($u)]);
        respond(['savedAt' => iso(now())]);
    case $route === 'admin/publish' && $method === 'POST':
        $u = require_admin();
        $content = content_field();
        save_doc('site_content_draft', ['content' => $content, 'updated_by_name' => display_name($u)]);
        save_doc('site_content_published', ['content' => $content, 'published_by_name' => display_name($u), 'published_at' => now()]);
        respond(['publishedAt' => iso(now())]);
    case $route === 'admin/discard' && $method === 'POST':
        $u = require_admin();
        $content = content_of(doc('site_content_published'));
        save_doc('site_content_draft', ['content' => $content, 'updated_by_name' => display_name($u)]);
        respond(['content' => $content]);
    case $route === 'admin/maintenance' && $method === 'POST':
        $u = require_admin();
        $enabled = body()['enabled'] ?? null;
        if (!is_bool($enabled)) fail(422, 'enabled must be true or false');
        save_doc('site_settings', ['maintenance_enabled' => (int) $enabled, 'changed_by_name' => display_name($u)]);
        respond(['maintenance' => $enabled]);
    case $route === 'admin/inquiries' && $method === 'GET':
        require_admin();
        respond(['items' => q('SELECT id, name, organisation, email, phone, division, message, created_date FROM contact_inquiries ORDER BY created_date DESC LIMIT 500')->fetchAll()]);
    case $route === 'admin/upload' && $method === 'POST':
        require_admin();
        require __DIR__ . '/upload.php';
        handle_upload();

    case $route === 'projects' && $method === 'GET':
        list_projects();
    case $route === 'projects' && $method === 'POST':
        write_project(null);
    case $parts[0] === 'projects' && count($parts) === 2 && $method === 'PUT':
        write_project($parts[1]);
    case $parts[0] === 'projects' && count($parts) === 2 && $method === 'DELETE':
        require_admin();
        q('DELETE FROM projects WHERE id = ?', [$parts[1]]);
        respond(['ok' => true]);

    case $route === 'inquiries' && $method === 'POST':
        create_inquiry();
}
fail(404, 'Not found');
