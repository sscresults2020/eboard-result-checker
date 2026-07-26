// Boards dropdown toggle (mobile-friendly, click to open)
(function () {
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
})();
