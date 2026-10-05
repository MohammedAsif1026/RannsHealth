/**
 * INFOGNANA - INTERACTIVE 3D/CANVAS RCM DATA-FLOW VISUALIZATION
 * Renders an enterprise 3D perspective data-flow node graph:
 * Eligibility -> Authorization -> Claims -> Payment Posting -> Denial Resolution -> Analytics
 * Responsive: Automatically reflows between a wide 6-stage perspective view on desktop
 * and an elegant, spacious 2-column S-curve neural pipeline on mobile (320px–430px)
 * with touch support, high-contrast readable labels, and zero clipping.
 */

export function initHeroCanvas() {
  const canvas = document.getElementById('heroDataFlowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('heroNodeTooltip');
  const instructionEl = document.getElementById('heroVisualInstructionText');
  let animationFrameId;
  let width, height;

  // Desktop stages definition (spacious horizontal perspective)
  const desktopNodes = [
    { id: 'eligibility', name: 'Eligibility', subtitle: '270/271 Real-Time', stat: '99.8% Verified', desc: 'Instant insurance eligibility checks & coverage validation before patient encounters.', color: '#00F0FF', xRatio: 0.14, yRatio: 0.35, z: 0 },
    { id: 'authorization', name: 'Authorization', subtitle: 'AI Prior-Auth', stat: '96.4% Approval', desc: 'Automated clinical documentation checking & prior-auth validation.', color: '#00D2B4', xRatio: 0.30, yRatio: 0.65, z: 20 },
    { id: 'claims', name: 'Claims Submission', subtitle: 'Rules Engine', stat: '99.2% Clean Rate', desc: 'Pre-submission scrubbing with 2,500+ payer-specific LCD/NCD validation rules.', color: '#8B5CF6', xRatio: 0.50, yRatio: 0.30, z: 10 },
    { id: 'payment', name: 'Payment Posting', subtitle: '835 ERA Auto-Post', stat: '<2hr Auto-Post', desc: 'Automated EOB data capture, electronic posting, and write-off reconciliation.', color: '#00F0FF', xRatio: 0.70, yRatio: 0.65, z: 30 },
    { id: 'denial', name: 'Denial Resolution', subtitle: 'Root Cause AI', stat: '84.7% Recovered', desc: 'Automated denial classification, smart routing, and rapid appeal package generation.', color: '#F59E0B', xRatio: 0.86, yRatio: 0.35, z: 15 },
    { id: 'analytics', name: 'AI & Analytics', subtitle: 'RCM Intelligence', stat: '4.8x ROI Impact', desc: 'End-to-end executive visibility, payer scorecards, and continuous revenue optimization.', color: '#10B981', xRatio: 0.50, yRatio: 0.85, z: 40 }
  ];

  // Mobile stages definition (2-column staggered S-curve layout tailored for 320px–430px viewports)
  const mobileNodes = [
    { id: 'eligibility', name: 'Eligibility', mobileName: 'Eligibility', subtitle: '270/271 Real-Time', mobileSubtitle: 'Real-Time 270', stat: '99.8% Verified', desc: 'Instant insurance eligibility checks & coverage validation before patient encounters.', color: '#00F0FF', xRatio: 0.28, yRatio: 0.16, z: 0 },
    { id: 'authorization', name: 'Authorization', mobileName: 'Prior-Auth', subtitle: 'AI Prior-Auth', mobileSubtitle: 'AI Validation', stat: '96.4% Approval', desc: 'Automated clinical documentation checking & prior-auth validation.', color: '#00D2B4', xRatio: 0.72, yRatio: 0.30, z: 10 },
    { id: 'claims', name: 'Claims Submission', mobileName: 'Clean Claims', subtitle: 'Rules Engine', mobileSubtitle: 'Rules Engine', stat: '99.2% Clean Rate', desc: 'Pre-submission scrubbing with 2,500+ payer-specific LCD/NCD validation rules.', color: '#8B5CF6', xRatio: 0.28, yRatio: 0.45, z: 15 },
    { id: 'payment', name: 'Payment Posting', mobileName: 'Payment Posting', subtitle: '835 ERA Auto-Post', mobileSubtitle: '835 ERA Auto', stat: '<2hr Auto-Post', desc: 'Automated EOB data capture, electronic posting, and write-off reconciliation.', color: '#00F0FF', xRatio: 0.72, yRatio: 0.60, z: 20 },
    { id: 'denial', name: 'Denial Resolution', mobileName: 'Denial Recovery', subtitle: 'Root Cause AI', mobileSubtitle: 'Root Cause AI', stat: '84.7% Recovered', desc: 'Automated denial classification, smart routing, and rapid appeal package generation.', color: '#F59E0B', xRatio: 0.28, yRatio: 0.74, z: 10 },
    { id: 'analytics', name: 'AI & Analytics', mobileName: 'AI Analytics', subtitle: 'RCM Intelligence', mobileSubtitle: 'RCM Insights', stat: '4.8x ROI Impact', desc: 'End-to-end executive visibility, payer scorecards, and continuous revenue optimization.', color: '#10B981', xRatio: 0.72, yRatio: 0.88, z: 25 }
  ];

  // Animated Particles flowing along paths
  const particles = [];
  const particleCount = 36;

  // Mouse & Touch tracking
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, hoveredNode: null };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (instructionEl) {
      instructionEl.textContent = (width < 640)
        ? '✦ Tap nodes to inspect real-time metrics'
        : '✦ Hover over stages to inspect real-time metrics';
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pathIndex: Math.floor(Math.random() * 5),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.0035,
      size: 1.6 + Math.random() * 1.8,
      opacity: 0.4 + Math.random() * 0.55
    });
  }

  function getCurvePoint(p0, p1, p2, p3, t) {
    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const x = (ax * Math.pow(t, 3)) + (bx * Math.pow(t, 2)) + (cx * t) + p0.x;
    const y = (ay * Math.pow(t, 3)) + (by * Math.pow(t, 2)) + (cy * t) + p0.y;

    return { x, y };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isMobile = width < 640;
    const isVeryNarrow = width < 360;
    const activeNodes = isMobile ? mobileNodes : desktopNodes;

    // Smooth tilt/parallax (gentler on mobile)
    const tiltMultiplier = isMobile ? 0.04 : 0.08;
    mouse.x += (mouse.targetX - mouse.x) * tiltMultiplier;
    mouse.y += (mouse.targetY - mouse.y) * tiltMultiplier;

    const calculatedNodes = activeNodes.map(node => {
      const baseNodeX = node.xRatio * width;
      const baseNodeY = node.yRatio * height;
      const zScale = isMobile ? 900 : 600;
      const tiltX = (mouse.x - width / 2) * (node.z / zScale);
      const tiltY = (mouse.y - height / 2) * (node.z / zScale);
      return {
        ...node,
        x: baseNodeX + tiltX,
        y: baseNodeY + tiltY
      };
    });

    // Draw connecting bezier pathways
    for (let i = 0; i < calculatedNodes.length - 1; i++) {
      const start = calculatedNodes[i];
      const end = calculatedNodes[i + 1];

      let cp1, cp2;
      if (isMobile) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        cp1 = { x: start.x + dx * 0.55, y: start.y + dy * 0.12 };
        cp2 = { x: start.x + dx * 0.45, y: end.y - dy * 0.12 };
      } else {
        cp1 = { x: start.x + (end.x - start.x) * 0.5, y: start.y };
        cp2 = { x: start.x + (end.x - start.x) * 0.5, y: end.y };
      }

      // Base glowing line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
      ctx.lineWidth = isMobile ? 2.2 : 3;
      ctx.stroke();

      // Outer glow line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = isMobile ? 7 : 10;
      ctx.stroke();
    }

    // Connect last node to first to close the feedback/analytics loop
    const firstNode = calculatedNodes[0];
    const analyticsNode = calculatedNodes[calculatedNodes.length - 1];
    ctx.beginPath();
    ctx.moveTo(analyticsNode.x, analyticsNode.y);
    if (isMobile) {
      const leftEdge = Math.max(12, width * 0.08);
      ctx.bezierCurveTo(width * 0.92, height * 0.98, leftEdge, height * 0.85, leftEdge, height * 0.5);
      ctx.bezierCurveTo(leftEdge, height * 0.22, firstNode.x - 30, firstNode.y, firstNode.x, firstNode.y);
    } else {
      ctx.bezierCurveTo(analyticsNode.x - 100, analyticsNode.y, firstNode.x, analyticsNode.y + 40, firstNode.x, firstNode.y);
    }
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.14)';
    ctx.lineWidth = 1.75;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw and update flowing particles
    particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        p.pathIndex = (p.pathIndex + 1) % (calculatedNodes.length - 1);
      }

      const start = calculatedNodes[p.pathIndex];
      const end = calculatedNodes[p.pathIndex + 1];
      let cp1, cp2;
      if (isMobile) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        cp1 = { x: start.x + dx * 0.55, y: start.y + dy * 0.12 };
        cp2 = { x: start.x + dx * 0.45, y: end.y - dy * 0.12 };
      } else {
        cp1 = { x: start.x + (end.x - start.x) * 0.5, y: start.y };
        cp2 = { x: start.x + (end.x - start.x) * 0.5, y: end.y };
      }

      const pos = getCurvePoint(start, cp1, cp2, end, p.progress);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = isMobile ? 6 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Nodes & Typography
    calculatedNodes.forEach((node) => {
      const isHovered = mouse.hoveredNode && mouse.hoveredNode.id === node.id;
      const baseRadius = isMobile ? (isVeryNarrow ? 14 : 16) : 20;
      const nodeRadius = isHovered ? (baseRadius + 5) : baseRadius;

      // Outer ripple ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius + (isMobile ? 7 : 10), 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? node.color : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node background
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, nodeRadius);
      gradient.addColorStop(0, '#0F1E3E');
      gradient.addColorStop(1, '#070D1E');
      ctx.fillStyle = gradient;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isHovered ? (isMobile ? 18 : 25) : (isMobile ? 8 : 12);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node border
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.stroke();

      // Inner pulsating core
      ctx.beginPath();
      ctx.arc(node.x, node.y, isMobile ? 4.5 : 6, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Primary Node Label
      const nameFontSize = isMobile ? (isVeryNarrow ? '10px' : '11px') : '12px';
      ctx.font = `600 ${nameFontSize} "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      const displayName = isMobile ? (node.mobileName || node.name) : node.name;
      ctx.fillText(displayName, node.x, node.y + nodeRadius + (isMobile ? 14 : 18));

      // Secondary Subtitle
      const subFontSize = isMobile ? (isVeryNarrow ? '8.5px' : '9.5px') : '10px';
      ctx.font = `500 ${subFontSize} "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = node.color;
      const displaySubtitle = isMobile ? (node.mobileSubtitle || node.subtitle) : node.subtitle;
      ctx.fillText(displaySubtitle, node.x, node.y + nodeRadius + (isMobile ? 26 : 32));
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  function showTooltip(node, clientX, clientY) {
    if (!tooltip) return;
    tooltip.querySelector('.hero-node-tooltip-title').textContent = node.name;
    tooltip.querySelector('.hero-node-tooltip-desc').textContent = node.desc;
    tooltip.querySelector('.hero-node-tooltip-stat').textContent = `Metric: ${node.stat}`;

    const isMobile = width < 640;
    const tooltipWidth = isMobile ? 210 : 240;
    const tooltipX = Math.min(width - tooltipWidth - 10, Math.max(10, clientX - tooltipWidth / 2));

    let tooltipY;
    if (clientY > height * 0.45) {
      tooltipY = Math.max(10, clientY - 120);
    } else {
      tooltipY = Math.min(height - 110, clientY + 30);
    }

    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
    tooltip.classList.add('active');
    canvas.style.cursor = 'pointer';
  }

  function hideTooltip() {
    if (tooltip) tooltip.classList.remove('active');
    canvas.style.cursor = 'default';
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;

    const isMobile = width < 640;
    const activeNodes = isMobile ? mobileNodes : desktopNodes;
    let foundNode = null;

    activeNodes.forEach(node => {
      const baseNodeX = node.xRatio * width;
      const baseNodeY = node.yRatio * height;
      const dx = mouse.targetX - baseNodeX;
      const dy = mouse.targetY - baseNodeY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < (isMobile ? 36 : 32)) {
        foundNode = node;
      }
    });

    mouse.hoveredNode = foundNode;

    if (foundNode) {
      showTooltip(foundNode, mouse.targetX, mouse.targetY);
    } else {
      hideTooltip();
    }
  }

  function handleMouseLeave() {
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;
    mouse.hoveredNode = null;
    hideTooltip();
  }

  function handleTouch(e) {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    mouse.targetX = touchX;
    mouse.targetY = touchY;

    const isMobile = width < 640;
    const activeNodes = isMobile ? mobileNodes : desktopNodes;
    let foundNode = null;

    activeNodes.forEach(node => {
      const baseNodeX = node.xRatio * width;
      const baseNodeY = node.yRatio * height;
      const dx = touchX - baseNodeX;
      const dy = touchY - baseNodeY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 38) {
        foundNode = node;
      }
    });

    mouse.hoveredNode = foundNode;

    if (foundNode) {
      showTooltip(foundNode, touchX, touchY);
      if (e.cancelable) e.preventDefault();
    } else {
      hideTooltip();
    }
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  canvas.addEventListener('touchstart', handleTouch, { passive: false });
  canvas.addEventListener('touchmove', handleTouch, { passive: false });

  document.addEventListener('touchstart', (e) => {
    if (!canvas.contains(e.target)) {
      mouse.hoveredNode = null;
      hideTooltip();
    }
  }, { passive: true });

  resize();
  mouse.x = width / 2;
  mouse.y = height / 2;
  mouse.targetX = width / 2;
  mouse.targetY = height / 2;
  draw();
}
