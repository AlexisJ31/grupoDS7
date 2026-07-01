const API_BASE = '../../api';
const AUTH_TOKEN_KEY = 'luxe_auth_token';
const AUTH_USER_KEY = 'luxe_auth_user';

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getAuthUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function isLoggedIn() {
  return !!getAuthToken();
}

function saveAuth(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  updateAuthUI();
}

function updateAuthUI() {
  const user = getAuthUser();
  document.querySelectorAll('.auth-logged-out').forEach(el => el.style.display = user ? 'none' : '');
  document.querySelectorAll('.auth-logged-in').forEach(el => el.style.display = user ? '' : 'none');
  const userName = document.getElementById('userName');
  if (userName) {
    userName.textContent = user ? user.nombre : '';
  }
}

async function handleLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (json.success) {
      saveAuth(json.data.token, {
        id: json.data.id,
        nombre: json.data.nombre,
        email: json.data.email,
        rol: json.data.rol || 'cliente',
      });
      updateAuthUI();
      return { success: true, rol: json.data.rol || 'cliente' };
    } else {
      return { success: false, error: json.error };
    }
  } catch {
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

async function handleRegister(nombre, email, password) {
  try {
    const res = await fetch(`${API_BASE}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    const json = await res.json();
    if (json.success) {
      saveAuth(json.data.token, {
        id: json.data.id,
        nombre: json.data.nombre,
        email: json.data.email,
        rol: 'cliente',
      });
      updateAuthUI();
      return { success: true };
    } else {
      return { success: false, error: json.error };
    }
  } catch {
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

function cerrarSesion() {
  clearAuth();
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', updateAuthUI);
