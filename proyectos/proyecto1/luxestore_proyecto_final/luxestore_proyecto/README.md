# LUXE STORE – Proyecto N°1 Desarrollo de Software VII

## Estructura del proyecto

```
luxestore_proyecto/
├── index.html              ← Página principal (Inicio)
├── luxestore_logo.svg      ← Logo oficial de la marca
├── css/
│   └── style.css           ← Hoja de estilos principal + responsive
├── js/
│   └── main.js             ← JS mínimo: navbar scroll + menú móvil + animaciones
├── img/                    ← ⚠️ Carpeta de imágenes (ver abajo)
└── pages/
    ├── tienda.html         ← Página de tienda (productos estáticos)
    ├── nosotros.html       ← Quiénes somos, valores, equipo
    └── contacto.html       ← Formulario de contacto + FAQ + mapa

```

---

## ⚠️ Imágenes requeridas en `/img/`

El sitio usa etiquetas `<img>` reales. Debes agregar tus propias fotos en la carpeta `img/` con estos nombres exactos:

### Productos
| Archivo                             | Descripción                    |
|-------------------------------------|--------------------------------|
| `producto-blazer-beige.jpg`         | Blazer Clásico Beige           |
| `producto-vestido-floral.jpg`       | Vestido Midi Floral            |
| `producto-camisa-lino.jpg`          | Camisa Lino Premium            |
| `producto-pantalon-chino.jpg`       | Pantalón Chino Slim            |
| `producto-bolso-piel.jpg`           | Bolso Piel Topo                |
| `producto-cinturon-reversible.jpg`  | Cinturón Reversible            |
| `producto-trench-camel.jpg`         | Trench Coat Camel              |
| `producto-jersey-merino.jpg`        | Jersey Merino Azul             |
| `producto-gafas-oro.jpg`            | Gafas Redondas Oro             |
| `producto-falda-plisada.jpg`        | Falda Plisada Midi             |
| `producto-loafers-negro.jpg`        | Loafers Cuero Negro            |
| `producto-panuelo-seda.jpg`         | Pañuelo Seda Estampado         |

### Categorías
| Archivo              | Descripción       |
|----------------------|-------------------|
| `cat-mujer.jpg`      | Foto categoría Mujer |
| `cat-hombre.jpg`     | Foto categoría Hombre |
| `cat-accesorios.jpg` | Foto categoría Accesorios |
| `cat-sale.jpg`       | Foto categoría Sale |

### Nosotros
| Archivo                  | Descripción                |
|--------------------------|----------------------------|
| `about-store.jpg`        | Foto interior de la tienda |
| `equipo-valentina.jpg`   | Foto Valentina Ramos       |
| `equipo-andres.jpg`      | Foto Andrés Molina         |
| `equipo-camila.jpg`      | Foto Camila Torres         |

> **Nota:** Si una imagen no existe, el fondo de color del producto seguirá siendo visible gracias al atributo `onerror` y al `background-color` definido en el HTML.

---

## Cumplimiento de requisitos

| Requisito                              | Estado |
|----------------------------------------|--------|
| Etiquetas semánticas HTML5 (`<nav>`, `<section>`, `<article>`, `<aside>`, `<footer>`) | ✅ |
| Logo con `<img src="luxestore_logo.svg">` en navbar y footer | ✅ |
| Sin emojis como placeholders de producto | ✅ |
| Etiquetas `<img>` reales apuntando a `img/` | ✅ |
| Sección "Quiénes somos" en `nosotros.html` | ✅ |
| Menú de navegación funcional entre páginas | ✅ |
| Formulario `<form>` con `<input>` y campos `required` | ✅ |
| Responsive sin frameworks externos (CSS3 puro) | ✅ |
| Cero PHP / lógica dinámica | ✅ |
| Todo el contenido escrito directamente en HTML | ✅ |
