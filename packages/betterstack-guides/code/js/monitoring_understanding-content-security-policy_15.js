# Source: https://betterstack.com/community/guides/monitoring/understanding-content-security-policy/
# Original language: javascript
# Normalized: js
# Block index: 15

const express = require('express');
const crypto = require('crypto');
const app = express();

app.use((req, res, next) => {
  // Generate a new cryptographically secure random nonce for each request
  const nonce = crypto.randomBytes(16).toString('base64');

  // Set the CSP header with the nonce
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}';`
  );

  // Make the nonce available to your template engine
  res.locals.nonce = nonce;
  next();
});

app.get('/', (req, res) => {
  res.render('index', { nonce: res.locals.nonce });
});

app.listen(3000);