# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 4

app.get('/', (req, res) => {
[highlight]
  req.setTimeout(20000);
[/highlight]
  console.log('Got request');
  setTimeout(() => res.send('Hello world!'), 10000);
});