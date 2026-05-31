# Source: https://betterstack.com/community/guides/monitoring/sre-golden-signals/
# Original language: javascript
# Normalized: js
# Block index: 1

import { Counter } from 'prom-client';

const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route']
});

function trafficMiddleware(req, res, next) {
  requestCounter.inc({
    method: req.method,
    route: req.route?.path || req.path
  });
  
  next();
}