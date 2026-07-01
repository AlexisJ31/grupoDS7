<?php
require_once __DIR__ . '/../models/ProductModel.php';

class ProductController {
    public function handleRequest() {
        header('Content-Type: application/json');

        try {
            $model = new ProductModel();
            $products = $model->getAllProducts();
            
            // Formatear respuesta
            echo json_encode([
                'success' => true,
                'data' => $products
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error BD: ' . $e->getMessage()
            ]);
        }
        exit;
    }
}

// Inicializar automáticamente si se llama directo por AJAX
if (basename($_SERVER['PHP_SELF']) == 'ProductController.php') {
    $controller = new ProductController();
    $controller->handleRequest();
}
