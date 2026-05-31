# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 27

import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';

await fastify.register(require("@fastify/cors"));
await fastify.register(require("@fastify/helmet"));