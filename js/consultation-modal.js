/**
 * INFOGNANA - CONSULTATION & DEMO BOOKING MODAL
 * Multi-step interactive modal with dynamic ROI projection
 */

export function initConsultationModal() {
  const modalOverlay = document.getElementById('consultationModalOverlay');
  const openButtons = document.querySelectorAll('.open-consultation-modal-btn');
  const closeButton = document.getElementById('closeConsultationModalBtn');
  const consultationForm = document.getElementById('consultationBookingForm');
  const confirmationView = document.getElementById('modalConfirmationView');

  if (!modalOverlay) return;

  function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formFullName')?.value || 'Valued Healthcare Leader';
      const orgType = document.getElementById('formOrgType')?.value || 'Healthcare Provider';
      const volume = document.getElementById('formVolume')?.value || '10,000+ Claims/Mo';

      // Hide form, show custom confirmation view
      consultationForm.style.display = 'none';
      if (confirmationView) {
        confirmationView.style.display = 'block';
        confirmationView.innerHTML = `
          <div style="text-align: center; padding: 20px 0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 2px solid var(--color-emerald); color: var(--color-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style="color: #FFFFFF; font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Consultation Request Confirmed</h3>
            <p style="color: #94A3B8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px;">
              Thank you, <strong style="color: #FFFFFF;">${name}</strong>. An INFOGNANA SOLUTIONS RCM Principal Solutions Architect has been assigned to your profile for <strong style="color: var(--color-cyan);">${orgType}</strong>.
            </p>

            <div style="background: rgba(14, 24, 52, 0.8); border: 1px solid var(--border-cyan-subtle); border-radius: 12px; padding: 18px; text-align: left; margin-bottom: 24px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-cyan); text-transform: uppercase; margin-bottom: 8px;">
                Initial Projected Optimization Impact (${volume})
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Estimated Revenue Recovery</div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: var(--color-emerald);">+12% to +18%</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Clean Claim Uplift</div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: var(--color-teal);">99.2% Target</div>
                </div>
              </div>
            </div>

            <button type="button" class="btn btn-secondary btn-sm" id="doneModalBtn" style="width: 100%;">
              Close Window
            </button>
          </div>
        `;

        const doneBtn = document.getElementById('doneModalBtn');
        if (doneBtn) {
          doneBtn.addEventListener('click', closeModal);
        }
      }
    });
  }
}
