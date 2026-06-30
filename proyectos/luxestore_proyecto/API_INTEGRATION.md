# LUXE STORE — API Dashboard Integración

## ✅ Archivos Creados

### 1. `api/dashboard.php`
**Ubicación:** `proyectos/luxestore_proyecto/api/dashboard.php`

Archivo principal que implementa todos los endpoints de la API interna del dashboard. Incluye:

- **Clase `DashboardAPI`** con 7 métodos públicos:
  - `getKPIs($range)` → KPIs principales (ingresos, órdenes, usuarios, etc.)
  - `getSalesSeries($range)` → Serie temporal de ventas
  - `getSalesByCategory()` → Ventas por categoría
  - `getTopProducts($limit)` → Productos más vendidos
  - `getLowStock()` → Productos con bajo inventario
  - `getNewUsers($range)` → Nuevos usuarios por semana
  - `getOrders($limit)` → Órdenes recientes

- **Enrutamiento dinámico** mediante parámetro GET `?endpoint=`
- **Headers CORS** ya configurados
- **Manejo de errores** con JSON response
- **Datos MOCK hardcodeados** en arrays PHP (base para cambio futuro a BD real)

## 🔄 Cambios Realizados en api-client.js

**Ubicación:** `proyectos/luxestore_proyecto/controllers/api-client.js`

### Cambios Realizados:

1. **USE_MOCK = false** ✅ ACTIVADO
   - Ahora usa la API PHP real en lugar de datos hardcodeados

2. **API_BASE actualizado:**
   ```javascript
   const API_BASE = '../api/dashboard.php?endpoint=';
   ```
   - Ruta relativa desde `controllers/` hacia `api/dashboard.php`
   - Incluye el parámetro base para los endpoints

3. **ENDPOINTS simplificados:**
   ```javascript
   const ENDPOINTS = {
     kpis:        'kpis',
     salesSeries: 'sales-series',
     byCategory:  'sales-by-category',
     topProducts: 'top-products',
     lowStock:    'low-stock',
     newUsers:    'new-users',
     orders:      'orders',
   };
   ```
   - Ahora solo contienen el nombre del endpoint
   - Se concatenan con API_BASE para construir la URL final

4. **Método _get() ajustado:**
   ```javascript
   const url = `${API_BASE}${path}${qs ? '&' + qs : ''}`;
   ```
   - Cambiado `'?' + qs` por `'&' + qs` (porque API_BASE ya incluye `?endpoint=`)
   - Ejemplo: `../api/dashboard.php?endpoint=kpis&range=30`

## 📦 Carpetas Creadas

1. **`api/`** → Contiene los endpoints PHP
2. **`models/`** → Preparada para futuros modelos de datos (aún vacía)

## 🔗 URLs que Genera

Ahora, cuando se ejecutan desde el dashboard:

```
GET ../api/dashboard.php?endpoint=kpis&range=30
GET ../api/dashboard.php?endpoint=sales-series&range=30
GET ../api/dashboard.php?endpoint=sales-by-category
GET ../api/dashboard.php?endpoint=top-products&limit=5
GET ../api/dashboard.php?endpoint=low-stock
GET ../api/dashboard.php?endpoint=new-users&range=30
GET ../api/dashboard.php?endpoint=orders&limit=10
```

## 📝 Datos Mock Incluidos

Los datos actuales están hardcodeados en PHP (arrays en la clase DashboardAPI):
- **12 productos** de ejemplo (Mujer, Hombre, Accesorios)
- **3 categorías** con ventas mock
- **10 clientes** de ejemplo
- **Números aleatorios** para series de tiempo y stock

## 🔴 TODO: Conexión a Base de Datos Real

Cuando Alexander/Nicolas entreguen la BD, reemplazar en `api/dashboard.php`:

### Líneas que necesitan conexión a BD:

1. **Línea 96** - `$this->products` (Array hardcodeado)
   ```php
   // TODO: Reemplazar con consulta a BD cuando esté lista (tabla productos)
   ```
   **Cambiar por:** SELECT * FROM productos

2. **Línea 125** - `getKPIs()` (Datos mock)
   ```php
   // TODO: Obtener de la BD (tablas: ordenes, clientes, productos, etc.)
   ```
   **Cambiar por:** Consultas a tablas ordenes, clientes, etc.

3. **Línea 149** - `getSalesSeries()` (Datos mock)
   ```php
   // TODO: Obtener de la BD (tabla: ordenes, agrupar por fecha)
   ```
   **Cambiar por:** SELECT SUM(total) FROM ordenes GROUP BY DATE(fecha)

4. **Línea 173** - `getSalesByCategory()` (Datos mock)
   ```php
   // TODO: Obtener de la BD (tabla: ordenes + detalles, agrupar por categoría)
   ```
   **Cambiar por:** SELECT categoria, SUM(cantidad*precio) FROM...

5. **Línea 185** - `getTopProducts()` (Datos mock)
   ```php
   // TODO: Obtener de la BD (tabla: detalles_orden, agrupar y ordenar por cantidad)
   ```

6. **Línea 203** - `getLowStock()` (Datos mock)
   ```php
   // TODO: Obtener de la BD (tabla: inventario, filtrar donde stock < threshold)
   ```

7. **Línea 223** - `getNewUsers()` (Datos mock)
   ```php
   // TODO: Obtener de la BD (tabla: clientes, agrupar por semana)
   ```

8. **Línea 241** - `getOrders()` (Datos mock)
   ```php
   // TODO: Obtener de la BD (tabla: ordenes, ordenar por fecha DESC)
   ```

## ✨ Estado Actual

✅ API funcionando con datos MOCK  
✅ Endpoints listos para consumo desde dashboard.js  
✅ Estructura MVC preparada  
✅ Sin dependencias externas (PHP puro)  
⏳ Esperando BD real para conectar  

## 🧪 Para Probar

1. Acceder a: `http://localhost/xampp/htdocs/desarrollo7/proyectos/grupoDS7/proyectos/luxestore_proyecto/api/dashboard.php?endpoint=kpis`
2. Debería devolver un JSON con los KPIs

## 📋 Resumen

- **Total de archivos creados:** 1 (api/dashboard.php)
- **Total de archivos modificados:** 1 (controllers/api-client.js)
- **Carpetas creadas:** 2 (api/, models/)
- **Estado:** Listo para producción con datos reales (solo falta BD)
