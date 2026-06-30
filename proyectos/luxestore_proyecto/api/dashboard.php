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

    /**
     * Productos hardcodeados (base para las operaciones mock)
     * TODO: Reemplazar con consulta a BD cuando esté lista (tabla productos)
     */
    private $products = [
        ['id' => 1,  'name' => 'Blazer Clásico Beige',    'category' => 'mujer',      'price' => 189.99],
        ['id' => 2,  'name' => 'Vestido Midi Floral',     'category' => 'mujer',      'price' => 145.00],
        ['id' => 3,  'name' => 'Camisa Lino Premium',     'category' => 'hombre',     'price' => 98.00],
        ['id' => 4,  'name' => 'Pantalón Chino Slim',     'category' => 'hombre',     'price' => 112.50],
        ['id' => 5,  'name' => 'Bolso Piel Topo',         'category' => 'accesorios', 'price' => 265.00],
        ['id' => 6,  'name' => 'Cinturón Reversible',     'category' => 'accesorios', 'price' => 75.00],
        ['id' => 7,  'name' => 'Trench Coat Camel',       'category' => 'mujer',      'price' => 320.00],
        ['id' => 8,  'name' => 'Jersey Merino Azul',      'category' => 'hombre',     'price' => 134.00],
        ['id' => 9,  'name' => 'Gafas Redondas Oro',      'category' => 'accesorios', 'price' => 89.00],
        ['id' => 10, 'name' => 'Falda Plisada Midi',      'category' => 'mujer',      'price' => 95.00],
        ['id' => 11, 'name' => 'Loafers Cuero Negro',     'category' => 'hombre',     'price' => 210.00],
        ['id' => 12, 'name' => 'Pañuelo Seda Estampado',  'category' => 'accesorios', 'price' => 55.00],
    ];

    /**
     * ENDPOINT: kpis
     * Devuelve los KPIs principales del dashboard
     * TODO: Obtener de la BD (tablas: ordenes, clientes, productos, etc.)
     */
    public function getKPIs($range = 30) {
        $factor = $range / 30;

        return [
            'revenue'  => round(28450 * $factor, 2),
            'orders'   => round(186 * $factor),
            'aov'      => 153.20,
            'users'    => 412,
            'products' => count($this->products),
            'sale'     => 4,
            'deltas'   => [
                'revenue'  => '+12.4%',
                'orders'   => '+8.1%',
                'aov'      => '+3.9%',
                'users'    => '+5.6%',
                'products' => '0%',
                'sale'     => '+1'
            ]
        ];
    }

    /**
     * ENDPOINT: sales-series
     * Devuelve una serie de tiempo con ventas por día
     * TODO: Obtener de la BD (tabla: ordenes, agrupar por fecha)
     */
    public function getSalesSeries($range = 30) {
        $labels = [];
        $values = [];
        $today = new DateTime();

        for ($i = $range - 1; $i >= 0; $i--) {
            $date = clone $today;
            $date->modify("-{$i} days");
            $labels[] = $date->format('Y-m-d');
            $values[] = rand(400, 1800);
        }

        return [
            'labels' => $labels,
            'values' => $values
        ];
    }

    /**
     * ENDPOINT: sales-by-category
     * Devuelve ventas totales por categoría
     * TODO: Obtener de la BD (tabla: ordenes + detalles, agrupar por categoría)
     */
    public function getSalesByCategory() {
        return [
            'labels' => ['Mujer', 'Hombre', 'Accesorios'],
            'values' => [12450, 8930, 7070]
        ];
    }

    /**
     * ENDPOINT: top-products
     * Devuelve los productos más vendidos
     * TODO: Obtener de la BD (tabla: detalles_orden, agrupar y ordenar por cantidad)
     */
    public function getTopProducts($limit = 5) {
        $productsToUse = array_slice($this->products, 0, $limit);
        
        $labels = [];
        $values = [];

        foreach ($productsToUse as $product) {
            $labels[] = $product['name'];
            $values[] = rand(8, 60);
        }

        return [
            'labels' => $labels,
            'values' => $values
        ];
    }

    /**
     * ENDPOINT: low-stock
     * Devuelve productos con bajo inventario
     * TODO: Obtener de la BD (tabla: inventario, filtrar donde stock < threshold)
     */
    public function getLowStock() {
        // Mezclar y tomar aleatoriamente
        $productsShuffled = $this->products;
        shuffle($productsShuffled);
        $lowStockProducts = array_slice($productsShuffled, 0, 5);

        $labels = [];
        $values = [];

        foreach ($lowStockProducts as $product) {
            $labels[] = $product['name'];
            $values[] = rand(1, 8);
        }

        return [
            'labels' => $labels,
            'values' => $values
        ];
    }

    /**
     * ENDPOINT: new-users
     * Devuelve nuevos usuarios por semana
     * TODO: Obtener de la BD (tabla: clientes, agrupar por semana)
     */
    public function getNewUsers($range = 30) {
        $weeks = max(4, round($range / 7));
        $labels = [];
        $values = [];

        for ($i = $weeks; $i >= 1; $i--) {
            $labels[] = "Sem -{$i}";
            $values[] = rand(6, 28);
        }

        return [
            'labels' => $labels,
            'values' => $values
        ];
    }

    /**
     * ENDPOINT: orders
     * Devuelve órdenes recientes
     * TODO: Obtener de la BD (tabla: ordenes, ordenar por fecha DESC)
     */
    public function getOrders($limit = 10) {
        $customers = [
            'María G.', 'Carlos R.', 'Ana P.', 'Luis F.', 'Sofía M.',
            'Diego L.', 'Valeria S.', 'Andrés C.', 'Camila V.', 'Jorge H.'
        ];
        $statuses = ['pending', 'paid', 'shipped', 'delivered', 'canceled'];

        $orders = [];
        $today = new DateTime();

        for ($i = 0; $i < $limit; $i++) {
            $date = clone $today;
            $date->modify("-{$i} days");

            $orders[] = [
                'id'       => '#' . (1000 + ($limit - $i)),
                'customer' => $customers[$i % count($customers)],
                'date'     => $date->format('Y-m-d'),
                'total'    => round(rand(55, 450) + (rand(0, 100) / 100), 2),
                'status'   => $statuses[array_rand($statuses)]
            ];
        }

        return $orders;
    }
}
?>
