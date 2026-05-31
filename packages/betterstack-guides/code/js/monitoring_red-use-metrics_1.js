# Source: https://betterstack.com/community/guides/monitoring/red-use-metrics/
# Original language: javascript
# Normalized: js
# Block index: 1

[label metrics.js]
import { Counter } from 'prom-client';

const errorCounter = new Counter({
 name: 'app_error_count_total',
 help: 'Total number of request errors',
 labelNames: ['method', 'route', 'error_type']
});

function errorHandler(err, req, res, next) {
 // Count the error
 errorCounter.inc({
   method: req.method,
   route: req.route?.path || req.path,
   error_type: err.name || 'UnknownError'
 });

 res.status(500).send('Something went wrong');
}