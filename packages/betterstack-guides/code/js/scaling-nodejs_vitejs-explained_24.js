# Source: https://betterstack.com/community/guides/scaling-nodejs/vitejs-explained/
# Original language: javascript
# Normalized: js
# Block index: 24

[label vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
[highlight]
  test: {
    globals: true,
    environment: 'jsdom',
    ui: true
  }
[/highlight]
});