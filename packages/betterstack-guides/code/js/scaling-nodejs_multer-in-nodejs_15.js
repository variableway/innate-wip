# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 15

// ...
// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File too large. Maximum size is 5MB.');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).send('Too many files uploaded.');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).send('Unexpected field name for file upload.');
    }
    // For any other Multer error
    return res.status(400).send(`Upload error: ${err.message}`);
  }
  
  // For non-Multer errors
  console.error(err);
  res.status(500).send('Something went wrong during file upload.');
});
// ...