# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 34

[label index.js]
const v8 = require("v8");
const express = require("express");
const app = express();
const PORT = 3000;

const headersArray = [];
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

process.on("SIGUSR2", () => {
  const fileName = v8.writeHeapSnapshot();
  console.log(`Created heapdump file: ${fileName}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});