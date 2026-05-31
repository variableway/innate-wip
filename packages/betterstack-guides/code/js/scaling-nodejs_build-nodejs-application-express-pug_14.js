# Source: https://betterstack.com/community/guides/scaling-nodejs/build-nodejs-application-express-pug/
# Original language: javascript
# Normalized: js
# Block index: 14

[label server.js]
const express = require('express');
[highlight]
const path = require('path');
[/highlight]

const app = express();

[highlight]
app.use(express.static(path.join(__dirname, 'public')));
[/highlight]