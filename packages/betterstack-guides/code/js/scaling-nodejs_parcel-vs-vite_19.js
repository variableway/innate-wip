# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: js
# Normalized: js
# Block index: 19

[label vite.config.js]
export default defineConfig({
  css: {
    modules: {
      // Configure CSS modules
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        // Add global SCSS variables
        additionalData: `$primary: #ff0000;`
      }
    }
  }
})