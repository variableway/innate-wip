# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 9

const { validateUser } = require('./middleware/validation');

app.post('/api/users', validateUser, (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: Date.now(), name, email });
});