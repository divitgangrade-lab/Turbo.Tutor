(() => {
  'use strict';

  const loader = document.querySelector('.tt-loader');
  if (!loader) return;

  const MIN_VISIBLE = 500;
  const started = performance.now();
  let finished = false;

  const signal = state => {
    window.dispatchEvent(new CustomEvent(`tt:loader-${state}`));
  };

  const show = () => {
    const wasHidden = loader.classList.contains('is-hidden');
    loader.classList.remove('is-hidden');
    loader.removeAttribute('aria-hidden');
    if (wasHidden) signal('show');
  };

  const hide = () => {
    if (loader.classList.contains('is-hidden')) return;
    loader.classList.add('is-hidden');
    loader.setAttribute('aria-hidden', 'true');
    signal('hidden');
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    const wait = Math.max(0, MIN_VISIBLE - (performance.now() - started));
    window.setTimeout(hide, wait);
  };

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });
  window.setTimeout(finish, 9000);

  document.addEventListener(
    'click',
    event => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link || link.hasAttribute('download')) return;
      if (link.target && link.target !== '_self') return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      show();
      window.setTimeout(hide, 1600);
    },
    true
  );

  window.addEventListener('pageshow', event => {
    if (event.persisted) hide();
  });
})();
