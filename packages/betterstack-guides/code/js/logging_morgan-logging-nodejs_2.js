# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 2

[label index.js]
import express from "express";
const app = express();
const PORT = 3000

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.get("/about", (req, res) => {
  res.send("About Us");
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});