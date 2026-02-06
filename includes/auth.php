<?php
/**
 * TekVion – Admin authentication
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Require admin to be logged in; redirect to login if not.
 */
function require_admin() {
    if (!isset($_SESSION['admin_id']) || !$_SESSION['admin_id']) {
        $login = defined('BASE_PATH') && BASE_PATH ? BASE_PATH . '/admin/login.php' : 'admin/login.php';
        redirect($login);
    }
}

/**
 * Get current admin user from session.
 */
function current_admin() {
    if (!isset($_SESSION['admin_id']) || !$_SESSION['admin_id']) {
        return null;
    }
    return [
        'id'    => (int) $_SESSION['admin_id'],
        'email' => $_SESSION['admin_email'] ?? '',
        'name'  => $_SESSION['admin_name'] ?? 'Admin',
    ];
}

/**
 * Attempt login; set session and return true on success.
 */
function admin_login(PDO $pdo, $email, $password) {
    $email = trim($email);
    if (!$email || !$password) {
        return false;
    }
    $st = $pdo->prepare('SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    $user = $st->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        return false;
    }
    $_SESSION['admin_id']    = (int) $user['id'];
    $_SESSION['admin_email'] = $user['email'];
    $_SESSION['admin_name']  = $user['name'] ?: 'Admin';
    return true;
}

/**
 * Logout (destroy session).
 */
function admin_logout() {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}
