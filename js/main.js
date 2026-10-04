/**
 * INFOGNANA - MAIN CLIENT ENTRY POINT
 * Initializes all interactive modules, scroll-spy, and event handlers
 */

import { initHeroCanvas } from './hero-canvas.js';
import { initCountUp } from './countup.js';
import { initRcmLifecycle } from './rcm-lifecycle.js';
import { initRannsccrScanner } from './rannsccr-scanner.js';
import { initTransformationSlider } from './transformation-slider.js';
import { initAnalyticsDashboard } from './analytics-dashboard.js';
import { initDenialWorkflow } from './denial-workflow.js';
import { initConsultationModal } from './consultation-modal.js';
import { initAmbientBg } from './ambient-bg.js';
import { initHeroTextAnimations } from './hero-text-anim.js';
import { initRannsCdeScanner } from './rannscde-scanner.js';
import { initRcmCalculator } from './rcm-calculator.js';
import { initLoadingScreen } from './loading-screen.js';

// Initialize loading screen controller immediately
initLoadingScreen();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sticky Header & Scroll-Spy
  initNavigation();

  // 2. Initialize Reveal on Scroll
  initScrollReveal();

  // 3. Initialize Interactive Background & Kinetic Animations
  initAmbientBg();
  initHeroBackgroundVideo();
  initHeroTextAnimations();

  // 4. Initialize Interactive Components
  initHeroCanvas();
  initCountUp();
  initRcmLifecycle();
  initRannsccrScanner();
  initRannsCdeScanner();
  initRcmCalculator();
  initTransformationSlider();
  initAnalyticsDashboard();
  initDenialWorkflow();
  initConsultationModal();
});

function initNavigation() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  const navLinks = document.querySelectorAll('.nav-link:not(.nav-dropdown-trigger)');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdownContainers = document.querySelectorAll('.nav-item-dropdown');

  // --- 1. Multi-Dropdown State Management (AI Labs, Specialties, etc.) ---
  dropdownContainers.forEach((dropdownContainer) => {
    const dropdownTrigger = dropdownContainer.querySelector('.nav-dropdown-trigger');
    const dropdownItems = dropdownContainer.querySelectorAll('.nav-dropdown-item');
    if (!dropdownTrigger) return;

    function openDropdown() {
      // Close other open dropdowns first
      dropdownContainers.forEach((other) => {
        if (other !== dropdownContainer) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.nav-dropdown-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
      dropdownContainer.classList.add('open');
      dropdownTrigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      dropdownContainer.classList.remove('open');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown() {
      const isOpen = dropdownContainer.classList.contains('open');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    // Click toggle (desktop click & mobile tap)
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Keyboard support on trigger
    dropdownTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
        if (dropdownItems.length > 0) {
          dropdownItems[0].focus();
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Keyboard navigation within dropdown items
    dropdownItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % dropdownItems.length;
          dropdownItems[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + dropdownItems.length) % dropdownItems.length;
          dropdownItems[prevIndex].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeDropdown();
          dropdownTrigger.focus();
        } else if (e.key === 'Tab') {
          // If tabbing off last item, close dropdown
          if (!e.shiftKey && index === dropdownItems.length - 1) {
            closeDropdown();
          } else if (e.shiftKey && index === 0) {
            closeDropdown();
          }
        }
      });
    });
  });

  // Close any open dropdown on click outside
  document.addEventListener('click', (e) => {
    dropdownContainers.forEach((container) => {
      if (!container.contains(e.target)) {
        container.classList.remove('open');
        const trigger = container.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- 2. Smart Smooth Header Hide on Scroll Down / Reveal on Scroll Up ---
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let isHeaderHidden = false;
  let isNavigating = false;
  let navScrollTimeout = null;
  const SCROLL_THRESHOLD = 60; // Keep visible at top
  const SCROLL_DELTA = 5;      // Jitter buffer

  // Keep header visible when clicking any in-page navigation anchor
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (!href) return;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const targetId = href.substring(hashIndex + 1);
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.add('is-revealed');
        targetEl.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
        isNavigating = true;
        if (isHeaderHidden) {
          header.classList.remove('header-hidden');
          isHeaderHidden = false;
        }
        header.classList.add('scrolled');
        clearTimeout(navScrollTimeout);
        navScrollTimeout = setTimeout(() => {
          isNavigating = false;
          lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        }, 800);
      }
    });
  });

  function handleScroll() {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    // A. At or near top of page: always visible and not scrolled-compact
    if (currentScrollY <= SCROLL_THRESHOLD) {
      if (isHeaderHidden) {
        header.classList.remove('header-hidden');
        isHeaderHidden = false;
      }
      header.classList.toggle('scrolled', currentScrollY > 20);
      lastScrollY = Math.max(0, currentScrollY);
      return;
    }

    header.classList.add('scrolled');

    // B. Guard: Do not hide if user is interacting with dropdown, mobile menu, or has keyboard focus inside header
    const hasFocus = header.contains(document.activeElement);
    const isMobileOpen = navMenu && navMenu.classList.contains('mobile-open');
    const isDropdownOpen = dropdownContainer && dropdownContainer.classList.contains('open');

    if (hasFocus || isMobileOpen || isDropdownOpen) {
      if (isHeaderHidden) {
        header.classList.remove('header-hidden');
        isHeaderHidden = false;
      }
      lastScrollY = Math.max(0, currentScrollY);
      return;
    }

    // C. Scroll delta evaluation (or keep visible during programmatic anchor navigation)
    if (isNavigating) {
      if (isHeaderHidden) {
        header.classList.remove('header-hidden');
        isHeaderHidden = false;
      }
      header.classList.add('scrolled');
      lastScrollY = Math.max(0, currentScrollY);
    } else {
      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) >= SCROLL_DELTA) {
        if (diff > 0 && currentScrollY > SCROLL_THRESHOLD) {
          // User is scrolling DOWN -> Hide header smoothly
          if (!isHeaderHidden) {
            header.classList.add('header-hidden');
            isHeaderHidden = true;
            closeDropdown();
          }
        } else if (diff < 0) {
          // User is scrolling UP -> Reappear smoothly
          if (isHeaderHidden) {
            header.classList.remove('header-hidden');
            isHeaderHidden = false;
          }
        }
      }
      lastScrollY = Math.max(0, currentScrollY);
    }

    // D. In-page Scroll-Spy (if sections exist)
    if (sections.length > 0) {
      let currentSectionId = '';
      const scrollPosition = currentScrollY + 140;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          link.classList.toggle('active', targetId === currentSectionId);
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // When keyboard user tabs into header, immediately bring header into view
  header.addEventListener('focusin', () => {
    if (isHeaderHidden) {
      header.classList.remove('header-hidden');
      isHeaderHidden = false;
    }
  });

  // --- 3. Mobile Navigation Menu Toggle ---
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (!isOpen) {
        closeDropdown();
      }
    });

    // Close mobile menu when any link is clicked
    const allMenuLinks = navMenu.querySelectorAll('a');
    allMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        closeDropdown();
      });
    });
  }
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // Add js-ready class to document element
  document.documentElement.classList.add('js-ready');

  // Immediately mark any elements in or near initial viewport as is-revealed
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight + 80) {
      el.classList.add('is-revealed');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.02,
    rootMargin: '100px 0px'
  });

  revealElements.forEach(el => {
    if (!el.classList.contains('is-revealed')) {
      observer.observe(el);
    }
  });
}

function initHeroBackgroundVideo() {
  const video = document.getElementById('heroVideo');
  const container = document.getElementById('heroVideoContainer');
  if (!video || !container) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isSmallScreen = window.matchMedia('(max-width: 768px)');
  const isDataSaver = navigator.connection && navigator.connection.saveData === true;

  function evaluatePlayback() {
    if (motionQuery.matches || isSmallScreen.matches || isDataSaver) {
      video.pause();
      container.classList.add('video-disabled');
      video.classList.remove('is-playing');
    } else {
      container.classList.remove('video-disabled');
      // Begin background video load asynchronously without blocking page display
      if (video.preload === 'none') {
        video.preload = 'auto';
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.classList.add('is-playing');
        }).catch(() => {
          // Autoplay policy: leave fallback visible, start on user interaction if needed
        });
      }
    }
  }

  // Graceful fallback if video fails to load
  video.addEventListener('error', () => {
    container.classList.add('video-disabled');
    video.classList.remove('is-playing');
  });

  // Fade in only once video is actually playing frames
  video.addEventListener('playing', () => {
    video.classList.add('is-playing');
  });

  video.addEventListener('canplay', () => {
    if (!motionQuery.matches && !isSmallScreen.matches && !isDataSaver) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.classList.add('is-playing');
        }).catch(() => {});
      }
    }
  });

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', evaluatePlayback);
    isSmallScreen.addEventListener('change', evaluatePlayback);
  }

  // Load video strictly in the background after main content has painted
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => evaluatePlayback(), { timeout: 600 });
  } else {
    setTimeout(evaluatePlayback, 60);
  }
}
