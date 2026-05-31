# Rate Limiting in Express.js

Rate limiting is essential for protecting your Express.js applications from abuse, DDoS attacks, and resource exhaustion. Without proper rate limiting, malicious users can overwhelm your server with requests, causing downtime for legitimate users.

[Express-rate-limit](https://www.npmjs.com/package/express-rate-limit) is the most popular rate limiting middleware for Node.js, providing flexible protection with over 10 million weekly downloads. It offers comprehensive defense against brute force attacks, API abuse, and resource exhaustion while maintaining excellent performance.

This guide covers implementing multiple rate limiting strategies, customizing responses for different user tiers, and establishing production-ready protection that scales with your application.

[ad-logs]

## Prerequisites

Before implementing rate limiting, ensure you have a current version of [Node.js](https://nodejs.org/en/download/) and `npm` installed on your system. This guide assumes familiarity with Express.js fundamentals and basic understanding of HTTP concepts like request headers, status codes, and middleware execution patterns.

## Step 1 — Setting up the Express foundation

Effective rate limiting requires a well-structured Express application as your starting point. You'll create a comprehensive API server and then systematically add rate limiting capabilities with increasing sophistication.

Create your project workspace and initialize it:

```command
mkdir express-rate-limiting && cd express-rate-limiting
```

Set up your Node.js project with modern configuration:

```command
npm init -y
```

Enable ES modules for cleaner import syntax:

```command
npm pkg set type="module"
```

Install Express as your web framework:

```command
npm install express
```

Build your initial server in `server.js`:

```javascript
[label server.js]
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Rate Limiting Demo API', 
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

app.get('/api/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    total: 2,
    requestId: Math.random().toString(36).substr(2, 9)
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Phone', price: 599 }
    ],
    total: 2
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
```

This code creates a basic web API using Express. It sets up a server that can send and receive data in JSON format.

It has three routes (or pages):

* **`/`** – Returns a message with the API name, current time, and environment.
* **`/api/users`** – Returns a list of two users and a random request ID.
* **`/api/products`** – Returns a list of two products with their prices.

The server runs on port 4000 (or another port if specified).

Configure your development environment for automatic reloading:

```command
npm pkg set scripts.dev="node --watch server.js"
```

Launch your development server:

```command
npm run dev
```

You should observe:

```text
[output]
API server running on http://localhost:4000
```

Navigate to `http://localhost:4000` in your browser to verify functionality.

You should see a JSON response containing your API information and timestamp, confirming your Express server is operational and ready for rate limiting implementation.

![Express server response showing API welcome message with timestamp and environment data](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/68641664-4242-44b1-3798-d4785198ec00/md1x =3248x1994)

This foundation provides a working Express API with multiple endpoints that you can protect using various rate limiting strategies. The timestamp and requestId fields will help demonstrate rate limiting behavior during testing phases.

## Step 2 — Installing and configuring basic rate limiting

Rate limiting middleware intercepts requests before they reach your application logic, providing the first line of defense against abuse. You'll install the essential packages and implement your first rate limiting rule to understand the fundamental concepts and see immediate protection benefits.

Install the primary rate limiting package:

```command
npm install express-rate-limit
```

The express-rate-limit package provides comprehensive rate limiting functionality with sensible defaults while remaining highly configurable for complex business scenarios and custom requirements.

Integrate basic rate limiting into your Express application:

```javascript
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
```

This configuration establishes a global rate limit allowing 100 requests per 15-minute window from each IP address. The middleware automatically tracks request counts, manages time windows, and returns appropriate HTTP headers to inform clients about their usage status and remaining quota.

The `standardHeaders: true` option enables modern RateLimit headers that provide clients with detailed information about their current usage, remaining requests, and reset time, following the latest HTTP standards for rate limiting communication.

Save your changes and restart the server. You'll notice the same startup message, but now every request includes comprehensive rate limiting headers and protection.

Test your rate limiting by making a request with verbose headers:

```command
curl -i http://localhost:4000/
```

You should see response headers indicating your rate limit status:

```text
[output]
HTTP/1.1 200 OK
X-Powered-By: Express
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 900
Content-Type: application/json; charset=utf-8
Content-Length: 103
ETag: W/"67-2Ouk9IhxCGFRr8is7Lc1VRa2+rk"
Date: Tue, 29 Jul 2025 11:23:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Rate Limiting Demo API","timestamp":"2025-07-29T11:23:27.315Z","environment":"development"}
```

The `RateLimit-Remaining: 99` header confirms that rate limiting is active and tracking your requests correctly. Each subsequent request will decrement this counter until the window resets, providing transparent feedback about quota consumption.

Your basic rate limiting is now operational and protecting all endpoints with a unified policy that balances security with usability.

## Step 3 — Adding security middleware and basic endpoint protection

Different endpoints need different levels of protection. Before implementing multiple rate limiters, you'll add essential security middleware and create your first targeted rate limiter for sensitive operations.

Install additional middleware for enhanced security and logging:

```command
npm install helmet morgan cors
```

These packages provide security headers, request logging, and CORS support that work alongside rate limiting to create comprehensive API protection.

Add the security middleware and create a strict limiter for authentication:

```javascript
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
```

Test the authentication rate limiting:

```command
curl -i -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"incorrect"}'
```


You should see the stricter authentication rate limit with comprehensive security headers:

```text
[output]
HTTP/1.1 401 Unauthorized
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
RateLimit-Policy: 5;w=600
RateLimit-Limit: 5
RateLimit-Remaining: 4
RateLimit-Reset: 600
Content-Type: application/json; charset=utf-8

{"error":"Invalid credentials","remaining":4}
```

Notice the `RateLimit-Limit: 5` header showing the authentication endpoint uses the stricter limiter, along with all the security headers from Helmet providing comprehensive protection.


## Step 4 — Creating specialized rate limiters for different endpoint types

Now you'll expand your rate limiting strategy by creating specialized limiters for API endpoints and resource-intensive operations, giving you granular control over different parts of your application.

Add more specialized rate limiters to handle different use cases:

```javascript
[label server.js]
// ... existing imports and basic setup

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

[highlight]
// API-specific rate limiting
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 requests per 5 minutes for API endpoints
  message: {
    error: 'API rate limit exceeded',
    retryAfter: '5 minutes',
    upgradeMessage: 'Consider upgrading your plan for higher limits'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'API rate limit exceeded',
      currentPlan: 'free',
      upgradeUrl: 'https://example.com/upgrade',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Heavy operation rate limiting
const heavyOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 heavy operations per hour
  message: {
    error: 'Heavy operation limit exceeded',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});
[/highlight]

// Apply general rate limiting
app.use(limiter);

// ... existing routes

[highlight]
// Protected API endpoints with specific rate limiting
app.use('/api', apiLimiter);
[/highlight]

app.get('/api/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    total: 2,
    requestId: Math.random().toString(36).substr(2, 9)
  });
});

app.get('/api/products', (req, res) => {
  ...
});

// Authentication endpoint (same as before)
app.post('/auth/login', authLimiter, (req, res) => {
  // ... existing auth logic
});

[highlight]
// Heavy operation endpoints
app.post('/api/export', heavyOperationLimiter, (req, res) => {
  // Simulate heavy export operation
  setTimeout(() => {
    res.json({
      message: 'Export completed',
      downloadUrl: 'https://example.com/exports/data-export.csv',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  }, 1000);
});

app.post('/api/report', heavyOperationLimiter, (req, res) => {
  // Simulate report generation
  setTimeout(() => {
    res.json({
      message: 'Report generated successfully',
      reportId: Math.random().toString(36).substr(2, 9),
      estimatedProcessingTime: '5-10 minutes'
    });
  }, 800);
});
[/highlight]

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
```

Now you have four layers of protection:

- **General limiter**: 100 requests per 15 minutes for everything
- **API limiter**: 50 requests per 5 minutes for `/api` routes  
- **Heavy operation limiter**: 10 requests per hour for expensive operations
- **Auth limiter**: 5 attempts per 10 minutes for login

Test the different rate limiting behaviors:

```command
curl -i http://localhost:4000/api/users
```

You should see the API-specific rate limit:

```text
[output]
Access-Control-Allow-Credentials: true
RateLimit-Policy: 50;w=300
RateLimit-Limit: 50
RateLimit-Remaining: 49
RateLimit-Reset: 300
Content-Type: application/json; charset=utf-8
...
{"users":[{"id":1,"name":"John Doe","email":"john@example.com"},{"id":2,"name":"Jane Smith","email":"jane@example.com"}],"total":2,"requestId":"4795edym6"}%                                                      
```

Test a heavy operation:

```command
curl -i -X POST http://localhost:4000/api/export
```

You should see the much stricter limit for resource-intensive operations:

```text
[output]
RateLimit-Policy: 10;w=3600
RateLimit-Limit: 10
RateLimit-Remaining: 9
RateLimit-Reset: 3600
Content-Type: application/json; charset=utf-8
...

{"message":"Export completed","downloadUrl":"https://example.com/exports/data-export.csv","expiresAt":"2025-07-30T11:45:18.007Z"}%          
```

Notice how each endpoint type has different `RateLimit-Limit` values:

- Home route: 100 (general limiter)
- API routes: 50 (API limiter) 
- Auth routes: 5 (auth limiter)
- Heavy operations: 10 (heavy operation limiter)

This layered approach provides comprehensive protection that adapts to the security and resource requirements of different parts of your application.

## Final thoughts

You've successfully built a comprehensive rate limiting system for Express.js with multiple protection strategies and targeted endpoint controls.

This foundation covers everything from basic API protection to sophisticated multi-tier limiting with authentication safeguards. The layered approach makes it easy to add more advanced features like Redis persistence, user-based limits, or geographic restrictions as your application grows.


Explore the [express-rate-limit documentation](https://www.npmjs.com/package/express-rate-limit) for additional options and advanced patterns. Remember to monitor effectiveness and adjust limits based on actual usage patterns and business needs.