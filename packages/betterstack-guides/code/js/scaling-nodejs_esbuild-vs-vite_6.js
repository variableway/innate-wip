# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/
# Original language: javascript
# Normalized: js
# Block index: 6

[label build-prod.js]
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  splitting: true,
  format: 'esm',
  outdir: 'dist'
}).catch(() => process.exit(1))