# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 25

fs.opendir('/etc/passwd', (err, _dir) => {
  if (err) throw err;
});