# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 2

server.setTimeout(10000, (socket) => {
  console.log('timeout');
  socket.destroy();
});