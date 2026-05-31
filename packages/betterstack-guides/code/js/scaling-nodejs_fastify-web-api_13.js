# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 13

[label app.js]
import Fastify from 'fastify';
import cors from '@fastify/cors';
[highlight]
import { testConnection } from './utils/db.js';
[/highlight]

....
// Start server
const start = async () => {
  try {
[highlight]
    // Test database connection before starting the server
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to the database');
    }
[/highlight]
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();