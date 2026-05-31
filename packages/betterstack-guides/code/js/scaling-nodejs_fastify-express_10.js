# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 10

[label main.js]
import Fastify from 'fastify';
import userPlugin from './userPlugin.js';

const fastify = Fastify();

await fastify.register(userPlugin);

fastify.register(async (instance) => {
  instance.get('/hello', async () => ({ message: 'Hello from another plugin!' }));
});

fastify.listen({ port: 3000 }, () => {
  console.log('Fastify server running at http://localhost:3000');
});