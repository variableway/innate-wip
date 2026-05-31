# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 4

// Global error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    };
    // Application-level error reporting
    ctx.app.emit('error', err, ctx);
  }
});

// Error emitter example
app.on('error', (err, ctx) => {
  console.error('Server error:', err, ctx.request.url);
  // Log to external service
});

// Route that throws an error
router.get('/error', async () => {
  throw new Error('This is a demo error');
});

// Custom error with status
router.get('/users/:id', async (ctx) => {
  const user = await findUser(ctx.params.id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  ctx.body = user;
});