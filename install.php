<?php
/**
 * TekVion – One-time install: create default admin user
 * Run after importing sql/schema.sql.
 * Default: admin@tekvion.ae / admin (change after first login)
 */
require_once __DIR__ . '/includes/init.php';

$done = false;
$error = '';
$message = '';

// Create admin user if not exists
try {
    $st = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $st->execute(['admin@tekvion.ae']);
    $exists = $st->fetch();

    if (!$exists) {
        $hash = password_hash('admin', PASSWORD_DEFAULT);
        $st = $pdo->prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
        $st->execute(['admin@tekvion.ae', $hash, 'Admin']);
        $message = 'Admin user created. Email: admin@tekvion.ae, Password: admin. Change password after first login.';
        $done = true;
    } else {
        $message = 'Admin user already exists. Use admin@tekvion.ae and your password to log in.';
        $done = true;
    }
} catch (PDOException $e) {
    $error = 'Database error: ' . $e->getMessage() . '. Make sure you have run sql/schema.sql first.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Install – <?= e(SITE_NAME) ?></title>
    <link rel="stylesheet" href="<?= e(base_url('css/bootstrap.min.css')) ?>">
    <style>
        body { font-family: sans-serif; max-width: 560px; margin: 60px auto; padding: 20px; }
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 20px; }
        .alert-success { background: #d1fae5; color: #065f46; }
        .alert-error { background: #fee2e2; color: #991b1b; }
        a { color: #18a4f9; }
    </style>
</head>
<body>
    <h1>Tekvion CMS – Install</h1>
    <?php if ($error): ?>
        <div class="alert alert-error"><?= e($error) ?></div>
        <p>Create the database and run <code>sql/schema.sql</code> in MySQL/MariaDB, then create <code>config/database.local.php</code> from <code>config/database.local.php.example</code> with your DB credentials.</p>
    <?php elseif ($done): ?>
        <div class="alert alert-success"><?= e($message) ?></div>
        <p><a href="<?= e(base_url('admin/login.php')) ?>">Go to admin login</a></p>
    <?php endif; ?>
    <p><a href="<?= e(base_url('index.html')) ?>">Back to site</a></p>
</body>
</html>
