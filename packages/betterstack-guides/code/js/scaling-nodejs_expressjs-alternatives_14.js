# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 14

const restify = require('restify');
const errors = require('restify-errors');

const server = restify.createServer();

server.get('/users/:id', (req, res, next) => {
  const userId = req.params.id;

  // Example conditional
  if (userId === '999') {
    return next(new errors.NotFoundError('User not found'));
  }

  if (!req.headers.authorization) {
    return next(new errors.UnauthorizedError('Authentication required'));
  }

  // Normal response
  res.send({ id: userId, name: 'Example User' });
  return next();
});

// Global error handler
server.on('restifyError', (req, res, err, callback) => {
  // Log the error
  console.error(err);
  // Optionally modify the error response
  err.toJSON = function() {
    return {
      error: {
        name: err.name,
        message: err.message,
        code: err.statusCode
      }
    };
  };
  return callback();
});

server.listen(3000);