# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 11

...
app.use(async (req, res, next) => {
  try {
    req.user = await getUser(req);
    next();
  } catch (error) {
    next(error); // Explicitly pass errors
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});