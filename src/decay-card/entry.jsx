import { render } from 'preact';

import DecayCard from './DecayCard.jsx';

const root = document.getElementById('decay-root');
const host = document.getElementById('decay-mount');

const supportsDecay = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

if (root && host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsDecay()) {
  render(
    <DecayCard
      image="f1-helmet.webp"
      width={360}
      height={450}
      intensity={0.6}
      sensitivity={0.5}
      hoverDecay={0.1}
      recovery={0.9}
      grain={0.26}
      detail={4}
      pattern={4}
      idle={0.26}
      flow={0.12}
      chroma={0.14}
      travel={24}
      tilt={7}
      scope="card"
      radius={0}
      grayscale={false}
      style={{ width: '100%', height: '100%' }}
    />,
    host
  );
  root.dataset.mounted = 'true';
}
