/**
 * INFOGNANA SOLUTIONS - rannsCDE AGENTIC AI DOCUMENT SCANNER
 * Interactive document processing simulation showcasing:
 * Classification -> Scanned/Handwritten OCR -> PHI Redaction -> Structured Extraction -> Validated Output
 */

export function initRannsCdeScanner() {
  const docContainer = document.getElementById('rannsCdeDocStream');
  const nodePills = document.querySelectorAll('.cde-pipeline-node');
  if (!docContainer) return;

  const docTypes = [
    {
      title: 'Handwritten Clinical Intake & H&P',
      badge: 'Handwritten OCR',
      badgeColor: '#00F0FF',
      fields: [
        { label: 'Patient Name', val: 'DOE, JOHN [REDACTED]', tag: 'PHI Redacted', tagColor: '#EF4444' },
        { label: 'Encounter Diagnosis', val: 'Severe Lumbar Radiculopathy', tag: 'ICD-10: M54.16', tagColor: '#10B981' },
        { label: 'Physician Signature', val: 'Dr. Michael Chen, MD (Verified)', tag: 'OCR Validated 99.8%', tagColor: '#00D2B4' }
      ]
    },
    {
      title: 'CMS-1500 Paper Claim Form',
      badge: 'Semi-Structured Form',
      badgeColor: '#8B5CF6',
      fields: [
        { label: 'Payer ID', val: 'BCBS-TX-00892', tag: 'Payer Validated', tagColor: '#00F0FF' },
        { label: 'CPT Code / Modifier', val: '99214 - 25 (E&M Service)', tag: 'CCI Checked', tagColor: '#10B981' },
        { label: 'Prior Auth Number', val: 'AUTH-2026-9812A', tag: '278 Confirmed', tagColor: '#F59E0B' }
      ]
    },
    {
      title: 'Prior-Authorization Letter & Lab EOB',
      badge: 'Unstructured PDF',
      badgeColor: '#10B981',
      fields: [
        { label: 'Service Requested', val: 'Lumbar MRI (72148)', tag: 'LCD Approved', tagColor: '#10B981' },
        { label: 'Medical Necessity', val: 'Documented 6-wk PT Failure', tag: 'Evidence Extracted', tagColor: '#00D2B4' },
        { label: 'Target Destination', val: 'Epic EHR / Cerner 837 Pipe', tag: 'FHIR Export Ready', tagColor: '#8B5CF6' }
      ]
    }
  ];

  let currentDocIndex = 0;

  function renderDoc(index) {
    const doc = docTypes[index];
    if (!doc) return;

    docContainer.innerHTML = `
      <div class="cde-live-doc-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="cde-live-doc-badge" style="background: ${doc.badgeColor}20; color: ${doc.badgeColor}; border: 1px solid ${doc.badgeColor}60;">
            ${doc.badge}
          </span>
          <span style="font-size: 0.78rem; font-weight: 700; color: #0F172A;">${doc.title}</span>
        </div>
        <span class="cde-status-pill">⚡ Processing Active</span>
      </div>

      <div class="cde-doc-content-area">
        <div class="cde-laser-scan-line"></div>
        ${doc.fields.map(f => `
          <div class="cde-extracted-field-row">
            <div>
              <div class="cde-field-label">${f.label}</div>
              <div class="cde-field-val">${f.val}</div>
            </div>
            <span class="cde-field-tag" style="background: ${f.tagColor}15; color: ${f.tagColor}; border: 1px solid ${f.tagColor}50;">
              ${f.tag}
            </span>
          </div>
        `).join('')}
      </div>
    `;

    // Highlight pipeline node
    if (nodePills.length) {
      nodePills.forEach((node, i) => {
        node.classList.toggle('active', i === index);
      });
    }
  }

  // Initial render
  renderDoc(0);

  // Cycle document samples periodically
  setInterval(() => {
    currentDocIndex = (currentDocIndex + 1) % docTypes.length;
    renderDoc(currentDocIndex);
  }, 4500);
}
