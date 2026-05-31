# Source: https://betterstack.com/community/guides/monitoring/sre-golden-signals/
# Original language: javascript
# Normalized: js
# Block index: 6

import express from 'express';
import promClient from 'prom-client';

const app = express();
const register = promClient.register;

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(8080);