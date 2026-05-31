# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 16

[label ecosystem.config.js:]
module.exports = {
  apps : [{
    name: 'app_name',
    script: 'app.js',
    [highlight]
    max_memory_restart: '400M'
    [/highlight]
    ...
  }]
}