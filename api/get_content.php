<?php
/**
 * TekVion – Public API: site content as JSON
 * Use this to drive the frontend dynamically or for headless consumption.
 */
require_once __DIR__ . '/../includes/init.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$type = isset($_GET['type']) ? trim($_GET['type']) : 'all';

$out = [];

if ($type === 'all' || $type === 'settings') {
    $st = $pdo->query('SELECT key_name, value FROM site_settings');
    $out['settings'] = [];
    while ($row = $st->fetch()) {
        $out['settings'][$row['key_name']] = $row['value'];
    }
}

if ($type === 'all' || $type === 'hero') {
    $out['hero_slides'] = $pdo->query('SELECT id, sort_order, title, description FROM hero_slides ORDER BY sort_order')->fetchAll(PDO::FETCH_ASSOC);
}

if ($type === 'all' || $type === 'services') {
    $out['services'] = $pdo->query('SELECT id, sort_order, title, description, image FROM services ORDER BY sort_order')->fetchAll(PDO::FETCH_ASSOC);
}

if ($type === 'all' || $type === 'testimonials') {
    $out['testimonials'] = $pdo->query('SELECT id, sort_order, name, text, image FROM testimonials ORDER BY sort_order')->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
