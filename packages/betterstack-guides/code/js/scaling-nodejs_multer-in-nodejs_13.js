# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 13

// ...
app.get("/", (req, res) => {
  res.send(`
    <h1>Multiple File Upload Demo</h1>
    <form action="/upload-multiple" method="post" enctype="multipart/form-data">
      <input type="file" name="gallery" multiple />
      <button type="submit">Upload Files</button>
    </form>
  `);
});

app.post("/upload-multiple", upload.array('gallery', 5), (req, res) => {
  console.log(req.files); // Array of file objects
  const fileNames = req.files.map(file => file.filename).join(', ');
  res.send(`Uploaded ${req.files.length} files: ${fileNames}`);
});
// ...