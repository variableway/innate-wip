# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 2

// Express request/response pattern
app.get('/api/data/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await fetchData(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});