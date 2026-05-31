# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 0

[label http_server.js]
import http from 'node:http';
const server = http.createServer((req, res) => {
  console.log('Got request');

  setTimeout(() => {
    res.end('Hello World!');
  }, 10000);
});

[highlight]
server.requestTimeout = 5000;
server.headersTimeout = 2000;
server.keepAliveTimeout = 3000;
server.timeout = 10000;
[/highlight]

server.listen(3000);