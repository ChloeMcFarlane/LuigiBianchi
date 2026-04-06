// ═══════════════════════════════════════
// GALLERY PAGE — filter + lightbox + players + reveal
// Wrapped in DOMContentLoaded so the script is safe
// whether loaded in <head> or end of <body>
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

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
  
    // ── CUSTOM WAVEFORM AUDIO PLAYERS ──
    (function () {
  
      // Generate a deterministic pseudo-random waveform for each card
      function generateBars(seed, count) {
        const bars = [];
        let s = seed;
        for (let i = 0; i < count; i++) {
          s = (s * 1664525 + 1013904223) & 0xffffffff;
          const raw = ((s >>> 0) / 0xffffffff);
          // Shape into something that looks like speech: more mid-range bars
          const shaped = 0.15 + raw * 0.85 * Math.sin(Math.PI * (i / count)) + raw * 0.3;
          bars.push(Math.min(1, shaped));
        }
        return bars;
      }
  
      function drawWaveform(canvas, bars, progress) {
        const dpr = window.devicePixelRatio || 1;
        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        // Guard: don't draw if canvas has no size yet
        if (!W || !H) return;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);
  
        const barCount = bars.length;
        const gap = 2;
        const barW = Math.max(2, (W - gap * (barCount - 1)) / barCount);
        const midY = H / 2;
        const cutX = W * progress;
  
        bars.forEach((amp, i) => {
          const x = i * (barW + gap);
          const barH = amp * midY * 0.92;
          const isPast = (x + barW) <= cutX;
          const isCurrent = x <= cutX && (x + barW) > cutX;
  
          if (isPast) {
            ctx.fillStyle = '#6BA36F'; // fern — played
          } else if (isCurrent) {
            ctx.fillStyle = '#A8C9AB'; // mist — playhead
          } else {
            ctx.fillStyle = 'rgba(74,124,80,0.3)'; // dim — unplayed
          }
  
          // Top half
          ctx.beginPath();
          ctx.roundRect(x, midY - barH, barW, barH, 1);
          ctx.fill();
  
          // Bottom half (mirror, lighter)
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.roundRect(x, midY + 1, barW, barH * 0.7, 1);
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }
  
      function formatTime(secs) {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return m + ':' + String(s).padStart(2, '0');
      }
  
      const cards = document.querySelectorAll('.vo-card');
      let activeCard = null;
  
      cards.forEach((card, idx) => {
        const audio    = card.querySelector('.vo-audio');
        const playBtn  = card.querySelector('.vo-play-btn');
        const canvas   = card.querySelector('.waveform-canvas');
        const progress = card.querySelector('.waveform-progress');
        const timeEl   = card.querySelector('.vo-time');
        const waveform = card.querySelector('.vo-waveform');
  
        const bars = generateBars(idx * 999 + 42, 60);
  
        function draw(prog) {
          drawWaveform(canvas, bars, prog);
        }
  
        // Use ResizeObserver to draw once canvas has real dimensions
        const ro = new ResizeObserver(() => draw(0));
        ro.observe(canvas);
  
        // Play / pause
        playBtn.addEventListener('click', () => {
          if (activeCard && activeCard !== card) {
            // Stop other card
            const otherAudio = activeCard.querySelector('.vo-audio');
            const otherBtn   = activeCard.querySelector('.vo-play-btn');
            otherAudio.pause();
            otherAudio.currentTime = 0;
            otherBtn.classList.remove('playing');
            activeCard.querySelector('.waveform-progress').style.width = '0%';
            activeCard.querySelector('.vo-time').textContent = '0:00';
            const otherCanvas = activeCard.querySelector('.waveform-canvas');
            const otherBars   = generateBars([...cards].indexOf(activeCard) * 999 + 42, 60);
            drawWaveform(otherCanvas, otherBars, 0);
            activeCard = null;
          }
  
          if (audio.paused) {
            audio.play();
            playBtn.classList.add('playing');
            activeCard = card;
          } else {
            audio.pause();
            playBtn.classList.remove('playing');
            activeCard = null;
          }
        });
  
        // Update waveform + time on playback
        audio.addEventListener('timeupdate', () => {
          const prog = audio.duration ? audio.currentTime / audio.duration : 0;
          draw(prog);
          progress.style.width = (prog * 100) + '%';
          timeEl.textContent = formatTime(audio.currentTime);
        });
  
        // Reset on end
        audio.addEventListener('ended', () => {
          playBtn.classList.remove('playing');
          draw(0);
          progress.style.width = '0%';
          timeEl.textContent = '0:00';
          activeCard = null;
        });
  
        // Click waveform to seek
        waveform.addEventListener('click', (e) => {
          if (!audio.duration) return;
          const rect = waveform.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          audio.currentTime = ratio * audio.duration;
        });
      });
  
    })();
  
  }); // end DOMContentLoaded