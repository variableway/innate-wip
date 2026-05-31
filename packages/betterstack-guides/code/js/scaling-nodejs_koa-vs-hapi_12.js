# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 12

// Global error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { 
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    
    // Custom error logging
    console.error('Request error:', {
      url: ctx.url,
      error: err.message,
      user: ctx.state.user?.id
    });
  }
});