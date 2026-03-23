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

// GALLERY FILTER
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

// WAVEFORMS
['vw1','vw2','vw3'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  [8,14,22,18,28,20,30,16,24,12,20,26,10,22,30,14,24,18,12,26].forEach(h => {
    const s = document.createElement('span');
    s.style.height = h + 'px';
    el.appendChild(s);
  });
});

// VOICEOVER
let activeVO = null;
function toggleVO(btn) {
  if (activeVO === btn) { btn.textContent = '▶'; activeVO = null; return; }
  if (activeVO) activeVO.textContent = '▶';
  btn.textContent = '⏸'; activeVO = btn;
  // TODO: attach real Audio() when files are provided
}