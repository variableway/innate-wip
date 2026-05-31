# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-websockets/
# Original language: javascript
# Normalized: js
# Block index: 7

[label server.js]
import Koa from 'koa';
import serve from 'koa-static';
[highlight]
import websocket from 'koa-websocket';
[/highlight]
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

[highlight]
const app = websocket(new Koa());
[/highlight]
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files
app.use(serve(join(__dirname, 'public')));

[highlight]
// WebSocket middleware
app.ws.use(async (ctx) => {
    console.log('WebSocket connection established');

    // Send welcome message
    ctx.websocket.send('Welcome to Koa WebSocket server!');

    // Handle incoming messages
    ctx.websocket.on('message', (message) => {
        const text = message.toString();
        console.log('Received message:', text);
        ctx.websocket.send(`Server echo: ${text}`);
    });

    // Handle connection close
    ctx.websocket.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
[/highlight]

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});