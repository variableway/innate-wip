# Source: https://betterstack.com/community/guides/scaling-nodejs/rate-limiting-express/
# Original language: javascript
# Normalized: js
# Block index: 6

[label server.js]
import express from 'express';
[highlight]
import rateLimit from 'express-rate-limit';
[/highlight]

const app = express();

app.use(express.json());

[highlight]
// Basic rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP address',
    retryAfter: '15 minutes',
    documentation: 'https://api.example.com/docs/rate-limits'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests from this IP, please try again later',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Apply rate limiting to all requests
app.use(limiter);
[/highlight]

app.get('/', (req, res) => {
  ..
});
...
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});