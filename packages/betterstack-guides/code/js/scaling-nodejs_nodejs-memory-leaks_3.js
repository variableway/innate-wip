# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 3

const express = require("express");
const app = express();
const PORT = 3000;

const data = [];
app.get("/", (req, res) => {
  data.push(req.headers);
  res.status(200).send(JSON.stringify(data));
});