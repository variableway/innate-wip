# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 30

[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    cron_restart: '0 */24 * * *',
    [/highlight]
  }]
}