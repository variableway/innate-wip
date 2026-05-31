# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: typescript
# Normalized: ts
# Block index: 22

server.addHook<{ Headers: { Authorization: string } }>(
  "preValidation",
  (req, reply) => {
    if (!req.headers.Authorization) {
      reply.code(401).send();
    }
  }
);