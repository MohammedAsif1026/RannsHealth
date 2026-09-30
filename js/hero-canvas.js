/**
 * INFOGNANA - INTERACTIVE 3D/CANVAS RCM DATA-FLOW VISUALIZATION
 * Renders an enterprise 3D perspective data-flow node graph:
 * Eligibility -> Authorization -> Claims -> Payment Posting -> Denial Resolution -> Analytics
 */

export function initHeroCanvas() {
  const canvas = document.getElementById('heroDataFlowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('heroNodeTooltip');
  let animationFrameId;
  let width, height;

  // Stages definition
  const nodes = [
    { id: 'eligibility', name: 'Eligibility', subtitle: '270/271 Real-Time', stat: '99.8% Verified', desc: 'Instant insurance eligibility checks & coverage validation before patient encounters.', color: '#00F0FF', xRatio: 0.14, yRatio: 0.35, z: 0 },
    { id: 'authorization', name: 'Authorization', subtitle: 'AI Prior-Auth', stat: '96.4% Approval', desc: 'Automated clinical documentation checking & prior-auth validation.', color: '#00D2B4', xRatio: 0.30, yRatio: 0.65, z: 20 },
    { id: 'claims', name: 'Claims Submission', subtitle: 'Rules Engine', stat: '99.2% Clean Rate', desc: 'Pre-submission scrubbing with 2,500+ payer-specific LCD/NCD validation rules.', color: '#8B5CF6', xRatio: 0.50, yRatio: 0.30, z: 10 },
    { id: 'payment', name: 'Payment Posting', subtitle: '835 ERA Auto-Post', stat: '<2hr Auto-Post', desc: 'Automated EOB data capture, electronic posting, and write-off reconciliation.', color: '#00F0FF', xRatio: 0.70, yRatio: 0.65, z: 30 },
    { id: 'denial', name: 'Denial Resolution', subtitle: 'Root Cause AI', stat: '84.7% Recovered', desc: 'Automated denial classification, smart routing, and rapid appeal package generation.', color: '#F59E0B', xRatio: 0.86, yRatio: 0.35, z: 15 },
    { id: 'analytics', name: 'AI & Analytics', subtitle: 'RCM Intelligence', stat: '4.8x ROI Impact', desc: 'End-to-end executive visibility, payer scorecards, and continuous revenue optimization.', color: '#10B981', xRatio: 0.50, yRatio: 0.85, z: 40 }
  ];

  // Animated Particles flowing along paths
  const particles = [];
  const particleCount = 42;

  // Mouse tilt tracking
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, hoveredNode: null };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pathIndex: Math.floor(Math.random() * (nodes.length - 1)),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      size: 1.8 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.6
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

    // Smooth mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    const calculatedNodes = nodes.map(node => {
      const baseNodeX = node.xRatio * width;
      const baseNodeY = node.yRatio * height;
      const tiltX = (mouse.x - width / 2) * (node.z / 600);
      const tiltY = (mouse.y - height / 2) * (node.z / 600);
      return {
        ...node,
        x: baseNodeX + tiltX,
        y: baseNodeY + tiltY,
        radius: 20
      };
    });

    // Draw connecting bezier pathways
    for (let i = 0; i < calculatedNodes.length - 1; i++) {
      const start = calculatedNodes[i];
      const end = calculatedNodes[i + 1];

      const cp1 = { x: start.x + (end.x - start.x) * 0.5, y: start.y };
      const cp2 = { x: start.x + (end.x - start.x) * 0.5, y: end.y };

      // Base glowing line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Outer glow line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 10;
      ctx.stroke();
    }

    // Connect last node to first to close analytics loop
    const firstNode = calculatedNodes[0];
    const analyticsNode = calculatedNodes[calculatedNodes.length - 1];
    ctx.beginPath();
    ctx.moveTo(analyticsNode.x, analyticsNode.y);
    ctx.bezierCurveTo(analyticsNode.x - 100, analyticsNode.y, firstNode.x, analyticsNode.y + 40, firstNode.x, firstNode.y);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.lineWidth = 2;
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
      const cp1 = { x: start.x + (end.x - start.x) * 0.5, y: start.y };
      const cp2 = { x: start.x + (end.x - start.x) * 0.5, y: end.y };

      const pos = getCurvePoint(start, cp1, cp2, end, p.progress);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Nodes
    calculatedNodes.forEach((node, index) => {
      const isHovered = mouse.hoveredNode && mouse.hoveredNode.id === node.id;
      const nodeRadius = isHovered ? 26 : 20;

      // Outer ripple ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius + 10, 0, Math.PI * 2);
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
      ctx.shadowBlur = isHovered ? 25 : 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node border
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.stroke();

      // Inner pulsating core
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Node Labels
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + nodeRadius + 18);

      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = node.color;
      ctx.fillText(node.subtitle, node.x, node.y + nodeRadius + 32);
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;

    // Check node hover
    const dpr = window.devicePixelRatio || 1;
    const mouseCanvasX = mouse.targetX;
    const mouseCanvasY = mouse.targetY;

    let foundNode = null;
    nodes.forEach(node => {
      const baseNodeX = node.xRatio * width;
      const baseNodeY = node.yRatio * height;
      const dx = mouseCanvasX - baseNodeX;
      const dy = mouseCanvasY - baseNodeY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 32) {
        foundNode = node;
      }
    });

    mouse.hoveredNode = foundNode;

    if (foundNode && tooltip) {
      tooltip.querySelector('.hero-node-tooltip-title').textContent = foundNode.name;
      tooltip.querySelector('.hero-node-tooltip-desc').textContent = foundNode.desc;
      tooltip.querySelector('.hero-node-tooltip-stat').textContent = `Metric: ${foundNode.stat}`;

      const tooltipX = Math.min(width - 230, Math.max(10, mouse.targetX - 110));
      const tooltipY = Math.max(10, mouse.targetY - 120);

      tooltip.style.left = `${tooltipX}px`;
      tooltip.style.top = `${tooltipY}px`;
      tooltip.classList.add('active');
      canvas.style.cursor = 'pointer';
    } else if (tooltip) {
      tooltip.classList.remove('active');
      canvas.style.cursor = 'default';
    }
  }

  function handleMouseLeave() {
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;
    mouse.hoveredNode = null;
    if (tooltip) tooltip.classList.remove('active');
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);

  resize();
  mouse.x = width / 2;
  mouse.y = height / 2;
  mouse.targetX = width / 2;
  mouse.targetY = height / 2;
  draw();
}
