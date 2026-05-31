# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 16

// ...
const handleUpload = (req, res, next) => {
  const uploadMiddleware = upload.single('uploadedFile');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Handle Multer errors
        return res.status(400).send(`Upload error: ${err.message}`);
      }
      // Handle other errors
      return res.status(500).send(`Server error: ${err.message}`);
    }
    
    // No error, continue
    next();
  });
};

app.post("/upload-with-error-handling", handleUpload, (req, res) => {
  res.send(`File uploaded successfully: ${req.file.filename}`);
});
// ...