# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 6

[label index.js]
import express from "express";
[highlight]
import morgan from "morgan";
[/highlight]
const app = express();
const PORT = 3000;

[highlight]
app.use(morgan("combined"));
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

...