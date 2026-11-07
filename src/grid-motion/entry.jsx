import { render } from 'preact';

import GridMotion from './GridMotion.jsx';

const host = document.getElementById('grid-motion-mount');
const compact = window.matchMedia('(max-width: 860px)').matches;

const items = [
  { src: './f1-car.webp', alt: 'Formula 1 car on a race track' },
  { src: './f1-helmet.webp', alt: 'Formula 1 racing helmet on display' },
  { src: './go-kart.webp', alt: 'Kart racers competing on a track' },
  { src: './monaco-harbour.svg', alt: 'Monaco harbour circuit illustration' },
  { src: './pit-garage.svg', alt: 'Racing pit garage illustration' }
];

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  render(
    <GridMotion
      items={items}
      rows={compact ? 7 : 6}
      aspectRatio={1.18}
      gap={12}
      radius={9}
      angle={-7}
      tilt={0}
      speed={compact ? 9 : 12}
      direction="alternate"
      parallax={0.35}
      spotlight={0.48}
      dim={0.3}
      grayscale={false}
      fade={0.58}
      theme="light"
    />,
    host
  );
  host.dataset.mounted = 'true';
}
