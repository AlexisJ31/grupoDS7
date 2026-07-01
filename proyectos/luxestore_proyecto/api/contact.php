<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['success' => false, 'error' => 'Método no permitido']); exit;
}

require_once __DIR__ . '/models/Database.php';

try {
    $db = Database::getConnection();
    
    // El frontend puede enviar como JSON o como Form Data
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }
    
    $nombre = $input['nombre'] ?? '';
    $email = $input['email'] ?? '';
    $asunto = $input['asunto'] ?? 'Sin Asunto';
    $mensaje = $input['mensaje'] ?? '';

    if (empty($nombre) || empty($email) || empty($mensaje)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios.']);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO mensajes_contacto (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)");
    $stmt->execute([$nombre, $email, $asunto, $mensaje]);

    echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error del servidor: ' . $e->getMessage()]);
}
