<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/models/Product.php';

try {
    if (isset($_GET['id'])) {
        $product = Product::getById((int) $_GET['id']);
        if ($product) {
            echo json_encode(['success' => true, 'data' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Producto no encontrado']);
        }
    } else {
        $products = Product::getAll();
        echo json_encode(['success' => true, 'data' => $products]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
