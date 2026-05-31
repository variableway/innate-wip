# Source: https://betterstack.com/community/guides/monitoring/red-use-metrics/
# Original language: javascript
# Normalized: js
# Block index: 2

[label metrics.js]
import { Histogram } from 'prom-client';

// Create a histogram for tracking request duration
export const requestDuration = new Histogram({
 name: 'http_request_duration_seconds',
 help: 'Request duration in seconds',
 labelNames: ['method', 'route'],
 buckets: [0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10]
});

function durationMiddleware(req, res, next) {
 const start = Date.now();

 // Add a hook to measure duration when the response is sent
 res.on('finish', () => {
   const duration = (Date.now() - start) / 1000; // Convert to seconds
   requestDuration.observe(
     {
       method: req.method,
       route: req.route?.path || req.path
     },
     duration
   );
 });

 next();
}