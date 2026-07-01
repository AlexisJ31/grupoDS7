async function login() {
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("pass").value.trim();
  let errorMsg = document.getElementById("errorMsg");

  errorMsg.innerText = "";
  errorMsg.style.color = "#b94545";

  if (email === "" || pass === "") {
    errorMsg.innerText = "Todos los campos son obligatorios";
    return;
  }

  if (pass.length < 6) {
    errorMsg.innerText = "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  const result = await handleLogin(email, pass);

  if (result.success) {
    errorMsg.style.color = "#2e7d4f";
    errorMsg.innerText = "Iniciando sesión...";
    setTimeout(() => {
      window.location.href = result.rol === 'admin' ? 'dashboard.html' : '../index.html';
    }, 800);
  } else {
    errorMsg.innerText = result.error;
  }
}
