/**
 * INFOGNANA - INTERACTIVE REVENUE DASHBOARD
 * Renders dynamic financial charts, time-range toggles, and live simulated claims feed
 */

const chartDataSets = {
  '30D': {
    labels: ['Day 1', 'Day 6', 'Day 12', 'Day 18', 'Day 24', 'Day 30'],
    cleanRate: [98.2, 98.7, 99.1, 99.0, 99.4, 99.6],
    denialRate: [4.2, 3.1, 2.4, 1.9, 1.4, 0.8],
    recovered: '$1.42M',
    arDays: '18.4'
  },
  '90D': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    cleanRate: [97.5, 98.6, 99.4],
    denialRate: [5.8, 3.2, 1.2],
    recovered: '$4.82M',
    arDays: '19.1'
  },
  '1Y': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    cleanRate: [96.1, 97.8, 98.9, 99.5],
    denialRate: [8.4, 4.6, 2.1, 0.9],
    recovered: '$18.6M',
    arDays: '18.8'
  }
};

const liveClaims = [
  { id: 'CLM-98241', payer: 'BlueCross BlueShield', amount: '$4,850.00', status: 'Clean', time: 'Just now' },
  { id: 'CLM-98240', payer: 'Medicare Part B', amount: '$1,240.50', status: 'Processed', time: '12s ago' },
  { id: 'CLM-98239', payer: 'UnitedHealthcare', amount: '$8,920.00', status: 'Recovered', time: '45s ago' },
  { id: 'CLM-98238', payer: 'Aetna Commercial', amount: '$3,100.00', status: 'Clean', time: '1m ago' },
  { id: 'CLM-98237', payer: 'Cigna Health', amount: '$2,670.00', status: 'Processed', time: '2m ago' }
];

export function initAnalyticsDashboard() {
  const canvas = document.getElementById('revenueTrendsCanvas');
  const timeButtons = document.querySelectorAll('.time-filter-btn');
  const liveFeedContainer = document.getElementById('liveClaimsFeedList');
  const kpiCleanRate = document.getElementById('dashKpiCleanRate');
  const kpiRecovered = document.getElementById('dashKpiRecovered');
  const kpiArDays = document.getElementById('dashKpiArDays');

  let currentPeriod = '90D';

  function renderChart() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const data = chartDataSets[currentPeriod];
    if (!data) return;

    // Draw grid lines
    const padding = { top: 20, right: 30, bottom: 35, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Plot Clean Rate Curve (Cyan)
    const pointsClean = data.cleanRate.map((val, idx) => {
      const x = padding.left + (chartW / (data.cleanRate.length - 1)) * idx;
      const normalized = (val - 95) / 5; // range 95% - 100%
      const y = padding.top + chartH - normalized * chartH;
      return { x, y, val };
    });

    // Draw Gradient Area under Clean Rate Curve
    ctx.beginPath();
    ctx.moveTo(pointsClean[0].x, pointsClean[0].y);
    for (let i = 1; i < pointsClean.length; i++) {
      const prev = pointsClean[i - 1];
      const curr = pointsClean[i];
      const midX = (prev.x + curr.x) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, (prev.y + curr.y) / 2);
    }
    ctx.lineTo(pointsClean[pointsClean.length - 1].x, pointsClean[pointsClean.length - 1].y);
    ctx.lineTo(pointsClean[pointsClean.length - 1].x, padding.top + chartH);
    ctx.lineTo(pointsClean[0].x, padding.top + chartH);
    ctx.closePath();

    const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    areaGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    areaGrad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Draw Line
    ctx.beginPath();
    ctx.moveTo(pointsClean[0].x, pointsClean[0].y);
    for (let i = 1; i < pointsClean.length; i++) {
      ctx.lineTo(pointsClean[i].x, pointsClean[i].y);
    }
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Dots and Labels
    pointsClean.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#050914';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();

      // X Axis Label
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[idx], pt.x, height - 10);
    });

    // Update KPI Numbers in mini-cards
    if (kpiCleanRate) kpiCleanRate.textContent = `${data.cleanRate[data.cleanRate.length - 1]}%`;
    if (kpiRecovered) kpiRecovered.textContent = data.recovered;
    if (kpiArDays) kpiArDays.textContent = `${data.arDays} Days`;
  }

  // Bind Time Filter Buttons
  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.getAttribute('data-period');
      renderChart();
    });
  });

  // Render live claims feed
  function renderFeed() {
    if (!liveFeedContainer) return;
    liveFeedContainer.innerHTML = liveClaims.map(c => `
      <div class="live-claim-item">
        <div>
          <div style="font-weight: 700; color: #FFFFFF; font-family: var(--font-mono); font-size: 0.75rem;">
            ${c.id} • ${c.payer}
          </div>
          <div style="color: var(--text-muted); font-size: 0.7rem; margin-top: 2px;">
            ${c.amount} • <span style="color: var(--color-teal);">${c.time}</span>
          </div>
        </div>
        <span class="claim-badge ${c.status.toLowerCase()}">${c.status}</span>
      </div>
    `).join('');
  }

  // Simulate periodic new claims arrival
  setInterval(() => {
    const payers = ['Aetna', 'Humana', 'BCBS', 'Medicare', 'Cigna', 'UnitedHealthcare'];
    const randomPayer = payers[Math.floor(Math.random() * payers.length)];
    const randomAmount = `$${(Math.random() * 6000 + 800).toFixed(2)}`;
    const randomId = `CLM-${Math.floor(Math.random() * 90000 + 10000)}`;
    const statuses = ['Clean', 'Processed', 'Recovered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    liveClaims.unshift({
      id: randomId,
      payer: randomPayer,
      amount: randomAmount,
      status: randomStatus,
      time: 'Just now'
    });

    if (liveClaims.length > 6) liveClaims.pop();
    renderFeed();
  }, 5000);

  window.addEventListener('resize', renderChart);
  renderChart();
  renderFeed();
}
