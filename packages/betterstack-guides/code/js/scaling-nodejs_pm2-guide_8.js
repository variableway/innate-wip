# Source: https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/
# Original language: javascript
# Normalized: js
# Block index: 8

[label server.js]
. . .

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`dadjokes server started on port: ${server.address().port}`);
  [highlight]
  // simulate a ready application after 1 second
  setTimeout(function () {
    process.send('ready');
  }, 1000);
  [/highlight]
});