# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 10

const jwt = require('koa-jwt');
const passport = require('koa-passport');

// JWT middleware
app.use(jwt({ 
  secret: process.env.JWT_SECRET,
  passthrough: true 
}));

// Custom authentication logic
app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/admin') && !ctx.state.user?.isAdmin) {
    ctx.status = 403;
    return;
  }
  await next();
});