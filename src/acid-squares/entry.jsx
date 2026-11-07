import { render } from 'preact';

import AcidSquares from './AcidSquares.jsx';

const host = document.getElementById('acid-squares-mount');

const supportsWebgl2 = () => {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
};

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsWebgl2()) {
  const compact = window.matchMedia('(max-width: 720px)').matches;

  render(
    <AcidSquares
      color="#0a0c0f"
      accentColor="#e10600"
      secondaryColor="#ffd400"
      tileSize={1}
      gap={0.14}
      roundness={0.24}
      rotation={35}
      waves={0.9}
      pulse={0.85}
      pulseSpeed={0.4}
      pulseSpacing={1.2}
      speed={0.45}
      lighting="split"
      tilt={0.68}
      zoom={1.05}
      depth={12}
      brightness={0.95}
      grain={0.08}
      fade={0.28}
      opacity={0.72}
      intro
      mouseInteraction
      detail={compact ? 'low' : 'medium'}
      dpr={compact ? 1.25 : 1.75}
    />,
    host
  );

  host.dataset.mounted = 'true';
}
