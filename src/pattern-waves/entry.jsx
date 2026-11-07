import { render } from 'preact';
import PatternWaves from './PatternWaves.jsx';

const host = document.getElementById('pattern-waves-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <PatternWaves
      preset="silk"
      color="#ffd400"
      backgroundColor="transparent"
      fade="edges"
      fadeSize={0.66}
      opacity={0.42}
      interactive
      cursorSize={64}
      cursorStrength={0.45}
      intro
    />,
    host
  );
}
