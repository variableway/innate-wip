# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 46

[label server.js]
. . .

function cleanupAndExit() {
  server.close(() => {
    console.log('dadjokes server closed');
    process.exit(0);
  });
}

[highlight]
process.on('SIGTERM', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);
[/highlight]