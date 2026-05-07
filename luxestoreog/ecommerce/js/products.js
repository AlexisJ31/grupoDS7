// ===== PRODUCTS DATABASE =====
const PRODUCTS = [
  { id: 1, name: "Blazer Clásico Beige", category: "mujer", price: 189.99, oldPrice: 239.99, emoji: "🧥", badge: "Sale", desc: "Blazer atemporal de corte estructurado" },
  { id: 2, name: "Vestido Midi Floral", category: "mujer", price: 145.00, oldPrice: null, emoji: "👗", badge: "Nuevo", desc: "Estampado floral en seda natural" },
  { id: 3, name: "Camisa Lino Premium", category: "hombre", price: 98.00, oldPrice: null, emoji: "👔", badge: null, desc: "Lino 100% lavado a la piedra" },
  { id: 4, name: "Pantalón Chino Slim", category: "hombre", price: 112.50, oldPrice: 130.00, emoji: "👖", badge: "Sale", desc: "Corte slim en gabardina premium" },
  { id: 5, name: "Bolso Piel Topo", category: "accesorios", price: 265.00, oldPrice: null, emoji: "👜", badge: "Nuevo", desc: "Piel italiana cosida a mano" },
  { id: 6, name: "Cinturón Reversible", category: "accesorios", price: 75.00, oldPrice: null, emoji: "👜", badge: null, desc: "Cuero genuino reversible negro/marrón" },
  { id: 7, name: "Trench Coat Camel", category: "mujer", price: 320.00, oldPrice: 399.00, emoji: "🧥", badge: "Sale", desc: "Gabardina clásica con detalles dorados" },
  { id: 8, name: "Jersey Merino Azul", category: "hombre", price: 134.00, oldPrice: null, emoji: "🧶", badge: null, desc: "Lana merino superfina extrafina" },
  { id: 9, name: "Gafas Redondas Oro", category: "accesorios", price: 89.00, oldPrice: 110.00, emoji: "🕶️", badge: "Sale", desc: "Montura metálica dorada UV400" },
  { id: 10, name: "Falda Plisada Midi", category: "mujer", price: 95.00, oldPrice: null, emoji: "👗", badge: "Nuevo", desc: "Plisado fino en satén mate" },
  { id: 11, name: "Loafers Cuero Negro", category: "hombre", price: 210.00, oldPrice: null, emoji: "👞", badge: null, desc: "Mocasines artesanales con borla" },
  { id: 12, name: "Pañuelo Seda Estampado", category: "accesorios", price: 55.00, oldPrice: null, emoji: "🎀", badge: "Nuevo", desc: "Seda natural 90x90cm estampado exclusivo" },
];

// ===== RENDER PRODUCT CARD =====
function renderProductCard(product) {
  return `
    <div class="product-card animate">
      <div class="product-img" style="background:${getProductBg(product.category)}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <span>${product.emoji}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            $${product.price.toFixed(2)}
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Agregar</button>
        </div>
      </div>
    </div>
  `;
}

function getProductBg(cat) {
  const map = { mujer: '#f0e8df', hombre: '#e8ede5', accesorios: '#ece7f0' };
  return map[cat] || '#f0f0f0';
}
