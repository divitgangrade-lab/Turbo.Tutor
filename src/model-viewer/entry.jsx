import { createRoot } from 'react-dom/client';

import ModelViewer from './ModelViewer.jsx';
import './model-band.css';

const root = document.getElementById('model-viewer-root');
const mount = document.getElementById('model-viewer-mount');
const MODEL = 'f1-car.glb';

const canRender = () => {
  if (!('WebGL2RenderingContext' in window)) return false;
  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2');
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return Boolean(gl);
};

const start = async () => {
  if (!root || !mount || !canRender()) return;
  try {
    const response = await fetch(MODEL, { method: 'HEAD' });
    if (!response.ok) return;
  } catch {
    return;
  }

  createRoot(mount).render(
    <ModelViewer
      url={MODEL}
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0 }}
      environment="none"
      exposure={1.05}
      autoRotate
      autoRotateSpeed={0.35}
      autoRotateDelay={2.5}
      startAngle={-35}
      tilt={12}
      fit={0.86}
      float={0.25}
      shadow
      shadowOpacity={0.5}
      intro="rise"
    />
  );

  root.dataset.mounted = 'true';
};

start();
