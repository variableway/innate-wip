# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 8

const router = new Router({ prefix: '/api/v1' });

// Basic routing
router.get('/users/:id', async (ctx) => {
  ctx.body = await User.findById(ctx.params.id);
});

// Manual parameter validation
router.get('/users/:id(\\d+)', async (ctx) => {
  const id = parseInt(ctx.params.id);
  ctx.body = await User.findById(id);
});