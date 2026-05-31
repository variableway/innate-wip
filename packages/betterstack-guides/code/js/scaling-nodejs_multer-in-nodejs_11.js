# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 11

[label index.js]
...
app.get("/", (req, res) => {
  res.send(`
    <h1>Image Upload Demo</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFile" />
[highlight]
      <p>Note: Only JPG, JPEG, PNG, and GIF files under 2MB are allowed</p>
[/highlight]
      <button type="submit">Upload</button>
    </form>
  `);
});