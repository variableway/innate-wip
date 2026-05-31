# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/
# Original language: javascript
# Normalized: js
# Block index: 3

[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ 
    logger: true 
});

// Register static file serving
await fastify.register(import('@fastify/static'), {
    root: new URL('public', import.meta.url).pathname
});

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();