# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 52

[label ecosystem.config.js]
module.exports = {
  apps: [
    {
      . . .
      [highlight]
      instances: 'max',
      exec_mode : 'cluster',
      [/highlight]
    },
  ],
};