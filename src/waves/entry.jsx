import { render } from 'preact';

import Waves from './Waves.jsx';

const host = document.getElementById('waves-mount');

const supportsWaves = () => {
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

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsWaves()) {
  render(
    <Waves
      lineColor="#a8e6df"
      accentColor="#e9fffb"
      lineStyle="solid"
      spacing={compact ? 24 : 30}
      lineWidth={0.8}
      rotation={0}
      amplitude={compact ? 12 : 18}
      scale={1.8}
      twist={0.65}
      speed={0.32}
      variation={0}
      mouseInteraction
      mouseRadius={220}
      mouseStrength={0.65}
      bounce={0.42}
      returnDuration={1.7}
      clickRipple
      intro
      fade={0.32}
      opacity={0.58}
      lightMode={false}
      dpr={compact ? 1.35 : 1.75}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
