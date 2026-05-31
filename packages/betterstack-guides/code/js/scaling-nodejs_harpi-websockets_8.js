# Source: https://betterstack.com/community/guides/scaling-nodejs/harpi-websockets/
# Original language: javascript
# Normalized: js
# Block index: 8

[label server.js]
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
[highlight]
import Nes from '@hapi/nes';
[/highlight]
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const init = async () => {
    const server = Hapi.server({
        ...
    });
[highlight]
    await server.register([Inert, Nes]);
[/highlight]
    // Serve static files
    server.route({
        ...
    });

    [highlight]
    // WebSocket subscription endpoint
    server.subscription('/websocket');

    // Handle WebSocket connections
    server.route({
        method: 'POST',
        path: '/message',
        handler: (request, h) => {
            const { message } = request.payload;
            console.log('Received message:', message);

            // Echo message back to all subscribers
            server.publish('/websocket', `Echo from Hapi: ${message}`);

            return { success: true };
        }
    });
    [/highlight]

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();