import { createRoot } from 'react-dom/client';

import ModelViewer from './ModelViewer.jsx';
import './model-band.css';

const MODEL = 'f1-car.glb';

const canRender = () => {
  if (!('WebGL2RenderingContext' in window)) return false;
  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2');
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return Boolean(gl);
};

const ready = async () => {
  if (!canRender()) return false;
  try {
    const response = await fetch(MODEL, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

const viewerProps = {
  url: MODEL,
  width: '100%',
  height: '100%',
  style: { position: 'absolute', inset: 0 },
  environment: 'none',
  exposure: 1.05,
  shadow: true,
  intro: 'rise'
};

export const mountBand = async () => {
  const root = document.getElementById('model-viewer-root');
  const mount = document.getElementById('model-viewer-mount');
  if (!root || !mount || root.dataset.mounted === 'true') return Boolean(root && mount);
  if (!(await ready())) return false;

  createRoot(mount).render(
    <ModelViewer
      {...viewerProps}
      autoRotate
      autoRotateSpeed={0.35}
      autoRotateDelay={2.5}
      startAngle={-35}
      tilt={12}
      fit={0.86}
      float={0.25}
      shadowOpacity={0.5}
    />
  );

  root.dataset.mounted = 'true';
  return true;
};

export const mountHero = async () => {
  const mount = document.getElementById('hero-3d-mount');
  if (!mount) return false;
  if (mount.dataset.mounted === 'true') return true;
  if (!(await ready())) return false;

  createRoot(mount).render(
    <ModelViewer
      {...viewerProps}
      autoRotate
      autoRotateSpeed={0.5}
      autoRotateDelay={1.2}
      startAngle={-28}
      tilt={10}
      fit={0.92}
      float={0.18}
      shadowOpacity={0.42}
    />
  );

  mount.dataset.mounted = 'true';
  return true;
};
