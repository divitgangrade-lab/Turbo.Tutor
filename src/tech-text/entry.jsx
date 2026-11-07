import { render } from 'preact';
import TechText from './TechText.jsx';

const host = document.getElementById('tech-text-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <TechText
      text="FULL THROTTLE"
      fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
      fontWeight={900}
      fontSize={230}
      letterSpacing={-0.04}
      align="center"
      color="#f7f5f0"
      accentColor="#ffd400"
      reveal="letter"
      dashLength={4}
      dashGap={2}
      strokeWidth={1.5}
      lineStyle="dashed"
      specks={12}
      selection
      labels
      draggable
      bounce={0.42}
      clickKick
      intro="none"
      guides={false}
      sweep
      speed={0.7}
    />,
    host
  );
}
