import { render } from 'preact';

import FluidGlass from './FluidGlass.jsx';
import './statement-band.css';

const host = document.getElementById('fluid-glass-root');

const probe = document.createElement('canvas');
const probeGl = probe.getContext('webgl2');
const canRender = Boolean(probeGl);
probeGl?.getExtension('WEBGL_lose_context')?.loseContext();

if (host && canRender) {
  host.dataset.mounted = 'true';
  render(
    <FluidGlass
      text={'LEARNING IN\nTHE FAST LANE'}
      textColor="#f7f5f0"
      fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
      fontWeight={900}
      shape="lens"
      shapes={['lens', 'blob', 'pill']}
      size={230}
      refraction={2}
      dispersion={0.8}
      reflection={1.3}
      tint={0.06}
      color="#f7f5f0"
      shadow={0.35}
      elevation={0.35}
      interaction="follow"
      position={[0.72, 0.5]}
      smoothness={0.6}
      wobble={0.75}
      spin={0}
      intro
      maxDevicePixelRatio={1.75}
    />,
    host
  );
}
