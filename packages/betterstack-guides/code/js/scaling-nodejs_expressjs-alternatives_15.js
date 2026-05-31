# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 15

// Install: npm install polka sirv compression
const polka = require('polka');
const serve = require('sirv')('public');
const compression = require('compression')();

// Create app
const app = polka();

// Middleware (runs on all routes)
app.use(compression);
app.use(serve);

// Routes
app.get('/', (req, res) => {
  res.end('Hello world!');
});

app.get('/users/:id', (req, res) => {
  res.end(`User: ${req.params.id}`);
});

app.listen(3000, err => {
  if (err) throw err;
  console.log(`> Running on localhost:3000`);
});