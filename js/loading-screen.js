/**
 * RANNSHEALTH - HIGH-PERFORMANCE PRELOADER CONTROLLER
 * Lightweight, elegant ECG heartbeat wave, workflow nodes, and subtle data particle field.
 * Dismisses immediately when the page is ready with zero forced delays.
 */

export function initLoadingScreen() {
  const loader = document.getElementById('rannshealthLoader');
  if (!loader) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('loaderParticlesCanvas');
  let animId = null;
  let isDismissed = false;

  // Reduced motion support
  if (motionQuery.matches) {
    loader.classList.add('reduced-motion');
  }

  // Listen for reduced motion preference changes
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

  // --- Background Moving Data Particles ---
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

  // --- Instant Dismissal When Page Is Ready ---
  function dismiss() {
    if (isDismissed) return;
    isDismissed = true;

    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }

    loader.classList.add('loader-fade-out');

    setTimeout(() => {
      loader.style.display = 'none';
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 420);
  }

  // Dismiss as soon as genuine page loading finishes (never force arbitrary multi-second delays)
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 350);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismiss, 300);
    }, { once: true });

    // Safety fallback: dismiss within 1.6s max if any heavy resource hangs
    setTimeout(dismiss, 1600);
  }
}
