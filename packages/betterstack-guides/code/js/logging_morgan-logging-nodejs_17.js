# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 17

[label index.js]
import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
[highlight]
import { Logtail } from "@logtail/node"
[/highlight]

const app = express();
const PORT = 3000;
[highlight]
const logtail = new Logtail("$SOURCE_TOKEN", {
  endpoint: 'https://$INGESTING_HOST',
});
[/highlight]
...
app.use(
  morgan((tokens, req, res) => {
[highlight]
    const entry = {
      requestId: tokens.id(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: parseInt(tokens.status(req, res), 10),
      response_time: tokens["response-time"](req, res),
    };
    logtail.info("HTTP request", entry);
    return null; // We return null so nothing prints to stdout
  })
[/highlight]
);