# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 12

// Install: npm install restify
const restify = require('restify');

const server = restify.createServer({
  name: 'my-api',
  version: '1.0.0'
});

// Middleware
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// Routes
server.get('/', (req, res, next) => {
  res.send({ message: 'Welcome to the API' });
  return next();
});

// Route with parameters
server.get('/users/:id', (req, res, next) => {
  const userId = req.params.id;
  // Fetch user from database
  res.send({ id: userId, name: 'Example User' });
  return next();
});

// POST example
server.post('/users', (req, res, next) => {
  const newUser = req.body;
  // Save to database
  res.send(201, { id: 'new-id', ...newUser });
  return next();
});

server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});