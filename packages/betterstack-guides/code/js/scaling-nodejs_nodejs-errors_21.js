# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 21

fs.open('non-existent-file.txt', (err, fd) => {
  if (err) {
    console.log(err);
  }
});