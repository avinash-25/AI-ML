(function () {
  "use strict";

  function select(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function selectAll(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function closeAllDropdowns() {
    selectAll('.nav-link[aria-expanded="true"]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
    });
    selectAll('.dropdown').forEach(function (menu) {
      menu.hidden = true;
    });
  }

  function openDropdown(name) {
    closeAllDropdowns();
    var button = select('.nav-link[data-menu="' + name + '"]');
    var menu = select('#menu-' + name);
    if (button && menu) {
      button.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    }
  }

  function toggleDropdown(name) {
    var button = select('.nav-link[data-menu="' + name + '"]');
    var menu = select('#menu-' + name);
    if (!button || !menu) return;
    var isOpen = button.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeAllDropdowns();
    } else {
      openDropdown(name);
    }
  }

  function setupDropdowns() {
    selectAll('.nav-item.has-menu .nav-link').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var name = btn.getAttribute('data-menu');
        toggleDropdown(name);
      });
    });
    document.addEventListener('click', function (e) {
      var withinAny = e.target.closest('.dropdown') || e.target.closest('.nav-item.has-menu');
      if (!withinAny) closeAllDropdowns();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  }

  function setupMobileMenu() {
    var hamburger = select('#hamburger');
    var mobileMenu = select('#mobile-menu');
    var mobileClose = select('#mobile-close');
    if (!hamburger || !mobileMenu) return;

    function open() {
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function close() {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () { open(); });
    mobileClose && mobileClose.addEventListener('click', function () { close(); });
    mobileMenu.addEventListener('click', function (e) { if (e.target === mobileMenu) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    selectAll('.mobile-nav a[data-open]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var name = link.getAttribute('data-open');
        close();
        setTimeout(function () { openDropdown(name); }, 50);
      });
    });
  }

  function setupSearch() {
    var input = select('#site-search');
    var popover = select('#search-popover');
    if (!input || !popover) return;

    function showPopover() { popover.hidden = false; }
    function hidePopover() { popover.hidden = true; }

    input.addEventListener('focus', showPopover);
    input.addEventListener('input', showPopover);

    document.addEventListener('click', function (e) {
      if (e.target === input || e.target.closest('#search-popover')) return;
      hidePopover();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== input && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        input.focus();
      }
      if (e.key === 'Escape') hidePopover();
    });
  }

  function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === 'light' || theme === 'dark') {
      html.setAttribute('data-theme', theme);
      try { localStorage.setItem('theme', theme); } catch (_) {}
    }
  }

  function setupThemeToggle() {
    var html = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (_) {}
    if (saved === 'light' || saved === 'dark') {
      html.setAttribute('data-theme', saved);
    }

    var btn = select('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function init() {
    setupDropdowns();
    setupMobileMenu();
    setupSearch();
    setupThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();