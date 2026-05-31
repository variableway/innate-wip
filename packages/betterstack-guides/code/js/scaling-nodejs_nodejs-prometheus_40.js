# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: javascript
# Normalized: js
# Block index: 40

[label index.js]
[highlight]
import { register, Counter, Gauge, Histogram, Summary } from "prom-client";
[/highlight]

...
[highlight]
const responseSizeSummary = new Summary({
  name: "http_response_size_bytes",
  help: "Summary of HTTP response sizes in bytes",
  labelNames: ["method", "route"],
});
[/highlight]

// In-memory user store for demo purposes
const users = {
  user1: { username: "user1", password: "password1" },
  user2: { username: "user2", password: "password2" },
};
[highlight]
// Middleware to track response size for '/' endpoint only
const trackResponseSize = async (request, reply, payload) => {
  if (payload && request.routerPath === "/") {
    const responseSizeBytes = JSON.stringify(payload).length;
    responseSizeSummary
      .labels(request.method, request.routerPath)
      .observe(responseSizeBytes);
  }
};

// Apply middleware to track response size
fastify.addHook("onSend", trackResponseSize);
[/highlight]