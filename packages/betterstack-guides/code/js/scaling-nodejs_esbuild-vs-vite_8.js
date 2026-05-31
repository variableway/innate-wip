# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/
# Original language: javascript
# Normalized: js
# Block index: 8

[label esbuild-plugin.js]
const esbuild = require('esbuild')

const customPlugin = {
  name: 'custom',
  setup(build) {
    build.onResolve({ filter: /^custom:/ }, args => {
      return { path: args.path, namespace: 'custom' }
    })
    
    build.onLoad({ filter: /.*/, namespace: 'custom' }, args => {
      return {
        contents: 'export default "custom content"',
        loader: 'js'
      }
    })
  }
}

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  plugins: [customPlugin]
})