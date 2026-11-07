import { render } from 'preact';

import Plasma from './Plasma.jsx';

const host = document.getElementById('plasma-mount');

const supportsPlasma = () => {
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

const compact = window.matchMedia('(max-width: 860px)').matches;

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsPlasma()) {
  render(
    <Plasma
      color="#ffd400"
      speed={0.42}
      direction="forward"
      scale={1.1}
      twist={1.2}
      wave={0.85}
      softness={0.52}
      shine={1.05}
      brightness={0.82}
      grain={0.03}
      quality={compact ? 0.4 : 0.58}
      mouseInteractive
      intro
      fade={0.3}
      opacity={0.58}
      lightMode={false}
      dpr={compact ? 1.25 : 1.6}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
