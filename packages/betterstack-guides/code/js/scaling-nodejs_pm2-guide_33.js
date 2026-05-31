# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 33

[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    max_restarts: 16,
    min_uptime: 5000, // 5 seconds
    [/highlight]
  }]
}