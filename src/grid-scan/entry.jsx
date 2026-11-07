import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import GridScan from './GridScan.jsx';

const host = document.getElementById('grid-scan-mount');

const supportsGridScan = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

function LaunchBackdrop() {
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');
  const compact = window.matchMedia('(max-width: 860px)').matches;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.dataset.theme === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <GridScan
      linesColor={dark ? '#8d7960' : '#b9ad96'}
      scanColor={dark ? '#ffd400' : '#c21b12'}
      cells={8}
      lineThickness={0.8}
      lineStyle="solid"
      depth={2.8}
      depthFade={0.7}
      parallax={0.7}
      points
      reflection={dark ? 0.28 : 0.18}
      shading={dark ? 0.6 : 0.4}
      scanDirection="forward"
      scanDuration={4.8}
      scanDelay={2.2}
      scanWidth={0.8}
      trail={0.35}
      glow={dark ? 0.7 : 0.4}
      autoScan
      interactive
      clickEffect="ping"
      intro
      lightMode={!dark}
      dpr={compact ? 1.2 : 1.5}
    />
  );
}

if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && supportsGridScan()) {
  render(<LaunchBackdrop />, host);
  host.dataset.mounted = 'true';
}
