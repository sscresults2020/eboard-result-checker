// nav.js — all navigation behavior for Exam Results BD
// Handles: (1) Boards dropdown toggle (open/close), (2) active-state highlight of the current page.
(function () {
  "use strict";

  // ---- 1. Dropdown toggle (mobile-friendly, click to open) ----
  var toggles = document.querySelectorAll('.nav-dropdown-toggle');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var menu = btn.nextElementSibling;
      var isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Close when clicking anywhere else
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-dropdown-menu.open').forEach(function (menu) {
      menu.classList.remove('open');
      menu.previousElementSibling.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown-menu.open').forEach(function (menu) {
        menu.classList.remove('open');
        menu.previousElementSibling.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ---- 2. Active-state: highlight the current page's menu item ----
  var path = location.pathname.replace(/\/$/, '') || '/';

  document.querySelectorAll('nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '');
    if (href === path || (path === '/' && (href === '/' || href === ''))) {
      if (!a.closest('.nav-dropdown-menu')) a.classList.add('active');
    }
  });

  // If a dropdown board page is active, mark the toggle button too
  document.querySelectorAll('.nav-dropdown-menu a[href]').forEach(function (a) {
    if (a.getAttribute('href').replace(/\/$/, '') === path) {
      var t = document.querySelector('.nav-dropdown-toggle');
      if (t) t.classList.add('active');
    }
  });
})();