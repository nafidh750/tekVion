<?php
require_once __DIR__ . '/../includes/init.php';
admin_logout();
redirect(base_url('admin/login.php'));
