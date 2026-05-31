# Source: https://betterstack.com/community/guides/monitoring/understanding-content-security-policy/
# Original language: javascript
# Normalized: js
# Block index: 24

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({
  type: ['application/json', 'application/csp-report']
}));

app.post('/csp-reports', (req, res) => {
  console.log('CSP Violation:', req.body);
  res.status(204).end();
});

app.listen(3000, () => {
  console.log('CSP reporting server running on port 3000');
});