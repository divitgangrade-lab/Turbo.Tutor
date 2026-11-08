import { useEffect, useRef } from 'preact/hooks';

/*
 * ShaderAnimation, adapted for the TurboTutor loader.
 * The concentric-ring fragment shader is kept intact; the Three.js wrapper is
 * replaced with a three-vertex WebGL2 draw so the loader stays a few kilobytes.
 */

const VERTEX = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;

out vec4 fragColor;

#define TWO_PI 6.2831853072
#define PI 3.14159265359

void main(void) {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float t = time * 0.05;
  float lineWidth = 0.002;

  vec3 color = vec3(0.0);
  for (int j = 0; j < 3; j++) {
    for (int i = 0; i < 5; i++) {
      color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
    }
  }

  fragColor = vec4(color, 1.0);
}`;

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const link = (gl, vertexSource, fragmentSource) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (!vertex || !fragment || !program) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return {
    program,
    time: gl.getUniformLocation(program, 'time'),
    resolution: gl.getUniformLocation(program, 'resolution')
  };
};

const ShaderAnimation = ({ className = '', active = true }) => {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    wakeRef.current?.();
  }, [active]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance'
    });
    if (!gl) return;

    const shader = link(gl, VERTEX, FRAGMENT);
    if (!shader) return;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    let time = 1;
    let visible = true;
    let pageVisible = document.visibilityState !== 'hidden';

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(shader.program);
      gl.uniform2f(shader.resolution, canvas.width, canvas.height);
      gl.uniform1f(shader.time, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = now => {
      raf = 0;
      if (!activeRef.current || !visible || !pageVisible) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!reduced) time += dt * 3;
      draw();
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || reduced || !activeRef.current || !visible || !pageVisible) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const scale = Math.min(
        window.devicePixelRatio || 1,
        1.5,
        Math.sqrt(2.4e6 / Math.max(1, rect.width * rect.height))
      );
      const width = Math.max(1, Math.round(rect.width * scale));
      const height = Math.max(1, Math.round(rect.height * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      wake();
    });
    intersection.observe(host);

    const onVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden';
      wake();
    };
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (!gl.isContextLost()) {
        gl.deleteVertexArray(vao);
        gl.deleteProgram(shader.program);
      }
    };
  }, []);

  return (
    <div ref={hostRef} className={`shader-animation${className ? ` ${className}` : ''}`}>
      <canvas ref={canvasRef} className="shader-animation__canvas" aria-hidden="true" />
    </div>
  );
};

export default ShaderAnimation;
