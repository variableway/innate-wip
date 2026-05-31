# Source: https://betterstack.com/community/guides/scaling-nodejs/build-nodejs-application-express-pug/
# Original language: javascript
# Normalized: js
# Block index: 10

[label server.js]
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Search Hacker News',
  });
});