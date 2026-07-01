<?php
require_once __DIR__ . '/../models/CartModel.php';

class CartController {
    private $cartModel;

    public function __construct() {
        $this->cartModel = new CartModel();
        
        // Iniciar sesión si no está iniciada para tener un session_id
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function handleRequest() {
        // Habilitar salida JSON
        header('Content-Type: application/json');

        $action = $_POST['action'] ?? $_GET['action'] ?? 'get';
        $sessionId = session_id();
        $userId = $_SESSION['user_id'] ?? null;

        $cartId = $this->cartModel->getOrCreateCart($sessionId, $userId);

        switch ($action) {
            case 'add':
                $productId = $_POST['product_id'] ?? 0;
                $qty = $_POST['qty'] ?? 1;
                
                if ($this->cartModel->addItem($cartId, $productId, $qty)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'No se pudo agregar al carrito']);
                }
                break;

            case 'remove':
                $itemId = $_POST['item_id'] ?? 0;
                if ($this->cartModel->removeItem($itemId)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'No se pudo eliminar el producto']);
                }
                break;

            case 'get':
            default:
                $items = $this->cartModel->getItems($cartId);
                $total = array_reduce($items, function($carry, $item) {
                    return $carry + ($item['precio_unitario'] * $item['cantidad']);
                }, 0);

                echo json_encode([
                    'success' => true,
                    'cart' => [
                        'items' => $items,
                        'total' => $total
                    ]
                ]);
                break;
        }
        exit;
    }
}

// Inicializar automáticamente si se llama directo por AJAX
if (basename($_SERVER['PHP_SELF']) == 'CartController.php') {
    $cart = new CartController();
    $cart->handleRequest();
}
