# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 0

// Express with manual error handling
app.get('/data/:id', async (req, res, next) => {
  try {
    const result = await fetchUserData(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});