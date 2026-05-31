# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 56

[label server.js]
app.get('/joke', async (req, res, next) => {
  console.log('Request handled by process:', process.env.NODE_APP_INSTANCE);

  if (process.env.NODE_APP_INSTANCE === '0') {
    console.log('Executing some operation on process 0 only...');
  }

  try {
    const response = await getRandomJoke();
    res.json(response);
  } catch (err) {
    next(err);
  }
});