# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 26

import Fastify from 'fastify';
import express from 'express';
import expressPlugin from '@fastify/express';

const app = express();
const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("x-custom-header", "true");
  next();
});

router.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Express inside Fastify!" });
});

fastify.register(require("@fastify/express")).after(() => {
  fastify.use(express.urlencoded({ extended: false }));
  fastify.use(express.json());
  fastify.use(router);
});

fastify.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});