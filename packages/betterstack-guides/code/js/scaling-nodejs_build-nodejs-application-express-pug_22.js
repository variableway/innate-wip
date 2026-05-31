# Source: https://betterstack.com/community/guides/scaling-nodejs/build-nodejs-application-express-pug/
# Original language: javascript
# Normalized: js
# Block index: 22

[label server.js]
app.get('/search', async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.redirect(302, '/');
    return;
  }

  const results = await searchHN(searchQuery);
  res.render('search', {
    title: `Search results for: ${searchQuery}`,
    searchResults: results,
    searchQuery,
  });
});