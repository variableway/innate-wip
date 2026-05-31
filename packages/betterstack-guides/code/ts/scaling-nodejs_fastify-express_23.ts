# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: typescript
# Normalized: ts
# Block index: 23

import express from "express";
import spdy from "spdy";
import fs from "fs";

const app = express();
app.get("/", (req, res) => res.json({ message: "Hello, HTTP/2!" }));

spdy
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    },
    app
  )
  .listen(3000, () => console.log("Server running on https://localhost:3000"));