<?php

// Intentar cargar configuración desde un archivo local .env.ini (que no se sube a GitHub)
$env_file = __DIR__ . '/.env.ini';
$config = [];

if (file_exists($env_file)) {
    $config = parse_ini_file($env_file);
}

// Definir constantes con los valores del INI o con valores por defecto (fallback)
define('DB_HOST', $config['DB_HOST'] ?? '127.0.0.1'); // Fallback estándar 3306
define('DB_NAME', $config['DB_NAME'] ?? 'luxestore');
define('DB_USER', $config['DB_USER'] ?? 'root');
define('DB_PASS', $config['DB_PASS'] ?? '');
define('DB_CHARSET', 'utf8mb4');