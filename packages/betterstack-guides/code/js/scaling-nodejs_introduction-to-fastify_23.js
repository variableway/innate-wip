# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 23

const post = await request.server.get("SELECT * FROM posts WHERE slug = ?", [
  slug,
]);