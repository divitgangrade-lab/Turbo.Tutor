import { render } from 'preact';

import LiquidChrome from './LiquidChrome.jsx';

const host = document.getElementById('liquid-chrome-mount');
const compact = window.matchMedia('(max-width: 860px)').matches;

const supportsLiquidChrome = () => {
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

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsLiquidChrome()) {
  render(
    <LiquidChrome
      color="#b8c2d2"
      speed={0.12}
      amplitude={0.2}
      frequencyX={2.2}
      frequencyY={2.6}
      detail={3}
      thickness={0.9}
      depth={0.8}
      roughness={0.46}
      exposure={0.95}
      interactive
      rippleStrength={0.35}
      rippleSize={0.9}
      tilt={0.55}
      intro
      lightMode={false}
      maxDevicePixelRatio={compact ? 1.3 : 1.6}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
