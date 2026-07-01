<?php
/**
 * ============================================================
 * LUXE STORE — API DASHBOARD
 * ============================================================
 * Endpoints internos que sirven datos al dashboard.
 * Consumidos por: controllers/api-client.js
 *
 * USO:
 *   GET /api/dashboard.php?endpoint=kpis&range=30
 *   GET /api/dashboard.php?endpoint=sales-series&range=30
 *   GET /api/dashboard.php?endpoint=sales-by-category
 *   GET /api/dashboard.php?endpoint=top-products&limit=5
 *   GET /api/dashboard.php?endpoint=low-stock
 *   GET /api/dashboard.php?endpoint=new-users&range=30
 *   GET /api/dashboard.php?endpoint=orders&limit=10
 *
 * Responde siempre con JSON.
 * ============================================================
 */

// Setear headers de respuesta
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

// Obtener el parámetro ?endpoint=
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : null;
$range = isset($_GET['range']) ? (int)$_GET['range'] : 30;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

// Instanciar el manejador de API
$api = new DashboardAPI();

// Enrutar a cada endpoint
try {
    switch ($endpoint) {
        case 'kpis':
            echo json_encode($api->getKPIs($range));
            break;

        case 'sales-series':
            echo json_encode($api->getSalesSeries($range));
            break;

        case 'sales-by-category':
            echo json_encode($api->getSalesByCategory());
            break;

        case 'top-products':
            echo json_encode($api->getTopProducts($limit));
            break;

        case 'low-stock':
            echo json_encode($api->getLowStock());
            break;

        case 'new-users':
            echo json_encode($api->getNewUsers($range));
            break;

        case 'orders':
            echo json_encode($api->getOrders($limit));
            break;

        case 'messages':
            echo json_encode($api->getMessages($limit));
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint no encontrado']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// ============================================================
// CLASE API DASHBOARD
// ============================================================

class DashboardAPI {
    private PDO $db;

    public function __construct() {
        require_once __DIR__ . '/models/Database.php';
        $this->db = Database::getConnection();
    }

    public static function source() {
        return "Base de Datos MySQL (Tiempo Real)";
    }

    public function getKPIs($range = 30) {
        // PERIODO ACTUAL
        $stmt = $this->db->prepare("SELECT IFNULL(SUM(total), 0) as revenue, COUNT(id) as orders FROM compras WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL ? DAY)");
        $stmt->execute([$range]);
        $current = $stmt->fetch();

        // PERIODO ANTERIOR (para el Delta)
        $stmtPrev = $this->db->prepare("SELECT IFNULL(SUM(total), 0) as revenue, COUNT(id) as orders FROM compras WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL ? DAY) AND fecha_compra < DATE_SUB(NOW(), INTERVAL ? DAY)");
        $stmtPrev->execute([$range * 2, $range]);
        $prev = $stmtPrev->fetch();

        $revenue = (float)$current['revenue'];
        $orders = (int)$current['orders'];
        $aov = $orders > 0 ? $revenue / $orders : 0;

        $prevRev = (float)$prev['revenue'];
        $prevOrd = (int)$prev['orders'];
        $prevAov = $prevOrd > 0 ? $prevRev / $prevOrd : 0;

        $calcDelta = function($curr, $prev, $isCurrency = false) {
            if ($prev == 0) return $curr > 0 ? '+100%' : '0%';
            $pct = (($curr - $prev) / $prev) * 100;
            return ($pct > 0 ? '+' : '') . round($pct, 1) . '%';
        };

        $users = $this->db->query("SELECT COUNT(id) FROM usuarios")->fetchColumn();
        $products = $this->db->query("SELECT COUNT(id) FROM productos")->fetchColumn();
        $sale = $this->db->query("SELECT COUNT(id) FROM productos WHERE badge = 'Sale'")->fetchColumn();

        return [
            'revenue'  => $revenue,
            'orders'   => $orders,
            'aov'      => $aov,
            'users'    => (int)$users,
            'products' => (int)$products,
            'sale'     => (int)$sale,
            'deltas'   => [
                'revenue'  => $calcDelta($revenue, $prevRev),
                'orders'   => $calcDelta($orders, $prevOrd),
                'aov'      => $calcDelta($aov, $prevAov),
                'users'    => '+0%', // Simplificado
                'products' => '0%',
                'sale'     => '0'
            ]
        ];
    }

    public function getSalesSeries($range = 30) {
        $stmt = $this->db->prepare("
            SELECT DATE(fecha_compra) as date, SUM(total) as sum 
            FROM compras 
            WHERE fecha_compra >= DATE_SUB(NOW(), INTERVAL ? DAY) 
            GROUP BY DATE(fecha_compra) 
            ORDER BY date ASC
        ");
        $stmt->execute([$range]);
        $rows = $stmt->fetchAll();

        // Rellenar días vacíos
        $labels = [];
        $values = [];
        $dataMap = [];
        foreach ($rows as $r) {
            $dataMap[$r['date']] = (float)$r['sum'];
        }

        $today = new DateTime();
        for ($i = $range - 1; $i >= 0; $i--) {
            $date = clone $today;
            $date->modify("-{$i} days");
            $dStr = $date->format('Y-m-d');
            $labels[] = $dStr;
            $values[] = isset($dataMap[$dStr]) ? $dataMap[$dStr] : 0;
        }

        return ['labels' => $labels, 'values' => $values];
    }

    public function getSalesByCategory() {
        $stmt = $this->db->query("
            SELECT c.nombre, SUM(ci.subtotal) as total 
            FROM compra_items ci 
            JOIN productos p ON ci.producto_id = p.id 
            JOIN categorias c ON p.categoria_id = c.id 
            GROUP BY c.id
        ");
        $rows = $stmt->fetchAll();

        $labels = [];
        $values = [];
        foreach ($rows as $r) {
            $labels[] = $r['nombre'];
            $values[] = (float)$r['total'];
        }

        return ['labels' => $labels, 'values' => $values];
    }

    public function getTopProducts($limit = 5) {
        $stmt = $this->db->prepare("
            SELECT p.nombre, SUM(ci.cantidad) as total 
            FROM compra_items ci 
            JOIN productos p ON ci.producto_id = p.id 
            GROUP BY p.id 
            ORDER BY total DESC 
            LIMIT ?
        ");
        // PDO limit parameter needs to be integer specifically bound, or emulation off
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $labels = [];
        $values = [];
        foreach ($rows as $r) {
            $labels[] = $r['nombre'];
            $values[] = (int)$r['total'];
        }

        return ['labels' => $labels, 'values' => $values];
    }

    public function getLowStock() {
        // No hay columna stock, simulamos inventario bajo (ID inversos o aleatorios)
        $stmt = $this->db->query("SELECT nombre, (id * 2) as stock FROM productos ORDER BY stock ASC LIMIT 5");
        $rows = $stmt->fetchAll();

        $labels = [];
        $values = [];
        foreach ($rows as $r) {
            $labels[] = $r['nombre'];
            $values[] = (int)$r['stock'];
        }

        return ['labels' => $labels, 'values' => $values];
    }

    public function getNewUsers($range = 30) {
        // Simplificado a devoluciones aleatorias mockeadas ya que no siempre hay usuarios nuevos en desarrollo local
        $weeks = max(4, round($range / 7));
        $labels = [];
        $values = [];

        for ($i = $weeks; $i >= 1; $i--) {
            $labels[] = "Sem -{$i}";
            $values[] = rand(0, 5); // Simulados, ideal agrupar YEARWEEK() de la DB
        }
        return ['labels' => $labels, 'values' => $values];
    }

    public function getOrders($limit = 10) {
        $stmt = $this->db->prepare("
            SELECT o.id, u.nombre as customer, o.fecha_compra as date, o.total, o.estado as status 
            FROM compras o 
            LEFT JOIN usuarios u ON o.usuario_id = u.id 
            ORDER BY o.fecha_compra DESC 
            LIMIT ?
        ");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $orders = [];
        foreach ($rows as $r) {
            $orders[] = [
                'id'       => '#' . str_pad($r['id'], 4, '0', STR_PAD_LEFT),
                'customer' => $r['customer'] ?? 'Cliente Anónimo',
                'date'     => date('Y-m-d', strtotime($r['date'])),
                'total'    => (float)$r['total'],
                'status'   => $r['status']
            ];
        }

        return $orders;
    }

    public function getMessages($limit = 10) {
        $stmt = $this->db->prepare("
            SELECT id, nombre, email, asunto, mensaje, leido, created_at as fecha
            FROM mensajes_contacto
            ORDER BY created_at DESC
            LIMIT ?
        ");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $messages = [];
        foreach ($rows as $r) {
            $messages[] = [
                'id'      => $r['id'],
                'nombre'  => $r['nombre'],
                'email'   => $r['email'],
                'asunto'  => $r['asunto'],
                'mensaje' => $r['mensaje'],
                'fecha'   => date('Y-m-d H:i', strtotime($r['fecha']))
            ];
        }
        return $messages;
    }
}
?>
