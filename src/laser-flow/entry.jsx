import { render } from 'preact';

import LaserFlow from './LaserFlow.jsx';
import './hero-laser.css';

const host = document.getElementById('laser-flow-mount');
const surface = document.querySelector('.hero-swap');

if (host && surface) {
  const surfaceRef = { current: surface };
  render(
    <LaserFlow
      surfaceRef={surfaceRef}
      beamPosition={0.62}
      color="#ffd75e"
      intensity={2.0}
      beamWidth={1.7}
      flare={1.5}
      spread={1.45}
      spill={1.2}
      fog={0.45}
      dust={1.6}
      streaks={1.5}
      dots={1}
      pulse={1.5}
      speed={1.2}
      seed={7}
      theme="dark"
      className="hero-laser-canvas"
    />,
    host
  );
  host.dataset.mounted = 'true';
}
