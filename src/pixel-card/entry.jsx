import { render } from 'preact';

import PixelCard from './PixelCard.jsx';
import './specialty-pixels.css';

const cards = [...document.querySelectorAll('#specialty [data-specialty]')];

const forward = (pixel, event) => {
  pixel.dispatchEvent(
    new PointerEvent(event.type, {
      bubbles: false,
      cancelable: false,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType || 'mouse',
      isPrimary: true
    })
  );
};

const mount = card => {
  if (card.dataset.pixelCard === 'on') return;
  const layer = document.createElement('div');
  layer.className = 'specialty-pixel-layer';
  layer.setAttribute('aria-hidden', 'true');
  card.prepend(layer);

  render(
    <PixelCard
      colors={['#e10600', '#ffd400', '#f7f5f0']}
      glowColor="#e10600"
      gap={6}
      pixelSize={2.6}
      speed={30}
      shape="square"
      origin="pointer"
      revealDuration={650}
      spotlight={0.65}
      glow={0.4}
      opacity={0.55}
      fade={0.55}
      trigger="hover"
      clickPulse
      intro
      noFocus
      theme="dark"
      radius={0}
      style={{ width: '100%', height: '100%', background: 'transparent', boxShadow: 'none' }}
    />,
    layer
  );

  const pixel = layer.querySelector('.pixel-card');
  if (!pixel) return;
  pixel.tabIndex = -1;
  card.dataset.pixelCard = 'on';

  for (const type of ['pointerenter', 'pointermove', 'pointerleave', 'pointerdown']) {
    card.addEventListener(type, event => forward(pixel, event), { passive: true });
  }
};

cards.forEach(mount);
