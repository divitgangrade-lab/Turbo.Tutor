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

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A busy page can refuse a new WebGL context for a moment while other islands
// claim theirs, so try again instead of leaving the section flat.
const mountWaves = (attempt = 0) => {
  if (!host || reduced) return;
  if (!supportsWaves()) {
    if (attempt < 8) window.setTimeout(() => mountWaves(attempt + 1), 350);
    return;
  }

  render(
    <Waves
      lineColor="#8ff3e6"
      accentColor="#f2fffd"
      lineStyle="solid"
      spacing={compact ? 22 : 27}
      lineWidth={1}
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
      fade={0.24}
      opacity={0.78}
      lightMode={false}
      dpr={compact ? 1.35 : 1.75}
    />,
    host
  );
  host.dataset.mounted = 'true';
};

mountWaves();
