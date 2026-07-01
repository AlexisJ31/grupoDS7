<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Correo y contraseña son obligatorios']);
    exit;
}

try {
    $user = User::login($input['email'], $input['password']);
    
    // Iniciar la sesión de PHP en el servidor y registrar el rol del usuario
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['user_role'] = $user['rol'] ?? 'cliente';
    
    echo json_encode(['success' => true, 'data' => $user]);
} catch (RuntimeException $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error del servidor']);
}
