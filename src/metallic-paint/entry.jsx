import { render } from 'preact';

import MetallicPaint from './MetallicPaint.jsx';

const host = document.getElementById('metallic-paint-root');
const mount = document.getElementById('metallic-paint-mount');

const supportsWebgl2 = (() => {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
})();

if (host && mount && supportsWebgl2) {
  render(
    <MetallicPaint
      text="TT"
      fontFamily='"Barlow Condensed", Impact, sans-serif'
      fontWeight={900}
      color="#e4ebf1"
      density={2.2}
      softness={0.12}
      dispersion={0.34}
      distortion={0.06}
      edgeBend={0.85}
      angle={62}
      speed={0.7}
      scale={0.86}
      rotation={-2}
      mouseTilt={0.4}
      intro
      className="metallic-paint-monogram"
    />,
    mount
  );

  host.dataset.mounted = 'true';
}
