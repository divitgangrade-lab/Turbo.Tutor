import { render } from 'preact';

import HalftoneReveal from './HalftoneReveal.jsx';

const mount = document.getElementById('halftone-mount');
const host = document.getElementById('halftone-root');

if (mount) {
  render(
    <HalftoneReveal
      src="go-kart.webp"
      fit="cover"
      mode="mono"
      shape="dot"
      cellSize={6}
      angle={45}
      dotScale={1}
      inkColor="#12161a"
      paperColor="#f7f5f0"
      contrast={1.15}
      brightness={0}
      roughness={0.18}
      revealRadius={95}
      softness={0.6}
      linger={1.1}
      clickBurst
      intro
      style={{ position: 'absolute', inset: 0 }}
    />,
    mount
  );
}

if (host) {
  const check = () => {
    if (host.querySelector('canvas[data-ready="true"]')) {
      host.dataset.mounted = 'true';
      observer.disconnect();
    }
  };
  const observer = new MutationObserver(check);
  observer.observe(host, {
    attributes: true,
    attributeFilter: ['data-ready'],
    childList: true,
    subtree: true
  });
  check();
}
