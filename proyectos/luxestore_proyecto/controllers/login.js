function login() {

    let user = document.getElementById("user").value.trim();
    let pass = document.getElementById("pass").value.trim();
    let errorMsg = document.getElementById("errorMsg");

    errorMsg.innerText = "";
    errorMsg.style.color = "red";

    if (user === "" || pass === "") {
        errorMsg.innerText = "❌ Todos los campos son obligatorios";
        return;
    }

    if (pass.length < 6) {
        errorMsg.innerText = "❌ La contraseña debe tener al menos 6 caracteres";
        return;
    }


    if (user.toLowerCase() === "admin") {

        errorMsg.style.color = "green";
        errorMsg.innerText = "✔ Bienvenido Administrador...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } else {

        errorMsg.style.color = "green";
        errorMsg.innerText = "✔ Bienvenido Usuario...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    }
}