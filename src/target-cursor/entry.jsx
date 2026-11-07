import { render } from 'preact';

import TargetCursor from './TargetCursor.jsx';

const host = document.getElementById('target-cursor-root');
const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

if (host && !reduced && finePointer) {
  render(
    <TargetCursor
      targetSelector="a, button, summary, input, select, textarea, [data-cursor], .hero-swap"
      cursorColor="#ffffff"
      cursorColorOnTarget="#ffd400"
      spinDuration={2.4}
      hoverDuration={0.2}
      parallaxOn
      hideDefaultCursor
      size={34}
      cornerSize={12}
      thickness={2.5}
      padding={6}
      matchRadius
      dotSize={3}
      blendMode="difference"
      showLabel
      clickEffect
    />,
    host
  );
}
