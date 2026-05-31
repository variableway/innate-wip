# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
import express from "express";
import morgan from "morgan";
[highlight]
import { v4 as uuidv4 } from "uuid";
[/highlight]

const app = express();
const PORT = 3000;
[highlight]
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Define a custom Morgan token for Request ID
morgan.token("id", (req) => req.id);

// Use Morgan with the custom token in the log format
app.use(
  morgan(":id :method :url :status :res[content-length] - :response-time ms")
);
[/highlight]

app.get("/", (req, res) => {
  ...
});