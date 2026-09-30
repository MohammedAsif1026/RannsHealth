/**
 * INFOGNANA - rannsCCR COGNITIVE CHART READER SHOWCASE
 * Features an interactive clinical chart scanner, sub-second search bar,
 * entity highlighting, and real-time AI cognitive synthesis summary.
 */

const sampleChartText = `
CHIEF COMPLAINT & ENCOUNTER NOTE:
Patient is a 58-year-old male presenting for comprehensive endocrinology evaluation and longitudinal management.

CLINICAL HISTORY & ASSESSMENT:
1. <span class="entity-tag diagnosis" data-type="Diagnosis" data-code="E11.42" data-conf="99.4%">Type 2 Diabetes Mellitus with Diabetic Polyneuropathy [ICD-10: E11.42]</span>. Hemoglobin A1c measured at 8.9% (elevated from 7.4% baseline). Patient reports progressive bilateral distal lower extremity paresthesias and burning sensations.
2. <span class="entity-tag diagnosis" data-type="Diagnosis" data-code="I10" data-conf="98.7%">Essential Primary Hypertension [ICD-10: I10]</span>. Blood pressure measured at 148/92 mmHg today in sitting position.
3. <span class="entity-tag diagnosis" data-type="Diagnosis" data-code="E78.5" data-conf="97.2%">Hyperlipidemia, Unspecified [ICD-10: E78.5]</span>. LDL-C recorded at 142 mg/dL.

ACTIVE MEDICATIONS & DOSING:
• <span class="entity-tag medication" data-type="Medication" data-code="RxNorm: 860975" data-conf="99.8%">Metformin HCl 1000 mg Oral Tablet</span> - 1 tab PO BID with meals.
• <span class="entity-tag medication" data-type="Medication" data-code="RxNorm: 199955" data-conf="99.1%">Lisinopril 20 mg Oral Tablet</span> - 1 tab PO daily in the morning.
• <span class="entity-tag medication" data-type="Medication" data-code="RxNorm: 259255" data-conf="98.5%">Atorvastatin Calcium 40 mg Oral Tablet</span> - 1 tab PO at bedtime.
• <span class="entity-tag medication" data-type="Medication" data-code="RxNorm: 25480" data-conf="96.8%">Gabapentin 300 mg Capsule</span> - 1 cap PO TID for neuropathic discomfort.

PROCEDURES & LAB ORDERS:
• <span class="entity-tag procedure" data-type="Procedure" data-code="CPT: 99214" data-conf="99.6%">Office/Outpatient Visit, Established Patient, Moderate Complexity [CPT: 99214]</span>.
• <span class="entity-tag procedure" data-type="Procedure" data-code="CPT: 83036" data-conf="99.2%">Hemoglobin Glycated A1c Quantitative Assay [CPT: 83036]</span>.
• <span class="entity-tag procedure" data-type="Procedure" data-code="CPT: 95907" data-conf="95.4%">Nerve Conduction Velocity Diagnostic Study [CPT: 95907]</span>.

PRIOR-AUTHORIZATION & RISK FACTORS:
• <span class="entity-tag auth" data-type="Prior-Auth" data-code="Auth# 88402-PA" data-conf="97.8%">Prior-Auth approved for SGLT2 inhibitor addition (Empagliflozin 10mg)</span>.
• <span class="entity-tag risk" data-type="Risk Factor" data-code="CMS-HCC V28: HCC 38" data-conf="99.1%">Hierarchical Condition Category: Diabetes with Chronic Complications (RAF Score Impact +0.318)</span>.
`;

const extractedEntities = [
  { type: 'Diagnosis', code: 'E11.42', label: 'Type 2 Diabetes with Diabetic Polyneuropathy', conf: '99.4%', color: '#EF4444' },
  { type: 'Diagnosis', code: 'I10', label: 'Essential Primary Hypertension', conf: '98.7%', color: '#EF4444' },
  { type: 'Medication', code: 'Rx: 860975', label: 'Metformin 1000mg BID + Gabapentin 300mg TID', conf: '99.8%', color: '#00F0FF' },
  { type: 'Procedure', code: 'CPT: 99214', label: 'Level 4 Established Patient Visit (Moderate Complexity)', conf: '99.6%', color: '#8B5CF6' },
  { type: 'Prior-Auth', code: 'Auth# 88402', label: 'SGLT2 Add-On Protocol Verified Active', conf: '97.8%', color: '#F59E0B' },
  { type: 'HCC Risk', code: 'HCC 38', label: 'Chronic Complication RAF Impact (+0.318)', conf: '99.1%', color: '#10B981' }
];

export function initRannsccrScanner() {
  const chartBody = document.getElementById('chartDocumentBody');
  const searchInput = document.getElementById('chartSearchInput');
  const speedBadge = document.getElementById('searchSpeedBadge');
  const entitiesContainer = document.getElementById('extractedEntitiesContainer');
  if (!chartBody || !entitiesContainer) return;

  // Insert initial formatted text
  chartBody.innerHTML = sampleChartText.trim().replace(/\n/g, '<br>');

  // Render initial extracted entities
  renderEntities(extractedEntities);

  // Bind interactive entity tag clicks
  setupEntityInteractions();

  // Search input handler with sub-second timer
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const startTime = performance.now();

      if (!query) {
        chartBody.innerHTML = sampleChartText.trim().replace(/\n/g, '<br>');
        renderEntities(extractedEntities);
        setupEntityInteractions();
        if (speedBadge) speedBadge.textContent = '⚡ Search in <0.20s';
        return;
      }

      // Filter entities
      const filtered = extractedEntities.filter(item => 
        item.label.toLowerCase().includes(query) || 
        item.code.toLowerCase().includes(query) || 
        item.type.toLowerCase().includes(query)
      );
      renderEntities(filtered);

      // Highlight matching terms in chart document
      let updatedText = sampleChartText.trim().replace(/\n/g, '<br>');
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      updatedText = updatedText.replace(regex, '<mark style="background: rgba(0, 240, 255, 0.4); color: #FFFFFF; padding: 0 4px; border-radius: 2px;">$1</mark>');
      chartBody.innerHTML = updatedText;
      setupEntityInteractions();

      const elapsed = (performance.now() - startTime).toFixed(2);
      if (speedBadge) {
        speedBadge.textContent = `⚡ Matched in ${elapsed}ms (${filtered.length} found)`;
      }
    });
  }

  function renderEntities(items) {
    if (!items.length) {
      entitiesContainer.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          No direct entity matches found for this search filter.
        </div>
      `;
      return;
    }

    entitiesContainer.innerHTML = items.map(item => `
      <div class="extracted-item-card" data-code="${item.code}">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="entity-type-badge" style="background: ${item.color}22; color: ${item.color}; border: 1px solid ${item.color}55;">
              ${item.type}
            </span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #94A3B8;">${item.code}</span>
          </div>
          <span style="font-size: 0.82rem; font-weight: 600; color: #FFFFFF; margin-top: 4px;">${item.label}</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
          <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Confidence</span>
          <span class="confidence-score">${item.conf}</span>
        </div>
      </div>
    `).join('');
  }

  function setupEntityInteractions() {
    const tags = chartBody.querySelectorAll('.entity-tag');
    tags.forEach(tag => {
      tag.addEventListener('mouseenter', () => {
        const type = tag.getAttribute('data-type');
        const code = tag.getAttribute('data-code');
        const conf = tag.getAttribute('data-conf');

        // Highlight matching extracted card
        const matchingCard = entitiesContainer.querySelector(`[data-code="${code}"]`);
        if (matchingCard) {
          matchingCard.style.borderColor = 'var(--color-cyan)';
          matchingCard.style.background = 'rgba(0, 240, 255, 0.15)';
        }
      });

      tag.addEventListener('mouseleave', () => {
        const code = tag.getAttribute('data-code');
        const matchingCard = entitiesContainer.querySelector(`[data-code="${code}"]`);
        if (matchingCard) {
          matchingCard.style.borderColor = '';
          matchingCard.style.background = '';
        }
      });
    });
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
