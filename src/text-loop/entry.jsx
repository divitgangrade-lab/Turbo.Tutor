import { render } from 'preact';
import TextLoop from './TextLoop.jsx';

const host = document.getElementById('text-loop-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <TextLoop
      text="MATH · ENGLISH · SCIENCE · GRADES 1–8"
      fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
      shape="wave"
      speed={55}
      direction="forward"
      separator="·"
      curviness={72}
      tilt={-2}
      fontSize={44}
      fontWeight={800}
      letterSpacing={1.4}
      uppercase
      color="#120f17"
      ribbon
      ribbonColor="#ffd400"
      ribbonWidth={84}
      edgeFade={0.2}
      pauseOnHover
      draggable
      scrollBoost={0.4}
      outline={false}
    />,
    host
  );
}
