# Source: https://betterstack.com/community/guides/scaling-nodejs/express-websockets/
# Original language: javascript
# Normalized: js
# Block index: 7

[label server.js]
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
...
    `);
});

[highlight]
const wss = new WebSocketServer({ 
    server,
    clientTracking: true
});

wss.on('connection', function connection(ws, request) {
    const clientIP = request.socket.remoteAddress;
    console.log(`New client connected from ${clientIP}`);
    
    // Send welcome message
    ws.send('Welcome to the WebSocket server!');
    
    ws.on('message', function message(data) {
        try {
            const messageText = data.toString();
            console.log('Received:', messageText);
            
            if (ws.readyState === ws.OPEN) {
                ws.send(`Echo: ${messageText}`);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on('close', function close(code, reason) {
        console.log(`Client disconnected - Code: ${code}, Reason: ${reason}`);
    });
    
    ws.on('error', function error(err) {
        console.error('WebSocket error:', err);
    });
    
    // Handle connection ping/pong for keep-alive
    ws.on('pong', function heartbeat() {
        ws.isAlive = true;
    });
    
    ws.isAlive = true;
});

// Ping clients periodically to detect broken connections
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});
[/highlight]

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});