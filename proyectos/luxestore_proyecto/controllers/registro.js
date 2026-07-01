async function register() {
  let user = document.getElementById("newUser").value.trim();
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("newPass").value.trim();
  let confirmPass = document.getElementById("confirmPass").value.trim();
  let errorMsg = document.getElementById("errorMsg");

  errorMsg.innerText = "";
  errorMsg.style.color = "#b94545";

  if (user === "" || email === "" || pass === "" || confirmPass === "") {
    errorMsg.innerText = "Todos los campos son obligatorios";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    errorMsg.innerText = "Correo inválido";
    return;
  }

  if (pass.length < 6) {
    errorMsg.innerText = "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  if (pass !== confirmPass) {
    errorMsg.innerText = "Las contraseñas no coinciden";
    return;
  }

  const result = await handleRegister(user, email, pass);

  if (result.success) {
    errorMsg.style.color = "#2e7d4f";
    errorMsg.innerText = "Cuenta creada correctamente";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  } else {
    errorMsg.innerText = result.error;
  }
}
