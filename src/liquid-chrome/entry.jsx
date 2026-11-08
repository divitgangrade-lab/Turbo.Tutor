import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import LiquidChrome from './LiquidChrome.jsx';

const host = document.getElementById('liquid-chrome-mount');
const loader = document.querySelector('.tt-loader');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compact = window.matchMedia('(max-width: 760px)').matches;

const supportsWebGL2 = () => {
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

const LoaderChrome = () => {
  const [active, setActive] = useState(() => !(loader && loader.classList.contains('is-hidden')));

  useEffect(() => {
    const show = () => setActive(true);
    const hide = () => setActive(false);
    window.addEventListener('tt:loader-show', show);
    window.addEventListener('tt:loader-hidden', hide);
    return () => {
      window.removeEventListener('tt:loader-show', show);
      window.removeEventListener('tt:loader-hidden', hide);
    };
  }, []);

  return (
    <LiquidChrome
      color="#dfe3e8"
      speed={reduced ? 0 : compact ? 1.25 : 1.55}
      amplitude={0.9}
      frequencyX={4.2}
      frequencyY={3.4}
      detail={compact ? 6 : 8}
      thickness={1.2}
      depth={2}
      roughness={0.22}
      exposure={1.1}
      interactive={!reduced}
      rippleStrength={3.5}
      rippleSize={2.8}
      tilt={1.4}
      intro={false}
      maxDevicePixelRatio={compact ? 1.5 : 1.75}
      active={active}
    />
  );
};

if (host && supportsWebGL2()) {
  render(<LoaderChrome />, host);
  host.dataset.mounted = 'true';
}
