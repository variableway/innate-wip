# Source: https://betterstack.com/community/guides/monitoring/sre-golden-signals/
# Original language: javascript
# Normalized: js
# Block index: 2

import { Counter } from 'prom-client';

const errorCounter = new Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP request errors',
  labelNames: ['method', 'route', 'status_code', 'error_type']
});

function errorHandler(err, req, res, next) {
  errorCounter.inc({
    method: req.method,
    route: req.route?.path || req.path,
    status_code: res.statusCode || 500,
    error_type: err.name || 'UnknownError'
  });
  
  res.status(500).send('Something went wrong');
}