# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 20

[label index.js]
const express = require("express");
const app = express();
const PORT = 3000;

const headersArray = [];
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});