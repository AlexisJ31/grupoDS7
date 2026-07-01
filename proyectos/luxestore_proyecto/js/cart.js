// ===== CARRITO OPTIMIZADO CON AJAX Y MVC =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// Función para agregar al carrito
async function addToCart(productId) {
    try {
        const formData = new FormData();
        formData.append('action', 'add');
        formData.append('product_id', productId);
        formData.append('qty', 1);

        const res = await fetch('../../controllers/CartController.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await res.json();
        if(data.success) {
            showToast('✓ Producto agregado al carrito');
            updateCartUI(); // Actualizar la interfaz
        } else {
            showToast('✗ Error: ' + data.message);
        }
    } catch (error) {
        console.error("Error al agregar al carrito", error);
    }
}

// Actualizar la interfaz del carrito (obtiene los datos del servidor)
async function updateCartUI() {
    try {
        const res = await fetch('../../controllers/CartController.php?action=get');
        const data = await res.json();
        
        if (data.success) {
            const cartItems = data.cart.items;
            const cartTotal = data.cart.total;
            
            // Actualizar contadores
            const count = cartItems.reduce((acc, item) => acc + parseInt(item.cantidad), 0);
            document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
            document.querySelectorAll('#cartTotal').forEach(el => el.textContent = `$${parseFloat(cartTotal).toFixed(2)}`);

            // Pintar items
            const itemsEl = document.getElementById('cartItems');
            if (itemsEl) {
                if (cartItems.length === 0) {
                    itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
                } else {
                    const imageMap = {
                        1: 'Blazer Clásico Beige.jpg',
                        2: 'Vestido Midi Floral.jpg',
                        3: 'Camisa Lino Premium.jpg',
                        4: 'Pantalón Chino Slim.jpg',
                        5: 'Bolso Piel Topo.jpg',
                        6: 'cinturon-reversible.webp',
                        7: 'Trench Coat Camel.webp',
                        8: 'Jersey Merino Azul.jpg',
                        9: 'gafas-oro.jpg',
                        10: 'Falda Plisada Midi.webp',
                        11: 'loafers-negros.jpg',
                        12: 'pañuelo.webp'
                    };

                    itemsEl.innerHTML = cartItems.map(item => {
                        let imgName = imageMap[item.producto_id] || 'default.png';
                        return `
                        <div class="cart-item">
                            <div class="cart-item-img"><img src="../../img/${imgName}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'"></div>
                            <div class="cart-item-info">
                                <h4>${item.nombre}</h4>
                                <p>Cantidad: ${item.cantidad}</p>
                                <div class="cart-item-price">$${(item.precio_unitario * item.cantidad).toFixed(2)}</div>
                                <span class="remove-item" onclick="removeFromCart(${item.id})" style="cursor:pointer; color:red; font-size:0.8rem;">Eliminar</span>
                            </div>
                        </div>
                        `;
                    }).join('');
                }
            }
        }
    } catch (error) {
        console.error("Error cargando el carrito", error);
    }
}

// Eliminar del carrito
async function removeFromCart(cartItemId) {
    try {
        const formData = new FormData();
        formData.append('action', 'remove');
        formData.append('item_id', cartItemId);

        const res = await fetch('../../controllers/CartController.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await res.json();
        if(data.success) {
            updateCartUI();
        }
    } catch (error) {
        console.error("Error al eliminar del carrito", error);
    }
}

function showToast(msg) {
    alert(msg); // Placeholder, reemplaza por tu librería de toasts
}
