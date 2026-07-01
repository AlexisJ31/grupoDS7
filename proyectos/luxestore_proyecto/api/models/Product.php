<?php

require_once __DIR__ . '/Database.php';

class Product
{
    public static function getAll(): array
    {
        $db  = Database::getConnection();
        $stmt = $db->query('
            SELECT p.id, p.nombre AS name, c.slug AS category, p.precio AS price,
                   p.precio_anterior AS oldPrice, p.imagen, p.badge, p.descripcion AS `desc`
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.activo = 1
            ORDER BY p.id
        ');
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $db  = Database::getConnection();
        $stmt = $db->prepare('
            SELECT p.id, p.nombre AS name, c.slug AS category, p.precio AS price,
                   p.precio_anterior AS oldPrice, p.imagen, p.badge, p.descripcion AS `desc`
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = :id AND p.activo = 1
        ');
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
