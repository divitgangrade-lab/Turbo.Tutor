import { render } from 'preact';
import ElasticMesh from './ElasticMesh.jsx';

const host = document.getElementById('elastic-mesh-root');

if (host) {
  const observer = new MutationObserver(() => {
    const canvas = host.querySelector('canvas');
    if (canvas && canvas.getContext('webgl2')) {
      host.dataset.mounted = 'true';
      observer.disconnect();
    }
  });
  observer.observe(host, { childList: true, subtree: true });
  window.setTimeout(() => {
    if (!host.querySelector('canvas')) observer.disconnect();
  }, 1600);

  render(
    <ElasticMesh
      text="404"
      material="balloon"
      color="#ffd400"
      inflate={1.15}
      stiffness={0.45}
      wobble={0.65}
      grabRadius={80}
      stretch={0.5}
      press={0.55}
      shadow={0.45}
      intro
      theme="dark"
      fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
      fontWeight={900}
      className="error-mesh"
      style={{ position: 'absolute', inset: 0 }}
    />,
    host
  );
}
