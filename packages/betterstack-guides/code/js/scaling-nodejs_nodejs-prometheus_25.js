# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: javascript
# Normalized: js
# Block index: 25

[label index.js]

...
[highlight]
import { register, Counter, Gauge } from "prom-client";
[/highlight]
// Prometheus metrics
const requestCounter = new Counter({
  ...
});

[highlight]
const loginUsersGauge = new Gauge({
  name: "logged_in_users",
  help: "Number of currently logged-in users",
});

[/highlight]
...
fastify.post("/login", async (request, reply) => {
  ...
  if (user && user.password === password) {
    request.session.user = { username: user.username };
[highlight]
    loginUsersGauge.inc(); // Increment gauge on successful login
[/highlight]
    return reply.send({ message: "Login successful", username: user.username });
  } else {
    return reply.status(401).send({ error: "Invalid username or password" });
  }
});

// Handle logout
fastify.post("/logout", async (request, reply) => {
  if (request.session.user) {
[highlight]
    loginUsersGauge.dec(); // Decrement gauge on logout
[/highlight]
    delete request.session.user;
    return reply.send({ message: "Logout successful" });
  } else {
    return reply.status(401).send({ error: "Not logged in" });
  }
});
...