<?php
/**
 * TekVion – Contact form handler
 * POST: name, email, phone, message → save to contact_messages, redirect back.
 */
require_once __DIR__ . '/includes/init.php';

$success = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email   = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone   = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    if (!$name || !$email) {
        $error = 'Name and email are required.';
    } else {
        try {
            $st = $pdo->prepare('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)');
            $st->execute([$name, $email, $phone, $message]);
            $success = true;
        } catch (PDOException $e) {
            $error = 'Could not save your message. Please try again or email us directly.';
        }
    }
}

$redirect = isset($_POST['redirect']) ? $_POST['redirect'] : base_url('contact.html');
if ($success) {
    header('Location: ' . $redirect . '?contact=success');
} elseif ($error) {
    header('Location: ' . $redirect . '?contact=error&msg=' . urlencode($error));
} else {
    header('Location: ' . $redirect);
}
exit;
