/**
 * RANNSHEALTH - 4-SECOND PRELOADER & HERO ENTRANCE CONTROLLER
 * Lightweight, elegant ECG heartbeat wave, workflow nodes, and subtle data particle field.
 * Unconditionally closes after exactly 4 seconds, never blocking on assets or scripts,
 * and reveals the hero section with a smooth entrance animation.
 */

export function initLoadingScreen() {
  const loader = document.getElementById('rannshealthLoader');
  if (!loader) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('loaderParticlesCanvas');
  const hero = document.getElementById('hero');
  let animId = null;
  let isDismissed = false;

  // 1. In-page navigation & session check:
  // If the user has already seen the intro loader during this session, dismiss immediately
  let hasSeenLoader = false;
  try {
    hasSeenLoader = sessionStorage.getItem('rannshealth_loader_seen') === 'true';
  } catch (e) {
    hasSeenLoader = false;
  }

  if (hasSeenLoader) {
    loader.style.display = 'none';
    loader.style.pointerEvents = 'none';
    if (loader.parentNode) loader.parentNode.removeChild(loader);
    if (hero) {
      hero.classList.add('hero-entrance-active');
    }
    return;
  }

  // Mark session as seen so in-page back/forward or navigation does not trigger it again
  try {
    sessionStorage.setItem('rannshealth_loader_seen', 'true');
  } catch (e) {
    // Ignore storage restrictions
  }

  // 2. Reduced motion support
  if (motionQuery.matches) {
    loader.classList.add('reduced-motion');
  }

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', (e) => {
      if (e.matches) {
        loader.classList.add('reduced-motion');
        if (animId) cancelAnimationFrame(animId);
      } else {
        loader.classList.remove('reduced-motion');
      }
    });
  }

  // 3. Background Moving Data Particles
  if (canvas && !motionQuery.matches) {
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const count = 24;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1,
        alpha: Math.random() * 0.45 + 0.2
      });
    }

    function renderParticles() {
      if (isDismissed) return;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting paths
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 75)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw floating nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(renderParticles);
    }

    animId = requestAnimationFrame(renderParticles);
  }

  // 4. Reliable Dismissal & Hero Reveal
  function dismiss() {
    if (isDismissed) return;
    isDismissed = true;

    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }

    // Immediately make loader non-interactive so clicks pass through
    loader.style.pointerEvents = 'none';

    // Trigger smooth entrance animation on the hero
    if (hero) {
      hero.classList.add('hero-entrance-active');
    }

    if (motionQuery.matches) {
      loader.style.display = 'none';
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    } else {
      loader.classList.add('loader-fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }
  }

  // 5. Unconditional 4-Second Timer:
  // Starts immediately when loader appears and triggers after exactly 4 seconds (4000ms).
  // Does not wait for video, images, fonts or network events to finish.
  const TIMER_MS = motionQuery.matches ? 150 : 4000;
  const dismissTimer = setTimeout(dismiss, TIMER_MS);

  // Safety cleanup if page is unloaded or hidden
  window.addEventListener('pagehide', () => {
    clearTimeout(dismissTimer);
  }, { once: true });
}
