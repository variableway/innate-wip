# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 3

router.get('/users/:id', async (ctx) => {
  const userId = ctx.params.id;
  const userAgent = ctx.get('User-Agent');
  ctx.status = 200;
  ctx.body = { userId, userAgent };
});