import * as THREE from 'three';

import './HeroCar.css';

const mount = document.getElementById('hero-3d-mount');
const toggle = document.getElementById('hero-3d-toggle');

const RED = 0xd8140b;
const BLACK = 0x15181c;
const CARBON = 0x101214;
const AMBER = 0xffd400;

const box = (w, h, d, material, x = 0, y = 0, z = 0) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  return mesh;
};

const radialShadow = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const buildCar = () => {
  const car = new THREE.Group();

  const body = new THREE.MeshStandardMaterial({ color: RED, roughness: 0.42, metalness: 0.28 });
  const trim = new THREE.MeshStandardMaterial({ color: BLACK, roughness: 0.55, metalness: 0.2 });
  const carbon = new THREE.MeshStandardMaterial({ color: CARBON, roughness: 0.78, metalness: 0.16 });
  const tire = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 0.96 });
  const rim = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, roughness: 0.32, metalness: 0.92 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xff2a1a, emissive: 0xff2a1a, emissiveIntensity: 2.2 });
  const visor = new THREE.MeshStandardMaterial({ color: 0x080b10, roughness: 0.12, metalness: 0.7 });
  const helmetMaterial = new THREE.MeshStandardMaterial({ color: AMBER, roughness: 0.34, metalness: 0.12 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.45 });

  car.add(box(4.2, 0.07, 1.6, carbon, -0.1, 0.2, 0));
  car.add(box(0.52, 0.24, 1.28, carbon, -2.24, 0.31, 0));

  for (const z of [-0.56, 0.56]) {
    car.add(box(1.9, 0.36, 0.46, body, -0.32, 0.44, z));
    car.add(box(0.1, 0.26, 0.38, trim, 0.6, 0.44, z));
    car.add(box(0.58, 0.28, 0.4, carbon, -1.42, 0.42, z));
  }

  car.add(box(1.62, 0.34, 0.56, body, 0.52, 0.46, 0));
  car.add(box(1.0, 0.16, 0.5, trim, 1.18, 0.36, 0));

  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.06, 1.55, 14), body);
  nose.rotation.z = Math.PI / 2;
  nose.scale.z = 0.78;
  nose.position.set(2.02, 0.4, 0);
  car.add(nose);

  car.add(box(0.52, 0.05, 1.9, carbon, 2.94, 0.2, 0));
  car.add(box(0.3, 0.04, 1.7, body, 3.06, 0.26, 0));
  for (const z of [-0.92, 0.92]) car.add(box(0.6, 0.28, 0.04, body, 2.96, 0.26, z));

  car.add(box(0.36, 0.05, 1.42, carbon, -2.14, 1.02, 0));
  car.add(box(0.2, 0.04, 1.3, body, -2.22, 1.12, 0));
  for (const z of [-0.7, 0.7]) car.add(box(0.52, 0.4, 0.035, body, -2.18, 0.96, z));
  car.add(box(0.1, 0.6, 0.1, carbon, -2.04, 0.68, 0));

  car.add(box(1.5, 0.38, 0.42, body, -0.98, 0.6, 0));
  car.add(box(1.2, 0.02, 0.18, white, -0.92, 0.795, 0));
  car.add(box(1.9, 0.015, 0.12, white, 0.5, 0.635, 0));
  car.add(box(0.36, 0.24, 0.3, body, -0.36, 0.82, 0));
  car.add(box(0.62, 0.08, 0.42, carbon, 0.72, 0.65, 0));

  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.032, 6, 22, Math.PI * 1.12), carbon);
  halo.rotation.set(Math.PI / 2, 0, 0.12);
  halo.position.set(0.74, 0.67, 0);
  car.add(halo);

  car.add(box(0.16, 0.16, 0.16, trim, 0.72, 0.7, 0));

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.145, 18, 14), helmetMaterial);
  helmet.position.set(0.78, 0.78, 0);
  car.add(helmet);
  const visorMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10, -0.9, 1.8, 1.0, 0.9), visor);
  visorMesh.position.set(0.84, 0.8, 0);
  car.add(visorMesh);

  for (const z of [-0.34, 0.34]) {
    car.add(box(0.16, 0.08, 0.1, trim, 0.62, 0.78, z));
  }

  const wheels = [
    [1.64, 0.92, 0.32],
    [1.64, -0.92, 0.32],
    [-1.64, 0.98, 0.36],
    [-1.64, -0.98, 0.36]
  ];
  for (const [x, z, width] of wheels) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, width, 26), tire);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, 0.42, z);
    car.add(wheel);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, width + 0.02, 18), rim);
    hub.rotation.x = Math.PI / 2;
    hub.position.set(x, 0.42, z);
    car.add(hub);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.018, 6, 22), glow);
    ring.position.set(x, 0.42, z + Math.sign(z) * (width / 2 + 0.012));
    car.add(ring);

    const arm = box(0.86, 0.035, 0.05, carbon, x * 0.55, 0.4, z * 0.55);
    arm.rotation.y = Math.atan2(z, x);
    car.add(arm);
    const lower = box(0.86, 0.03, 0.04, carbon, x * 0.55, 0.26, z * 0.55);
    lower.rotation.y = Math.atan2(z, x);
    car.add(lower);
  }

  car.add(box(0.06, 0.06, 0.62, glow, -2.34, 0.56, 0));
  car.add(box(0.9, 0.1, 0.08, carbon, 0.2, 0.98, 0));

  return car;
};

if (mount) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  mount.append(canvas);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = false;
  let pinned = false;
  let frame = 0;
  let inView = true;
  let dragging = false;
  let lastX = 0;
  let spin = 0;
  let idle = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  camera.position.set(4.4, 2.0, 5.8);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const car = buildCar();
  car.rotation.y = -0.9;
  scene.add(car);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 4.4),
    new THREE.MeshBasicMaterial({ map: radialShadow(), transparent: true, depthWrite: false })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.004;
  scene.add(floor);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.012, 6, 96),
    new THREE.MeshBasicMaterial({ color: 0x8f1a12, transparent: true, opacity: 0.55 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.006;
  scene.add(ring);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a3038, 1.1));

  const key = new THREE.DirectionalLight(0xfff4e6, 3.4);
  key.position.set(5, 7, 4);
  scene.add(key);

  const rimLight = new THREE.DirectionalLight(0xff3b1f, 3);
  rimLight.position.set(-6, 2.4, -4);
  scene.add(rimLight);

  const fill = new THREE.DirectionalLight(0x9fb6ff, 1.1);
  fill.position.set(-2, 3, 6);
  scene.add(fill);

  const resize = () => {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (active) renderer.render(scene, camera);
  };

  const wake = () => {
    if (frame || !active || !inView || document.hidden) return;
    frame = requestAnimationFrame(tick);
  };

  const tick = now => {
    frame = 0;
    if (!active || !inView || document.hidden) return;
    const dt = Math.min(0.05, (now - (tick.last || now)) / 1000);
    tick.last = now;
    if (!reduce.matches) {
      idle += dt;
      if (!dragging && idle > 1.6) car.rotation.y += dt * 0.18;
      car.position.y = Math.sin(now * 0.0012) * 0.012;
    }
    car.rotation.y += spin;
    spin *= 0.92;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };

  const setActive = on => {
    active = on;
    mount.classList.toggle('is-on', on);
    toggle?.setAttribute('aria-pressed', String(on));
    if (on) {
      resize();
      tick.last = 0;
      wake();
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
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

  canvas.addEventListener('pointerdown', event => {
    dragging = true;
    lastX = event.clientX;
    idle = 0;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!dragging) return;
    spin += (event.clientX - lastX) * 0.0016;
    lastX = event.clientX;
    idle = 0;
  });
  const endDrag = () => {
    dragging = false;
    idle = 0;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('lostpointercapture', endDrag);

  window.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !active) return;
    pinned = false;
    setActive(false);
    toggle?.focus();
  });

  const intersection = new IntersectionObserver(entries => {
    inView = entries.some(entry => entry.isIntersecting);
    if (!inView && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake();
  });
  intersection.observe(mount);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake();
  });

  new ResizeObserver(resize).observe(mount);
  resize();
  mount.dataset.ready = 'true';
}
