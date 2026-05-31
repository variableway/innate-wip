# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 12

[label index.js]
// Error handler for file filter and limit rejections
app.use((err, req, res, next) => {
[highlight]
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File too large. Maximum size is 2MB.');
    }
  }
[/highlight]
  res.status(400).send(err.message);
});
..