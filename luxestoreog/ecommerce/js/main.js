// ===== MAIN JS =====

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.animate').forEach(el => observer.observe(el));
});

// Toast notification
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Newsletter subscription
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('✓ ¡Suscripción exitosa! Revisa tu correo.');
  e.target.reset();
}

// Audio toggle
let audioPlaying = false;
function toggleAudio() {
  const audio = document.getElementById('bg-audio');
  const btn = document.getElementById('audioBtn');
  if (!audio) return;
  if (audioPlaying) {
    audio.pause();
    btn.textContent = '🔇';
  } else {
    audio.play().catch(() => {});
    btn.textContent = '🔊';
  }
  audioPlaying = !audioPlaying;
}

// Render home featured products (first 4)
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('homeProducts');
  if (grid && typeof PRODUCTS !== 'undefined') {
    const featured = PRODUCTS.slice(0, 4);
    grid.innerHTML = featured.map(renderProductCard).join('');
    grid.querySelectorAll('.animate').forEach(el => observer.observe(el));
  }
});
