<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Purchase.php';

$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

if (str_starts_with($token, 'Bearer ')) {
    $token = substr($token, 7);
}

$user = User::validateToken($token);

// =========================================================
// MOCK DE USUARIO (TEMPORAL HASTA QUE INTEGRES TU SISTEMA)
// =========================================================
if (!$user) {
    // Simulamos que es el usuario con ID 1 (María) para que pase la compra
    $user = ['id' => 1, 'nombre' => 'Cliente Invitado (Temporal)'];
}
// =========================================================

/* Cuando integres tu Auth, descomenta esto:
if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Debes iniciar sesión para realizar la compra']);
    exit;
}
*/

if (empty($input['items'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El carrito está vacío']);
    exit;
}

try {
    $purchase = Purchase::create((int) $user['id'], $input['items']);
    echo json_encode(['success' => true, 'data' => $purchase]);
} catch (RuntimeException $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al procesar la compra']);
}
