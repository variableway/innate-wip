# Source: https://betterstack.com/community/guides/scaling-nodejs/harpi-websockets/
# Original language: javascript
# Normalized: js
# Block index: 10

[label server.js]
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Nes from '@hapi/nes';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

[highlight]
// Connection tracking
const connections = new Map();
let connectionCounter = 0;

function trackConnection(socket) {
    const id = ++connectionCounter;
    const connectionInfo = {
        id,
        connectedAt: new Date(),
        lastActivity: new Date(),
        isActive: true
    };

    connections.set(socket, connectionInfo);
    console.log(`Client ${id} connected. Total connections: ${connections.size}`);
    return connectionInfo;
}

function removeConnection(socket) {
    const info = connections.get(socket);
    if (info) {
        connections.delete(socket);
        console.log(`Client ${info.id} disconnected. Remaining: ${connections.size}`);
    }
}
[/highlight]

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    [highlight]
    await server.register([
        Inert,
        {
            plugin: Nes,
            options: {
                onConnection: (socket) => {
                    trackConnection(socket);

                    // Send personalized welcome
                    const info = connections.get(socket);
                    server.publish('/websocket', `Welcome! You are user #${info.id}. ${connections.size} users online.`);
                },
                onDisconnection: (socket) => {
                    const info = connections.get(socket);
                    removeConnection(socket);
                    if (info) {
                        server.publish('/websocket', `User #${info.id} left. ${connections.size} users remaining.`);
                    }
                },
                onMessage: (socket, message) => {
                    const info = connections.get(socket);
                    if (info) {
                        info.lastActivity = new Date();
                        console.log(`Message from user #${info.id}:`, message);
                    }
                }
            }
        }
    ]);
    [/highlight]

    // Serve static files
    server.route({
        ...
    });

    // WebSocket subscription endpoint
    server.subscription('/websocket');

    // Handle WebSocket messages
    server.route({
        method: 'POST',
        path: '/message',
        handler: (request, h) => {
            [highlight]
            try {
                const { message } = request.payload;

                if (!message || message.trim().length === 0) {
                    return { success: false, error: 'Message cannot be empty' };
                }

                if (message.length > 500) {
                    return { success: false, error: 'Message too long (max 500 characters)' };
                }

                console.log('Broadcasting message:', message);
                server.publish('/websocket', `User message: ${message}`);

                return { success: true };
            } catch (error) {
                console.error('Message handling error:', error);
                return { success: false, error: 'Server error processing message' };
            }
            [/highlight]
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();