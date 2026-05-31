# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 13

const restify = require('restify');
const server = restify.createServer();

// Version 1 of the API
server.get({ path: '/api/users', version: '1.0.0' }, (req, res, next) => {
  res.send([
    { id: 1, username: 'user1' },
    { id: 2, username: 'user2' }
  ]);
  return next();
});

// Version 2 adds more fields
server.get({ path: '/api/users', version: '2.0.0' }, (req, res, next) => {
  res.send([
    { id: 1, username: 'user1', email: 'user1@example.com', active: true },
    { id: 2, username: 'user2', email: 'user2@example.com', active: false }
  ]);
  return next();
});

// Client specifies version via Accept header
// e.g., 'Accept: application/json; version=2.0.0'
server.listen(3000);