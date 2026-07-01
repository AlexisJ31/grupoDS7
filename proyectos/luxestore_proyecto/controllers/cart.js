const CART_KEY = 'luxe_cart';

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  actualizarContadorCarrito();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function agregarAlCarrito(producto) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === producto.id);
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({
      id: producto.id,
      name: producto.name,
      price: producto.price,
      imagen: producto.imagen || '',
      qty: 1,
    });
  }
  saveCart(cart);
  mostrarToast(`✓ ${producto.name} añadido al carrito`);
}

function eliminarDelCarrito(productId) {
  let cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderizarCarrito();
}

function actualizarCantidad(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
    renderizarCarrito();
  }
}

function vaciarCarrito() {
  saveCart([]);
  renderizarCarrito();
}

function actualizarContadorCarrito() {
  document.querySelectorAll('.cart-count').forEach(el => {
    const count = getCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? 'inline' : 'none';
  });
}

function mostrarToast(mensaje) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

async function finalizarCompra() {
  const token = typeof getAuthToken !== 'undefined' ? getAuthToken() : 'mock-token';
  
  /* TEMPORALMENTE DESHABILITADO PARA PERMITIR COMPRAS DE PRUEBA
  if (!token) {
    mostrarToast('Debes iniciar sesión para comprar');
    window.location.href = 'login.html';
    return;
  }
  */

  const items = getCart().map(item => ({ id: item.id, qty: item.qty }));
  if (items.length === 0) {
    mostrarToast('El carrito está vacío');
    return;
  }
  try {
    const res = await fetch('../../api/checkout.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, items }),
    });
    const json = await res.json();
    if (json.success) {
      vaciarCarrito();
      alert('🎉 ¡Pago exitoso! Tu compra ha sido registrada en el sistema.\n\nGracias por confiar en LUXE STORE.');
      window.location.href = '../index.html';
    } else {
      mostrarToast('✗ ' + (json.error || 'Error al procesar la compra'));
    }
  } catch {
    mostrarToast('✗ Error de conexión con el servidor');
  }
}

function renderizarCarrito() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const emptyEl = document.getElementById('cart-empty');
  if (!container) return;
  const items = getCart();
  if (items.length === 0) {
    container.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  container.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>$${item.price.toFixed(2)}</span>
      </div>
      <div class="cart-item-qty">
        <button onclick="actualizarCantidad(${item.id}, ${item.qty - 1})">−</button>
        <span>${item.qty}</span>
        <button onclick="actualizarCantidad(${item.id}, ${item.qty + 1})">+</button>
      </div>
      <div class="cart-item-subtotal">$${(item.price * item.qty).toFixed(2)}</div>
      <button class="cart-item-remove" onclick="eliminarDelCarrito(${item.id})">✕</button>
    </div>
  `).join('');
  if (totalEl) totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();
  renderizarCarrito();
});
