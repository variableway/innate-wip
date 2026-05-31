# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/
# Original language: javascript
# Normalized: js
# Block index: 1

[label build.js]
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  target: ['es2020']
}).catch(() => process.exit(1))