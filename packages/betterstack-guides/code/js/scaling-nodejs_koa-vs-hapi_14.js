# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 14

// Lightweight request processing
app.use(async (ctx, next) => {
  const start = process.hrtime.bigint();
  await next();
  const duration = Number(process.hrtime.bigint() - start) / 1000000;
  ctx.set('X-Response-Time', `${duration.toFixed(2)}ms`);
});

// Efficient streaming
app.use(async (ctx) => {
  if (ctx.path === '/large-data') {
    ctx.body = fs.createReadStream('./large-file.json');
  }
});