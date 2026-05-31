# Getting Started with Express WebSockets

[Express.js](https://expressjs.com/) remains the preferred framework for developing Node.js web applications, offering ease of use and adaptability. Besides handling traditional HTTP requests, Express works smoothly with WebSocket libraries to power real-time apps like live dashboards, multiplayer games, and instant messaging services.

Since Express doesn't have built-in WebSocket support, combining it with the popular `ws` library creates a strong setup for real-time communication. This method provides the familiar Express routing and middleware system along with reliable WebSocket capabilities.

This tutorial guides you through building WebSocket features with Express from scratch. You'll learn about connection management, message broadcasting, and client handling. Once you're done, you'll have the skills to add live updates to any Express app.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQV0xzOeGzU
" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Prerequisites

To develop WebSocket applications with Express, you need Node.js version 14 or higher and npm installed on your system. This tutorial assumes familiarity with Express.js fundamentals and basic JavaScript asynchronous programming concepts.

## Creating your Express WebSocket project

Working with WebSockets requires a dedicated development environment, so we'll set up a new project. Start by initializing a fresh Node.js project and organizing the required directory structure.

```command
mkdir express-websockets && cd express-websockets
```

```command
npm init -y
```

```command
npm pkg set type="module"
```

The first command creates and navigates into a new project folder. The `npm init -y` command sets up a `package.json` file with default settings, while the third command configures your project to use ES modules, allowing modern import/export syntax.

Install Express alongside the WebSocket library and additional tools for a complete development setup:

```command
npm install express ws cors
```

Create your main server file with the foundational Express configuration using ES modules:

```javascript
[label server.js]
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
```

This code imports the necessary modules using ES module syntax. The `createServer` function wraps your Express app in an HTTP server, which is required for WebSocket integration. The static middleware serves files from a `public` directory we'll create next.

Now, build a client-side interface for testing your WebSocket implementation. Create a `public` directory and add an HTML file that will serve as your testing ground:

```command
mkdir public
```

```javascript
[label server.js]
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

[highlight]
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Express WebSocket Demo</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    #messages { border: 1px solid #ccc; height: 300px; 
                               overflow-y: scroll; padding: 10px; margin-bottom: 10px; }
                    #messageInput { width: 300px; padding: 5px; }
                    button { padding: 5px 10px; }
                </style>
            </head>
            <body>
                <h1>Express WebSocket Demo</h1>
                <div id="messages"></div>
                <input type="text" id="messageInput" placeholder="Enter your message">
                <button onclick="sendMessage()">Send Message</button>
                <script>
                    const ws = new WebSocket('ws://localhost:3000');
                    const messages = document.getElementById('messages');
                    
                    ws.onmessage = function(event) {
                        const messageDiv = document.createElement('div');
                        messageDiv.textContent = event.data;
                        messages.appendChild(messageDiv);
                        messages.scrollTop = messages.scrollHeight;
                    };
                    
                    function sendMessage() {
                        const input = document.getElementById('messageInput');
                        if (input.value) {
                            ws.send(input.value);
                            input.value = '';
                        }
                    }
                    
                    document.getElementById('messageInput').addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    });
                </script>
            </body>
        </html>
    `);
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
[/highlight]
```

This route serves an HTML page with embedded CSS and JavaScript. The client-side script creates a WebSocket connection to `ws://localhost:3000` and handles message display and sending. The interface includes auto-scrolling messages and Enter key support for better user experience.

Launch your development server to confirm the basic setup functions correctly:

```command
node --watch server.js
```

Navigate to `http://localhost:3000` in your browser to view the demo interface:

![Screenshot of the demo interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/12f80958-16c6-42d7-880e-f2a4c7652300/md1x =3248x1994)

The WebSocket functionality isn't operational yet since we haven't implemented the WebSocket server.

## Building your first WebSocket server

Now that your Express application and client interface are ready, you need to create a WebSocket server that handles real-time connections. This enables your browser client to establish persistent connections for instant message exchange.

Add the WebSocket server implementation to your `server.js` file:

```javascript
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
```

The `WebSocketServer` constructor creates a WebSocket server attached to your HTTP server. The `connection` event fires when clients connect, giving you access to individual WebSocket instances. The `message` event handler processes incoming text data, while the `close` event manages disconnections.

Your server should restart and then return to `http://localhost:3000`. Type a message and press **Enter** or click **Send Message**:

![Screenshot of message input](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e7d78a75-59f5-4f0f-20d2-de6eadd6e800/lg1x =3248x1994)

Your message should appear echoed back with an "Echo:" prefix in real time:

![Screenshot of echoed message](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4c2f194-8bbd-4e04-efe0-ff4603225200/md2x =3248x1994)

You've successfully created your first Express WebSocket server. Next, you'll learn how to handle connection errors robustly.


## Handling WebSocket connection states

WebSocket connections in Express applications have distinct lifecycle phases that require careful management for production-ready applications. Understanding these states helps you build resilient real-time features that gracefully handle network interruptions and client disconnections.

Your current implementation works for basic scenarios but lacks comprehensive error handling. Let's enhance it with proper connection state management:

```javascript
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
```

This enhanced version includes several critical improvements. The `clientTracking` option enables automatic client management, while the `readyState` check ensures messages only go to open connections. The ping/pong mechanism detects broken connections that haven't closed properly, preventing memory leaks.

The connection now captures client IP addresses and provides detailed disconnection information. The interval-based heartbeat system pings clients every 30 seconds to maintain connection health.

Restart your server and test at `http://localhost:3000`:

![Screenshot of enhanced server](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3f785628-6125-4a4b-fb53-134ed65c9f00/lg2x =3248x1994)

When you close the browser tab or refresh the page, you'll see detailed disconnection information in your terminal instead of silent failures:

```text
[output]
Restarting 'server.js'
Server running on http://localhost:3000
New client connected from ::1
Client disconnected - Code: 1001, Reason: 
```
This robust error handling is crucial for applications where connection stability matters.

## Broadcasting messages to multiple clients

Real-world WebSocket applications typically need to communicate with multiple clients simultaneously. Your current setup only echoes messages back to the sender. To create interactive experiences like chat rooms or live updates, you need broadcasting capabilities.

Implement a message broadcasting system that shares messages among all connected clients:

```javascript
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
```

The `ConnectionManager` class maintains a Set of active WebSocket connections, providing clean methods for adding, removing, and broadcasting to clients. The `broadcast` method excludes the sender to prevent message echoing and includes error handling for broken connections.

When new clients connect, they receive a welcome message showing the current client count, while existing clients are notified of the new arrival. Messages from any client are broadcast to all others, creating a real-time chat experience.

Restart your server and open multiple browser tabs to `http://localhost:3000`. You'll see welcome messages, client count updates, and join notifications as new tabs connect:


![Screenshot showing multiple welcome messages and user join notifications](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d96e69ea-4816-4b84-fb42-7d4217e56600/md1x =3248x1994)

Send a message from one tab and watch it appear instantly in all other tabs:

![Screenshot of broadcast message](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4417ad66-aee4-43a5-1f4f-f4a6e3ea0300/lg2x =3248x1994)

You've just built a functional real-time chat system with Express and WebSockets.

## Final thoughts

You've built a comprehensive real-time WebSocket application with Express.js. From a simple echo server, you've advanced to a multi-client broadcasting system that handles connections smoothly.

 For more tips on WebSocket optimization and advanced techniques, don't forget to check out the [ws library documentation](https://github.com/websockets/ws) and [Express.js advanced guides](https://expressjs.com/en/advanced/best-practice-security.html).