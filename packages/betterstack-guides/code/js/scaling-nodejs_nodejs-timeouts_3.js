# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 3

[label express_server.js]
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log('Got request');
  setTimeout(() => res.send('Hello world!'), 10000);
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

[highlight]
server.requestTimeout = 5000;
server.headersTimeout = 2000;
server.keepAliveTimeout = 3000;
server.setTimeout(10000, (socket) => {
  console.log('timeout');
  socket.destroy();
});
[/highlight]