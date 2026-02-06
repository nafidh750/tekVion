<?php
require_once __DIR__ . '/../includes/init.php';
require_admin();
$admin = current_admin();

$saved = isset($_GET['saved']) ? (string) $_GET['saved'] : '';
$error = isset($_GET['error']) ? (string) $_GET['error'] : '';

// Load settings into key-value
$settings = [];
$st = $pdo->query('SELECT key_name, value FROM site_settings');
while ($row = $st->fetch()) {
    $settings[$row['key_name']] = $row['value'];
}

// Load hero slides
$heroSlides = $pdo->query('SELECT id, sort_order, title, description FROM hero_slides ORDER BY sort_order')->fetchAll();

// Load services
$services = $pdo->query('SELECT id, sort_order, title, description, image FROM services ORDER BY sort_order')->fetchAll();

// Load testimonials
$testimonials = $pdo->query('SELECT id, sort_order, name, text, image FROM testimonials ORDER BY sort_order')->fetchAll();

// Handle POST (save)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $section = isset($_POST['section']) ? $_POST['section'] : '';
    try {
        if ($section === 'homepage') {
            // Update first hero slide
            $st = $pdo->prepare('UPDATE hero_slides SET title = ?, description = ? WHERE sort_order = 1 LIMIT 1');
            $st->execute([
                isset($_POST['hero_title_1']) ? $_POST['hero_title_1'] : '',
                isset($_POST['hero_desc_1']) ? $_POST['hero_desc_1'] : ''
            ]);
            foreach (['we_do_intro', 'about_intro'] as $k) {
                if (array_key_exists($k, $_POST)) {
                    $st = $pdo->prepare('INSERT INTO site_settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?');
                    $st->execute([$k, $_POST[$k], $_POST[$k]]);
                }
            }
            redirect(base_url('admin/content.php') . '?saved=homepage');
        }
        if ($section === 'settings') {
            $keys = ['address', 'phone', 'email', 'copyright'];
            foreach ($keys as $k) {
                if (array_key_exists($k, $_POST)) {
                    $st = $pdo->prepare('INSERT INTO site_settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?');
                    $st->execute([$k, $_POST[$k], $_POST[$k]]);
                }
            }
            redirect(base_url('admin/content.php') . '?saved=settings#settings');
        }
        if ($section === 'services') {
            $ids = isset($_POST['id']) ? (array) $_POST['id'] : [];
            $titles = isset($_POST['title']) ? (array) $_POST['title'] : [];
            $descs = isset($_POST['description']) ? (array) $_POST['description'] : [];
            $images = isset($_POST['image']) ? (array) $_POST['image'] : [];
            $st = $pdo->prepare('UPDATE services SET title = ?, description = ?, image = ? WHERE id = ?');
            for ($i = 0; $i < count($ids); $i++) {
                if (!empty($ids[$i])) {
                    $st->execute([
                        $titles[$i] ?? '',
                        $descs[$i] ?? '',
                        $images[$i] ?? '',
                        $ids[$i]
                    ]);
                }
            }
            redirect(base_url('admin/content.php') . '?saved=services#services');
        }
        if ($section === 'testimonials') {
            $ids = isset($_POST['id']) ? (array) $_POST['id'] : [];
            $names = isset($_POST['name']) ? (array) $_POST['name'] : [];
            $texts = isset($_POST['text']) ? (array) $_POST['text'] : [];
            $images = isset($_POST['image']) ? (array) $_POST['image'] : [];
            $st = $pdo->prepare('UPDATE testimonials SET name = ?, text = ?, image = ? WHERE id = ?');
            for ($i = 0; $i < count($ids); $i++) {
                if (!empty($ids[$i])) {
                    $st->execute([
                        $names[$i] ?? '',
                        $texts[$i] ?? '',
                        $images[$i] ?? '',
                        $ids[$i]
                    ]);
                }
            }
            redirect(base_url('admin/content.php') . '?saved=testimonials#testimonials');
        }
    } catch (Exception $e) {
        redirect(base_url('admin/content.php') . '?error=' . urlencode($e->getMessage()));
    }
}

$get = function ($key, $default = '') use ($settings) {
    return isset($settings[$key]) ? $settings[$key] : $default;
};
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Content – <?= e(SITE_NAME) ?> CMS</title>
	<link rel="stylesheet" href="<?= e(base_url('css/bootstrap.min.css')) ?>">
	<link rel="stylesheet" href="<?= e(base_url('admin/css/admin.css')) ?>">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
	<div class="admin-wrap">
		<aside class="admin-sidebar" id="adminSidebar">
			<div class="admin-logo">
				<a href="<?= e(base_url('admin/index.php')) ?>">
					<img src="<?= e(base_url('images/Tekvion.svg')) ?>" alt="<?= e(SITE_NAME) ?>" class="admin-logo-icon">
					<span class="admin-logo-text"><?= e(SITE_NAME) ?> CMS</span>
				</a>
			</div>
			<nav class="admin-nav">
				<div class="admin-nav-section">
					<p class="admin-nav-section-title">Main</p>
					<a href="<?= e(base_url('admin/index.php')) ?>" class="admin-nav-link"><i class="fa fa-dashboard"></i><span class="admin-nav-text">Dashboard</span></a>
					<a href="<?= e(base_url('admin/content.php')) ?>" class="admin-nav-link active"><i class="fa fa-edit"></i><span class="admin-nav-text">Content</span></a>
					<a href="<?= e(base_url('admin/content.php')) ?>#services" class="admin-nav-link"><i class="fa fa-th-large"></i><span class="admin-nav-text">Services</span></a>
					<a href="<?= e(base_url('admin/content.php')) ?>#testimonials" class="admin-nav-link"><i class="fa fa-quote-left"></i><span class="admin-nav-text">Testimonials</span></a>
				</div>
				<div class="admin-nav-section">
					<p class="admin-nav-section-title">Site</p>
					<a href="<?= e(base_url('admin/content.php')) ?>#settings" class="admin-nav-link"><i class="fa fa-cog"></i><span class="admin-nav-text">Settings</span></a>
					<a href="<?= e(base_url('index.html')) ?>" class="admin-nav-link" target="_blank"><i class="fa fa-external-link"></i><span class="admin-nav-text">View site</span></a>
				</div>
			</nav>
		</aside>
		<main class="admin-main">
			<header class="admin-topbar">
				<div class="admin-topbar-left">
					<button type="button" class="admin-sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar"><i class="fa fa-bars"></i></button>
					<h1 class="admin-page-title">Content</h1>
				</div>
				<div class="admin-topbar-right">
					<div class="admin-user-menu" id="userMenu">
						<div class="admin-user-avatar"><?= e(strtoupper(substr($admin['name'], 0, 1))) ?></div>
						<div class="admin-user-info">
							<span class="admin-user-name"><?= e($admin['name']) ?></span>
							<span class="admin-user-role">Administrator</span>
						</div>
						<i class="fa fa-chevron-down" style="font-size:12px; color:var(--admin-text-muted);"></i>
						<div class="admin-user-dropdown" id="userDropdown">
							<a href="<?= e(base_url('admin/content.php')) ?>#settings"><i class="fa fa-cog"></i> Settings</a>
							<a href="<?= e(base_url('index.html')) ?>" target="_blank"><i class="fa fa-external-link"></i> View site</a>
							<div class="divider"></div>
							<a href="<?= e(base_url('admin/logout.php')) ?>" id="adminLogout"><i class="fa fa-sign-out"></i> Log out</a>
						</div>
					</div>
				</div>
			</header>
			<div class="admin-content">
				<?php if ($saved): ?>
					<div class="admin-alert admin-alert-success">Saved successfully.</div>
				<?php endif; ?>
				<?php if ($error): ?>
					<div class="admin-alert admin-alert-error"><?= e($error) ?></div>
				<?php endif; ?>
				<div class="admin-tabs">
					<button type="button" class="admin-tab active" data-tab="homepage">Homepage</button>
					<button type="button" class="admin-tab" data-tab="services">Services</button>
					<button type="button" class="admin-tab" data-tab="testimonials">Testimonials</button>
					<button type="button" class="admin-tab" data-tab="settings">Settings</button>
				</div>

				<!-- Homepage -->
				<div id="homepage" class="admin-tab-pane active">
					<div class="admin-card">
						<div class="admin-card-header"><h2 class="admin-card-title">Hero / Banner (slide 1)</h2></div>
						<div class="admin-card-body">
							<form method="post" action="">
								<input type="hidden" name="section" value="homepage">
								<?php
								$h1 = $heroSlides[0] ?? null;
								$heroTitle1 = $h1 ? $h1['title'] : $get('hero_title_1', 'Innovating with AI & Cloud');
								$heroDesc1 = $h1 ? $h1['description'] : $get('hero_desc_1', 'We deliver AI, cloud and automation solutions...');
								?>
								<div class="admin-form-group">
									<label>Slide 1 – Title</label>
									<input type="text" name="hero_title_1" value="<?= e($heroTitle1) ?>" placeholder="Innovating with AI & Cloud">
								</div>
								<div class="admin-form-group">
									<label>Slide 1 – Description</label>
									<textarea name="hero_desc_1" rows="3" placeholder="We deliver AI, cloud..."><?= e($heroDesc1) ?></textarea>
								</div>
								<div class="admin-form-group">
									<label>What we do – Intro</label>
									<textarea name="we_do_intro" rows="2"><?= e($get('we_do_intro')) ?></textarea>
								</div>
								<div class="admin-form-group">
									<label>About – Intro</label>
									<textarea name="about_intro" rows="3"><?= e($get('about_intro')) ?></textarea>
								</div>
								<button type="submit" class="admin-btn admin-btn-primary">Save homepage</button>
							</form>
						</div>
					</div>
				</div>

				<!-- Services -->
				<div id="services" class="admin-tab-pane">
					<div class="admin-card">
						<div class="admin-card-header"><h2 class="admin-card-title">Services</h2></div>
						<div class="admin-card-body">
							<form method="post" action="">
								<input type="hidden" name="section" value="services">
								<?php foreach ($services as $i => $s): ?>
									<div style="margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid var(--admin-border);">
										<div class="admin-form-group">
											<label>Service <?= $i + 1 ?> – Title</label>
											<input type="hidden" name="id[]" value="<?= (int)$s['id'] ?>">
											<input type="text" name="title[]" value="<?= e($s['title']) ?>">
										</div>
										<div class="admin-form-group">
											<label>Description</label>
											<textarea name="description[]" rows="2"><?= e($s['description']) ?></textarea>
										</div>
										<div class="admin-form-group">
											<label>Image path</label>
											<input type="text" name="image[]" value="<?= e($s['image']) ?>" placeholder="images/...">
										</div>
									</div>
								<?php endforeach; ?>
								<button type="submit" class="admin-btn admin-btn-primary">Save all services</button>
							</form>
						</div>
					</div>
				</div>

				<!-- Testimonials -->
				<div id="testimonials" class="admin-tab-pane">
					<div class="admin-card">
						<div class="admin-card-header"><h2 class="admin-card-title">Testimonials</h2></div>
						<div class="admin-card-body">
							<form method="post" action="">
								<input type="hidden" name="section" value="testimonials">
								<?php foreach ($testimonials as $i => $t): ?>
									<div style="margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid var(--admin-border);">
										<div class="admin-form-group">
											<label>Testimonial <?= $i + 1 ?> – Name</label>
											<input type="hidden" name="id[]" value="<?= (int)$t['id'] ?>">
											<input type="text" name="name[]" value="<?= e($t['name']) ?>">
										</div>
										<div class="admin-form-group">
											<label>Quote</label>
											<textarea name="text[]" rows="3"><?= e($t['text']) ?></textarea>
										</div>
										<div class="admin-form-group">
											<label>Image path</label>
											<input type="text" name="image[]" value="<?= e($t['image']) ?>">
										</div>
									</div>
								<?php endforeach; ?>
								<button type="submit" class="admin-btn admin-btn-primary">Save all testimonials</button>
							</form>
						</div>
					</div>
				</div>

				<!-- Settings -->
				<div id="settings" class="admin-tab-pane">
					<div class="admin-card">
						<div class="admin-card-header"><h2 class="admin-card-title">Contact / Company info</h2></div>
						<div class="admin-card-body">
							<form method="post" action="">
								<input type="hidden" name="section" value="settings">
								<div class="admin-form-group">
									<label>Address</label>
									<input type="text" name="address" value="<?= e($get('address')) ?>">
								</div>
								<div class="admin-form-group">
									<label>Phone</label>
									<input type="text" name="phone" value="<?= e($get('phone')) ?>">
								</div>
								<div class="admin-form-group">
									<label>Email</label>
									<input type="email" name="email" value="<?= e($get('email')) ?>">
								</div>
								<div class="admin-form-group">
									<label>Copyright text</label>
									<input type="text" name="copyright" value="<?= e($get('copyright')) ?>">
								</div>
								<button type="submit" class="admin-btn admin-btn-primary">Save settings</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
	<script src="<?= e(base_url('js/jquery-3.0.0.min.js')) ?>"></script>
	<script src="<?= e(base_url('admin/js/admin.js')) ?>"></script>
	<script>
		// Restore tab from hash
		(function() {
			var hash = window.location.hash.slice(1);
			if (hash) {
				var tab = document.querySelector('.admin-tab[data-tab="' + hash + '"]');
				var pane = document.getElementById(hash);
				if (tab && pane) {
					document.querySelectorAll('.admin-tab').forEach(function(t){ t.classList.remove('active'); });
					document.querySelectorAll('.admin-tab-pane').forEach(function(p){ p.classList.remove('active'); });
					tab.classList.add('active');
					pane.classList.add('active');
				}
			}
		})();
	</script>
</body>
</html>
