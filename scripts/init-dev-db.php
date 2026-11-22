<?php
// Create (or recreate) the local SQLite database from database/schema.sql + seed.sql.
//   php scripts/init-dev-db.php
// The schema is written so it runs on both MySQL 8 and SQLite.
$root = dirname(__DIR__);
@mkdir("$root/.data");
@unlink("$root/.data/dev.sqlite");
$pdo = new PDO("sqlite:$root/.data/dev.sqlite", null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
foreach (['schema.sql', 'seed.sql'] as $file) $pdo->exec(file_get_contents("$root/database/$file"));
echo 'Projects: ' . $pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn() . "\n";
echo "Now create an admin: TSW_CONFIG=scripts/dev-config.php php public/api/create-admin.php you@example.com \"Your Name\"\n";
