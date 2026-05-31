# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 9

import express from 'express';
const app = express();
const server = app.listen(8080);

[highlight]
server.keepAliveTimeout = 15 * 1000;
server.headersTimeout = 16 * 1000;
[/highlight]