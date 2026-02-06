<?php
/**
 * TekVion – Database connection (PDO)
 * Create config/database.local.php with your DB_HOST, DB_NAME, DB_USER, DB_PASS.
 */

$dbConfig = [
    'host' => 'localhost',
    'name' => 'tekvion_cms',
    'user' => 'root',
    'pass' => '',
    'charset' => 'utf8mb4',
];

if (file_exists(__DIR__ . '/database.local.php')) {
    $local = require __DIR__ . '/database.local.php';
    $dbConfig = array_merge($dbConfig, $local);
}

$dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=%s',
    $dbConfig['host'],
    $dbConfig['name'],
    $dbConfig['charset']
);

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], $options);
} catch (PDOException $e) {
    if (getenv('APP_ENV') === 'production') {
        die('Database connection failed.');
    }
    die('Database connection failed: ' . $e->getMessage());
}
