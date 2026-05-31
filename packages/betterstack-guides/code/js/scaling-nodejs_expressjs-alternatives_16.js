# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 16

const polka = require('polka');
const { json } = require('body-parser');

const app = polka();

// Parse JSON requests
app.use(json());

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token !== 'valid-token') {
    res.statusCode = 401;
    res.end('Unauthorized');
    return;
  }
  // Add user info to request
  req.user = { id: 1, name: 'Authenticated User' };
  next();
};

// Public route
app.get('/', (req, res) => {
  res.end('Public route');
});

// Protected route with route-specific middleware
app.get('/protected', authenticate, (req, res) => {
  res.end(`Welcome, ${req.user.name}!`);
});

app.listen(3000);