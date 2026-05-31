# Source: https://betterstack.com/community/guides/monitoring/understanding-content-security-policy/
# Original language: javascript
# Normalized: js
# Block index: 5

const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://analytics.example.com; style-src 'self' https://fonts.googleapis.com;"
  );
  next();
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});