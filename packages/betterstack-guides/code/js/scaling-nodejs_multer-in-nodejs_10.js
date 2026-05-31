# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
...
// Update the multer configuration to include limits
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
[highlight]
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
    files: 1 // Maximum number of files
  }
[/highlight]
});