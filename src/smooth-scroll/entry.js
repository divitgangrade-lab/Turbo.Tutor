import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import './smooth-scroll.css';

const media = window.matchMedia('(prefers-reduced-motion: reduce)');
let lenis = null;

const start = () => {
  if (lenis || media.matches) return;
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 0.92,
    touchMultiplier: 1.5,
    anchors: { duration: 1.15 },
    respectReducedMotion: true
  });
};

const stop = () => {
  lenis?.destroy();
  lenis = null;
};

const onAnchorClick = event => {
  if (!lenis || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!link) return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
  event.preventDefault();
  window.history.pushState(null, '', url.hash);
};

document.addEventListener('click', onAnchorClick, true);

start();
media.addEventListener?.('change', event => {
  if (event.matches) stop();
  else start();
});
