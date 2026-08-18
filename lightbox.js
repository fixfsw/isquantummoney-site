// Screenshot lightbox: click a screenshot in a .screenshots-track to view
// it enlarged, sized to about the track's own displayed width.
//
// Only pages with a .screenshots-track (the app pages) have matching
// triggers, so this script is a no-op everywhere else.

(function () {
  let current = null;

  function trackWidth(track) {
    const rect = track.getBoundingClientRect();
    const available = window.innerWidth - 64; // lightbox side padding
    return Math.min(rect.width, available);
  }

  function close() {
    if (!current) return;
    current.overlay.remove();
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', onKeydown);
    current.trigger.focus();
    current = null;
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  function open(img, trigger, track) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('tabindex', '-1');

    const big = document.createElement('img');
    big.className = 'lightbox-image';
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || '';
    big.style.width = `${trackWidth(track)}px`;

    overlay.appendChild(big);
    overlay.addEventListener('click', close);

    document.body.appendChild(overlay);
    document.body.classList.add('lightbox-open');
    document.addEventListener('keydown', onKeydown);

    current = { overlay, trigger };
    overlay.focus();
  }

  document.querySelectorAll('.screenshots-track .screenshot-trigger').forEach((btn) => {
    const track = btn.closest('.screenshots-track');
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      if (img) open(img, btn, track);
    });
  });
})();
