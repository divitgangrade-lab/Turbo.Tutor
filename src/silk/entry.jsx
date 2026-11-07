import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Silk from './Silk.jsx';

const host = document.getElementById('silk-mount');

const supportsSilk = () => {
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

function SpecialtyBackdrop() {
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
    <Silk
      color={dark ? '#2b2020' : '#cfc7b7'}
      sheenColor={dark ? '#ffd400' : '#ffffff'}
      speed={3.6}
      scale={1.05}
      rotation={0.35}
      sheen={dark ? 0.6 : 0.48}
      depth={0.55}
      glow={dark ? 0.4 : 0.24}
      noiseIntensity={1.1}
      ripple={0.8}
      wave={0.9}
      mouseInteraction
      interactionStrength={0.75}
      clickRipple={false}
      intro
      fade={0.32}
      lightMode={!dark}
      dpr={compact ? 1.25 : 1.75}
    />
  );
}

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsSilk()) {
  render(<SpecialtyBackdrop />, host);
  host.dataset.mounted = 'true';
}
