# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/
# Original language: javascript
# Normalized: js
# Block index: 9

[label server.js]
// ... previous imports and setup ...

fastify.register(async function (fastify) {
    fastify.get('/websocket', { websocket: true }, (connection, request) => {
        [highlight]
        const clientIP = request.socket.remoteAddress;
        console.log(`Client connected from ${clientIP}`);
        [/highlight]
        
        connection.send('Connected to Fastify WebSocket server!');
        
        connection.on('message', message => {
            [highlight]
            try {
                const text = message.toString();
                console.log(`Received from ${clientIP}:`, text);
                
                // Check if connection is still open before sending
                if (connection.readyState === connection.OPEN) {
                    connection.send(`Echo: ${text}`);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
            [/highlight]
        });
        
        [highlight]
        // Handle WebSocket errors
        connection.on('error', (error) => {
            console.error(`WebSocket error for ${clientIP}:`, error);
        });
        
        connection.on('close', (code, reason) => {
            console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
        });
        [/highlight]

    });
});

// ... rest of server setup ...