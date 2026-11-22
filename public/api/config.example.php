<?php
// Copy to tsw-config.php one level ABOVE public_html (preferred), or to config.php in this folder.
// Never commit the real file.
return [
    // Bluehost MySQL: cPanel > MySQL Databases. Host is normally localhost.
    'db_dsn'  => 'mysql:host=localhost;dbname=CPANELUSER_together;charset=utf8mb4',
    'db_user' => 'CPANELUSER_together',
    'db_pass' => 'change-me',
    // Optional: email new contact enquiries here (uses PHP mail()). Leave '' to disable.
    'notify_email' => '',
    // Optional: From address for those emails, ideally a mailbox on your domain.
    'mail_from' => '',
];
