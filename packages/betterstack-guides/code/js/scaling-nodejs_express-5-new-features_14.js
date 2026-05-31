# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 14

const express = require('express');
const app = express();
const router = express.Router();

// Middleware to log user-related requests
router.use((req, res, next) => {
  console.log(`User route accessed: ${req.originalUrl}`);
  next();
});

// Define user routes
router.get('/profile', (req, res) => {
  res.send('User profile page');
});

router.post('/signup', (req, res) => {
  res.send('User signup successful');
});

// Mount the router at the /user path
app.use('/user', router);

app.listen(3000, () => console.log('Server running on port 3000'));