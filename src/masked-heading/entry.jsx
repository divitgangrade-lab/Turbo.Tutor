import { render } from 'preact';
import MaskedHeading from './MaskedHeading.jsx';

const host = document.getElementById('masked-heading-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <MaskedHeading
      id="promise-title"
      text="EVERY LAP COUNTS."
      tag="h2"
      mediaType="image"
      src="f1-helmet.webp"
      fillScale={1.3}
      parallax={32}
      drift={12}
      hoverZoom={0.04}
      brightness={1.05}
      saturation={1.1}
      reveal="scale"
      trigger="view"
      duration={1.15}
      stagger={0.06}
      spotlight
      spotlightRadius={180}
      outline
      outlineWidth={1}
      align="left"
      weight={900}
      tracking={-0.02}
      lineHeight={0.9}
      textScale={0.15}
      className="promise-mask-heading"
    />,
    host
  );
}
