# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 5

// ...
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ...
app.post("/upload", upload.single('uploadedFile'), (req, res) => {
  // File is available as a buffer in req.file.buffer
  console.log(req.file.buffer);
  res.send(`File uploaded to memory. Size: ${req.file.size} bytes`);
});
// ...