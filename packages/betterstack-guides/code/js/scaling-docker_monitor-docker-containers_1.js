# Source: https://betterstack.com/community/guides/scaling-docker/monitor-docker-containers/
# Original language: javascript
# Normalized: js
# Block index: 1

[label app.js]
const express = require('express');
const app = express();
const port = 3000;

let requestCount = 0;
let errors = 0;

app.get('/', (req, res) => {
  requestCount++;
  res.json({ 
    message: 'Hello World!', 
    requests: requestCount,
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/error', (req, res) => {
  errors++;
  res.status(500).json({ error: 'Simulated error', count: errors });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});