# Source: https://betterstack.com/community/guides/scaling-nodejs/build-nodejs-application-express-pug/
# Original language: javascript
# Normalized: js
# Block index: 16

[label server.js]
app.get('/search', (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.redirect(302, '/');
    return;
  }

  console.log(searchQuery);
  res.status(200).end();
});