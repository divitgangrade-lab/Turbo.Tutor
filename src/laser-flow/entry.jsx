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
      intensity={2.7}
      beamWidth={2.2}
      flare={1.9}
      spread={1.9}
      spill={1.5}
      fog={0.55}
      dust={1.9}
      streaks={1.5}
      dots={1}
      pulse={1.7}
      speed={1.2}
      seed={7}
      theme="dark"
      className="hero-laser-canvas"
    />,
    host
  );
  host.dataset.mounted = 'true';
}
