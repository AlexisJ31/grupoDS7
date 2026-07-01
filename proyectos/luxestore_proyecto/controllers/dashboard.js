/* ============================================================
 * LUXE STORE — DASHBOARD CONTROLLER
 * Renderiza KPIs, gráficos (Chart.js) y tabla de pedidos.
 * Toda la data viene de DashboardAPI (controllers/api-client.js).
 * ============================================================ */

const BRAND = {
  gold:     '#c9a87c',
  goldDark: '#a8855a',
  black:    '#0d0d0d',
  gray:     '#6b6b6b',
  light:    '#f5f2ee',
  palette:  ['#c9a87c', '#0d0d0d', '#a8855a', '#6b6b6b', '#d8c4a0', '#3a3a3a']
};

Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.color = BRAND.gray;
Chart.defaults.borderColor = '#ece6db';

const charts = {};
const fmtMoney = n => '$' + Number(n).toLocaleString('es-PA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt   = n => Number(n).toLocaleString('es-PA');

/* ---------- KPIs ---------- */
async function loadKpis(range) {
  const k = await DashboardAPI.kpis(range);
  setKpi('kpi-revenue',  fmtMoney(k.revenue),  k.deltas.revenue);
  setKpi('kpi-orders',   fmtInt(k.orders),     k.deltas.orders);
  setKpi('kpi-aov',      fmtMoney(k.aov),      k.deltas.aov);
  setKpi('kpi-users',    fmtInt(k.users),      k.deltas.users);
  setKpi('kpi-products', fmtInt(k.products),   k.deltas.products);
  setKpi('kpi-sale',     fmtInt(k.sale),       k.deltas.sale);
}
function setKpi(id, value, delta) {
  const v = document.getElementById(id);
  const d = document.getElementById(id + '-delta');
  if (v) v.textContent = value;
  if (d) {
    d.textContent = delta;
    d.classList.remove('up', 'down');
    if (String(delta).trim().startsWith('+')) d.classList.add('up');
    else if (String(delta).trim().startsWith('-')) d.classList.add('down');
  }
}

/* ---------- CHARTS ---------- */
function destroy(id) { if (charts[id]) { charts[id].destroy(); delete charts[id]; } }

async function loadSalesChart(range) {
  const data = await DashboardAPI.salesSeries(range);
  document.getElementById('sales-period').textContent = `${data.labels[0]} → ${data.labels[data.labels.length - 1]}`;
  destroy('sales');
  const ctx = document.getElementById('chart-sales').getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 260);
  grad.addColorStop(0, 'rgba(201,168,124,0.35)');
  grad.addColorStop(1, 'rgba(201,168,124,0.00)');
  charts.sales = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Ventas',
        data: data.values,
        borderColor: BRAND.gold,
        backgroundColor: grad,
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      }]
    },
    options: chartOpts({ moneyY: true })
  });
}

async function loadCategoryChart() {
  const data = await DashboardAPI.salesByCategory();
  destroy('category');
  charts.category = new Chart(document.getElementById('chart-category'), {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: BRAND.palette,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } } }
    }
  });
}

async function loadTopChart() {
  const data = await DashboardAPI.topProducts(5);
  destroy('top');
  charts.top = new Chart(document.getElementById('chart-top'), {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{ label: 'Unidades', data: data.values, backgroundColor: BRAND.gold, borderRadius: 4 }]
    },
    options: chartOpts({ indexAxis: 'y' })
  });
}

async function loadStockChart() {
  const data = await DashboardAPI.lowStock();
  destroy('stock');
  charts.stock = new Chart(document.getElementById('chart-stock'), {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{ label: 'Stock', data: data.values, backgroundColor: '#b94545', borderRadius: 4 }]
    },
    options: chartOpts({ indexAxis: 'y' })
  });
}

async function loadUsersChart(range) {
  const data = await DashboardAPI.newUsers(range);
  destroy('users');
  charts.users = new Chart(document.getElementById('chart-users'), {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Nuevos usuarios',
        data: data.values,
        borderColor: BRAND.black,
        backgroundColor: 'rgba(13,13,13,0.06)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        fill: true
      }]
    },
    options: chartOpts()
  });
}

function chartOpts({ moneyY = false, indexAxis = 'x' } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: c => moneyY ? fmtMoney(c.parsed.y ?? c.parsed) : fmtInt(c.parsed.y ?? c.parsed.x ?? c.parsed)
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1ebe0' },
        ticks: { callback: v => moneyY ? fmtMoney(v) : v }
      }
    }
  };
}

/* ---------- ORDERS TABLE ---------- */
async function loadOrders() {
  const tbody = document.getElementById('orders-tbody');
  try {
    const orders = await DashboardAPI.orders(10);
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Sin pedidos.</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>${o.date}</td>
        <td>${fmtMoney(o.total)}</td>
        <td><span class="badge badge-${o.status}">${statusLabel(o.status)}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">Error al cargar: ${err.message}</td></tr>`;
  }
}
function statusLabel(s) {
  return ({ pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado',
            delivered: 'Entregado', canceled: 'Cancelado' })[s] || s;
}

/* ---------- MESSAGES TABLE ---------- */
async function loadMessages() {
  const tbody = document.getElementById('messages-tbody');
  if (!tbody) return;
  try {
    const msgs = await DashboardAPI.messages(10);
    if (!msgs || !msgs.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">Sin mensajes.</td></tr>';
      return;
    }
    tbody.innerHTML = msgs.map(m => `
      <tr>
        <td style="white-space:nowrap;">${m.fecha}</td>
        <td><strong>${m.nombre}</strong><br><small style="color:var(--gray)">${m.email}</small></td>
        <td>${m.asunto}</td>
        <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${m.mensaje}">${m.mensaje}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty">Error al cargar: ${err.message}</td></tr>`;
  }
}

/* ---------- INIT ---------- */
async function refreshAll(range) {
  await Promise.all([
    loadKpis(range),
    loadSalesChart(range),
    loadCategoryChart(),
    loadTopChart(),
    loadStockChart(),
    loadUsersChart(range),
    loadOrders(),
    loadMessages()
  ]);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dash-source-tag').innerHTML =
    `Fuente: <strong>${DashboardAPI.source()}</strong>`;

  const sel = document.getElementById('dash-range');
  sel.addEventListener('change', () => refreshAll(parseInt(sel.value, 10)));

  document.querySelectorAll('.dash-nav-item').forEach(a => {
    a.addEventListener('click', e => {
      document.querySelectorAll('.dash-nav-item').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
    });
  });

  refreshAll(parseInt(sel.value, 10)).catch(err => console.error('[dashboard]', err));
});
