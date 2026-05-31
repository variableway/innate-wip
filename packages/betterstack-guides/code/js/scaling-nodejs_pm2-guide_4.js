# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 4

[label server.js]
. . .
app.get('/', async (req, res, next) => {
  try {
    const response = await getRandomJoke();

    res.render('home', {
      [highlight]
      title: 'Random Dad Jokes',
      [/highlight]
      dadjokes: response,
    });
  } catch (err) {
    next(err);
  }
});
. . .