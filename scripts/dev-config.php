<?php
// Local development config: a SQLite file instead of MySQL. Production uses tsw-config.php (see ENVIRONMENT.md).
return [
    'db_dsn' => 'sqlite:' . dirname(__DIR__) . '/.data/dev.sqlite',
    'notify_email' => '',
];
