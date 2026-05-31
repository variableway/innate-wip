# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 14

[label index.js]
import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
const app = express();
const PORT = 3000;
[highlight]
app.use(morgan("dev"));
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});
...