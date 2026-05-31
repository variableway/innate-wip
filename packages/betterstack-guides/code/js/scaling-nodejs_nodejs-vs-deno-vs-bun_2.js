# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-vs-bun/
# Original language: javascript
# Normalized: js
# Block index: 2

[label server.js]
import express from "express";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});