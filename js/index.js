// NAV state
const nav = document.getElementById('navbar');
const musicEl = document.getElementById('music');
function updateNav() {
  const past80 = scrollY > 80;
  const pastMusic = musicEl && scrollY > musicEl.offsetTop - 200;
  nav.className = '';
  if (pastMusic) nav.classList.add('dark');
  else if (past80) nav.classList.add('solid');
}
window.addEventListener('scroll', updateNav);

// SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// SCROLL GALLERY — smooth drag to scroll with momentum
const track = document.getElementById('scroll-gallery-track');
if (track) {
  let isDown = false, startX, scrollLeft;
  let velX = 0, lastX = 0, rafId = null;

  function applyMomentum() {
    velX *= 0.92; // friction
    track.scrollLeft += velX;
    if (Math.abs(velX) > 0.5) {
      rafId = requestAnimationFrame(applyMomentum);
    }
  }

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    lastX = e.pageX;
    velX = 0;
    cancelAnimationFrame(rafId);
  });

  track.addEventListener('mouseleave', () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
    requestAnimationFrame(applyMomentum);
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
    requestAnimationFrame(applyMomentum);
  });

  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    velX = lastX - e.pageX;       // track velocity
    lastX = e.pageX;
    track.scrollLeft = scrollLeft + (startX - x);
  });

  // Touch — native scroll handles this well, just let it ride
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX;
    scrollLeft = track.scrollLeft;
    velX = 0;
    cancelAnimationFrame(rafId);
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    const x = e.touches[0].pageX;
    track.scrollLeft = scrollLeft + (startX - x);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    // let CSS scroll-snap handle the settle
  }, { passive: true });
}
// GALLERY FILTER — only run on pages that are NOT the gallery page
// (gallery.js owns this on gallery.html)
if (!document.getElementById('gallery-grid')) {
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.masonry-item').forEach(item => {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? 'block' : 'none';
      });
    });
  });
}