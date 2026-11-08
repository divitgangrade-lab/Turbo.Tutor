import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import DotField from '../dot-field/DotField.jsx';
import Iridescence from '../iridescence/Iridescence.jsx';

const supportsWebgl2 = () => {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

const useDarkTheme = () => {
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.dataset.theme === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return dark;
};

const compact = window.matchMedia('(max-width: 860px)').matches;

function KitDots() {
  const dark = useDarkTheme();

  return (
    <DotField
      dotRadius={compact ? 1.15 : 1.35}
      dotSpacing={compact ? 17 : 19}
      pattern="grid"
      gradientFrom="#e10600"
      gradientTo="#ffd400"
      gradientAngle={135}
      cursorRadius={210}
      bulgeStrength={0.34}
      twist={7}
      glowColor="#ffd400"
      glowRadius={170}
      glowIntensity={dark ? 0.55 : 0.35}
      baseOpacity={dark ? 0.4 : 0.22}
      waveAmplitude={4}
      sparkle
      speed={0.45}
      interactive
      holdToZoom={false}
      intro
      lightMode={!dark}
      opacity={0.6}
      maxDevicePixelRatio={compact ? 1.1 : 1.4}
    />
  );
}

function TermIridescence() {
  const dark = useDarkTheme();

  return (
    <Iridescence
      color={dark ? '#b98a4e' : '#dcc094'}
      speed={0.2}
      amplitude={0.07}
      mouseReact
      scale={1.2}
      detail={6}
      rotation={16}
      warp={0.85}
      hueShift={10}
      saturation={0.58}
      brightness={1.05}
      contrast={1.12}
      stir={0.24}
      sheen={0.32}
      clickSwirl
      grain={0.02}
      fade={0.45}
      opacity={dark ? 0.7 : 0.55}
      resolution={compact ? 0.6 : 0.8}
    />
  );
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsWebgl2()) {
  const dots = document.getElementById('included-field-mount');
  if (dots) {
    render(<KitDots />, dots);
    dots.dataset.mounted = 'true';
  }

  const iridescence = document.getElementById('term-field-mount');
  if (iridescence) {
    render(<TermIridescence />, iridescence);
    iridescence.dataset.mounted = 'true';
  }
}
