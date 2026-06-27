/* ============================================================
   Woodpecker's — SITE (plantilla compartida)
   Comportamiento común a todas las páginas:
   loader, nav al hacer scroll, menú móvil (con foco atrapado y
   Escape), reveal on-scroll y año dinámico del footer.
   Lo específico de cada página (galería, juegos…) va aparte.
============================================================ */
(function () {
  'use strict';

  /* ---------- Loader con failsafe ---------- */
  var loader = document.getElementById('loader');
  var hideLoader = function () {
    if (loader && !loader.classList.contains('hide')) {
      loader.classList.add('hide');
      setTimeout(function () { loader.remove(); }, 1000);
    }
  };
  window.addEventListener('load', function () { setTimeout(hideLoader, 400); });
  setTimeout(hideLoader, 4000);

  /* ---------- Nav al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  var tickingNav = false;
  var updateNav = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    tickingNav = false;
  };
  window.addEventListener('scroll', function () {
    if (!tickingNav) { requestAnimationFrame(updateNav); tickingNav = true; }
  }, { passive: true });
  updateNav();

  /* ---------- Barra de progreso de scroll ---------- */
  var progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    var tickingProgress = false;
    var docEl = document.documentElement;
    var updateProgress = function () {
      var scrollHeight = docEl.scrollHeight - window.innerHeight;
      var scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      progressBar.style.width = scrolled + '%';
      tickingProgress = false;
    };
    window.addEventListener('scroll', function () {
      if (!tickingProgress) { requestAnimationFrame(updateProgress); tickingProgress = true; }
    }, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }
  function openMenu() {
    if (!toggle || !menu) return;
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
      else openMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    menu.addEventListener('click', function (e) {
      if (e.target === menu) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (e.key === 'Escape' && open) { closeMenu(); toggle.focus(); }
      // Foco atrapado dentro del menú mientras está abierto
      if (e.key === 'Tab' && open) {
        var focusable = [].slice.call(menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) return;
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Reveal on-scroll ---------- */
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Año dinámico del footer ---------- */
  var fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();
})();
