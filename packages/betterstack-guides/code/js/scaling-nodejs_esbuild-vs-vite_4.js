# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/
# Original language: javascript
# Normalized: js
# Block index: 4

[label vite.config.js]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext'
  }
})