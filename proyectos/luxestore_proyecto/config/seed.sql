USE luxestore;

-- ===== CATEGORÍAS =====
INSERT INTO categorias (id, nombre, slug, descripcion) VALUES
(1, 'Mujer', 'mujer', 'Moda femenina premium'),
(2, 'Hombre', 'hombre', 'Moda masculina premium'),
(3, 'Accesorios', 'accesorios', 'Complementos y accesorios de lujo')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- ===== PRODUCTOS =====
INSERT INTO productos (id, categoria_id, nombre, descripcion, precio, precio_anterior, imagen, badge) VALUES
(1, 1, 'Blazer Clásico Beige', 'Blazer atemporal de corte estructurado', 189.99, 239.99, 'blazer_beige.png', 'Sale'),
(2, 1, 'Vestido Midi Floral', 'Estampado floral en seda natural', 145.00, NULL, 'vestido_floral.png', 'Nuevo'),
(3, 2, 'Camisa Lino Premium', 'Lino 100% lavado a la piedra', 98.00, NULL, 'camisa_lino.png', NULL),
(4, 2, 'Pantalón Chino Slim', 'Corte slim en gabardina premium', 112.50, 130.00, 'pantalon_chino.png', 'Sale'),
(5, 3, 'Bolso Piel Topo', 'Piel italiana cosida a mano', 265.00, NULL, 'bolso_piel.png', 'Nuevo'),
(6, 3, 'Cinturón Reversible', 'Cuero genuino reversible negro/marrón', 75.00, NULL, 'cinturon.png', NULL),
(7, 1, 'Trench Coat Camel', 'Gabardina clásica con detalles dorados', 320.00, 399.00, 'trench_coat.png', 'Sale'),
(8, 2, 'Jersey Merino Azul', 'Lana merino superfina extrafina', 134.00, NULL, 'jersey_merino.png', NULL),
(9, 3, 'Gafas Redondas Oro', 'Montura metálica dorada UV400', 89.00, 110.00, 'gafas_oro.png', 'Sale'),
(10, 1, 'Falda Plisada Midi', 'Plisado fino en satén mate', 95.00, NULL, 'falda_plisada.png', 'Nuevo'),
(11, 2, 'Loafers Cuero Negro', 'Mocasines artesanales con borla', 210.00, NULL, 'loafers_cuero.png', NULL),
(12, 3, 'Pañuelo Seda Estampado', 'Seda natural 90x90cm estampado exclusivo', 55.00, NULL, 'panuelo_seda.png', 'Nuevo')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
