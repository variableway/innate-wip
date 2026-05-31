# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 5

...
app.use((req, res, next) => {
  if (!req.headers['x-auth-token']) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/data', (req, res) => res.json({ message: 'Protected content' }));
...