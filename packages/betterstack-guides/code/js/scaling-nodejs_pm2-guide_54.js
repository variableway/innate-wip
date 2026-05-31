# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 54

[label ecosystem.config.js]
module.exports = {
  apps: [
    {
      . . .
      [highlight]
      instances: -1,
      [/highlight]
      exec_mode : 'cluster',
    },
  ],
};