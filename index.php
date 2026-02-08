<?php
// Fallback index.php: if index.html is missing for any reason, try to load it or show message.
if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
    exit;
}
echo "TekVion: index.html not found.";
