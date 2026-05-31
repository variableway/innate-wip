# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/
# Original language: javascript
# Normalized: js
# Block index: 7

[label vite.config.js]
export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: true
  }
})