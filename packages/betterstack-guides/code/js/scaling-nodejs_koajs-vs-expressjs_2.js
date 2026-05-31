# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 2

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const userAgent = req.get('User-Agent');
  res.status(200).json({ userId, userAgent });
});