// ═══════════════════════════════════════
// GALLERY PAGE — filter + overlay + reveal
// Jordan-style behavior, Luigi palette
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

  // ── FILTER ──
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
        if (f === 'all' || item.dataset.cat === f) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      updateCount();
    });
  });

  // ── OVERLAY MODAL ──
  const overlay      = document.getElementById('gallery-overlay');
  const overlayClose = document.getElementById('overlay-close');
  const overlayPrev  = document.getElementById('overlay-prev');
  const overlayNext  = document.getElementById('overlay-next');
  const overlayImgPh = document.getElementById('overlay-img-ph');
  const captionTitle = document.getElementById('overlay-caption-title');
  const captionTag   = document.getElementById('overlay-caption-tag');

  let currentIndex = 0; // index within the current visible set

  function openOverlay(index) {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = Math.max(0, Math.min(index, visible.length - 1));
    populateOverlay(visible[currentIndex]);
    overlay.removeAttribute('hidden');
    // Scroll lock
    document.body.style.overflow = 'hidden';
    // Move focus to close button
    if (overlayClose) overlayClose.focus();
  }

  function closeOverlay() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function populateOverlay(item) {
    const visible = getVisibleItems();

    // Image: real <img> or placeholder text
    const img = item.querySelector('img');
    if (overlayImgPh) {
      // Clear previous content
      overlayImgPh.innerHTML = '';
      if (img) {
        const clone = img.cloneNode(true);
        overlayImgPh.appendChild(clone);
        overlayImgPh.style.background = '';
      } else {
        // Show placeholder label from the tile
        const tileSpan = item.querySelector('.tile-img span');
        overlayImgPh.textContent = tileSpan ? tileSpan.textContent : '';
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

  // Open overlay when a tile is clicked or activated via keyboard
  items.forEach((item, idx) => {
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

  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);

  // Close on backdrop click
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeOverlay();
    });
  }

  if (overlayPrev) overlayPrev.addEventListener('click', goPrev);
  if (overlayNext) overlayNext.addEventListener('click', goNext);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!overlay || overlay.hasAttribute('hidden')) return;
    if (e.key === 'Escape')      closeOverlay();
    if (e.key === 'ArrowRight')  goNext();
    if (e.key === 'ArrowLeft')   goPrev();
  });

  // ── SCROLL REVEAL ──
  (function () {
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in-view'), i * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => obs.observe(el));
  })();

}); // end DOMContentLoaded