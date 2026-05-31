# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: javascript
# Normalized: js
# Block index: 2

[label index.js]
...
// In-memory user store for demo purposes
const users = {
  user1: { username: "user1", password: "password1" },
  user2: { username: "user2", password: "password2" },
};


// Handle login form submissions
fastify.post("/login", async (request, reply) => {
  const { username, password } = request.body;
  ...
});

// Handle logout
fastify.post("/logout", async (request, reply) => {
  ...
});

fastify.get("/", async (request, reply) => {
  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT title, release_date, tagline FROM movies",
    ...
    });
  });

  return rows.splice(0, 8);
});

...