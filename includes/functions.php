<?php
/**
 * TekVion – Helper functions
 */

if (!function_exists('base_url')) {
    function base_url($path = '') {
        $base = rtrim(defined('BASE_PATH') ? BASE_PATH : '', '/');
        return $base . ($path ? '/' . ltrim($path, '/') : '');
    }
}

if (!function_exists('redirect')) {
    function redirect($url, $code = 302) {
        $url = strpos($url, 'http') === 0 ? $url : base_url($url);
        header('Location: ' . $url, true, $code);
        exit;
    }
}

if (!function_exists('json_response')) {
    function json_response($data, $code = 200) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if (!function_exists('e')) {
    function e($str) {
        return htmlspecialchars((string) $str, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('setting')) {
    function setting(PDO $pdo, $key, $default = null) {
        static $cache = [];
        if (!isset($cache[$key])) {
            $st = $pdo->prepare('SELECT `value` FROM site_settings WHERE key_name = ?');
            $st->execute([$key]);
            $row = $st->fetch();
            $cache[$key] = $row ? $row['value'] : $default;
        }
        return $cache[$key];
    }
}
