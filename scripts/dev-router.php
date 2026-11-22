<?php
// Local development only (never deployed): PHP's built-in server standing in for Apache.
//   php -S 127.0.0.1:8044 -t public scripts/dev-router.php
putenv('TSW_CONFIG=' . __DIR__ . '/dev-config.php');
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if (str_starts_with($path, '/api/')) {
    require dirname(__DIR__) . '/public/api/index.php';
    return true;
}
return false; // static files (uploads, media)
