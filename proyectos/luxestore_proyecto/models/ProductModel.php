<?php
require_once __DIR__ . '/../config/database.php';

class ProductModel {
    private $db;

    public function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->db = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (PDOException $e) {
            throw new Exception("Error de conexión PDO: " . $e->getMessage());
        }
    }

    public function getAllProducts() {
        // Hacemos un JOIN con categorías para que los filtros funcionen
        $query = "SELECT p.*, c.slug as categoria_slug 
                  FROM productos p 
                  JOIN categorias c ON p.categoria_id = c.id";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
