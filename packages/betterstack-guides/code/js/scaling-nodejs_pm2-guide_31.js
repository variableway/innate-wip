# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 31

[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    restart_delay: 5000 // wait for five seconds before restarting
    [/highlight]
  }]
}