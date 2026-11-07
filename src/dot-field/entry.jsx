import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import DotField from './DotField.jsx';

const host = document.getElementById('dot-field-mount');

const supportsDotField = () => {
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

function WalkthroughBackdrop() {
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
    <DotField
      dotRadius={1.35}
      dotSpacing={15}
      pattern="grid"
      gradientFrom="#e10600"
      gradientTo="#ffd400"
      gradientAngle={135}
      cursorRadius={220}
      bulgeStrength={0.38}
      twist={8}
      glowColor="#ffd400"
      glowRadius={150}
      glowIntensity={dark ? 0.7 : 0.45}
      baseOpacity={dark ? 0.48 : 0.3}
      waveAmplitude={5}
      sparkle
      speed={0.55}
      interactive
      holdToZoom={false}
      intro
      lightMode={!dark}
      opacity={0.62}
      maxDevicePixelRatio={compact ? 1.2 : 1.5}
    />
  );
}

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsDotField()) {
  render(<WalkthroughBackdrop />, host);
  host.dataset.mounted = 'true';
}
