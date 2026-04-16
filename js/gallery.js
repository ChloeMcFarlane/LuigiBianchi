// ═══════════════════════════════════════════════════════
// GALLERY.JS
// Features: filter pills · overlay modal · scroll reveal
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {


  // ─────────────────────────────────────────────────────
  // FILTER PILLS
  // ─────────────────────────────────────────────────────
  const pills   = document.querySelectorAll('.filter-pill');
  const items   = document.querySelectorAll('.gallery-item');
  const countEl = document.getElementById('gallery-count');

  function getVisibleItems() {
    return [...items].filter(i => !i.classList.contains('hidden'));
  }

  function updateCount() {
    const n = getVisibleItems().length;
    if (countEl) countEl.textContent = n + ' photo' + (n !== 1 ? 's' : '');
  }

  pills.forEach(btn => {
    btn.addEventListener('click', () => {
      pills.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const f = btn.dataset.filter;
      items.forEach(item => {
        const show = f === 'all' || item.dataset.cat === f;
        item.classList.toggle('hidden', !show);
      });
      updateCount();
    });
  });


  // ─────────────────────────────────────────────────────
  // OVERLAY MODAL
  // ─────────────────────────────────────────────────────
  const overlay      = document.getElementById('gallery-overlay');
  const overlayClose = document.getElementById('overlay-close');
  const overlayPrev  = document.getElementById('overlay-prev');
  const overlayNext  = document.getElementById('overlay-next');
  const overlayImgPh = document.getElementById('overlay-img-ph');
  const captionTitle = document.getElementById('overlay-caption-title');
  const captionTag   = document.getElementById('overlay-caption-tag');

  let currentIndex = 0;

  // ── Open ──
  function openOverlay(index) {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = Math.max(0, Math.min(index, visible.length - 1));
    populateOverlay(visible[currentIndex]);
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (overlayClose) overlayClose.focus();
  }

  // ── Close ──
  function closeOverlay() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // ── Populate with full image (no crop) ──
  function populateOverlay(item) {
    const visible = getVisibleItems();

    if (overlayImgPh) {
      overlayImgPh.innerHTML = '';

      const img = item.querySelector('img');
      if (img) {
        // Clone the real image and let CSS handle sizing via object-fit: contain
        const clone = img.cloneNode(true);

        // Remove any inline sizing that might interfere
        clone.removeAttribute('width');
        clone.removeAttribute('height');

        // Ensure the image is never cropped — CSS does the heavy lifting,
        // but we set these here as a safety net
        clone.style.width      = 'auto';
        clone.style.height     = 'auto';
        clone.style.maxWidth   = 'min(88vw, calc((100vh - 200px) * 1.778))';
        clone.style.maxHeight  = 'calc(100vh - 200px)';
        clone.style.objectFit  = 'contain';
        clone.style.display    = 'block';

        overlayImgPh.appendChild(clone);
        overlayImgPh.style.background = 'transparent';
        overlayImgPh.style.width      = 'auto';
        overlayImgPh.style.height     = 'auto';
      } else {
        // Fallback: show placeholder label text
        const tileSpan = item.querySelector('.tile-img span');
        overlayImgPh.textContent      = tileSpan ? tileSpan.textContent : '';
        overlayImgPh.style.background = '';
        overlayImgPh.style.width      = '';
        overlayImgPh.style.height     = '';
      }
    }

    // Caption
    const titleEl = item.querySelector('.tile-title');
    const tagEl   = item.querySelector('.tile-tag');
    if (captionTitle) captionTitle.textContent = titleEl ? titleEl.textContent : '';
    if (captionTag)   captionTag.textContent   = tagEl   ? tagEl.textContent   : '';

    // Prev / next button state
    if (overlayPrev) overlayPrev.disabled = currentIndex <= 0;
    if (overlayNext) overlayNext.disabled = currentIndex >= visible.length - 1;
  }

  // ── Navigate ──
  function goNext() {
    const visible = getVisibleItems();
    if (currentIndex < visible.length - 1) {
      currentIndex++;
      populateOverlay(visible[currentIndex]);
    }
  }

  function goPrev() {
    const visible = getVisibleItems();
    if (currentIndex > 0) {
      currentIndex--;
      populateOverlay(visible[currentIndex]);
    }
  }

  // ── Tile click / keyboard activate ──
  items.forEach(item => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const visIdx  = visible.indexOf(item);
      if (visIdx !== -1) openOverlay(visIdx);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const visible = getVisibleItems();
        const visIdx  = visible.indexOf(item);
        if (visIdx !== -1) openOverlay(visIdx);
      }
    });
  });

  // ── Button listeners ──
  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);
  if (overlayPrev)  overlayPrev.addEventListener('click', goPrev);
  if (overlayNext)  overlayNext.addEventListener('click', goNext);

  // Close on backdrop click
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeOverlay();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!overlay || overlay.hasAttribute('hidden')) return;
    if (e.key === 'Escape')     closeOverlay();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });


  // ─────────────────────────────────────────────────────
  // SCROLL REVEAL
  // ─────────────────────────────────────────────────────
  (function () {
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => obs.observe(el));
  })();


}); // end DOMContentLoaded