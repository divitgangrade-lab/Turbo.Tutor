import { render } from 'preact';

import PixelSwap from './PixelSwap.jsx';

const mount = document.getElementById('pixel-swap-mount');
const fallback = document.querySelector('.hero-swap-fallback');

if (mount) {
  render(
    <PixelSwap
      firstContent={
        <img
          className="hero-swap-image"
          src="f1-car.webp"
          alt="Carlos Sainz driving a red Ferrari Formula 1 car at the 2023 Austrian Grand Prix"
          width="1200"
          height="500"
          loading="eager"
          decoding="async"
        />
      }
      secondContent={
        <img
          className="hero-swap-image"
          src="go-kart.webp"
          alt="A go-kart racing on a track"
          width="960"
          height="620"
          loading="eager"
          decoding="async"
        />
      }
      pattern="pointer"
      pixelSize={48}
      pixelRadius={0}
      duration={480}
      pixelDuration={360}
      randomness={0.2}
      bounce={0.3}
      trigger="hover"
      intro={false}
      aspectRatio="12 / 5"
      ariaLabel="Hover or focus to switch between the Formula 1 car and the go-kart photographs"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />,
    mount
  );

  if (fallback) fallback.setAttribute('aria-hidden', 'true');
}
