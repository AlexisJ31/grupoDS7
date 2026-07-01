<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Purchase.php';

$token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (str_starts_with($token, 'Bearer ')) {
    $token = substr($token, 7);
}

$user = User::validateToken($token);
if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token inválido']);
    exit;
}

try {
    $purchases = Purchase::getByUser((int) $user['id']);
    echo json_encode(['success' => true, 'data' => $purchases]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error del servidor']);
}
