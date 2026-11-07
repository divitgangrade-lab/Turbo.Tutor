import { render } from 'preact';

import Iridescence from './Iridescence.jsx';

const host = document.getElementById('iridescence-mount');

const supportsIridescence = () => {
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

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsIridescence()) {
  render(
    <Iridescence
      color="#aebbd6"
      speed={0.24}
      amplitude={0.08}
      mouseReact
      scale={1.18}
      detail={7}
      rotation={18}
      warp={0.9}
      hueShift={8}
      saturation={0.72}
      brightness={1.08}
      contrast={1.15}
      stir={0.28}
      sheen={0.38}
      clickSwirl
      grain={0.025}
      fade={0.42}
      opacity={0.62}
      resolution={compact ? 0.7 : 0.85}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
