# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 0

app.get('/data', async (req, res, next) => {
  try {
    const result = await fetchData();
    res.send(result);
  } catch (err) {
    next(err);
  }
});