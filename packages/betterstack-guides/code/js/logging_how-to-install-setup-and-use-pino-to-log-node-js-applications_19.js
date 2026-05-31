# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 19

app.get('/changeLevel', (req, res) => {
  const { level } = req.body;
  // check that the level is valid then change it:
  logger.level = level;
});