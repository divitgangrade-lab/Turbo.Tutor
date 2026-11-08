import { render } from 'preact';

import PaperCrumple from './PaperCrumple.jsx';

const host = document.getElementById('paper-crumple-mount');
const compact = window.matchMedia('(max-width: 860px)').matches;

if (host) {
  host.replaceChildren();
  render(
    <PaperCrumple
      src="./f1-helmet.webp"
      alt="A Formula 1 racing helmet photographed on display"
      width={320}
      height={400}
      sceneHeight={compact ? 300 : 340}
      releaseBehavior="creased"
      crumpleAmount={0.85}
      crumpleDuration={0.5}
      releaseDuration={0.42}
      foldCount={6}
      foldSharpness={0.62}
      wrinkleDepth={0.7}
      creaseStrength={0.2}
      paperColor="#f4f0e8"
      paperTexture={0.1}
      roughness={0.9}
      lightIntensity={2.1}
      lightAngle={-32}
      shadowOpacity={0.16}
      rotation={-3}
      draggable
      freeRoam
      returnToOrigin={false}
      dragRadius={900}
      dragRotation={16}
      throwStrength={1.15}
      throwFriction={1.7}
      detail={compact ? 48 : 64}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
