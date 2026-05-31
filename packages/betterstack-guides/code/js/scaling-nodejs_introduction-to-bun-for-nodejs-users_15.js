# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 15

[label index.js]
Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response("Hello World!");
 return new Response("404!");
 },
});