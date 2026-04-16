# Proyecto Desarrollo de Software VII - Grupo DS7

¡Bienvenidos al repositorio oficial de nuestro equipo! 
Aquí trabajaremos la interfaz gráfica con HTML5, CSS3, Bootstrap 5 y la lógica con PHP Orientado a Objetos.

---

## 🚀 Guía para Clonar y Configurar tu Rama

Para mantener nuestro código ordenado y evitar conflictos, **nadie debe trabajar directamente en la rama principal (`main`)**. Sigue estos pasos para configurar tu entorno local y crear tu propia rama de trabajo:

### Paso 1: Abrir la terminal
Abre tu terminal (puede ser la de Windows o la integrada de Visual Studio Code). Recuerda que debes estar ubicado en la carpeta raíz de tu servidor local (`htdocs` si usas XAMPP o `www` si usas AppServ).

### Paso 2: Clonar el repositorio
Ejecuta el siguiente comando para descargar el proyecto en tu computadora:

    git clone https://github.com/AlexisJ31/grupoDS7.git

### Paso 3: Entrar al proyecto
Una vez que termine de descargar, entra a la carpeta que se acaba de crear:

    cd grupoDS7

### Paso 4: Crear tu propia rama (Branch)
Para crear tu propia rama y moverte a ella automáticamente, ejecuta este comando pero **poniendo tu nombre sin espacios** (puedes usar guiones):

    git checkout -b tu-nombre
    
*(Ejemplo: `git checkout -b juan-perez`)*

### Paso 5: Subir tu rama a GitHub
En este momento, tu rama solo existe en tu computadora. Para que los demás podamos verla en GitHub, debes publicarla ejecutando:

    git push -u origin tu-nombre

*(Ejemplo: `git push -u origin juan-perez`)*

---

🎉 **¡Y listo!** Ya estás configurado. Todo el código que escribas y guardes a partir de ahora estará aislado en tu propia rama. 

**Nota:** Cuando termines una tarea y quieras agregarla al proyecto final, avísale al administrador para hacer un *Pull Request*.
