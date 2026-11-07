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
      color="#f2c46d"
      speed={0.2}
      amplitude={0.3}
      detail={4}
      thickness={1}
      interactive
      maxDevicePixelRatio={compact ? 1.4 : 1.8}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
