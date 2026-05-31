# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 12

[label index.js]
...
morgan.token("id", (req) => req.id);

[highlight]
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
  res.send("Welcome to the Home Page!");
});
...