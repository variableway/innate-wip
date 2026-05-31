# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/
# Original language: javascript
# Normalized: js
# Block index: 5

[label dev-server.js]
const esbuild = require('esbuild')
const http = require('http')
const fs = require('fs')

// Manual dev server setup required
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(fs.readFileSync('index.html'))
  }
  // Handle other routes manually
})

// Watch and rebuild
esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  watch: true,
}).then(() => {
  server.listen(3000)
  console.log('Server running on http://localhost:3000')
})