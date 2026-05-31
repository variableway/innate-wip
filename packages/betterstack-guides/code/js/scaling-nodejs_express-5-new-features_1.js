# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 1

app.get('/data', async (req, res) => {
  const result = await fetchData();
  res.send(result);
});