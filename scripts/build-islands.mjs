import { rmSync } from 'node:fs';
import { build } from 'esbuild';

rmSync('island-chunks', { recursive: true, force: true });

await build({
  entryPoints: {
    'flying-button': 'src/flying-button/entry.jsx',
    'flux-lines': 'src/flux-lines/entry.jsx',
    'pattern-waves': 'src/pattern-waves/entry.jsx',
    'tech-text': 'src/tech-text/entry.jsx',
    'text-loop': 'src/text-loop/entry.jsx',
    'masked-heading': 'src/masked-heading/entry.jsx',
    'particle-text': 'src/particle-text/entry.jsx',
    'split-flap-text': 'src/split-flap-text/entry.jsx',
    'warp-text': 'src/warp-text/entry.jsx',
    'elastic-mesh': 'src/elastic-mesh/entry.jsx',
    'halftone-reveal': 'src/halftone-reveal/entry.jsx',
    'animated-content': 'src/animated-content/entry.jsx',
    'target-cursor': 'src/target-cursor/entry.jsx',
    'pixel-swap': 'src/pixel-swap/entry.jsx',
    'metallic-paint': 'src/metallic-paint/entry.jsx',
    'ribbons': 'src/ribbons/entry.jsx',
    'acid-squares': 'src/acid-squares/entry.jsx'
  },
  bundle: true,
  minify: true,
  format: 'esm',
  splitting: true,
  chunkNames: 'island-chunks/[name]-[hash]',
  target: ['es2020'],
  outdir: '.',
  entryNames: '[name]',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  alias: { react: 'preact/compat' },
  define: { 'process.env.NODE_ENV': '"production"' },
  sourcemap: false,
  legalComments: 'none',
  charset: 'utf8',
  logLevel: 'info'
});
