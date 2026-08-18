// Theme toggle: light / auto / dark segmented control.
//
// "Auto" (no stored preference) follows the OS/browser via the
// prefers-color-scheme media query in style.css — this script never touches
// that case. An explicit light/dark choice is persisted to localStorage and
// applied via a `data-theme` attribute on <html>, which the same stylesheet
// gives priority over the media query.
//
// The static markup ships with "Auto" marked active, which is correct for
// any first-time visitor; this script only needs to correct that highlight
// for returning visitors who previously chose light or dark, and to wire up
// clicks. See the inline head script on each page for the (pre-paint) part
// that avoids a flash of the wrong theme.

(function () {
  const KEY = 'theme';
  const root = document.documentElement;
  const group = document.querySelector('.theme-toggle');
  if (!group) return;

  const buttons = group.querySelectorAll('[data-theme-choice]');

  function stored() {
    try {
      const value = localStorage.getItem(KEY);
      return value === 'light' || value === 'dark' ? value : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function apply(choice) {
    if (choice === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', choice);
    }
    buttons.forEach((btn) => {
      btn.setAttribute('aria-checked', String(btn.dataset.themeChoice === choice));
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.themeChoice;
      try {
        if (choice === 'auto') {
          localStorage.removeItem(KEY);
        } else {
          localStorage.setItem(KEY, choice);
        }
      } catch (e) {
        // Storage unavailable (private browsing etc.) — theme still applies
        // for the rest of this page view, it just won't persist.
      }
      apply(choice);
    });
  });

  apply(stored());
})();
