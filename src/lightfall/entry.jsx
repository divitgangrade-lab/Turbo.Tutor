import { render } from 'preact';

import Lightfall from './Lightfall.jsx';

const host = document.getElementById('lightfall-mount');

const supportsLightfall = () => {
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

const compact = window.matchMedia('(max-width: 860px)').matches;

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsLightfall()) {
  render(
    <Lightfall
      colors={['#ff4b2f', '#ffd400', '#ff8a1f', '#fff0d0']}
      backgroundColor="#ff2b1a"
      speed={0.34}
      streakCount={3}
      streakWidth={0.65}
      streakLength={1.3}
      density={0.42}
      twinkle={0.22}
      zoom={3.1}
      backgroundGlow={0.16}
      headGlow={0.82}
      depth={0.55}
      bloom={0.4}
      glow={1}
      opacity={0.72}
      mouseInteraction
      mouseStrength={0.8}
      mouseRadius={0.55}
      mouseDampening={0.08}
      lens={0.95}
      holdToWarp={false}
      intro
      fade={0.28}
      lightMode={false}
      dpr={compact ? 1.25 : 1.75}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
