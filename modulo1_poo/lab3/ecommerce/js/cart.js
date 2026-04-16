// ===== CART SYSTEM =====
let cart = JSON.parse(localStorage.getItem('luxe_cart') || '[]');

function saveCart() {
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`✓ ${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  document.querySelectorAll('#cartTotal').forEach(el => el.textContent = `$${total.toFixed(2)}`);

  const itemsEl = document.getElementById('cartItems');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Cantidad: ${item.qty}</p>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <span class="remove-item" onclick="removeFromCart(${item.id})">Eliminar</span>
      </div>
    </div>
  `).join('');
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

// Init cart on load
document.addEventListener('DOMContentLoaded', updateCartUI);
