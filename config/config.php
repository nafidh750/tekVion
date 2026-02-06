<?php
/**
 * TekVion – Application config
 * Copy to config.local.php and set your values (or use env vars).
 */

// Base path (no trailing slash) – e.g. '' if site is at / or '/tekvion' if in subfolder
define('BASE_PATH', defined('BASE_PATH') ? BASE_PATH : '');

// Site name
define('SITE_NAME', 'Tekvion');

// Timezone
date_default_timezone_set('UTC');

// Error reporting (disable in production)
if (getenv('APP_ENV') === 'production') {
    error_reporting(0);
    ini_set('display_errors', 0);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}
