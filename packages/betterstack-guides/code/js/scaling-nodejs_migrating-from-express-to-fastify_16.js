# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 16

// Optimized database connection handling
import { Pool } from 'pg';

const dbPlugin = async (fastify, options) => {
  const pool = new Pool({
    host: options.host,
    max: 20,
    idleTimeoutMillis: 30000
  });
  
  fastify.decorate('db', pool);
  
  fastify.addHook('onClose', async (instance) => {
    await instance.db.end();
  });
};

await fastify.register(dbPlugin, databaseConfig);