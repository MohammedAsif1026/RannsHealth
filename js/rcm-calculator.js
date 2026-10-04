/**
 * INFOGNANA / RannsHealth - INTERACTIVE RCM OPPORTUNITY CALCULATOR
 * Formula:
 *   Monthly Difference = Monthly Collectible Revenue × (Target Rate − Current Rate)
 *   Annual Difference  = Monthly Difference × 12
 */

export function initRcmCalculator() {
  const form = document.getElementById('rcmCalcForm');
  const revenueInput = document.getElementById('rcmMonthlyRevenue');
  const revenueSlider = document.getElementById('rcmRevenueSlider');
  const currentRateInput = document.getElementById('rcmCurrentRate');
  const currentRateSlider = document.getElementById('rcmCurrentRateSlider');
  const targetRateInput = document.getElementById('rcmTargetRate');
  const targetRateSlider = document.getElementById('rcmTargetRateSlider');
  const calcBtn = document.getElementById('rcmCalcBtn');

  // Outputs
  const monthlyDiffDisplay = document.getElementById('rcmMonthlyDiffVal');
  const annualDiffDisplay = document.getElementById('rcmAnnualDiffVal');
  const rateDeltaBadge = document.getElementById('rcmRateDeltaBadge');
  const validationAlert = document.getElementById('rcmValidationAlert');
  const presetChips = document.querySelectorAll('.rcm-preset-chip');

  if (!revenueInput || !currentRateInput || !targetRateInput || !monthlyDiffDisplay) {
    return;
  }

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  function parseNumber(val, defaultVal = 0) {
    if (typeof val === 'number') return val;
    if (!val) return defaultVal;
    const clean = String(val).replace(/[^0-9.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? defaultVal : num;
  }

  function calculate() {
    let revenue = parseNumber(revenueInput.value, 94000);
    let currentRate = parseNumber(currentRateInput.value, 85);
    let targetRate = parseNumber(targetRateInput.value, 95);

    // Bounds checking
    if (revenue < 0) revenue = 0;
    if (currentRate < 0) currentRate = 0;
    if (currentRate > 100) currentRate = 100;
    if (targetRate < 0) targetRate = 0;
    if (targetRate > 100) targetRate = 100;

    // Validation for Target vs Current
    if (targetRate < currentRate) {
      if (validationAlert) {
        validationAlert.style.display = 'block';
        validationAlert.textContent = 'Notice: Target collection rate should be equal to or greater than your current collection rate.';
      }
    } else {
      if (validationAlert) {
        validationAlert.style.display = 'none';
      }
    }

    const rateDeltaPercent = targetRate - currentRate;
    const rateDeltaDecimal = rateDeltaPercent / 100;

    const monthlyDifference = revenue * rateDeltaDecimal;
    const annualDifference = monthlyDifference * 12;

    // Update displays
    monthlyDiffDisplay.textContent = currencyFormatter.format(Math.max(0, monthlyDifference));
    if (annualDiffDisplay) {
      annualDiffDisplay.textContent = `${currencyFormatter.format(Math.max(0, annualDifference))} annualized`;
    }

    if (rateDeltaBadge) {
      const sign = rateDeltaPercent >= 0 ? '+' : '';
      rateDeltaBadge.textContent = `${sign}${rateDeltaPercent.toFixed(1)}% Collection Delta`;
    }

    // Sync sliders if they exist
    if (revenueSlider && document.activeElement !== revenueSlider) {
      revenueSlider.value = Math.min(revenue, parseFloat(revenueSlider.max) || 5000000);
    }
    if (currentRateSlider && document.activeElement !== currentRateSlider) {
      currentRateSlider.value = currentRate;
    }
    if (targetRateSlider && document.activeElement !== targetRateSlider) {
      targetRateSlider.value = targetRate;
    }
  }

  // Event Listeners for Reactive Updates
  revenueInput.addEventListener('input', calculate);
  currentRateInput.addEventListener('input', calculate);
  targetRateInput.addEventListener('input', calculate);

  if (revenueSlider) {
    revenueSlider.addEventListener('input', (e) => {
      revenueInput.value = e.target.value;
      calculate();
    });
  }

  if (currentRateSlider) {
    currentRateSlider.addEventListener('input', (e) => {
      currentRateInput.value = e.target.value;
      calculate();
    });
  }

  if (targetRateSlider) {
    targetRateSlider.addEventListener('input', (e) => {
      targetRateInput.value = e.target.value;
      calculate();
    });
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculate();
      // Smooth pulse animation on results
      monthlyDiffDisplay.parentElement.classList.remove('pulse-anim');
      void monthlyDiffDisplay.parentElement.offsetWidth; // trigger reflow
      monthlyDiffDisplay.parentElement.classList.add('pulse-anim');
    });
  }

  // Quick Preset Chips
  if (presetChips.length > 0) {
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.getAttribute('data-revenue');
        if (val) {
          revenueInput.value = val;
          calculate();
        }
      });
    });
  }

  // Initial calculation on load
  calculate();
}
