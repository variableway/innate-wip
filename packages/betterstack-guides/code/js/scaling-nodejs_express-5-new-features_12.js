# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 12

app.get('/user/:id', (req, res) => {
  const userId = req.param('id');
  res.send(`User ID: ${userId}`);
});