/**
 * VACATION HOME WATCH & PROPERTY CHECK SERVICE
 * Main Interactive Module: Theme Toggle (SVG Sun/Moon), RTL/LTR Mode, 
 * Mobile Drawer, Dropdowns, and Back-to-Top Button
 */

(function () {
  'use strict';

  // --- Storage Keys ---
  const THEME_KEY = 'homewatch_theme';
  const DIR_KEY = 'homewatch_dir';

  // SVG Icon Templates
  const SVG_MOON = `
    <svg class="theme-icon theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;

  const SVG_SUN = `
    <svg class="theme-icon theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;

  // --- Theme Management ---
  function initTheme() {
    let savedTheme = 'light';
    try {
      savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {
      savedTheme = 'light';
    }
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}

    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    const iconSvg = isDark ? SVG_SUN : SVG_MOON;

    const themeButtons = document.querySelectorAll('.js-theme-toggle');
    themeButtons.forEach(btn => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);

      // Check if button has specific container or replaces innerHTML
      const iconContainer = btn.querySelector('.theme-icon-container');
      const textLabel = btn.querySelector('.theme-label');

      if (iconContainer) {
        iconContainer.innerHTML = iconSvg;
        if (textLabel) {
          textLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
      } else {
        btn.innerHTML = iconSvg;
      }
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // --- RTL / LTR Management ---
  function initDirection() {
    let savedDir = 'ltr';
    try {
      savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    } catch (e) {
      savedDir = 'ltr';
    }
    applyDirection(savedDir);
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
    try {
      localStorage.setItem(DIR_KEY, dir);
    } catch (e) {}

    const isRtl = dir === 'rtl';
    const targetDir = isRtl ? 'LTR' : 'RTL';
    const label = `Switch text direction to ${targetDir}`;
    const title = `Current: ${dir.toUpperCase()} (Click to switch to ${targetDir})`;

    const rtlButtons = document.querySelectorAll('.js-rtl-toggle');
    rtlButtons.forEach(btn => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', title);

      const ltrOpt = btn.querySelector('.dir-opt-ltr');
      const rtlOpt = btn.querySelector('.dir-opt-rtl');

      if (ltrOpt && rtlOpt) {
        if (isRtl) {
          ltrOpt.classList.remove('active');
          rtlOpt.classList.add('active');
        } else {
          ltrOpt.classList.add('active');
          rtlOpt.classList.remove('active');
        }
      } else {
        // Fallback structured badge if button had plain text
        btn.innerHTML = `
          <span class="dir-opt dir-opt-ltr ${!isRtl ? 'active' : ''}">LTR</span>
          <span class="dir-opt-sep">|</span>
          <span class="dir-opt dir-opt-rtl ${isRtl ? 'active' : ''}">RTL</span>
        `;
      }
    });
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(newDir);
  }

  // --- Navigation & Mobile Drawer ---
  function initNavigation() {
    const hamburgerBtn = document.querySelector('.js-hamburger-btn');
    const drawer = document.querySelector('.js-mobile-drawer');
    const backdrop = document.querySelector('.js-mobile-backdrop');
    const closeBtn = document.querySelector('.js-drawer-close');

    function openDrawer() {
      if (drawer && backdrop) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
      }
    }

    function closeDrawer() {
      if (drawer && backdrop) {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    }

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', openDrawer);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    // Close drawer when clicking any link inside it
    const drawerLinks = document.querySelectorAll('.mobile-nav-drawer a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Mobile accordion dropdown toggle
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const parent = this.closest('.mobile-nav-item');
        if (parent) {
          const list = parent.querySelector('.mobile-dropdown-list');
          if (list) {
            list.classList.toggle('show');
            const isOpen = list.classList.contains('show');
            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          }
        }
      });
    });

    // Attach Event Listeners to Theme & RTL buttons
    document.querySelectorAll('.js-theme-toggle').forEach(btn => {
      if (btn.dataset.themeBound === 'true') return;
      btn.dataset.themeBound = 'true';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
      });
    });

    document.querySelectorAll('.js-rtl-toggle').forEach(btn => {
      if (btn.dataset.rtlBound === 'true') return;
      btn.dataset.rtlBound = 'true';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleDirection();
      });
    });

    // Desktop dropdown toggle on click for keyboard/touch
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        const parent = this.closest('.nav-item');
        if (parent) {
          const menu = parent.querySelector('.dropdown-menu');
          if (menu) {
            const isShown = menu.classList.toggle('show');
            this.setAttribute('aria-expanded', isShown ? 'true' : 'false');
          }
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
          m.classList.remove('show');
          const trigger = m.closest('.nav-item')?.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Global keyboard listener (Escape key closes drawer & dropdowns)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDrawer();
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
          m.classList.remove('show');
          const trigger = m.closest('.nav-item')?.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // --- Back to Top Button ---
  function initBackToTop() {
    const btn = document.querySelector('.js-back-to-top');
    if (!btn) return;

    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 280) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    btn.addEventListener('click', function () {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // --- Page Preloader Controller ---
  function initPagePreloader() {
    const preloader = document.getElementById('page-preloader');
    if (!preloader) return;

    let dismissed = false;
    function hidePreloader() {
      if (dismissed) return;
      dismissed = true;
      preloader.classList.add('loaded');
      setTimeout(() => {
        try {
          preloader.style.display = 'none';
        } catch (e) {}
      }, 500);
    }

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 320);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hidePreloader, 320);
      });
    }

    // Safety fallback timeout: preloader never blocks for more than 1200ms
    setTimeout(hidePreloader, 1200);
  }

  // Run on DOM ready
  function initAll() {
    initPagePreloader();
    initTheme();
    initDirection();
    initNavigation();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Expose helpers globally if needed
  window.HomeWatchApp = {
    toggleTheme,
    toggleDirection,
    applyTheme,
    applyDirection
  };
})();

