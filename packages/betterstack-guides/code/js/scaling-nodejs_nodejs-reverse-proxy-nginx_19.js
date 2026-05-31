# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-reverse-proxy-nginx/
# Original language: javascript
# Normalized: js
# Block index: 19

[label server.js]
. . .

fastify.listen(300 + process.env.NODE_APP_INSTANCE, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});