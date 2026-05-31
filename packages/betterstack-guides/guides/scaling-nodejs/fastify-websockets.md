# Getting Started with Fastify WebSockets

[Fastify](https://www.fastify.io/) offers impressive performance for Node.js web applications and is very developer-friendly. In addition to managing standard HTTP routes, Fastify smoothly works with WebSocket plugins, making it easy to build real-time features like chat systems, live dashboards, and collaborative tools.

Since Fastify's main focus is on core features, WebSocket support is added via the official `@fastify/websocket` plugin. This setup combines Fastify's speed and robust plugin system with dependable WebSocket communication.

This guide will walk you through building WebSocket features with Fastify step by step. You'll discover how to handle connections, broadcast messages, and manage clients effectively.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/vUDH8OX5DTM
" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Prerequisites

To build WebSocket applications with Fastify, you'll want to make sure you have Node.js version 16 or newer installed on your system, along with npm. We’re also assuming you’re comfortable with Fastify routing and using JavaScript's async/await patterns.

## Setting up your Fastify WebSocket project

WebSocket development becomes smoother with a tidy project structure, so let's set up a dedicated workspace. We'll kick things off by initializing a new Node.js project and installing all the essential dependencies to bring real-time features to life.

```command
mkdir fastify-websockets && cd fastify-websockets
```

```command
npm init -y
```

```command
npm pkg set type="module"
```

These commands help you set up a project directory, create a default `package.json` file, and activate ES module support for modern JavaScript syntax.

Feel free to install Fastify along with the WebSocket plugin and static file serving to get started.

```command
npm install fastify @fastify/websocket @fastify/static
```

Create your main server file with basic Fastify configuration:

```javascript
[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ 
    logger: true 
});

// Register static file serving
await fastify.register(import('@fastify/static'), {
    root: new URL('public', import.meta.url).pathname
});

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
```

This setup imports Fastify with logging enabled and registers the static file plugin to serve client-side files. The server configuration uses Fastify's recommended startup pattern with proper error handling.

Next, create a simple client interface for testing. Make a `public` directory and add an HTML file:

```command
mkdir public && touch public/index.html
```

Add this basic WebSocket client to `public/index.html`:

```html
[label public/index.html]
<!DOCTYPE html>
<html>
<head>
    <title>Fastify WebSocket Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        #messages { border: 1px solid #ccc; height: 300px; 
                   overflow-y: auto; padding: 10px; margin-bottom: 10px; }
        input[type="text"] { width: 300px; padding: 5px; }
        button { padding: 5px 10px; }
    </style>
</head>
<body>
    <h1>Fastify WebSocket Demo</h1>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Type your message">
    <button onclick="sendMessage()">Send</button>
    
    <script>
        const ws = new WebSocket('ws://localhost:3000/websocket');
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
```

This client creates a WebSocket connection to `/websocket` and provides basic message sending and display functionality. The interface includes keyboard shortcuts and auto-scrolling for better usability.

Update your server file to serve this HTML page:

```javascript
[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ 
    logger: true 
});

await fastify.register(import('@fastify/static'), {
    root: new URL('public', import.meta.url).pathname
});

[highlight]
fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});
[/highlight]

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
```

Start your server to test the basic setup:

```command
node --watch server.js
```

Visit `http://localhost:3000` to see your demo interface:

![Screenshot of the demo interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/34319ea3-7b65-4fd7-9bcb-3e09cb698900/md1x =3248x1994)

The WebSocket connection will fail since we haven't implemented the server-side handler yet.


## Creating your first WebSocket handler

Let's enhance your Fastify server by adding WebSocket functionality. The `@fastify/websocket` plugin offers an easy way to manage WebSocket connections while still handling your regular HTTP routes.

 Simply register the WebSocket plugin and set up your very first connection handler—it's a smooth step forward in making your server more interactive and responsive:

```javascript
[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ 
    logger: true 
});

await fastify.register(import('@fastify/static'), {
    root: new URL('public', import.meta.url).pathname
});

[highlight]
// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));
[/highlight]

fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

[highlight]
// WebSocket route handler
fastify.register(async function (fastify) {
    fastify.get('/websocket', { websocket: true }, (connection, request) => {
        console.log('Client connected');
        
        // Send welcome message
        connection.send('Connected to Fastify WebSocket server!');
        
        // Handle incoming messages
        connection.on('message', message => {
            const text = message.toString();
            console.log('Received:', text);
            connection.send(`Echo: ${text}`);
        });
        
        // Handle connection close
        connection.on('close', () => {
            console.log('Client disconnected');
        });
    });
});
[/highlight]

const PORT = process.env.PORT || 3000;

...
```

Registering the plugin activates WebSocket support across your application. The route handler specifies `{ websocket: true }` to denote WebSocket handling instead of HTTP responses. Fastify allows access to both the WebSocket connection and the original HTTP request for context.

The connection handler sends a welcome message, echoes incoming messages back to the sender, and logs connection events. This creates a simple echo server that confirms your WebSocket setup works correctly.

Restart your server and return to `http://localhost:3000`. Type a message and press Enter:

![Screenshot of message input in the demo interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7ac618ec-6ee7-4f99-ea94-fb18d7fc0800/md1x =3248x1994)

You should see your message echoed back in real time with an "Echo:" prefix.

![Screenshot of echoed message appearing in the interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fe378c7b-ea8c-4614-0919-13d5f692ec00/lg2x =3248x1994)

Your first Fastify WebSocket server is working! Next, you'll learn how to handle connection errors robustly.

## Adding connection error handling

WebSocket applications for production require reliable error handling to effectively address network problems, client disconnections, and unforeseen errors.

While your current setup handles simple cases, it needs more thorough error management. Let's improve it by implementing proper connection state control.

```javascript
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
```

The new updates log client IP addresses for improved tracking and incorporate error event handling. The message handler now checks connection states to avoid sending messages to closed connections. The close event now also reports disconnection codes and reasons for debugging.

Restart your server and test at `http://localhost:3000`. When you close the browser tab or refresh the page, you will see detailed disconnection information in your terminal instead of silent failures.

```text
[output]
...
Client connected from 127.0.0.1
Client 127.0.0.1 disconnected - Code: 1001, Reason: none
```

This strong error handling is really important for applications where keeping a stable connection makes a big difference.

## Broadcasting messages to multiple clients

Real WebSocket applications typically need to send messages to multiple clients simultaneously. Your current echo server only responds to individual senders. Let's build message broadcasting functionality to enable multi-client communication.

Create a simple connection manager to track and message multiple clients:

```javascript
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
```

The `connections` Set tracks all active WebSocket connections, while the `broadcast` function sends messages to all clients except the sender. The function includes error handling to automatically remove broken connections.

When clients connect, they get a personalized welcome message, and the other clients are informed. Messages sent by any client are broadcasted to everyone, forming a simple chat system.

Restart your server and open multiple browser tabs to `http://localhost:3000`. You'll see connection notifications and user counts update in real-time:

![Screenshot showing multiple welcome messages and user join notifications](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ccc2db20-1ac3-4009-81a0-6af62d99f900/public =3248x1994)

Send a message from one tab and see it appear instantly in all the other tabs:

![Screenshot of message broadcasting across multiple clients](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/68ad22b1-fa6f-46c1-23ab-a36ad7927600/lg1x =3248x1994)

You've successfully built a real-time multi-client chat system with Fastify WebSockets.

## Final thoughts

This article guided you through creating a real-time WebSocket app with Fastify's plugin system, starting from a basic echo server and advancing to a multi-client broadcaster with error handling.

For some great ideas on advanced features and ways to scale up, take a look at the [@fastify/websocket docs](https://github.com/fastify/fastify-websocket) and [Fastify’s optimization guides](https://www.fastify.io/docs/latest/Guides/Getting-Started/). You might also want to think about adding authentication, message persistence, or horizontal scaling to make your setup even better.
