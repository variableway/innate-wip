# Source: https://betterstack.com/community/guides/monitoring/sre-golden-signals/
# Original language: javascript
# Normalized: js
# Block index: 0

import { Histogram } from 'prom-client';

const requestLatency = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10]
});

function latencyMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    requestLatency.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode
      },
      duration
    );
  });
  
  next();
}