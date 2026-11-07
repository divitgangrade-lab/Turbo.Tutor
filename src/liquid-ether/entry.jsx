import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import LiquidEther from './LiquidEther.jsx';

const host = document.getElementById('liquid-ether-mount');

const supportsLiquidEther = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    const supported = Boolean(
      gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float')
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return supported;
  } catch {
    return false;
  }
};

function PlansBackdrop() {
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');
  const compact = window.matchMedia('(max-width: 860px)').matches;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.dataset.theme === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <LiquidEther
      colors={['#1b232a', '#e10600', '#ffd400']}
      intensity={0.95}
      mouseForce={16}
      cursorSize={92}
      persistence={0.68}
      viscosity={0.12}
      resolution={compact ? 0.3 : 0.5}
      autoDemo
      autoSpeed={0.32}
      autoIntensity={1.4}
      autoResumeDelay={1800}
      clickBurst={false}
      bounceEdges={false}
      intro
      lightMode={!dark}
      backgroundColor="transparent"
      maxDevicePixelRatio={compact ? 1.25 : 1.75}
    />
  );
}

if (
  host &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  supportsLiquidEther()
) {
  render(<PlansBackdrop />, host);
  host.dataset.mounted = 'true';
}
