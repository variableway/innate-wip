# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 35

[label index.js]
const v8 = require("v8");
[highlight]
const client = require("prom-client");
[/highlight]
const express = require("express");
const app = express();
const PORT = 3000;

[highlight]
const register = new client.Registry();
client.collectDefaultMetrics({ register });
[/highlight]

const headersArray = [];
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

[highlight]
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});
[/highlight]

process.on("SIGUSR2", () => {
  const fileName = v8.writeHeapSnapshot();
  console.log(`Created heapdump file: ${fileName}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});