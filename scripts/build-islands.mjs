import { build } from 'esbuild';

await build({
  entryPoints: {
    'flying-button': 'src/flying-button/entry.jsx',
    'flux-lines': 'src/flux-lines/entry.jsx',
    'pattern-waves': 'src/pattern-waves/entry.jsx',
    'tech-text': 'src/tech-text/entry.jsx',
    'text-loop': 'src/text-loop/entry.jsx'
  },
  bundle: true,
  minify: true,
  format: 'esm',
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
