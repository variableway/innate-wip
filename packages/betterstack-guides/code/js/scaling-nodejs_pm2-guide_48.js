# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 48

[label ecosystem.config.js]
module.exports = {
  apps: [
    {
      name: 'dadjokes',
      script: './server.js',
      exp_backoff_restart_delay: 100,
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: 2000,
      [highlight]
      out_file: '<custom_path>', // use /dev/null to disable
      error_file: '<custom_path>', // use /dev/null to disable
      [/highlight]
    },
  ],
};