# Source: https://betterstack.com/community/guides/scaling-nodejs/vite-vs-webpack/
# Original language: javascript
# Normalized: js
# Block index: 4

[label vite.config.js]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    minify: 'terser',
  }
})