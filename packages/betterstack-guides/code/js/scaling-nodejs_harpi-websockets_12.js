# Source: https://betterstack.com/community/guides/scaling-nodejs/harpi-websockets/
# Original language: javascript
# Normalized: js
# Block index: 12

[label server.js]
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Nes from '@hapi/nes';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

[highlight]
// Enhanced connection and broadcasting management
class ConnectionManager {
    constructor() {
        this.connections = new Map();
        this.userCounter = 0;
        this.messageHistory = [];
        this.maxHistorySize = 20;
    }

    addConnection(socket) {
        const userData = {
            id: ++this.userCounter,
            nickname: `User${this.userCounter}`,
            connectedAt: new Date(),
            lastSeen: new Date(),
            messagesSent: 0
        };

        this.connections.set(socket, userData);
        console.log(`${userData.nickname} joined. Total users: ${this.connections.size}`);
        return userData;
    }

    removeConnection(socket) {
        const userData = this.connections.get(socket);
        if (userData) {
            this.connections.delete(socket);
            console.log(`${userData.nickname} left. Remaining users: ${this.connections.size}`);
            return userData;
        }
    }

    updateActivity(socket) {
        const userData = this.connections.get(socket);
        if (userData) {
            userData.lastSeen = new Date();
            userData.messagesSent++;
        }
    }

    addToHistory(message) {
        this.messageHistory.push({
            text: message,
            timestamp: new Date().toISOString()
        });

        if (this.messageHistory.length > this.maxHistorySize) {
            this.messageHistory.shift();
        }
    }

    getStats() {
        return {
            totalUsers: this.connections.size,
            totalMessages: this.messageHistory.length
        };
    }
}

const connectionManager = new ConnectionManager();
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
                    const userData = connectionManager.addConnection(socket);
                    const stats = connectionManager.getStats();

                    // Send personalized welcome with stats
                    setTimeout(() => {
                        server.publish('/websocket',
                            `Welcome ${userData.nickname}! ${stats.totalUsers} users online, ${stats.totalMessages} messages today.`
                        );

                        // Notify others about new user
                        server.publish('/websocket',
                            `${userData.nickname} joined the chat! Say hello!`
                        );
                    }, 100);
                },
                onDisconnection: (socket) => {
                    const userData = connectionManager.removeConnection(socket);
                    if (userData) {
                        server.publish('/websocket',
                            `${userData.nickname} left the chat. ${connectionManager.getStats().totalUsers} users remain.`
                        );
                    }
                },
                onMessage: (socket, message) => {
                    connectionManager.updateActivity(socket);
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

    // Enhanced message handling
    server.route({
        method: 'POST',
        path: '/message',
        handler: (request, h) => {
            try {
                ...
                if (message.length > 500) {
                    return { success: false, error: 'Message too long (max 500 characters)' };
                }

                [highlight]
                // Add to message history
                connectionManager.addToHistory(message);

                // Broadcast with timestamp and formatting
                const timestamp = new Date().toLocaleTimeString();
                const formattedMessage = `[${timestamp}] ${message}`;

                console.log('Broadcasting:', formattedMessage);
                server.publish('/websocket', formattedMessage);
                [/highlight]

                return { success: true };
            } catch (error) {
                console.error('Message handling error:', error);
                return { success: false, error: 'Server error processing message' };
            }
        }
    });

    [highlight]
    // Add stats endpoint
    server.route({
        method: 'GET',
        path: '/stats',
        handler: (request, h) => {
            return connectionManager.getStats();
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