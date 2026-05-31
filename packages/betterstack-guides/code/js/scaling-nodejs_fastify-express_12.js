# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 12

app.use(async (req, res, next) => {
  req.user = await getUser(req); // Automatically caught if rejected
  next(); // No need for explicit error handling
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});