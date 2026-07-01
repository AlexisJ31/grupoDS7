// ===== AUTH SYSTEM (Login / Register) =====
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
  const authBtn = document.getElementById('authBtn');
  const userName = document.getElementById('userName');
  if (!authBtn && !userName) return;

  if (user) {
    if (authBtn) authBtn.style.display = 'none';
    if (userName) {
      userName.textContent = user.nombre;
      userName.style.display = 'inline';
    }
  } else {
    if (authBtn) authBtn.style.display = 'inline-flex';
    if (userName) userName.style.display = 'none';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const nombre = form.querySelector('[name="regNombre"]').value.trim();
  const email = form.querySelector('[name="regEmail"]').value.trim();
  const password = form.querySelector('[name="regPassword"]').value;
  const btn = form.querySelector('button[type="submit"]');
  const msg = form.querySelector('.auth-msg');

  btn.disabled = true;
  btn.textContent = 'Registrando...';
  msg.className = 'auth-msg';
  msg.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    const json = await res.json();

    if (json.success) {
      saveAuth(json.data.token, { id: json.data.id, nombre: json.data.nombre, email: json.data.email });
      closeAuthModal();
      showToast(`✓ Bienvenido, ${json.data.nombre}`);
      updateAuthUI();
    } else {
      msg.className = 'auth-msg error';
      msg.textContent = json.error;
    }
  } catch {
    msg.className = 'auth-msg error';
    msg.textContent = 'Error de conexión con el servidor';
  }

  btn.disabled = false;
  btn.textContent = 'Crear Cuenta';
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('[name="loginEmail"]').value.trim();
  const password = form.querySelector('[name="loginPassword"]').value;
  const btn = form.querySelector('button[type="submit"]');
  const msg = form.querySelector('.auth-msg');

  btn.disabled = true;
  btn.textContent = 'Iniciando sesión...';
  msg.className = 'auth-msg';
  msg.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();

    if (json.success) {
      saveAuth(json.data.token, { id: json.data.id, nombre: json.data.nombre, email: json.data.email });
      closeAuthModal();
      showToast(`✓ Bienvenido de nuevo, ${json.data.nombre}`);
      updateAuthUI();
    } else {
      msg.className = 'auth-msg error';
      msg.textContent = json.error;
    }
  } catch {
    msg.className = 'auth-msg error';
    msg.textContent = 'Error de conexión con el servidor';
  }

  btn.disabled = false;
  btn.textContent = 'Iniciar Sesión';
}

function openAuthModal() {
  const modal = document.getElementById('authModal');
  const overlay = document.getElementById('authOverlay');
  if (modal) {
    modal.classList.add('open');
    overlay.classList.add('open');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  const overlay = document.getElementById('authOverlay');
  if (modal) {
    modal.classList.remove('open');
    overlay.classList.remove('open');
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`authForm${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}

function toggleAuthDropdown() {
  const dd = document.getElementById('authDropdown');
  if (dd) dd.classList.toggle('open');
}

function handleLogout() {
  clearAuth();
  closeAuthDropdown();
  showToast('✓ Sesión cerrada');
}

function closeAuthDropdown() {
  const dd = document.getElementById('authDropdown');
  if (dd) dd.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) closeAuthDropdown();
  });
});
