# Proyecto Desarrollo de Software VII - Grupo DS7

¡Bienvenidos al repositorio oficial de nuestro equipo para la materia de **Desarrollo de Software VII**! 

En este repositorio trabajaremos en conjunto para desarrollar nuestros proyectos y laboratorios, construyendo la interfaz gráfica con **HTML5, CSS3 y Bootstrap 5**, y la lógica del lado del servidor con **PHP Orientado a Objetos (POO)**.

---

## 📂 Estructura del Repositorio

El repositorio está organizado en módulos y carpetas específicas para mantener el código ordenado durante todo el semestre:

* `modulo1_poo/`: Ejercicios y laboratorios sobre Programación Orientada a Objetos en PHP.
* `modulo2_interactividad/`: Prácticas de interactividad, formularios y sesiones.
* `modulo3_persistencia/`: Conexión a bases de datos y operaciones CRUD.
* `modulo4_servicios/`: Consumo y creación de APIs o Servicios Web.
* `proyectos/`: Entregables finales y proyectos completos (Ej. Proyecto 1: Luxe Store).
* `docs/`: Recursos estáticos, assets y prototipos iniciales.

🔗 **Link del Mockup Oficial en Figma (Luxe Store):** [Ver Diseño del Mockup](https://www.figma.com/design/puWfAZfcGl02qB5vP2eJbE/Mockup-LUXE-HOME?node-id=0-1&t=2quxde0LnQAnVwax-1)

---

## 🛠️ Guía de Trabajo con Git para el Equipo

Para mantener el orden en el proyecto y evitar perder código, **NUNCA trabajaremos directamente sobre la rama `main`** (de hecho, está protegida). Cada integrante debe crear su propia rama y luego solicitar que sus cambios se integren mediante un Pull Request.

Aquí tienes el flujo de trabajo oficial:

### 1. Actualiza tu entorno local ANTES de empezar
Siempre que vayas a trabajar, asegúrate de tener la versión más reciente del código:
```bash
git switch main
git pull origin main
```

### 2. Crea tu propia rama de trabajo
Crea una rama con un nombre que describa lo que vas a hacer. Por ejemplo, si vas a programar el inicio de sesión, usa `feat/login`.
```bash
git checkout -b nombre-de-tu-rama
```
*(💡 Tip: Usa prefijos como `feat/` para funciones nuevas o `fix/` para solucionar errores).*

### 3. Trabaja, guarda y sube tus cambios
Escribe tu código, guárdalo y envíalo a tu rama en el repositorio remoto:
```bash
git add .
git commit -m "Agrega una descripción clara de lo que hiciste"
git push -u origin nombre-de-tu-rama
```

### 4. Crea un Pull Request (PR)
Una vez que hayas subido (pusheado) tus cambios:
1. Ve a la página del repositorio en GitHub.
2. Verás un botón verde que dice **"Compare & pull request"**. Haz clic en él.
3. Asegúrate de que la rama base sea `main` y la rama de comparación sea la tuya.
4. Escribe un comentario explicando qué hiciste y haz clic en **"Create pull request"**.
*(⚠️ Importante: Otro compañero del equipo debe revisar tu Pull Request y aprobarlo para que el código se una definitivamente a `main`).*

---

## 🔄 ¿Cómo integrar el código de un compañero al tuyo?

A veces necesitarás usar el código que otro compañero ya subió a su propia rama (por ejemplo, si tu compañero hizo la conexión a la base de datos y tú necesitas hacer las consultas). Para traer su código a tu rama, haz lo siguiente:

1. **Guarda tus cambios:** Asegúrate de no tener archivos sin "commitear" en tu rama actual. Si los tienes, haz un `git add` y `git commit` primero.
2. **Actualiza tu lista de ramas remotas:**
   ```bash
   git fetch origin
   ```
3. **Fusiona (merge) la rama de tu compañero en la tuya:**
   ```bash
   git merge origin/rama-de-tu-companero
   ```
*(Si los dos modificaron exactamente las mismas líneas del mismo archivo, VS Code te avisará que hay un "Conflicto" y tendrás que elegir qué código conservar antes de poder continuar).*

## 🗓️ Cronograma — Proyecto #2

**Semana del miércoles 24 al martes 30 de junio**
Login, dashboard, sistema de roles, carrito de compras y API interna sobre la arquitectura MVC.

### Equipo y responsabilidad principal

| Persona | Responsabilidad principal |
|---|---|
| **Alexis** | Arquitectura MVC, sistema de roles y permisos, API interna del dashboard |
| **Alexander y Nicolas** | Base de datos y tablas, conexión a la BD, carrito de compras |
| **J.J.** | Login + sesión/cookies, apoya en el carrito desde el sábado |
| **Lohnard** | Pantalla de administrador y dashboard |
| **@.** | Logo e identidad visual, apoya en el dashboard desde el jueves |

### Día por día

- **Miércoles 24** — Alexis arranca el MVC y organiza el repo · Alexander/Nicolas crean BD y tablas · J.J. arranca el login · Lohnard arranca el dashboard · @. hace el logo
- **Jueves 25** — Alexis termina el MVC y arranca roles · Alexander/Nicolas conectan la BD · J.J. sigue con login (lógica + sesión) · Lohnard y @. siguen con el dashboard
- **Viernes 26** — Alexis en sistema de roles · Alexander/Nicolas arrancan el carrito · J.J. termina login y conecta sesión real · Lohnard y @. conectan dashboard con roles
- **Sábado 27** — Alexis cierra roles · Alexander, Nicolas y J.J. en el carrito · Lohnard y @. en el dashboard
- **Domingo 28** — Alexis arranca la API interna del dashboard · Alexander, Nicolas y J.J. cierran el carrito · Lohnard y @. dejan el dashboard listo para conectar la API
- **Lunes 29** — Alexis termina la API · Todo el equipo: Pull Requests, revisión cruzada y merge a `main`
- **Martes 30** — Todo el equipo: pruebas finales (login, roles, carrito, dashboard + API) y entrega
