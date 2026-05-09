// ===== LUXE STORE – main.js (versión estática) =====

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (menu) menu.classList.toggle('active');
  if (hamburger) hamburger.classList.toggle('active');
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// Animaciones con IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate').forEach(el => observer.observe(el));
});
