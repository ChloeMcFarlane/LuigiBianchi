const galleryData = [
  // THEATRE / PROD IMAGES
  { src: "src/lb-prod1.jpeg",  title: "Acting Thesis",           cat: "theatre", tag: "Theatre · 2026", aria: "Production Title" },
  { src: "src/lb-prod2.jpeg",  title: "Acting Thesis",           cat: "theatre", tag: "Theatre · 2026", aria: "Production Title" },
  { src: "src/lb-prod3.jpeg",  title: "Acting Thesis",           cat: "theatre", tag: "Theatre · 2026", aria: "Production Title" },
  { src: "src/lb-prod4.jpeg",  title: "Acting Thesis",           cat: "theatre", tag: "Theatre · 2026", aria: "Production Title" },
  { src: "src/lb-prod5.jpeg",  title: "Acting Thesis",           cat: "theatre", tag: "Theatre · 2026", aria: "Production Title" },
  { src: "src/lbprodimg.jpeg", title: "Acting Thesis",           cat: "theatre", tag: "Theatre · 2026", aria: "Production Title" },
  { src: "src/lb-prod6.jpeg",  title: "Sweet Science of Bruising", cat: "theatre", tag: "Theatre · 2024", aria: "Production Title" },
  { src: "src/lb-prod7.jpeg",  title: "Sweet Science of Bruising", cat: "theatre", tag: "Theatre · 2024", aria: "Production Title" },
  { src: "src/lb-prod8.jpeg",  title: "Sweet Science of Bruising", cat: "theatre", tag: "Theatre · 2024", aria: "Production Title" },
  { src: "src/lb-prod9.jpeg",  title: "Sweet Science of Bruising", cat: "theatre", tag: "Theatre · 2024", aria: "Production Title" },
  { src: "src/lb-prod10.jpeg", title: "Sweet Science of Bruising", cat: "theatre", tag: "Theatre · 2024", aria: "Production Title" },
  { src: "src/lb-prod11.jpeg", title: "12 Angry Jurors",         cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod12.jpeg", title: "12 Angry Jurors",         cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod13.jpeg", title: "12 Angry Jurors",         cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod14.jpeg", title: "12 Angry Jurors",         cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod15.jpeg", title: "12 Angry Jurors",         cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod16.jpeg", title: "Book of Fishes",          cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod17.jpg",  title: "Book of Fishes",          cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod18.jpeg", title: "Book of Fishes",          cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod19.jpeg", title: "Book of Fishes",          cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },
  { src: "src/lb-prod20.jpeg", title: "Book of Fishes",          cat: "theatre", tag: "Theatre · 2025", aria: "Production Title" },

  // HEADSHOTS
  { src: "src/lbheadshot1.jpg", title: "Headshot",  cat: "headshot", aria: "Headshot 2024" },
  { src: "src/lbheadshot2.jpg", title: "Headshot",  cat: "headshot", aria: "Headshot 2024" },
  { src: "src/lbheadshot3.png", title: "Headshot by @toneinfocus",  cat: "headshot", aria: "Headshot 2024" },
  { src: "src/lbheadshot4.png", title: "Headshot by @toneinfocus",  cat: "headshot", aria: "Headshot 2024" },
];

const reelsData = [
  {
    id: "1188266307",
    title: "Performance Reel",
    desc: "Highlights of my dramatic and comedic experience."
  },
  {
    id: "1188322604",
    title: "The Bowl",
    desc: "Check out this film directed, written, and starred by me."
  }
];

document.addEventListener('DOMContentLoaded', function () {
  const grid        = document.getElementById('gallery-grid');
  const reelsGrid   = document.getElementById('reels-grid');
  const reelsPortal = document.getElementById('reels-portal');
  const countEl     = document.getElementById('gallery-count');
  const overlay     = document.getElementById('gallery-overlay');
  const overlayImgPh   = document.getElementById('overlay-img-ph');
  const overlayCapTitle = document.getElementById('overlay-caption-title');
  const overlayCapTag   = document.getElementById('overlay-caption-tag');
  const overlayClose    = document.getElementById('overlay-close');
  const overlayPrev     = document.getElementById('overlay-prev');
  const overlayNext     = document.getElementById('overlay-next');

  if (!grid || !reelsGrid) return;

  // ─── 1. Render Reels ──────────────────────────────────────────────────────
  // Use loading="lazy" on iframes via srcdoc trick — Vimeo iframes are heavy.
  // We render a click-to-load poster instead of embedding all iframes upfront.
  reelsGrid.innerHTML = reelsData.map(reel => `
    <div class="reel-card">
      <div class="vimeo-wrapper">
        <div class="vimeo-facade" data-id="${reel.id}" role="button" tabindex="0" aria-label="Play ${reel.title}">
          <img
            src="https://vumbnail.com/${reel.id}.jpg"
            alt="Thumbnail for ${reel.title}"
            loading="lazy"
            decoding="async"
          />
          <div class="vimeo-play-btn" aria-hidden="true">
            <svg viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="34" cy="34" r="34" fill="rgba(0,0,0,0.55)"/>
              <polygon points="26,20 54,34 26,48" fill="#fff"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="reel-info">
        <h3 class="reel-title">${reel.title}</h3>
        <p class="reel-desc">${reel.desc}</p>
      </div>
    </div>
  `).join('');

  // Lazy-load Vimeo iframes only when the user clicks the facade
  reelsGrid.querySelectorAll('.vimeo-facade').forEach(facade => {
    function activateFacade() {
      const id = facade.dataset.id;
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&badge=0`;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';
      facade.parentNode.replaceChild(iframe, facade);
    }
    facade.addEventListener('click', activateFacade);
    facade.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activateFacade(); });
  });

  // ─── 2. Render Gallery Photos ─────────────────────────────────────────────
  grid.innerHTML = galleryData.map((item, idx) => `
    <div class="gallery-item" data-cat="${item.cat}" data-index="${idx}"
         role="listitem" tabindex="0" aria-label="${item.aria}">
      <div class="tile-img">
        <img src="${item.src}" alt="${item.aria}" loading="lazy" decoding="async"/>
      </div>
      <div class="tile-overlay">
        <div class="tile-title">${item.title}</div>
        ${item.tag ? `<div class="tile-tag">${item.tag}</div>` : ''}
      </div>
    </div>
  `).join('');

  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const pills = Array.from(document.querySelectorAll('.filter-pill'));

  // ─── 3. Filter Logic ──────────────────────────────────────────────────────
  function applyFilter(filter) {
    // Reels section
    if (reelsPortal) {
      reelsPortal.style.display = (filter === 'all' || filter === 'video') ? '' : 'none';
    }

    // Photo items
    items.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !show);
    });

    updateCount();
  }

  pills.forEach(btn => {
    btn.addEventListener('click', () => {
      pills.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  function updateCount() {
    const visible = items.filter(i => !i.classList.contains('hidden')).length;
    if (countEl) countEl.textContent = `${visible} photo${visible !== 1 ? 's' : ''}`;
  }

  // ─── 4. Overlay / Lightbox ────────────────────────────────────────────────
  let currentIndex = 0;

  function getVisibleItems() {
    return items.filter(i => !i.classList.contains('hidden'));
  }

  function openOverlay(index) {
    const visibleItems = getVisibleItems();
    currentIndex = index;
    const item = visibleItems[currentIndex];
    if (!item) return;

    const data = galleryData[parseInt(item.dataset.index, 10)];
    overlayImgPh.innerHTML = `<img src="${data.src}" alt="${data.aria}" style="max-width:100%;max-height:80vh;display:block;margin:auto;"/>`;
    overlayCapTitle.textContent = data.title || '';
    overlayCapTag.textContent   = data.tag   || '';

    overlay.hidden = false;
    overlay.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.hidden = true;
    overlayImgPh.innerHTML = '';
    document.body.style.overflow = '';
  }

  function stepOverlay(dir) {
    const visibleItems = getVisibleItems();
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    openOverlay(currentIndex);
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const positionInVisible = visibleItems.indexOf(item);
      openOverlay(positionInVisible);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const visibleItems = getVisibleItems();
        const positionInVisible = visibleItems.indexOf(item);
        openOverlay(positionInVisible);
      }
    });
  });

  overlayClose.addEventListener('click', closeOverlay);
  overlayPrev.addEventListener('click',  () => stepOverlay(-1));
  overlayNext.addEventListener('click',  () => stepOverlay(1));

  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });

  document.addEventListener('keydown', e => {
    if (overlay.hidden) return;
    if (e.key === 'Escape')     closeOverlay();
    if (e.key === 'ArrowLeft')  stepOverlay(-1);
    if (e.key === 'ArrowRight') stepOverlay(1);
  });

  // ─── 5. Scroll Reveal ─────────────────────────────────────────────────────
  function setupReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => observer.observe(el));
  }

  // ─── 6. Init ──────────────────────────────────────────────────────────────
  updateCount();
  setupReveal();

  // Make sure reels are visible on first load (filter = 'all')
  if (reelsPortal) reelsPortal.style.display = '';
});