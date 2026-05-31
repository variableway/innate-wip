# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/
# Original language: javascript
# Normalized: js
# Block index: 11

[label server.js]
// ... previous imports and setup ...

[highlight]
// Simple connection manager
const connections = new Set();

function broadcast(message, sender = null) {
    connections.forEach(connection => {
        if (connection !== sender && connection.readyState === connection.OPEN) {
            try {
                connection.send(message);
            } catch (error) {
                console.error('Broadcast error:', error);
                connections.delete(connection);
            }
        }
    });
}
[/highlight]

fastify.register(async function (fastify) {
    fastify.get('/websocket', { websocket: true }, (connection, request) => {
        const clientIP = request.socket.remoteAddress;
        console.log(`Client connected from ${clientIP}`);
        
        [highlight]
        // Add to connection pool
        connections.add(connection);
        console.log(`Total connections: ${connections.size}`);
        
        // Welcome message with connection count
        connection.send(`Welcome! ${connections.size} clients connected.`);
        
        // Notify other clients
        broadcast(`New user joined. ${connections.size} total users.`, connection);
        [/highlight]
        
        connection.on('message', message => {
            try {
                const text = message.toString();
                console.log(`Received from ${clientIP}:`, text);
                
                [highlight]
                // Broadcast message to all other clients
                broadcast(`User says: ${text}`, connection);
                [/highlight]
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });
        
        connection.on('error', (error) => {
            console.error(`WebSocket error for ${clientIP}:`, error);
        });
        
        connection.on('close', (code, reason) => {
            [highlight]
            connections.delete(connection);
            console.log(`Client ${clientIP} disconnected - Code: ${code}`);
            console.log(`Remaining connections: ${connections.size}`);
            
            // Notify remaining clients
            broadcast(`User left. ${connections.size} total users.`);
            [/highlight]
        });
    });
});

// ... rest of server setup ...