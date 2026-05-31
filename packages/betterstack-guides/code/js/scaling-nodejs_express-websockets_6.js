# Source: https://betterstack.com/community/guides/scaling-nodejs/express-websockets/
# Original language: javascript
# Normalized: js
# Block index: 6

[label server.js]
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// ... HTML template code from above ...

[highlight]
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    console.log('New client connected');
    
    ws.on('message', function message(data) {
        const messageText = data.toString();
        console.log('Received:', messageText);
        ws.send(`Echo: ${messageText}`);
    });
    
    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});
[/highlight]

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});