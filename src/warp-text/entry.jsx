import { render } from 'preact';
import WarpText from './WarpText.jsx';

const host = document.getElementById('warp-text-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <WarpText
      text={'LEARNING IN\nTHE FAST LANE'}
      warpStrength={0.08}
      warpScale={1.7}
      speed={0.5}
      lens="bulge"
      pointerInfluence={0.42}
      pointerStrength={0.38}
      refraction={0.018}
      chromatic={0.32}
      idleDrift={0.2}
      ripple
      clickRipple
      intro
      color="#f7f5f0"
      fontSize="clamp(2.6rem, 8vw, 6.8rem)"
      fontWeight={900}
      fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
      letterSpacing="-0.03em"
      lineHeight={0.88}
      style={{ height: '100%' }}
    />,
    host
  );
}
