<?php
// Create or reset an admin account. Run from cPanel Terminal / SSH only:
//   php ~/public_html/api/create-admin.php you@example.com "Full Name"
// The password is typed at the prompt, so it never lands in shell history.
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
define('TSW_API', true);
require __DIR__ . '/bootstrap.php';

$email = $argv[1] ?? null;
$name = $argv[2] ?? null;
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Usage: php create-admin.php email \"Full Name\"\n");
    exit(1);
}
$password = getenv('TSW_ADMIN_PASSWORD') ?: null;
if (!$password) {
    echo 'Password (min 12 chars): ';
    if (DIRECTORY_SEPARATOR === '/') system('stty -echo');
    $password = trim((string) fgets(STDIN));
    if (DIRECTORY_SEPARATOR === '/') system('stty echo');
    echo "\n";
}
if (strlen($password) < 12) {
    fwrite(STDERR, "Password must be at least 12 characters.\n");
    exit(1);
}

$email = strtolower($email);
$hash = password_hash($password, PASSWORD_DEFAULT);
$existing = q('SELECT id FROM users WHERE email = ?', [$email])->fetch();
if ($existing) {
    q('UPDATE users SET password_hash = ?, role = ?, full_name = COALESCE(?, full_name) WHERE id = ?', [$hash, 'admin', $name, $existing['id']]);
    q('DELETE FROM sessions WHERE user_id = ?', [$existing['id']]);
    echo "Updated admin $email\n";
} else {
    q('INSERT INTO users (id, email, full_name, role, password_hash, created_date) VALUES (?, ?, ?, ?, ?, ?)', [new_id(), $email, $name, 'admin', $hash, now()]);
    echo "Created admin $email\n";
}
