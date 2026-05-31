# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/
# Original language: javascript
# Normalized: js
# Block index: 8

[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ 
    logger: true 
});

await fastify.register(import('@fastify/static'), {
    root: new URL('public', import.meta.url).pathname
});

[highlight]
// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));
[/highlight]

fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

[highlight]
// WebSocket route handler
fastify.register(async function (fastify) {
    fastify.get('/websocket', { websocket: true }, (connection, request) => {
        console.log('Client connected');
        
        // Send welcome message
        connection.send('Connected to Fastify WebSocket server!');
        
        // Handle incoming messages
        connection.on('message', message => {
            const text = message.toString();
            console.log('Received:', text);
            connection.send(`Echo: ${text}`);
        });
        
        // Handle connection close
        connection.on('close', () => {
            console.log('Client disconnected');
        });
    });
});
[/highlight]

const PORT = process.env.PORT || 3000;

...