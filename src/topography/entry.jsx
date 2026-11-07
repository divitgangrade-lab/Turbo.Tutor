import { render } from 'preact';

import Topography from '../legal-bg/Topography.jsx';
import './scene.css';

const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const compact = window.matchMedia?.('(max-width: 760px)').matches ?? false;

const supportsWebgl2 = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch (error) {
    return false;
  }
};

const presets = {
  rail: {
    color: '#ffcf3a',
    lineCount: compact ? 14 : 20,
    lineWidth: 1,
    elevation: 1,
    foreground: 0.16,
    scale: 1.35,
    detail: 0.4,
    tilt: 30,
    speed: compact ? 0.1 : 0.18,
    direction: 'forward',
    morph: 0.5,
    glow: 0.9,
    depthOfField: 0.4,
    fog: 0.55,
    brightness: 1.4,
    mouseInteraction: true,
    hoverEffect: 'light',
    mouseRadius: 2,
    mouseStrength: 1,
    trail: 0.35,
    parallax: 0.6,
    clickEffect: 'pulse',
    markers: 'none',
    glitch: 0.12,
    dpr: compact ? 1.25 : 1.5
  },
  band: {
    color: '#ff6b4a',
    lineCount: compact ? 16 : 22,
    lineWidth: 1.1,
    elevation: 1.15,
    foreground: 0.2,
    scale: 1.2,
    detail: 0.42,
    tilt: 26,
    speed: compact ? 0.12 : 0.22,
    direction: 'forward',
    morph: 0.7,
    glow: 1,
    depthOfField: 0.45,
    fog: 0.45,
    brightness: 1.5,
    mouseInteraction: true,
    hoverEffect: 'trace',
    mouseRadius: 2.4,
    mouseStrength: 1.2,
    trail: 0.4,
    parallax: 0.8,
    clickEffect: 'pulse',
    markers: compact ? 'none' : 'dots',
    glitch: 0.2,
    dpr: compact ? 1.25 : 1.5
  },
  page: {
    color: '#1b2b32',
    lineCount: compact ? 18 : 26,
    lineWidth: 1.15,
    elevation: 0.8,
    foreground: 0.3,
    scale: 1.1,
    detail: 0.35,
    tilt: 34,
    speed: compact ? 0.08 : 0.14,
    direction: 'forward',
    morph: 0.35,
    glow: 0.2,
    depthOfField: 0.4,
    fog: 0.5,
    brightness: 1.6,
    opacity: 0.9,
    mouseInteraction: true,
    hoverEffect: 'light',
    mouseRadius: 2,
    mouseStrength: 0.9,
    trail: 0.35,
    parallax: 0.7,
    clickEffect: 'pulse',
    markers: 'none',
    glitch: 0,
    lightMode: true,
    dpr: compact ? 1.25 : 1.5
  }
};

const mount = host => {
  if (host.dataset.topographyMounted) return;
  const preset = presets[host.dataset.topography] || presets.rail;
  render(<Topography {...preset} />, host);
  host.dataset.topographyMounted = 'true';
};

if (!reduce && supportsWebgl2()) {
  const hosts = Array.from(document.querySelectorAll('[data-topography]'));
  if (!('IntersectionObserver' in window)) {
    hosts.forEach(mount);
  } else {
    const seen = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          seen.unobserve(entry.target);
          mount(entry.target);
        }
      },
      { rootMargin: '320px 0px' }
    );
    hosts.forEach(host => seen.observe(host));
  }
}
