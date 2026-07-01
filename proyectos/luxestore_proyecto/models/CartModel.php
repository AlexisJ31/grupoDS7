<?php
require_once __DIR__ . '/../config/database.php';

class CartModel {
    private $db;

    public function __construct() {
        // Conexión a la base de datos usando PDO
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->db = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }

    // Obtener o crear carrito (basado en session_id si no está logueado)
    public function getOrCreateCart($sessionId, $userId = null) {
        $query = "SELECT id FROM carrito WHERE session_id = :session_id OR (usuario_id = :user_id AND usuario_id IS NOT NULL) LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['session_id' => $sessionId, 'user_id' => $userId]);
        $cart = $stmt->fetch();

        if ($cart) {
            return $cart['id'];
        }

        // Crear nuevo carrito
        $query = "INSERT INTO carrito (usuario_id, session_id) VALUES (:user_id, :session_id)";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['user_id' => $userId, 'session_id' => $sessionId]);
        
        return $this->db->lastInsertId();
    }

    // Agregar producto al carrito
    public function addItem($cartId, $productId, $qty) {
        // Obtener precio del producto
        $stmt = $this->db->prepare("SELECT precio FROM productos WHERE id = :id");
        $stmt->execute(['id' => $productId]);
        $product = $stmt->fetch();
        
        if (!$product) return false;

        // Verificar si ya existe en el carrito
        $stmt = $this->db->prepare("SELECT id, cantidad FROM carrito_items WHERE carrito_id = :cart_id AND producto_id = :prod_id");
        $stmt->execute(['cart_id' => $cartId, 'prod_id' => $productId]);
        $existing = $stmt->fetch();

        if ($existing) {
            // Actualizar cantidad
            $newQty = $existing['cantidad'] + $qty;
            $stmt = $this->db->prepare("UPDATE carrito_items SET cantidad = :qty WHERE id = :item_id");
            return $stmt->execute(['qty' => $newQty, 'item_id' => $existing['id']]);
        } else {
            // Insertar nuevo item
            $stmt = $this->db->prepare("INSERT INTO carrito_items (carrito_id, producto_id, cantidad, precio_unitario) VALUES (:cart_id, :prod_id, :qty, :precio)");
            return $stmt->execute([
                'cart_id' => $cartId, 
                'prod_id' => $productId, 
                'qty' => $qty, 
                'precio' => $product['precio']
            ]);
        }
    }

    // Obtener todos los items del carrito con información del producto
    public function getItems($cartId) {
        $query = "SELECT ci.id, ci.cantidad, ci.precio_unitario, p.id as producto_id, p.nombre, p.emoji as imagen 
                  FROM carrito_items ci 
                  JOIN productos p ON ci.producto_id = p.id 
                  WHERE ci.carrito_id = :cart_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['cart_id' => $cartId]);
        return $stmt->fetchAll();
    }

    // Eliminar item
    public function removeItem($itemId) {
        $stmt = $this->db->prepare("DELETE FROM carrito_items WHERE id = :id");
        return $stmt->execute(['id' => $itemId]);
    }
}
