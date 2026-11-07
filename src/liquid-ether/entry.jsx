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
      colors={['#252a27', '#7d2c24', '#6f5a1c']}
      intensity={1.2}
      mouseForce={21}
      cursorSize={215}
      persistence={0.8}
      viscosity={0.1}
      resolution={compact ? 0.3 : 0.5}
      autoDemo
      autoSpeed={1.05}
      autoIntensity={3}
      autoResumeDelay={650}
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
