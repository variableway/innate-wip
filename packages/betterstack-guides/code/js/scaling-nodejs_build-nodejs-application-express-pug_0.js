# Source: https://betterstack.com/community/guides/scaling-nodejs/build-nodejs-application-express-pug/
# Original language: javascript
# Normalized: js
# Block index: 0

[label server.js]
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Node.js server');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Hacker news server started on port: ${server.address().port}`);
});