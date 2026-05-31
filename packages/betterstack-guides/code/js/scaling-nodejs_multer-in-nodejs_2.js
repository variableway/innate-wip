# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 2

[label index.js]
import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(`
    <h1>File Upload Demo</h1>
    <form>
      <p>Upload functionality not implemented yet.</p>
    </form>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});