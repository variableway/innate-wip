# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 14

const express = require('express');
const app = express();

const server = app.listen(3000, '192.168.0.101', function () {
  console.log('server listening at port 3000......');
});