import { render } from 'preact';
import FluxLines from './FluxLines.jsx';

const host = document.getElementById('flux-lines-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <FluxLines
      colors={['#ffffff', '#ffd400', '#f7f5f0']}
      speed={0.45}
      scale={1.45}
      turbulence={1.05}
      fluidity={0.12}
      rimWidth={0.2}
      sharpness={2.2}
      shimmer={0.8}
      glow={2.1}
      lineWidth={1}
      flowDirection="down"
      mouseInteraction
      mouseStrength={0.8}
      mouseRadius={0.4}
      mouseDampening={0.18}
      clickSwirl
      intro
      lightMode={false}
      transparent
      opacity={0.95}
      dpr={1.5}
    />,
    host
  );
}
