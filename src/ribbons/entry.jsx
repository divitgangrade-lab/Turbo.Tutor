import { render } from 'preact';

import Ribbons from './Ribbons.jsx';

const host = document.getElementById('ribbons-root');

if (host) {
  render(
    <Ribbons
      colors={['#ffd400', '#e10600', '#f7f5f0']}
      thickness={34}
      length={1.7}
      spread={22}
      stiffness={0.45}
      bounce={0.6}
      shape="comet"
      wave={0.16}
      softness={0.5}
      fade
      opacity={0.45}
      className="footer-ribbons-canvas"
    />,
    host
  );
}
