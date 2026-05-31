# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: js
# Normalized: js
# Block index: 10

[label main.js]
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

// HMR is handled automatically for Vue files
// For custom handling:
if (import.meta.hot) {
  import.meta.hot.accept('./some-module.js', (newModule) => {
    // Custom HMR handling
  })
}