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
      speed={reduced ? 0 : compact ? 1.8 : 2.2}
      amplitude={1.1}
      frequencyX={4.4}
      frequencyY={3.6}
      detail={compact ? 7 : 8}
      thickness={0.9}
      depth={2.8}
      roughness={0.08}
      exposure={1.45}
      interactive={!reduced}
      rippleStrength={5}
      rippleSize={2.4}
      tilt={1.7}
      intro={false}
      maxDevicePixelRatio={compact ? 1.6 : 2}
      active={active}
    />
  );
};

if (host && supportsWebGL2()) {
  render(<LoaderChrome />, host);
  host.dataset.mounted = 'true';
}
