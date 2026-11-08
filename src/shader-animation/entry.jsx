import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import ShaderAnimation from './ShaderAnimation.jsx';
import './ShaderAnimation.css';

const host = document.getElementById('shader-animation-mount');
const loader = document.querySelector('.tt-loader');

const supportsWebGL2 = () => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

const LoaderShader = () => {
  const [active, setActive] = useState(() => !(loader && loader.classList.contains('is-hidden')));

  useEffect(() => {
    const show = () => setActive(true);
    const hide = () => setActive(false);
    window.addEventListener('tt:loader-show', show);
    window.addEventListener('tt:loader-hidden', hide);
    return () => {
      window.removeEventListener('tt:loader-show', show);
      window.removeEventListener('tt:loader-hidden', hide);
    };
  }, []);

  return <ShaderAnimation active={active} />;
};

if (host && supportsWebGL2()) {
  render(<LoaderShader />, host);
  host.dataset.mounted = 'true';
}
