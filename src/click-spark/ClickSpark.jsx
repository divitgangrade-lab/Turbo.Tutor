import { useEffect, useRef } from 'preact/hooks';

const EASINGS = {
  linear: value => value,
  'ease-in': value => value * value,
  'ease-out': value => 1 - Math.pow(1 - value, 3),
  'ease-in-out': value => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2)
};

const MAX_BURSTS = 16;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toColors = value => {
  const list = (Array.isArray(value) ? value : [value]).filter(Boolean);
  return list.length ? list : ['#ffffff'];
};

const channels = (ctx, color) => {
  if (!ctx) return [255, 255, 255];
  ctx.fillStyle = color;
  const normal = String(ctx.fillStyle);
  const hex = /^#([0-9a-f]{6})$/i.exec(normal);
  if (hex) {
    const value = parseInt(hex[1], 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  }
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(normal);
  if (rgb) {
    return rgb[1]
      .split(',')
      .slice(0, 3)
      .map(part => parseFloat(part));
  }
  return [255, 255, 255];
};

/**
 * Adapted from React Bits ClickSpark (MIT + Commons Clause).
 * The original wraps children; this version is a fixed, decorative layer so
 * the static page can use it without moving its document structure.
 */
export default function ClickSpark({
  sparkColor = ['#ffd400', '#e10600', '#f7f5f0'],
  sparkSize = 12,
  sparkRadius = 28,
  sparkCount = 10,
  sparkWidth = 1.8,
  duration = 520,
  easing = 'ease-out',
  randomness = 0.3,
  glow = 0.4
}) {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const colors = toColors(sparkColor);
    const ease = EASINGS[easing] || EASINGS['ease-out'];
    const bursts = [];
    let raf = 0;
    let lastPress = { time: -1e9, x: 0, y: 0 };

    const remove = burst => {
      burst.canvas.remove();
      const index = bursts.indexOf(burst);
      if (index >= 0) bursts.splice(index, 1);
    };

    const draw = (ctx, burst, now) => {
      const width = burst.canvas.width / burst.ratio;
      const height = burst.canvas.height / burst.ratio;
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const spark of burst.sparks) {
        const progress = (now - burst.start) / duration;
        if (progress >= 1) continue;
        alive = true;
        const eased = ease(clamp(progress, 0, 1));
        const distance = sparkRadius * spark.reach * eased;
        const length = sparkSize * spark.scale * Math.pow(1 - progress, 1.6);
        const angle = spark.angle;
        const x1 = burst.x - burst.left + Math.cos(angle) * distance;
        const y1 = burst.y - burst.top + Math.sin(angle) * distance;
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;
        const alpha = Math.pow(1 - progress, 1.5);

        ctx.strokeStyle = spark.color;
        ctx.lineCap = 'round';
        if (glow > 0) {
          ctx.globalAlpha = alpha * 0.16 * glow;
          ctx.lineWidth = sparkWidth * spark.scale * 4.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.globalAlpha = alpha;
        ctx.lineWidth = sparkWidth * spark.scale;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      return alive;
    };

    const frame = now => {
      raf = 0;
      for (const burst of [...bursts]) {
        if (!draw(burst.ctx, burst, now)) remove(burst);
      }
      if (bursts.length) raf = requestAnimationFrame(frame);
    };

    const spawn = (clientX, clientY) => {
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      const reach = sparkRadius + sparkSize + 16;
      const left = Math.max(clientX - reach, 0);
      const top = Math.max(clientY - reach, 0);
      const right = Math.min(clientX + reach, viewportWidth);
      const bottom = Math.min(clientY + reach, viewportHeight);
      if (right - left < 1 || bottom - top < 1) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil((right - left) * ratio);
      canvas.height = Math.ceil((bottom - top) * ratio);
      Object.assign(canvas.style, {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${right - left}px`,
        height: `${bottom - top}px`,
        display: 'block',
        pointerEvents: 'none'
      });
      canvas.setAttribute('aria-hidden', 'true');
      layer.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        canvas.remove();
        return;
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const sparks = Array.from({ length: Math.round(clamp(sparkCount, 1, 24)) }, (_, index) => {
        const angle = (Math.PI * 2 * index) / sparkCount + (Math.random() - 0.5) * randomness;
        return {
          angle,
          reach: 1 + (Math.random() - 0.5) * randomness * 0.7,
          scale: 1 + (Math.random() - 0.5) * randomness * 0.8,
          color: colors[index % colors.length]
        };
      });

      // Touch and keyboard bursts can extend just beyond the compact canvas.
      // Keep the canvas within the viewport; the line shortening is intentional.
      bursts.push({ x: clientX, y: clientY, left, top, canvas, ctx, ratio, start: performance.now(), sparks });
      while (bursts.length > MAX_BURSTS) remove(bursts[0]);
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onPointerDown = event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      lastPress = { time: performance.now(), x: event.clientX, y: event.clientY };
      spawn(event.clientX, event.clientY);
    };

    const onClick = event => {
      if ('pointerType' in event && event.pointerType === 'mouse') return;
      if (event.detail === 0) {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return;
      }
      const recent =
        performance.now() - lastPress.time < 700 &&
        Math.hypot(event.clientX - lastPress.x, event.clientY - lastPress.y) < 12;
      if (!recent) spawn(event.clientX, event.clientY);
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('click', onClick);
      bursts.forEach(remove);
    };
  }, [duration, easing, glow, randomness, sparkColor, sparkCount, sparkRadius, sparkSize, sparkWidth]);

  return (
    <div className="click-spark" aria-hidden="true">
      <span className="click-spark__layer" ref={layerRef} />
    </div>
  );
}
