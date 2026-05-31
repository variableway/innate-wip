# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: typescript
# Normalized: ts
# Block index: 21

declare module "fastify" {
  interface FastifyRequest {
    user: { id: number };
  }
}

server.decorateRequest("user", null);