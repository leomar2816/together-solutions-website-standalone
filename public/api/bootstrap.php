<?php
// Shared helpers for the API: config, database, JSON I/O and authentication.
declare(strict_types=1);

if (!defined('TSW_API')) { http_response_code(404); exit; }

const SITE_KEY = 'site';
const SESSION_DAYS = 14;
const MAX_CONTENT_BYTES = 400000;

function config(): array
{
    static $config;
    if ($config !== null) return $config;
    // Prefer a config file outside the web root; fall back to api/config.php (blocked by .htaccess).
    $candidates = array_filter([
        getenv('TSW_CONFIG') ?: null,
        dirname(__DIR__, 2) . '/tsw-config.php',
        __DIR__ . '/config.php',
    ]);
    foreach ($candidates as $file) {
        if (is_file($file)) return $config = require $file;
    }
    fail(500, 'Server is not configured. Copy api/config.example.php to config.php.');
}

function db(): PDO
{
    static $pdo;
    if ($pdo) return $pdo;
    $c = config();
    $pdo = new PDO($c['db_dsn'], $c['db_user'] ?? null, $c['db_pass'] ?? null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function q(string $sql, array $params = []): PDOStatement
{
    $st = db()->prepare($sql);
    $st->execute($params);
    return $st;
}

function now(): string { return gmdate('Y-m-d H:i:s'); }
function iso(?string $dt): ?string { return $dt ? str_replace(' ', 'T', $dt) . 'Z' : null; }
function new_id(): string { return bin2hex(random_bytes(12)); }

function respond($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $message): void { respond(['error' => $message], $status); }

function body(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '{}', true);
    if (!is_array($data)) fail(400, 'Invalid JSON body');
    return $data;
}

function client_ip(): string { return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'; }

// ---------- auth ----------

function bearer_token(): ?string
{
    // A custom header: Apache on shared hosting often strips Authorization.
    $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
    return preg_match('/^[a-f0-9]{64}$/', $token) ? $token : null;
}

function current_user(): ?array
{
    static $user = false;
    if ($user !== false) return $user;
    $token = bearer_token();
    if (!$token) return $user = null;
    $row = q(
        'SELECT u.id, u.email, u.full_name, u.role FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = ? AND s.expires_at > ?',
        [hash('sha256', $token), now()]
    )->fetch();
    return $user = $row ?: null;
}

function require_user(): array
{
    $user = current_user();
    if (!$user) fail(401, 'Unauthorized');
    return $user;
}

function require_admin(): array
{
    $user = require_user();
    if ($user['role'] !== 'admin') fail(403, 'Forbidden');
    return $user;
}

function display_name(array $user): string { return $user['full_name'] ?: $user['email']; }

function public_user(array $u): array
{
    return ['id' => $u['id'], 'email' => $u['email'], 'full_name' => $u['full_name'], 'role' => $u['role']];
}

// ---------- validation ----------

function str_field(array $data, string $key, int $max, bool $required = false): ?string
{
    $value = $data[$key] ?? null;
    if ($value === null || $value === '') {
        if ($required) fail(422, "$key is required");
        return null;
    }
    if (!is_string($value)) fail(422, "$key must be text");
    $value = trim($value);
    if ($required && $value === '') fail(422, "$key is required");
    if (mb_strlen($value) > $max) fail(422, "$key is too long");
    return $value;
}

// Content is decoded as objects, not arrays, so empty {} survives the round trip (an assoc decode turns it into []).
function content_field(): stdClass
{
    $content = json_decode(file_get_contents('php://input') ?: '{}')->content ?? null;
    if (!$content instanceof stdClass) fail(422, 'content must be an object');
    $json = json_encode($content, JSON_UNESCAPED_UNICODE);
    if (strlen($json) > MAX_CONTENT_BYTES) fail(422, 'Content is too large');
    return $content;
}
