import { render } from 'preact';

import FallingText from '../falling-text/FallingText.jsx';
import Ballpit from './Ballpit.jsx';
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
  const pit = document.createElement('div');
  pit.className = 'legal-scene__balls';
  layer.append(terrain, pit);
  document.body.prepend(layer);
  root.dataset.legalScene = 'live';

  render(
    <Topography
      color="#28e0c8"
      lineCount={compact ? 18 : 24}
      lineWidth={1.3}
      majorLines
      elevation={1.15}
      foreground={0.28}
      scale={1.05}
      detail={0.4}
      tilt={38}
      speed={0.14}
      direction="forward"
      morph={0.6}
      glow={1}
      depthOfField={0.5}
      fog={0.5}
      brightness={1.6}
      opacity={1}
      mouseInteraction
      hoverEffect="trace"
      mouseRadius={2.2}
      mouseStrength={1.1}
      trail={0.42}
      parallax={0.8}
      clickEffect="pulse"
      markers="dots"
      glitch={0.24}
      dpr={1.5}
    />,
    terrain
  );

  render(
    <Ballpit
      count={compact ? 44 : 90}
      colors={['#eef3f5', '#28e0c8', '#ff3d81']}
      material="metal"
      minSize={0.38}
      maxSize={1}
      gravity={0.34}
      friction={0.998}
      wallBounce={0.92}
      bounce={0.82}
      depth={2.4}
      drift={0.22}
      followCursor
      cursorSize={0.9}
      grab
      clickEffect="burst"
      lightColor="#ff3d81"
      lightIntensity={1.15}
      exposure={1.2}
      shadows={0.38}
      dpr={1.5}
    />,
    pit
  );
};

if (reduce) {
  root.dataset.legalStatic = 'true';
} else {
  mountFalling();
  if (supportsWebgl2()) mountScene();
}
