# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 13

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;     // Route parameter
  const queryName = req.query.name; // Query string parameter
  res.send(`User ID: ${userId}, Name: ${queryName}`);
});