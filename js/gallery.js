// ═══════════════════════════════════════
// GALLERY PAGE — filter + lightbox logic
// ═══════════════════════════════════════

// ── GALLERY FILTER + COUNT ──
const pills   = document.querySelectorAll('.filter-pill');
const items   = document.querySelectorAll('.masonry-item');
const countEl = document.getElementById('gallery-count');

function updateCount() {
  const visible = [...items].filter(i => !i.classList.contains('hidden')).length;
  countEl.textContent = visible + ' photo' + (visible !== 1 ? 's' : '');
}

pills.forEach(btn => {
  btn.addEventListener('click', () => {
    pills.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
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

// ── LIGHTBOX ──
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

items.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    }
  });
});

lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});