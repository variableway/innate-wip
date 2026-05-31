# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-websockets/
# Original language: javascript
# Normalized: js
# Block index: 8

[label server.js]
// ... previous imports ...

// WebSocket middleware
app.ws.use(async (ctx) => {
    [highlight]
    const clientAddress = ctx.request.ip;
    console.log(`WebSocket connection established from ${clientAddress}`);
    [/highlight]

    ctx.websocket.send('Welcome to Koa WebSocket server!');

    ctx.websocket.on('message', (message) => {
        [highlight]
        try {
            const text = message.toString();
            console.log(`Message from ${clientAddress}:`, text);

            // Verify connection is still active
            if (ctx.websocket.readyState === ctx.websocket.OPEN) {
                ctx.websocket.send(`Server echo: ${text}`);
            }
        } catch (error) {
            console.error('Message processing error:', error);
        }
        [/highlight]
    });

    [highlight]
    // Handle WebSocket errors
    ctx.websocket.on('error', (error) => {
        console.error(`WebSocket error from ${clientAddress}:`, error);
    });
    [/highlight]

[highlight]
    ctx.websocket.on('close', (code, reason) => {
        console.log(`Client ${clientAddress} disconnected - Code: ${code}, Reason: ${reason || 'none'}`);
    });
[/highlight]
});

// ... rest of server setup ...