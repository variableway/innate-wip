# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 23

// config is a directory
fs.readFile('config', (err, data) => {
  if (err) throw err;
  console.log(data);
});