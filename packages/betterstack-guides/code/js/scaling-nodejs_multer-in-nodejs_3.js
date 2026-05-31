# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 3

[label index.js]
import express from "express";
[highlight]
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
[/highlight]

const app = express();
const PORT = 3000;

[highlight]
// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
[/highlight]
app.get("/", (req, res) => {
  res.send(`
    <h1>File Upload Demo</h1>
[highlight]
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFile" />
      <button type="submit">Upload</button>
    </form>
[/highlight]
  `);
});

[highlight]
app.post("/upload", upload.single('uploadedFile'), (req, res) => {
  console.log(req.file); // Contains file info
  res.send(`File uploaded successfully: ${req.file.filename}`);
});
[/highlight]

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});