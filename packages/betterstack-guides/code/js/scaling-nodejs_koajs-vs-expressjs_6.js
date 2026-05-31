# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 6

app.get('/api/stats', (req, res) => {
  Promise.all([
    getUserCount(),
    getOrderCount(),
    getRevenueStats()
  ]).then(([users, orders, revenue]) => {
    res.json({ users, orders, revenue });
  }).catch(next);
});