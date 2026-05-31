# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 7

router.get('/api/stats', async (ctx) => {
  const [users, orders, revenue] = await Promise.all([
    getUserCount(),
    getOrderCount(),
    getRevenueStats()
  ]);
  ctx.body = { users, orders, revenue };
});