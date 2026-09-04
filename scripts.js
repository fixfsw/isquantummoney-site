// Ticker: animate the running totals from 0 up to their data-value, then
// continue increasing at data-per-sec. Progressive enhancement — if this
// script never runs, the fallback text in each .total-value is already
// accurate for today.

(function () {
  const els = document.querySelectorAll('[data-value][data-per-sec]');
  if (!els.length) return;

  const items = [];
  els.forEach((el) => {
    const value = parseFloat(el.dataset.value);
    const perSec = parseFloat(el.dataset.perSec);
    if (!isFinite(value) || !isFinite(perSec)) return;
    items.push({ el, value, perSec, fallback: el.textContent, last: '' });
  });
  if (!items.length) return;

  const nf = new Intl.NumberFormat('en-US');
  // Floor to `step` to keep low-order digits stable and reduce visual chatter.
  const format = (n, step) => '$' + nf.format(Math.floor(n / step) * step);

  // Hide the animating figure from assistive tech, expose the stable
  // fallback text via a visually-hidden sibling.
  items.forEach(({ el, fallback }) => {
    el.setAttribute('aria-hidden', 'true');
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = fallback;
    el.parentNode.insertBefore(sr, el);
  });

  // Only touch the DOM when the visible string actually changes.
  const write = (item, str) => {
    if (str !== item.last) {
      item.el.textContent = str;
      item.last = str;
    }
  };

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => { write(item, format(item.value, 1)); });
    return;
  }

  const COUNT_UP_MS = 1400;
  const COUNT_UP_STEP = 1e6; // count up in $1M units
  const TICK_STEP = 1e3;     // tick in $1K units
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    if (elapsed < COUNT_UP_MS) {
      const t = easeOutCubic(elapsed / COUNT_UP_MS);
      items.forEach((item) => {
        write(item, format(item.value * t, COUNT_UP_STEP));
      });
    } else {
      const tickElapsed = elapsed - COUNT_UP_MS;
      items.forEach((item) => {
        write(item, format(item.value + (tickElapsed * item.perSec) / 1000, TICK_STEP));
      });
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
