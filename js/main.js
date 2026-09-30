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

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sticky Header & Scroll-Spy
  initNavigation();

  // 2. Initialize Reveal on Scroll
  initScrollReveal();

  // 3. Initialize Interactive Background & Kinetic Animations
  initAmbientBg();
  initHeroTextAnimations();

  // 4. Initialize Interactive Components
  initHeroCanvas();
  initCountUp();
  initRcmLifecycle();
  initRannsccrScanner();
  initTransformationSlider();
  initAnalyticsDashboard();
  initDenialWorkflow();
  initConsultationModal();
});

function initNavigation() {
  const header = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-Spy active section highlight
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

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
  });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
