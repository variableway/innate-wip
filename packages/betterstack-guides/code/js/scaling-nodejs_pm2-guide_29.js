# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 29

[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    max_memory_restart: '1G',
    [/highlight]
  }]
}