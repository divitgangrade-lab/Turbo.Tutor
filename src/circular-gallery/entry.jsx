import { render } from 'preact';

import CircularGallery from './CircularGallery.jsx';
import './site-gallery.css';

const root = document.getElementById('circular-gallery-root');
const mount = document.getElementById('circular-gallery-mount');

const items = [
  {
    image: 'f1-car.webp',
    text: 'Carlos Sainz, 2023',
    description: 'A real Ferrari at the Austrian Grand Prix, from the hero shot.',
    alt: 'A red Ferrari Formula 1 car on track'
  },
  {
    image: 'f1-helmet.webp',
    text: "Oscar Piastri's helmet",
    description: 'The papaya helmet behind the promise on this page.',
    alt: "Oscar Piastri's papaya-coloured racing helmet"
  },
  {
    image: 'go-kart.webp',
    text: 'Where it starts',
    description: 'Most drivers begin here: a kart, a stopwatch and a coach.',
    alt: 'A go-kart on a karting track'
  }
];

const probe = document.createElement('canvas');
const probeGl = probe.getContext('webgl2');
const canRender = Boolean(probeGl);
probeGl?.getExtension('WEBGL_lose_context')?.loseContext();

if (root && mount && canRender) {
  render(
    <CircularGallery
      items={items}
      bend={2.6}
      textColor="#f2f4ef"
      font={'bold 30px "Chakra Petch"'}
      itemSize={0.82}
      itemAspect={1.3}
      gap={0.22}
      borderRadius={0.06}
      wave={1}
      fadeEdges={0.14}
      shadow={0.35}
      grayscale
      autoScroll={0.16}
      scrollSpeed={2}
      scrollEase={0.06}
    />,
    mount
  );

  root.dataset.mounted = 'true';
}
