<?php
require_once __DIR__ . '/../includes/init.php';

// Already logged in
if (current_admin()) {
    redirect(base_url('admin/index.php'));
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    if (admin_login($pdo, $email, $password)) {
        redirect(base_url('admin/index.php'));
    }
    $error = 'Invalid email or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Admin Login – <?= e(SITE_NAME) ?> CMS</title>
	<link rel="stylesheet" href="<?= e(base_url('css/bootstrap.min.css')) ?>">
	<link rel="stylesheet" href="<?= e(base_url('admin/css/admin.css')) ?>">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body class="admin-login-page">
	<div class="admin-login-card">
		<h1><i class="fa fa-shield" aria-hidden="true"></i> <?= e(SITE_NAME) ?> CMS</h1>
		<p class="subtitle">Sign in to the admin panel</p>
		<?php if ($error): ?>
			<div class="admin-alert admin-alert-error"><?= e($error) ?></div>
		<?php endif; ?>
		<form method="post" action="">
			<div class="admin-form-group">
				<label for="adminEmail">Email</label>
				<input type="email" id="adminEmail" name="email" value="<?= e($_POST['email'] ?? '') ?>" placeholder="admin@tekvion.ae" required autocomplete="email">
			</div>
			<div class="admin-form-group">
				<label for="adminPassword">Password</label>
				<input type="password" id="adminPassword" name="password" placeholder="••••••••" required autocomplete="current-password">
			</div>
			<button type="submit" class="admin-btn admin-btn-primary">
				<i class="fa fa-sign-in" aria-hidden="true"></i> Sign in
			</button>
		</form>
		<p class="admin-form-hint" style="text-align:center; margin-top:20px;">
			<a href="<?= e(base_url('index.html')) ?>" style="color:var(--admin-primary);">← Back to site</a>
		</p>
	</div>
</body>
</html>
