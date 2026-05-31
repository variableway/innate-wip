# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: js
# Normalized: js
# Block index: 15

[label vite.config.js]
export default defineConfig({
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})