/**
 * INFOGNANA - METRICS COUNT-UP ANIMATION
 * Animates key numerical indicators on scroll entry using IntersectionObserver
 */

export function initCountUp() {
  const metricElements = document.querySelectorAll('.metric-number[data-target]');
  if (!metricElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateMetric(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  metricElements.forEach(el => observer.observe(el));
}

function animateMetric(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const isFloat = el.getAttribute('data-target').includes('.');
  const duration = 2000; // ms
  const startTime = performance.now();

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const currentVal = easedProgress * target;

    if (isFloat) {
      el.textContent = currentVal.toFixed(1);
    } else {
      el.textContent = Math.floor(currentVal).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (isFloat) {
        el.textContent = target.toFixed(1);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
  }

  requestAnimationFrame(update);
}
