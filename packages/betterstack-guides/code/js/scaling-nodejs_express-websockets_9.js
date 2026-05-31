# Source: https://betterstack.com/community/guides/scaling-nodejs/express-websockets/
# Original language: javascript
# Normalized: js
# Block index: 9

[label server.js]
...
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
...
    `);
});

[highlight]
class ConnectionManager {
    constructor() {
        this.clients = new Set();
    }
    
    addClient(ws) {
        this.clients.add(ws);
        console.log(`Client added. Total clients: ${this.clients.size}`);
    }
    
    removeClient(ws) {
        this.clients.delete(ws);
        console.log(`Client removed. Total clients: ${this.clients.size}`);
    }
    
    broadcast(message, sender = null) {
        this.clients.forEach(client => {
            if (client !== sender && client.readyState === client.OPEN) {
                try {
                    client.send(message);
                } catch (error) {
                    console.error('Error broadcasting to client:', error);
                    this.removeClient(client);
                }
            }
        });
    }
    
    getClientCount() {
        return this.clients.size;
    }
}

const connectionManager = new ConnectionManager();
[/highlight]

const wss = new WebSocketServer({ 
    server,
    clientTracking: true
});

wss.on("connection", function connection(ws, request) {
    const clientIP = request.socket.remoteAddress;
    console.log(`New client connected from ${clientIP}`);
    
    // Send welcome message
    ws.send('Welcome to the WebSocket server!');
    
    [highlight]
    connectionManager.addClient(ws);
    ws.send(`Welcome! There are ${connectionManager.getClientCount()} clients connected.`);
    
    // Notify other clients about new connection
    connectionManager.broadcast(`A new user joined the chat!`, ws);
    [/highlight]
    
    ws.on("message", function message(data) {
        try {
            const messageText = data.toString();
            console.log("Received:", messageText);
            
            [highlight]
            // Broadcast message to all other clients
            connectionManager.broadcast(`User says: ${messageText}`, ws);
            [/highlight]
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on("close", function close(code, reason) {
        [highlight]
        connectionManager.removeClient(ws);
        connectionManager.broadcast(`A user left the chat.`);
        [/highlight]
        console.log(`Client disconnected - Code: ${code}, Reason: ${reason}`);
    });
    
    ...
});
...