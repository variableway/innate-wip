# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 28

app.get("/users", (req, res) => {
  res.json({ message: "Users from Express!" });
});