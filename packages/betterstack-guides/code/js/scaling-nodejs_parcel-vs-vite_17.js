# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: js
# Normalized: js
# Block index: 17

// Parcel handles dynamic imports for code splitting
import('./heavy-module').then(module => {
  module.doSomething()
})