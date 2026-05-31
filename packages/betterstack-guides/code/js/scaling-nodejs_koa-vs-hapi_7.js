# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 7

// Most features built-in
const server = Hapi.server({
  port: 3000,
  routes: {
    cors: true,
    security: true
  }
});

await server.register([
  require('@hapi/jwt'),
  require('@hapi/inert')
]);