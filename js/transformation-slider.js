/**
 * INFOGNANA - REVENUE TRANSFORMATION ENGINE
 * Interactive Before & After comparison visualizer
 */

export function initTransformationSlider() {
  const toggleButtons = document.querySelectorAll('.trans-view-toggle-btn');
  const beforeCard = document.querySelector('.trans-card.before-card');
  const afterCard = document.querySelector('.trans-card.after-card');
  const engineCircle = document.querySelector('.engine-core-circle');

  if (!toggleButtons.length || !beforeCard || !afterCard) return;

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode'); // 'all', 'before', 'after'

      toggleButtons.forEach(b => b.classList.toggle('active', b === btn));

      if (mode === 'before') {
        beforeCard.style.opacity = '1';
        beforeCard.style.transform = 'scale(1.02)';
        afterCard.style.opacity = '0.4';
        afterCard.style.transform = 'scale(0.98)';
      } else if (mode === 'after') {
        afterCard.style.opacity = '1';
        afterCard.style.transform = 'scale(1.02)';
        beforeCard.style.opacity = '0.4';
        beforeCard.style.transform = 'scale(0.98)';
      } else {
        beforeCard.style.opacity = '1';
        beforeCard.style.transform = 'scale(1)';
        afterCard.style.opacity = '1';
        afterCard.style.transform = 'scale(1)';
      }
    });
  });

  if (engineCircle) {
    engineCircle.addEventListener('mouseenter', () => {
      engineCircle.style.transform = 'scale(1.15)';
      engineCircle.style.boxShadow = '0 0 60px rgba(0, 240, 255, 0.9)';
    });
    engineCircle.addEventListener('mouseleave', () => {
      engineCircle.style.transform = '';
      engineCircle.style.boxShadow = '';
    });
  }
}
