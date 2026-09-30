/**
 * INFOGNANA SOLUTIONS - HERO KINETIC TEXT ANIMATIONS
 * Staggered mask reveals, dynamic rotating value propositions,
 * and high-end typography micro-interactions.
 */

export function initHeroTextAnimations() {
  const rotatingTarget = document.getElementById('heroRotatingText');
  if (!rotatingTarget) return;

  const phrases = [
    'Better Healthcare.',
    'Maximum Reimbursements.',
    'Zero Denial Backlogs.',
    'Instant Chart Intelligence.',
    '99.2% Clean Claims.'
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typingSpeed = 40;
    } else {
      charIndex++;
      typingSpeed = 80;
    }

    rotatingTarget.textContent = currentPhrase.substring(0, charIndex);

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full word
      typingSpeed = 2400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  // Trigger typing loop after initial entrance
  setTimeout(typeLoop, 2000);
}
