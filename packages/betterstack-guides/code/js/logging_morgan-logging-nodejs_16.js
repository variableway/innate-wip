# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 16

[label index.js]
import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;

[highlight]
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

morgan.token("id", (req) => req.id);

app.use(
  morgan(function (tokens, req, res) {
    return JSON.stringify({
      requestId: tokens.id(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: parseInt(tokens.status(req, res), 10),
      responseTime: `${tokens["response-time"](req, res)} ms`,
    });
  })
);
[/highlight]
app.get("/", (req, res) => {
  ...
}
....