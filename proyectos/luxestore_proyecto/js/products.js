// ===== PRODUCTOS DINÁMICOS Y FILTROS =====
document.addEventListener('DOMContentLoaded', () => {
    let allProducts = [];
    
    // Contenedor de productos
    const productsGrid = document.querySelector('.shop-content .products-grid');
    const countText = document.querySelector('.sort-bar p strong');

    // Elementos de filtros
    const catCheckboxes = document.querySelectorAll('input[name="cat"]');
    const priceRadios = document.querySelectorAll('input[name="price"]');
    const estadoCheckboxes = document.querySelectorAll('input[name="estado"]');

    // 1. Cargar productos desde el backend (DB)
    async function loadProducts() {
        try {
            const res = await fetch('../../controllers/ProductController.php');
            const json = await res.json();
            
            if (json.success) {
                allProducts = json.data;
                renderProducts(allProducts);
            } else {
                alert("Error del Servidor: " + json.message);
                console.error(json.message);
            }
        } catch (error) {
            console.error("Error cargando productos", error);
        }
    }

    // 2. Renderizar productos en el DOM
    function renderProducts(products) {
        if(!productsGrid) return;

        if (countText) countText.textContent = products.length;

        if (products.length === 0) {
            productsGrid.innerHTML = '<h3 style="grid-column: 1/-1; text-align: center; margin-top: 3rem;">No se encontraron productos con estos filtros.</h3>';
            return;
        }

        productsGrid.innerHTML = products.map(p => {
            let badgeHtml = '';
            if (p.badge) {
                badgeHtml = `<span class="product-badge">${p.badge}</span>`;
            }

            let priceHtml = `$${parseFloat(p.precio).toFixed(2)}`;
            if (p.precio_anterior) {
                priceHtml = `<span class="old-price">$${parseFloat(p.precio_anterior).toFixed(2)}</span> ${priceHtml}`;
            }

            // Mapeo exacto de los archivos de imagen existentes en la carpeta img/
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
            
            let imgName = imageMap[p.id] || 'default.png';

            return `
            <article class="product-card" data-cat="${p.categoria_slug}" data-price="${p.precio}" data-badge="${p.badge || ''}">
                <div class="product-img" style="background:#f9f9f9">
                    ${badgeHtml}
                    <img src="../../img/${imgName}" alt="${p.nombre}" onerror="this.style.display='none'" />
                </div>
                <div class="product-info">
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion || ''}</p>
                    <div class="product-footer">
                        <div class="product-price">${priceHtml}</div>
                        <button class="add-to-cart-btn" onclick="addToCart(${p.id})" style="border:none;cursor:pointer;">Agregar</button>
                    </div>
                </div>
            </article>
            `;
        }).join('');
    }

    // 3. Aplicar Filtros
    function filterProducts() {
        // Obtener categorías seleccionadas
        const selectedCats = Array.from(catCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Obtener estados seleccionados (Nuevo / Sale)
        const selectedEstados = Array.from(estadoCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());

        // Obtener precio seleccionado
        const priceFilter = document.querySelector('input[name="price"]:checked').value;

        // Filtrar array principal
        const filtered = allProducts.filter(p => {
            // Filtrar Categoría
            if (!selectedCats.includes(p.categoria_slug)) return false;

            // Filtrar Estado (Badge)
            if (selectedEstados.length > 0) {
                const b = p.badge ? p.badge.toLowerCase() : '';
                // Si el producto no tiene badge y se filtró por estado, lo omitimos (a menos que se quiera otra lógica)
                if (!b || !selectedEstados.includes(b)) return false;
            }

            // Filtrar Precio
            const price = parseFloat(p.precio);
            if (priceFilter === 'low' && price > 100) return false;
            if (priceFilter === 'mid' && (price < 100 || price > 200)) return false;
            if (priceFilter === 'high' && price < 200) return false;

            return true;
        });

        renderProducts(filtered);
    }

    // 4. Asignar Event Listeners a los filtros
    catCheckboxes.forEach(el => el.addEventListener('change', filterProducts));
    priceRadios.forEach(el => el.addEventListener('change', filterProducts));
    estadoCheckboxes.forEach(el => el.addEventListener('change', filterProducts));

    // Inicializar
    if (productsGrid) {
        loadProducts();
    }
});
