/**
 * INFOGNANA SOLUTIONS - INTERACTIVE ABSTRACT AMBIENT BACKGROUND
 * High-performance ambient neural fluid & particle field that reacts
 * smoothly to mouse coordinates, providing a high-end enterprise aesthetic.
 */

export function initAmbientBg() {
  const canvas = document.getElementById('ambientBgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let width, height;

  // Mouse physics with smooth lerp
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 260,
    isHovering: false
  };

  // Ambient fluid glowing orbs
  const orbs = [
    { x: 0.2, y: 0.3, radius: 350, vx: 0.0004, vy: 0.0003, color: 'rgba(0, 240, 255, 0.09)' },
    { x: 0.8, y: 0.6, radius: 420, vx: -0.0003, vy: 0.0004, color: 'rgba(139, 92, 246, 0.08)' },
    { x: 0.5, y: 0.8, radius: 300, vx: 0.0003, vy: -0.0003, color: 'rgba(0, 210, 180, 0.07)' },
    { x: 0.7, y: 0.2, radius: 280, vx: -0.0004, vy: -0.0002, color: 'rgba(0, 240, 255, 0.06)' }
  ];

  // Ambient floating particle constellation
  const particleCount = 48;
  const particles = [];

  function resize() {
    const parent = canvas.parentElement || document.body;
    width = parent.clientWidth;
    height = parent.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.15,
        alpha: 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Lerp mouse coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    // 1. Draw animated fluid ambient glow orbs
    orbs.forEach(orb => {
      orb.x += orb.vx;
      orb.y += orb.vy;

      if (orb.x < 0.05 || orb.x > 0.95) orb.vx *= -1;
      if (orb.y < 0.05 || orb.y > 0.95) orb.vy *= -1;

      const orbPixelX = orb.x * width + (mouse.x - width / 2) * 0.04;
      const orbPixelY = orb.y * height + (mouse.y - height / 2) * 0.04;

      const grad = ctx.createRadialGradient(orbPixelX, orbPixelY, 0, orbPixelX, orbPixelY, orb.radius);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(0.6, orb.color.replace(/[\d.]+\)$/, '0.02)'));
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });

    // 2. Interactive Cursor Spotlight Aura
    if (mouse.isHovering) {
      const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
      mouseGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
      mouseGrad.addColorStop(0.5, 'rgba(0, 210, 180, 0.04)');
      mouseGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 3. Ambient Particle Constellation with Cursor Interaction
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse distance repulsion/glow effect
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let alpha = p.baseAlpha;
      if (dist < mouse.radius && mouse.isHovering) {
        const force = (1 - dist / mouse.radius);
        p.x -= (dx / dist) * force * 1.5;
        p.y -= (dy / dist) * force * 1.5;
        alpha = Math.min(1, p.baseAlpha + force * 0.6);
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.fill();

      // Connect near neighbors with delicate filaments
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const distP = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (distP < 110) {
          const lineAlpha = (1 - distP / 110) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.isHovering = true;
  }

  function handleMouseLeave() {
    mouse.isHovering = false;
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  const parent = canvas.parentElement || window;
  parent.addEventListener('mousemove', handleMouseMove);
  parent.addEventListener('mouseleave', handleMouseLeave);

  resize();
  initParticles();
  mouse.x = width / 2;
  mouse.y = height / 2;
  mouse.targetX = width / 2;
  mouse.targetY = height / 2;
  draw();
}
