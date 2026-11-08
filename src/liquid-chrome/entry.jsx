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
      color="#f4f7fb"
      speed={reduced ? 0 : compact ? 0.45 : 0.55}
      amplitude={0.7}
      frequencyX={2.4}
      frequencyY={2}
      detail={5}
      thickness={1.4}
      depth={1.5}
      roughness={0.2}
      exposure={0.85}
      interactive={!reduced}
      rippleStrength={2}
      rippleSize={2}
      tilt={0.9}
      intro={false}
      maxDevicePixelRatio={compact ? 1.25 : 1.5}
      active={active}
    />
  );
};

if (host && supportsWebGL2()) {
  render(<LoaderChrome />, host);
  host.dataset.mounted = 'true';
}
