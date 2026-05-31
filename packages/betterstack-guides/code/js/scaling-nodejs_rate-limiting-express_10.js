# Source: https://betterstack.com/community/guides/scaling-nodejs/rate-limiting-express/
# Original language: javascript
# Normalized: js
# Block index: 10

[label server.js]
import express from 'express';
import rateLimit from 'express-rate-limit';
[highlight]
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
[/highlight]

const app = express();

[highlight]
// Security and logging middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourapp.com' : 'http://localhost:3000',
  credentials: true
}));
[/highlight]
app.use(express.json());

// Basic rate limiting configuration (same as before)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP address',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  ...
});

[highlight]
// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Only 5 authentication attempts per 10 minutes
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});
[/highlight]

// Apply general rate limiting
app.use(limiter);

// ... existing routes

[highlight]
// Authentication endpoint with strict limiting
app.post('/auth/login', authLimiter, (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'secretpassword') {
    res.json({ 
      message: 'Login successful', 
      token: 'jwt-token-example'
    });
  } else {
    res.status(401).json({ 
      error: 'Invalid credentials',
      remaining: req.rateLimit.remaining
    });
  }
});
[/highlight]

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});