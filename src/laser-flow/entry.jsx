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
      color="#ffd400"
      intensity={1.7}
      beamWidth={1.6}
      flare={1.4}
      spread={1.5}
      spill={1.1}
      fog={0.4}
      dust={1.5}
      streaks={1.5}
      dots={1}
      pulse={1.4}
      speed={1.2}
      seed={7}
      theme="dark"
      className="hero-laser-canvas"
    />,
    host
  );
  host.dataset.mounted = 'true';
}
