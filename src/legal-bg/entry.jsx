import { render } from 'preact';

import FallingText from '../falling-text/FallingText.jsx';
import Topography from './Topography.jsx';

const root = document.documentElement;
const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const compact = window.matchMedia?.('(max-width: 760px)').matches ?? false;

const supportsWebgl2 = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch (error) {
    return false;
  }
};

const mountFalling = () => {
  document.querySelectorAll('[data-legal-fall]').forEach(host => {
    const text = host.getAttribute('data-legal-fall');
    if (!text || host.dataset.mounted) return;
    render(
      <FallingText
        text={text}
        trigger="click"
        variant="tile"
        split="words"
        order="random"
        stagger={0.045}
        gravity={1.05}
        bounciness={0.18}
        scatter={0.24}
        restoreDelay={4.2}
        cursorPush={0.35}
        fontSize={compact ? '0.78rem' : '0.92rem'}
        accentColor="#28e0c8"
        theme="dark"
        draggable
        className="legal-fall__body"
      />,
      host
    );
    host.dataset.mounted = 'true';
  });
};

const mountScene = () => {
  if (document.querySelector('.legal-scene')) return;
  const layer = document.createElement('div');
  layer.className = 'legal-scene';
  layer.setAttribute('aria-hidden', 'true');
  const terrain = document.createElement('div');
  terrain.className = 'legal-scene__topo';
  layer.append(terrain);
  document.body.prepend(layer);
  root.dataset.legalScene = 'live';

  render(
    <Topography
      color="#2fe0c8"
      lineCount={compact ? 20 : 26}
      lineWidth={1.2}
      majorLines
      elevation={0.9}
      foreground={0.2}
      scale={1.05}
      detail={0.45}
      tilt={22}
      speed={compact ? 0.1 : 0.22}
      direction="forward"
      morph={1}
      glow={1}
      depthOfField={0.6}
      fog={0.4}
      brightness={1.7}
      opacity={1}
      mouseInteraction
      hoverEffect="light"
      mouseRadius={2.5}
      mouseStrength={1.5}
      trail={0.35}
      parallax={1}
      clickEffect="pulse"
      markers="dots"
      glitch={0.3}
      dpr={compact ? 1.25 : 1.5}
    />,
    terrain
  );
};

if (reduce) {
  root.dataset.legalStatic = 'true';
} else {
  mountFalling();
  if (supportsWebgl2()) mountScene();
}
