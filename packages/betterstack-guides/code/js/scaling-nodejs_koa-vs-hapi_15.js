# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 15

// Automatic caching
server.route({
  method: 'GET',
  path: '/expensive-data',
  options: {
    cache: {
      expiresIn: 60 * 1000,
      generateTimeout: 2000
    }
  },
  handler: async () => {
    return await computeExpensiveData();
  }
});

// Built-in compression and optimization
const server = Hapi.server({
  compression: { minBytes: 1024 },
  load: { sampleInterval: 1000 }
});