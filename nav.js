// ============================================================
// js/nav.js — Sticky Nav · Mobile Menu · Active Section
// ============================================================

(function () {
  const nav        = document.getElementById('nav');
  const toggle     = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('navMobile');
  const THRESHOLD  = 60; // px before nav becomes solid

  if (!nav) return;

  // ---- Scroll: toggle solid background --------------------
  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ---- Mobile menu toggle ---------------------------------
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        toggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ---- Active section via IntersectionObserver -----------
  const sections    = document.querySelectorAll('.section[id]');
  const navLinks    = document.querySelectorAll('.nav__link[data-section]');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link[data-section]');
  let   activeId    = '';

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
          updateActiveLink();
        }
      });
    },
    {
      threshold: 0,
      rootMargin: `-${Math.floor(window.innerHeight * 0.4)}px 0px -${Math.floor(window.innerHeight * 0.4)}px 0px`,
    }
  );

  sections.forEach(s => sectionObserver.observe(s));

  function updateActiveLink() {
    navLinks.forEach(l => {
      l.classList.toggle('is-active', l.dataset.section === activeId);
    });
    mobileLinks.forEach(l => {
      l.classList.toggle('is-active', l.dataset.section === activeId);
    });
  }

  // ---- Smooth scroll for all in-page anchors -------------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(nav).height) || 72);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
