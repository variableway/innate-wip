# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/
# Original language: javascript
# Normalized: js
# Block index: 6

[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ 
    logger: true 
});

await fastify.register(import('@fastify/static'), {
    root: new URL('public', import.meta.url).pathname
});

[highlight]
fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});
[/highlight]

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();