# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 25

[label ecosystem.config.js]
module.exports = {
  apps: [{
  [highlight]
    name: 'dadjokes',
    script: './server.js',
  [/highlight]
  }]
}