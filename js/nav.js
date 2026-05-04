/* ═══════════════════════════════════════════════════════
   NAV.JS — shared across all pages
   Handles: hamburger toggle, scroll solid state, close on link click
   ═══════════════════════════════════════════════════════ */

   (function () {
    const nav    = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const menu   = document.getElementById('nav-menu');
    const links  = menu ? menu.querySelectorAll('a') : [];
  
    // ── Scroll: add .solid class after 80px ──────────────
    window.addEventListener('scroll', () => {
      if (nav) nav.classList.toggle('solid', window.scrollY > 80);
    }, { passive: true });
  
    if (!toggle || !menu) return;
  
    // ── Toggle open / closed ─────────────────────────────
    function openMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent scroll behind
    }
  
    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });
  
    // ── Close when a nav link is clicked ─────────────────
    links.forEach(link => link.addEventListener('click', closeMenu));
  
    // ── Close on Escape key ──────────────────────────────
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
    });
  
    // ── Close if clicking outside the nav ────────────────
    document.addEventListener('click', e => {
      if (menu.classList.contains('active') && !nav.contains(e.target)) closeMenu();
    });
  })();