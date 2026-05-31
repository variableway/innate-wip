# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 1

server.on('timeout', (socket) => {
  console.log('timeout');
  socket.destroy();
});