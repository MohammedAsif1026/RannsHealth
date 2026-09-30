/**
 * INFOGNANA - DENIAL MANAGEMENT & RECOVERY VISUALIZER
 * Interactive denial root-cause explorer and workflow step highlighter
 */

const denialCategories = [
  {
    id: 'eligibility',
    title: 'Eligibility & Registration',
    carc: 'CARC 26 / 27',
    desc: 'Coverage expired, inactive member ID, or incorrect primary payer coordination of benefits.',
    aiAction: 'Automated 270/271 real-time payer inquiry, active policy discovery, COB re-sequencing.',
    recoveryRate: '92.4% Recovery Rate'
  },
  {
    id: 'coding',
    title: 'Coding & Medical Necessity',
    carc: 'CARC 50 / 96 / 11',
    desc: 'Diagnosis code does not satisfy payer LCD/NCD coverage policies or unbundled CPT modifiers.',
    aiAction: 'rannsCCR clinical chart extraction identifies documented comorbidities to cross-validate LCD criteria.',
    recoveryRate: '87.1% Recovery Rate'
  },
  {
    id: 'documentation',
    title: 'Missing Documentation',
    carc: 'CARC 252 / 16',
    desc: 'Payer requires supporting operative reports, physician notes, or diagnostic lab evidence.',
    aiAction: 'Automated document package aggregation from EHR with highlighted clinical justification snippets.',
    recoveryRate: '89.6% Recovery Rate'
  },
  {
    id: 'authorization',
    title: 'Prior Authorization',
    carc: 'CARC 197',
    desc: 'Service performed without obtained or approved prior-authorization tracking number.',
    aiAction: 'Retroactive authorization protocol initiation with urgent clinical emergency necessity appeal.',
    recoveryRate: '79.8% Recovery Rate'
  }
];

export function initDenialWorkflow() {
  const cardsContainer = document.getElementById('denialCategoriesGrid');
  if (!cardsContainer) return;

  cardsContainer.innerHTML = denialCategories.map((cat, index) => `
    <div class="category-card" data-cat-id="${cat.id}">
      <div class="cat-header">
        <span class="eyebrow-badge badge-cyan" style="font-size: 0.65rem; padding: 2px 8px;">${cat.carc}</span>
      </div>
      <h4 class="cat-title">${cat.title}</h4>
      <p class="cat-desc">${cat.desc}</p>
      
      <div style="background: rgba(5, 9, 20, 0.6); border-radius: 8px; padding: 10px; margin-bottom: 12px; border-left: 2px solid var(--color-cyan);">
        <div style="font-size: 0.65rem; font-weight: 700; color: var(--color-cyan); text-transform: uppercase; margin-bottom: 2px;">
          INFOGNANA SOLUTIONS Automated AI Fix:
        </div>
        <div style="font-size: 0.75rem; color: #CBD5E1; line-height: 1.4;">
          ${cat.aiAction}
        </div>
      </div>

      <div class="recovery-stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${cat.recoveryRate}</span>
      </div>
    </div>
  `).join('');
}
