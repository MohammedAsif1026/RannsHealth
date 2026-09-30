/**
 * INFOGNANA - RCM LIFECYCLE INTERACTIVE JOURNEY
 * Manages the 5-stage interactive horizontal timeline, benefits display, and active laser indicator
 */

const lifecycleData = [
  {
    id: 'pre-auth',
    num: 'Stage 01',
    title: 'Pre-Authorization & Eligibility',
    badge: 'Front-End Accuracy',
    headline: 'Stop Denials Before They Happen at Patient Access',
    description: 'Real-time 270/271 insurance eligibility verification combined with automated prior-authorization checks. INFOGNANA SOLUTIONS surfaces clinical documentation gaps upfront to eliminate front-end registration errors.',
    features: [
      'Automated real-time coverage and co-pay/deductible verification',
      'Intelligent prior-authorization rules engine across all major commercial & government payers',
      'Front-end demographic and registration error auto-correction',
      'Reduces front-end denials by up to 88%'
    ],
    stats: [
      { label: 'Front-End Denial Reduction', value: '88%' },
      { label: 'Prior-Auth Turnaround', value: '< 24 Hours' },
      { label: 'Eligibility Scrub Rate', value: '100% Real-Time' }
    ]
  },
  {
    id: 'claims-processing',
    num: 'Stage 02',
    title: 'Claims Processing & Scrubbing',
    badge: 'Clean Submission',
    headline: 'Sub-Second Validation with Over 2,500 Payer Rule Sets',
    description: 'High-speed automated claim scrubbing cross-references local and national coverage determinations (LCDs/NCDs), correct coding initiatives (CCI edits), and payer-specific fee schedules before electronic 837 batch dispatch.',
    features: [
      'Automated CCI, LCD, and NCD medical necessity validation',
      'Payer-specific clearinghouse pre-scrubbing for instant error detection',
      'Automated secondary & tertiary claim generation with primary EOB cross-linking',
      'Achieves consistent 99%+ first-pass clean claim submission rates'
    ],
    stats: [
      { label: 'First-Pass Clean Claim Rate', value: '99.2%' },
      { label: 'Claim Batch Dispatch Speed', value: '< 2 Hours' },
      { label: 'Coding Accuracy SLA', value: '99.5%' }
    ]
  },
  {
    id: 'payment-posting',
    num: 'Stage 03',
    title: 'Payment Posting & Reconciliation',
    badge: 'Fast Liquidity',
    headline: 'Automated 835 ERA Ingestion and Flawless Balancing',
    description: 'Accelerate cash application with automated electronic remittance advice (ERA) parsing, robotic matching against claims records, zero-balance write-off verification, and real-time bank ledger reconciliation.',
    features: [
      'Automated electronic remittance advice (835 ERA) ingestion and line-item posting',
      'Optical Character Recognition (OCR) for paper EOB and check conversion',
      'Automated contractual adjustment and approved write-off verification',
      'Daily automated bank-to-EHR reconciliation reporting'
    ],
    stats: [
      { label: 'Auto-Posting Rate', value: '96.5%' },
      { label: 'Posting Turnaround Time', value: '< 12 Hours' },
      { label: 'Reconciliation Variance', value: '0.00%' }
    ]
  },
  {
    id: 'denial-management',
    num: 'Stage 04',
    title: 'Denial Management & Resolution',
    badge: 'Revenue Recovery',
    headline: 'AI Root-Cause Categorization and Rapid Appeals',
    description: 'Every denied claim is immediately analyzed by our NLP rules engine, classified into actionable root-cause categories (CO/PR codes), and automatically routed to specialized certified recovery teams with pre-built appeal documentation.',
    features: [
      'Instant CARC & RARC root-cause categorization and triage',
      'Automated appeal package generation with attached clinical evidence',
      'Intelligent high-dollar and aged A/R priority work queues',
      'Continuous feedback loop to update front-end validation rules'
    ],
    stats: [
      { label: 'Denial Recovery Rate', value: '84.7%' },
      { label: 'Average Days to Appeal', value: '< 48 Hours' },
      { label: 'A/R Days Reduction', value: '38% Avg' }
    ]
  },
  {
    id: 'analytics-optimization',
    num: 'Stage 05',
    title: 'Analytics & Continuous Optimization',
    badge: 'Executive Visibility',
    headline: '360° Financial Clarity and Payer Performance Insights',
    description: 'Executive dashboards provide real-time visibility into collection velocity, net collection ratios, payer dispute trends, and staff productivity metrics to guide strategic executive decision-making.',
    features: [
      'Real-time executive KPI dashboards with multi-facility roll-up',
      'Payer scorecard monitoring contract compliance and underpayments',
      'Predictive cash flow forecasting and denial trend heatmaps',
      'Full compliance tracking and audit trail generation'
    ],
    stats: [
      { label: 'Executive Reporting Cycle', value: 'Real-Time' },
      { label: 'Underpayment Recovery ROI', value: '4.8x' },
      { label: 'Audit Trail Retention', value: '7+ Years' }
    ]
  }
];

export function initRcmLifecycle() {
  const stepButtons = document.querySelectorAll('.lifecycle-step-btn');
  const activeLaser = document.querySelector('.lifecycle-active-laser');
  const detailsCard = document.getElementById('lifecycleDetailsCard');
  if (!stepButtons.length || !detailsCard) return;

  function renderStage(index) {
    const stage = lifecycleData[index];
    if (!stage) return;

    // Update active button state
    stepButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Update active laser bar position
    if (activeLaser) {
      activeLaser.style.left = `${index * 20}%`;
      activeLaser.style.width = '20%';
    }

    // Render details content
    detailsCard.innerHTML = `
      <div class="lifecycle-details-content">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <span class="eyebrow-badge badge-cyan">${stage.num}</span>
          <span class="eyebrow-badge badge-teal">${stage.badge}</span>
        </div>
        <h3 style="color: #FFFFFF; font-size: 1.6rem; margin-bottom: 12px; font-weight: 700;">${stage.headline}</h3>
        <p style="color: #94A3B8; font-size: 0.95rem; line-height: 1.7; margin-bottom: 20px;">${stage.description}</p>
        
        <div class="lifecycle-features-list">
          ${stage.features.map(f => `
            <div class="lifecycle-feature-item">
              <div class="feature-check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span style="color: #E2E8F0; font-size: 0.88rem; font-weight: 500;">${f}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="lifecycle-metrics-box">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-cyan); letter-spacing: 0.08em; margin-bottom: 4px;">
          Stage Performance Benchmark
        </div>
        ${stage.stats.map(s => `
          <div class="stat-pill">
            <span class="stat-pill-label">${s.label}</span>
            <span class="stat-pill-val" style="color: var(--color-teal);">${s.value}</span>
          </div>
        `).join('')}
        <div style="font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-top: 4px;">
          * Reported outcomes across INFOGNANA SOLUTIONS client cohort
        </div>
      </div>
    `;
  }

  stepButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      renderStage(index);
    });
  });

  // Initial render of first stage
  renderStage(0);
}
