# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 61

[label ecosystem.config.js]
module.exports = {
  apps: [],
  [highlight]
  deploy: {
    production: {
      user: '<your_remote_server_username>',
      host: [<your_remote_server_ip>],
      ref: 'origin/master',
      repo: '<your_git_repo_url>',
      path: '/home/<your_server_username>/dadjokes',
      'post-setup': 'npm install',
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
  [/highlight]
};