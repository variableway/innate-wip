# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 0

import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "Hello from Express!" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));