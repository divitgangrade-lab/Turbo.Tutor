import './SplineHero.css';

/*
 * Hero 3D car slot.
 * The runtime is a standalone ES module copied to /spline-runtime.js, so it is
 * imported only when the hero is first used and never bundled into the island.
 */

const mount = document.getElementById('spline-hero-mount');
const toggle = document.getElementById('spline-hero-toggle');
const hero = mount?.closest('.hero-swap');

const supportsWebGL2 = () => {
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

if (mount && supportsWebGL2()) {
  const scene = mount.dataset.scene;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  mount.append(canvas);

  let app = null;
  let ready = false;
  let loading = false;
  let active = false;
  let pinned = false;
  let disposed = false;

  const setPressed = on => toggle?.setAttribute('aria-pressed', String(on));

  const paint = () => {
    mount.classList.toggle('is-on', ready && active);
    setPressed(ready && active);
    toggle?.classList.toggle('is-busy', loading);
    if (!app) return;
    if (ready && active && app.isStopped) app.play();
    if (ready && !active && !app.isStopped) app.stop();
  };

  const load = () => {
    if (loading || ready || disposed || !scene) return;
    loading = true;
    paint();
    import(new URL('./spline-runtime.js', import.meta.url).href)
      .then(({ Application }) => {
        if (disposed) return null;
        app = new Application(canvas, { renderMode: 'auto' });
        return app.load(scene).then(() => app);
      })
      .then(result => {
        if (!result || disposed) return;
        ready = true;
        loading = false;
        mount.dataset.ready = 'true';
        result.stop();
        paint();
      })
      .catch(error => {
        loading = false;
        mount.dataset.failed = 'true';
        console.warn('The 3D hero scene could not load.', error);
        paint();
      });
  };

  const setActive = on => {
    active = on;
    if (on) load();
    paint();
  };

  toggle?.addEventListener('click', () => {
    pinned = !pinned;
    setActive(pinned);
  });
  toggle?.addEventListener('pointerenter', () => {
    if (!pinned) setActive(true);
  });
  toggle?.addEventListener('pointerleave', () => {
    if (!pinned) setActive(false);
  });
  toggle?.addEventListener('focus', () => {
    if (!pinned) setActive(true);
  });
  toggle?.addEventListener('blur', () => {
    if (!pinned) setActive(false);
  });
  hero?.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !active) return;
    pinned = false;
    setActive(false);
    toggle?.focus();
  });

  if (!reduce.matches) load();
}
