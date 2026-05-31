# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 22

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.originalUrl });
  next();
});