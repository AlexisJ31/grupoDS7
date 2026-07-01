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
  
  // Agregar enlace al Dashboard si es admin
  const userDropdown = document.getElementById('userDropdown');
  if (userDropdown) {
    let adminLink = document.getElementById('adminDashboardLink');
    if (user && user.rol === 'admin') {
      if (!adminLink) {
        adminLink = document.createElement('a');
        adminLink.id = 'adminDashboardLink';
        const isPagesDir = window.location.pathname.includes('/pages/');
        adminLink.href = isPagesDir ? 'dashboard.php' : 'pages/dashboard.php';
        adminLink.style.cssText = 'display:block; padding:0.25rem 0.5rem; cursor:pointer; font-size:0.85rem; color:#000; text-decoration:none; margin-top:0.25rem; margin-bottom:0.25rem; width:100%; text-align:left; font-weight:600;';
        adminLink.textContent = '🛡️ Panel de Admin';
        
        // Insertar justo antes del separador <hr> para que quede arriba del botón "Cerrar sesión"
        const hr = userDropdown.querySelector('hr');
        if (hr) {
          userDropdown.insertBefore(adminLink, hr);
        } else {
          userDropdown.appendChild(adminLink);
        }
      }
    } else if (adminLink) {
      adminLink.remove();
    }
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
  const isPagesDir = window.location.pathname.includes('/pages/');
  window.location.href = isPagesDir ? 'login.html' : 'pages/login.html';
}

document.addEventListener('DOMContentLoaded', updateAuthUI);
