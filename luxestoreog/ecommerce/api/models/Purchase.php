<?php

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Product.php';

class Purchase
{
    public static function create(int $usuarioId, array $items, ?string $sessionId = null): array
    {
        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $total = 0;
            $lineItems = [];

            foreach ($items as $item) {
                $product = Product::getById((int) $item['id']);
                if (!$product) {
                    throw new RuntimeException("Producto ID {$item['id']} no encontrado");
                }

                $qty       = max(1, (int) ($item['qty'] ?? 1));
                $unitPrice = (float) $product['price'];
                $subtotal  = $unitPrice * $qty;
                $total    += $subtotal;

                $lineItems[] = [
                    'producto_id'      => $product['id'],
                    'nombre_producto'  => $product['name'],
                    'cantidad'         => $qty,
                    'precio_unitario'  => $unitPrice,
                    'subtotal'         => $subtotal,
                ];
            }

            $stmt = $db->prepare('
                INSERT INTO compras (usuario_id, total, estado)
                VALUES (:usuario_id, :total, :estado)
            ');
            $stmt->execute([
                ':usuario_id' => $usuarioId,
                ':total'      => $total,
                ':estado'     => 'confirmado',
            ]);
            $compraId = (int) $db->lastInsertId();

            $stmtItem = $db->prepare('
                INSERT INTO compra_items (compra_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
                VALUES (:compra_id, :producto_id, :nombre_producto, :cantidad, :precio_unitario, :subtotal)
            ');

            foreach ($lineItems as $li) {
                $stmtItem->execute([
                    ':compra_id'       => $compraId,
                    ':producto_id'     => $li['producto_id'],
                    ':nombre_producto' => $li['nombre_producto'],
                    ':cantidad'        => $li['cantidad'],
                    ':precio_unitario' => $li['precio_unitario'],
                    ':subtotal'        => $li['subtotal'],
                ]);
            }

            $db->commit();

            return [
                'compra_id' => $compraId,
                'total'     => $total,
                'fecha'     => date('Y-m-d H:i:s'),
                'items'     => $lineItems,
                'estado'    => 'confirmado',
            ];
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function getByUser(int $usuarioId): array
    {
        $db = Database::getConnection();

        $stmt = $db->prepare('
            SELECT c.id, c.fecha_compra, c.total, c.estado,
                   ci.producto_id, ci.nombre_producto, ci.cantidad, ci.precio_unitario, ci.subtotal
            FROM compras c
            LEFT JOIN compra_items ci ON ci.compra_id = c.id
            WHERE c.usuario_id = :usuario_id
            ORDER BY c.fecha_compra DESC, ci.id ASC
        ');
        $stmt->execute([':usuario_id' => $usuarioId]);
        $rows = $stmt->fetchAll();

        $compras = [];
        foreach ($rows as $row) {
            $cid = $row['id'];
            if (!isset($compras[$cid])) {
                $compras[$cid] = [
                    'id'           => (int) $cid,
                    'fecha_compra' => $row['fecha_compra'],
                    'total'        => (float) $row['total'],
                    'estado'       => $row['estado'],
                    'items'        => [],
                ];
            }
            if ($row['producto_id']) {
                $compras[$cid]['items'][] = [
                    'producto_id'     => (int) $row['producto_id'],
                    'nombre_producto' => $row['nombre_producto'],
                    'cantidad'        => (int) $row['cantidad'],
                    'precio_unitario' => (float) $row['precio_unitario'],
                    'subtotal'        => (float) $row['subtotal'],
                ];
            }
        }

        return array_values($compras);
    }
}
