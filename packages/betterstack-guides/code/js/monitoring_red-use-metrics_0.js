# Source: https://betterstack.com/community/guides/monitoring/red-use-metrics/
# Original language: javascript
# Normalized: js
# Block index: 0

[label metrics.js]
import { Counter } from 'prom-client';

const requestCounter = new Counter({
 name: 'app_request_count_total',
 help: 'Total number of requests received',
 labelNames: ['method', 'route']
});

requestCounter.inc({
 method: req.method,
 route: req.route?.path || req.path,
});