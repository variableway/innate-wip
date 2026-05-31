# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: typescript
# Normalized: ts
# Block index: 19

server.get<{ Querystring: { username: string } }>("/login", async (request) => {
  const { username } = request.query;
  // `username` is strongly typed as a string
});