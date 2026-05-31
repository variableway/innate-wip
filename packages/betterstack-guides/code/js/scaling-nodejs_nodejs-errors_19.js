# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 19

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'new.txt'), null, (err) => {
    console.log(err);
    res.end();
  });
});