# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-websockets/
# Original language: javascript
# Normalized: js
# Block index: 10

[label server.js]
// ... previous imports ...

[highlight]
// Connection management
const activeConnections = new Set();

function broadcastMessage(message, excludeConnection = null) {
    activeConnections.forEach(connection => {
        if (connection !== excludeConnection && connection.readyState === connection.OPEN) {
            try {
                connection.send(message);
            } catch (error) {
                console.error('Broadcasting error:', error);
                activeConnections.delete(connection);
            }
        }
    });
}
[/highlight]

// WebSocket middleware
app.ws.use(async (ctx) => {
    const clientAddress = ctx.request.ip;
    console.log(`WebSocket connection established from ${clientAddress}`);

    [highlight]
    // Register connection
    activeConnections.add(ctx.websocket);
    console.log(`Active connections: ${activeConnections.size}`);

    // Send personalized welcome
    ctx.websocket.send(`Welcome! There are ${activeConnections.size} users online.`);

    // Announce new user to others
    broadcastMessage(`A new user joined the chat! (${activeConnections.size} users online)`, ctx.websocket);
    [/highlight]

    ctx.websocket.on('message', (message) => {
        try {
            const text = message.toString();
            console.log(`Message from ${clientAddress}:`, text);

            [highlight]
            // Broadcast message to all other clients
            broadcastMessage(`User message: ${text}`, ctx.websocket);
            [/highlight]
        } catch (error) {
            console.error('Message processing error:', error);
        }
    });

    ctx.websocket.on('error', (error) => {
        console.error(`WebSocket error from ${clientAddress}:`, error);
    });

    ctx.websocket.on('close', (code, reason) => {
        [highlight]
        activeConnections.delete(ctx.websocket);
        console.log(`Client ${clientAddress} disconnected - Code: ${code}`);
        console.log(`Remaining connections: ${activeConnections.size}`);

        // Notify other users about departure
        broadcastMessage(`A user left the chat. (${activeConnections.size} users online)`);
        [/highlight]
    });
});

// ... rest of server setup ...