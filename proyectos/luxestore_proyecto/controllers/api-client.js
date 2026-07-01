/* ============================================================
 * LUXE STORE — API CLIENT
 * ------------------------------------------------------------
 * Capa única de acceso a datos del dashboard.
 *
 * USO PARA ALEXIS (backend / API):
 *   1) Cambiar  USE_MOCK = false
 *   2) Ajustar  API_BASE  con la URL real (ej: '/api' o 'http://localhost/luxe/api')
 *   3) Confirmar que los endpoints en ENDPOINTS devuelven el shape JSON
 *      descrito en el bloque "CONTRATO DE DATOS" más abajo.
 *
 * Los métodos de DashboardAPI siempre devuelven una Promise<JSON>
 * con el mismo shape, sin importar si la fuente es MOCK o real.
 * ============================================================ */

const USE_MOCK = false;                // ← Alexis: CONECTADO A API PHP
const API_BASE = '../../api/dashboard.php?endpoint='; // ← Ruta a la API interna

const ENDPOINTS = {
  kpis:        'kpis',          // GET ?range=30
  salesSeries: 'sales-series',  // GET ?range=30
  byCategory:  'sales-by-category',
  topProducts: 'top-products',  // GET ?limit=5
  lowStock:    'low-stock',
  newUsers:    'new-users',     // GET ?range=30 (agrupado semanal)
  orders:      'orders',        // GET ?limit=10
  messages:    'messages',
};

/* ============================================================
 * CONTRATO DE DATOS (lo que cada endpoint debe devolver)
 * ------------------------------------------------------------
 * GET /dashboard/kpis?range=30 →
 *   { revenue:Number, orders:Number, aov:Number, users:Number,
 *     products:Number, sale:Number,
 *     deltas:{ revenue:%, orders:%, aov:%, users:%, products:%, sale:% } }
 *
 * GET /dashboard/sales-series?range=30 →
 *   { labels:[ "2026-06-01", ... ], values:[ 1240.50, ... ] }
 *
 * GET /dashboard/sales-by-category →
 *   { labels:["Mujer","Hombre","Accesorios"], values:[3200,2100,1450] }
 *
 * GET /dashboard/top-products?limit=5 →
 *   { labels:["Trench Coat Camel", ...], values:[ 42, 31, ... ] }
 *
 * GET /dashboard/low-stock →
 *   { labels:["Bolso Piel Topo", ...], values:[ 3, 5, ... ] }
 *
 * GET /dashboard/new-users?range=30 →
 *   { labels:["Sem 22","Sem 23",...], values:[ 12, 18, ... ] }
 *
 * GET /dashboard/orders?limit=10 →
 *   [ { id:"#1042", customer:"María G.", date:"2026-06-28",
 *       total:189.99, status:"paid" }, ... ]
 *   status ∈ { pending, paid, shipped, delivered, canceled }
 * ============================================================ */

const DashboardAPI = {
  source: () => USE_MOCK ? 'MOCK' : 'API',

  async _get(path, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = `${API_BASE}${path}${qs ? '&' + qs : ''}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
    return res.json();
  },

  kpis(range = 30) {
    return USE_MOCK ? Promise.resolve(MOCK.kpis(range))
                    : this._get(ENDPOINTS.kpis, { range });
  },
  salesSeries(range = 30) {
    return USE_MOCK ? Promise.resolve(MOCK.salesSeries(range))
                    : this._get(ENDPOINTS.salesSeries, { range });
  },
  salesByCategory() {
    return USE_MOCK ? Promise.resolve(MOCK.byCategory())
                    : this._get(ENDPOINTS.byCategory);
  },
  topProducts(limit = 5) {
    return USE_MOCK ? Promise.resolve(MOCK.topProducts(limit))
                    : this._get(ENDPOINTS.topProducts, { limit });
  },
  lowStock() {
    return USE_MOCK ? Promise.resolve(MOCK.lowStock())
                    : this._get(ENDPOINTS.lowStock);
  },
  newUsers(range = 30) {
    return USE_MOCK ? Promise.resolve(MOCK.newUsers(range))
                    : this._get(ENDPOINTS.newUsers, { range });
  },
  orders(limit = 10) {
    return USE_MOCK ? Promise.resolve(MOCK.orders(limit))
                    : this._get(ENDPOINTS.orders, { limit });
  },
  messages(limit = 10) {
    return USE_MOCK ? Promise.resolve(MOCK.messages(limit))
                    : this._get(ENDPOINTS.messages, { limit });
  }
};

/* ============================================================
 * MOCK DATA — sólo se usa mientras USE_MOCK = true.
 * Inspirado en luxestoreog/ecommerce/js/products.js
 * ============================================================ */
const MOCK = (() => {
  const products = [
    { id:1,  name:"Blazer Clásico Beige",    category:"mujer",      price:189.99 },
    { id:2,  name:"Vestido Midi Floral",     category:"mujer",      price:145.00 },
    { id:3,  name:"Camisa Lino Premium",     category:"hombre",     price:98.00  },
    { id:4,  name:"Pantalón Chino Slim",     category:"hombre",     price:112.50 },
    { id:5,  name:"Bolso Piel Topo",         category:"accesorios", price:265.00 },
    { id:6,  name:"Cinturón Reversible",     category:"accesorios", price:75.00  },
    { id:7,  name:"Trench Coat Camel",       category:"mujer",      price:320.00 },
    { id:8,  name:"Jersey Merino Azul",      category:"hombre",     price:134.00 },
    { id:9,  name:"Gafas Redondas Oro",      category:"accesorios", price:89.00  },
    { id:10, name:"Falda Plisada Midi",      category:"mujer",      price:95.00  },
    { id:11, name:"Loafers Cuero Negro",     category:"hombre",     price:210.00 },
    { id:12, name:"Pañuelo Seda Estampado",  category:"accesorios", price:55.00  },
  ];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const fmtDate = d => d.toISOString().slice(0, 10);

  return {
    kpis(range) {
      const factor = range / 30;
      return {
        revenue: +(28450 * factor).toFixed(2),
        orders:  Math.round(186 * factor),
        aov:     153.20,
        users:   412,
        products: products.length,
        sale: 4,
        deltas: {
          revenue: '+12.4%', orders: '+8.1%', aov: '+3.9%',
          users: '+5.6%', products: '0%', sale: '+1'
        }
      };
    },
    salesSeries(range) {
      const labels = [], values = [];
      const today = new Date();
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        labels.push(fmtDate(d));
        values.push(rand(400, 1800));
      }
      return { labels, values };
    },
    byCategory() {
      return {
        labels: ['Mujer', 'Hombre', 'Accesorios'],
        values: [12450, 8930, 7070]
      };
    },
    topProducts(limit) {
      const sorted = [...products]
        .map(p => ({ name: p.name, sold: rand(8, 60) }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, limit);
      return {
        labels: sorted.map(p => p.name),
        values: sorted.map(p => p.sold)
      };
    },
    lowStock() {
      const picks = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
      return {
        labels: picks.map(p => p.name),
        values: picks.map(() => rand(1, 8))
      };
    },
    newUsers(range) {
      const weeks = Math.max(4, Math.round(range / 7));
      const labels = [], values = [];
      for (let i = weeks; i >= 1; i--) {
        labels.push(`Sem -${i}`);
        values.push(rand(6, 28));
      }
      return { labels, values };
    },
    orders(limit) {
      const customers = ['María G.', 'Carlos R.', 'Ana P.', 'Luis F.', 'Sofía M.',
                         'Diego L.', 'Valeria S.', 'Andrés C.', 'Camila V.', 'Jorge H.'];
      const statuses = ['pending', 'paid', 'shipped', 'delivered', 'canceled'];
      const today = new Date();
      return Array.from({ length: limit }, (_, i) => {
        const d = new Date(today); d.setDate(today.getDate() - i);
        return {
          id: `#${1000 + (limit - i)}`,
          customer: customers[i % customers.length],
          date: fmtDate(d),
          total: +(rand(55, 450) + Math.random()).toFixed(2),
          status: statuses[rand(0, statuses.length - 1)]
        };
      });
    },
    messages(limit) {
      return Array.from({ length: limit }, (_, i) => ({
        id: i + 1,
        nombre: 'Usuario Mock ' + i,
        email: 'mock@correo.com',
        asunto: 'Consulta mock',
        mensaje: 'Este es un mensaje de prueba',
        fecha: '2026-06-30 14:00'
      }));
    }
  };
})();
