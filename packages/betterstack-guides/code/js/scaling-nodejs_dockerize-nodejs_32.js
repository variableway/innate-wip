# Source: https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 32

[label server.js]
. . .
const address = await app.listen({ host: '0.0.0.0', port: config.port });
. . .