# Source: https://betterstack.com/community/guides/logging/morgan-logging-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 8

[label index.js]
...
[highlight]
app.use(morgan("tiny"));
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});
...