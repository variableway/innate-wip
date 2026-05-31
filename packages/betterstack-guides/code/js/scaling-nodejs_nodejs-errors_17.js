# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 17

const express = require('express');
const app = express();
const path = require('path');

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'new.txt'), null, (err) => {
    console.log(err);
  });
  res.end();
});

const server = app.listen(3000, () => {
  console.log('server listening at port 3001......');
});