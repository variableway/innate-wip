# Source: https://betterstack.com/community/guides/scaling-nodejs/rate-limiting-express/
# Original language: javascript
# Normalized: js
# Block index: 13

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