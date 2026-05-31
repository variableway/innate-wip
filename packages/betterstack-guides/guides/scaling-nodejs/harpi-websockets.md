# Getting Started with WebSockets in Hapi.js

[Hapi.js](https://hapi.dev/) is a web framework for Node.js, designed to make developers' lives easier with its rich set of built-in features and mature tools.

It's great at building reliable HTTP APIs, and it also works smoothly with WebSocket solutions. This allows you to create more dynamic, real-time applications such as notification systems, collaborative platforms, and live monitoring dashboards.

Hapi's plugin-oriented architecture offers real-time capabilities through specialized packages like `@hapi/nes`. This design keeps Hapi's core stable while providing flexible options for bidirectional communication, making it a reliable and versatile choice.

This tutorial explores building WebSocket-enabled applications with Hapi from foundational concepts to production deployment.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/rT-nduaJp_E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

To develop WebSocket applications using Hapi, ensure you have Node.js version 16 or later and the npm package manager installed. This guide assumes you are familiar with Hapi's plugin architecture, routing methods, and JavaScript's asynchronous programming techniques.

## Setting up the project directory

In this section, you'll configure the development environment for WebSocket integration with Hapi and install the necessary dependencies for real-time functionality.

Begin by creating the project directory and navigating into it:

```command
mkdir hapi-websockets && cd hapi-websockets
```

Initialize your Node.js project with default configuration:

```command
npm init -y
```

Configure ES module support for contemporary JavaScript syntax:

```command
npm pkg set type="module"
```

Install the essential packages for Hapi WebSocket development:

```command
npm install @hapi/hapi @hapi/nes @hapi/inert
```

Create your main server file with fundamental Hapi configuration:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    // Register static file plugin
    await server.register(Inert);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

This setup configures Hapi with thorough error handling and includes the Inert plugin for serving static assets. The server initialization adheres to Hapi's recommended practices with solid exception management and proper resource cleanup.

Now create a client-side testing interface to validate WebSocket functionality. Set up a `public` directory and develop an HTML client:

```command
mkdir public && touch public/index.html
```

Develop this WebSocket test client in `public/index.html`:

```html
[label public/index.html]
<!DOCTYPE html>
<html>
  <head>
    <title>Hapi WebSocket Demo</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 30px;
        background: #f0f2f5;
      }
      .demo-container {
        max-width: 700px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background: #4a90e2;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .status {
        padding: 10px 20px;
        background: #e8f4f8;
        border-bottom: 1px solid #d1e7dd;
        font-size: 14px;
      }
      #messageArea {
        height: 400px;
        overflow-y: auto;
        padding: 20px;
        background: #fafbfc;
      }
      .message {
        margin-bottom: 12px;
        padding: 10px 14px;
        background: #ffffff;
        border-radius: 8px;
        border-left: 4px solid #4a90e2;
        font-size: 15px;
      }
      .controls {
        padding: 20px;
        border-top: 1px solid #e1e5e9;
        display: flex;
        gap: 12px;
      }
      #messageInput {
        flex: 1;
        padding: 12px;
        border: 2px solid #d1d5db;
        border-radius: 8px;
        font-size: 16px;
      }
      #sendBtn {
        padding: 12px 24px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
      }
      #sendBtn:hover {
        background: #357abd;
      }
      #sendBtn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
    </style>
  </head>
  <body>
    <div class="demo-container">
      <div class="header">
        <h1>Hapi WebSocket Demo</h1>
      </div>
      <div class="status" id="connectionStatus">Connecting...</div>
      <div id="messageArea"></div>
      <div class="controls">
        <input
          type="text"
          id="messageInput"
          placeholder="Type your message..."
          disabled
        />
        <button id="sendBtn" onclick="sendMessage()" disabled>Send</button>
      </div>
    </div>

    <script>
      let client;
      const messageArea = document.getElementById("messageArea");
      const statusDiv = document.getElementById("connectionStatus");
      const messageInput = document.getElementById("messageInput");
      const sendBtn = document.getElementById("sendBtn");

      // Connect to Hapi WebSocket server
      function connectWebSocket() {
        client = new WebSocket("ws://localhost:3000/websocket");

        client.onopen = function () {
          statusDiv.textContent = "Connected to Hapi server";
          statusDiv.style.background = "#d4edda";
          messageInput.disabled = false;
          sendBtn.disabled = false;
        };

        client.onmessage = function (event) {
          displayMessage(event.data);
        };

        client.onclose = function () {
          statusDiv.textContent = "Disconnected from server";
          statusDiv.style.background = "#f8d7da";
          messageInput.disabled = true;
          sendBtn.disabled = true;
        };

        client.onerror = function () {
          statusDiv.textContent = "Connection error occurred";
          statusDiv.style.background = "#fff3cd";
        };
      }

      function displayMessage(text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
        messageDiv.textContent = text;
        messageArea.appendChild(messageDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
      }

      function sendMessage() {
        if (messageInput.value.trim() && client.readyState === WebSocket.OPEN) {
          client.send(messageInput.value);
          messageInput.value = "";
        }
      }

      messageInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && !sendBtn.disabled) {
          sendMessage();
        }
      });

      connectWebSocket();
    </script>
  </body>
</html>
```

This interface implements a comprehensive WebSocket client with connection state management, visual feedback systems, and responsive user interactions. The implementation includes error handling, automatic scrolling, and keyboard navigation for enhanced usability.

Configure your server to deliver the HTML interface:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';
[highlight]
import Inert from '@hapi/inert';
[/highlight]
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    await server.register(Inert);

    [highlight]
    // Serve static files
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: join(__dirname, 'public'),
                index: ['index.html']
            }
        }
    });
    [/highlight]

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

The highlighted route configuration establishes static file serving for your application. The `/{param*}` path pattern creates a catch-all route that matches any URL path, while the directory handler serves files from the `public` folder. The `index` property automatically serves `index.html` when users navigate to the root URL, creating a seamless entry point for your WebSocket demo interface.

Launch your development server to verify the initial setup:

```command
node --watch server.js
```

Visit `http://localhost:3000` to examine your demo interface:

![Screenshot of the Hapi WebSocket demo interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/62021c9d-d518-4337-5e61-3fdd9b5efc00/md1x =3248x1994)

The connection will fail since WebSocket handling hasn't been implemented yet.

## Configuring WebSocket support with Nes

Let's integrate WebSocket capabilities using the `@hapi/nes` plugin. Nes provides enterprise-grade WebSocket functionality with advanced features including subscription management, automatic reconnection, and built-in authentication support.

Register the Nes plugin and create your first WebSocket handler:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
[highlight]
import Nes from '@hapi/nes';
[/highlight]
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const init = async () => {
    const server = Hapi.server({
        ...
    });
[highlight]
    await server.register([Inert, Nes]);
[/highlight]
    // Serve static files
    server.route({
        ...
    });

    [highlight]
    // WebSocket subscription endpoint
    server.subscription('/websocket');

    // Handle WebSocket connections
    server.route({
        method: 'POST',
        path: '/message',
        handler: (request, h) => {
            const { message } = request.payload;
            console.log('Received message:', message);

            // Echo message back to all subscribers
            server.publish('/websocket', `Echo from Hapi: ${message}`);

            return { success: true };
        }
    });
    [/highlight]

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

The Nes plugin registration enables WebSocket functionality throughout your Hapi application. The `server.subscription()` method establishes WebSocket endpoints, while `server.publish()` handles message broadcasting to connected clients. This approach integrates seamlessly with Hapi's existing routing infrastructure.

Now upgrade the client implementation to utilize the Nes client library. Modify your HTML file to incorporate the Nes client:

```html
[label public/index.html]
<!DOCTYPE html>
<html>
  <head>
    <title>Hapi WebSocket Demo</title>
    <style>
      /* ... existing styles ... */
    </style>
    [highlight]
    <script src="https://cdn.jsdelivr.net/npm/@hapi/nes@14.0.1/lib/client.min.js"></script>
    [/highlight]
  </head>
  <body>
    <!-- ... existing HTML structure ... -->

    <script>
      [highlight]
      let client;
      const messageArea = document.getElementById('messageArea');
      const statusDiv = document.getElementById('connectionStatus');
      const messageInput = document.getElementById('messageInput');
      const sendBtn = document.getElementById('sendBtn');

      // Connect using Nes client
      async function connectWebSocket() {
          client = new nes.Client('http://localhost:3000');

          try {
              await client.connect();
              statusDiv.textContent = 'Connected to Hapi server';
              statusDiv.style.background = '#d4edda';
              messageInput.disabled = false;
              sendBtn.disabled = false;

              // Subscribe to WebSocket messages
              await client.subscribe('/websocket', (message) => {
                  displayMessage(message);
              });

              // Send welcome message
              displayMessage('Connected to Hapi WebSocket server!');

          } catch (err) {
              statusDiv.textContent = 'Failed to connect';
              statusDiv.style.background = '#f8d7da';
              console.error('Connection error:', err);
          }
      }

      function displayMessage(text) {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'message';
          messageDiv.textContent = text;
          messageArea.appendChild(messageDiv);
          messageArea.scrollTop = messageArea.scrollHeight;
      }

      async function sendMessage() {
          if (messageInput.value.trim() && client) {
              try {
                  await client.request({
                      method: 'POST',
                      path: '/message',
                      payload: { message: messageInput.value }
                  });
                  messageInput.value = '';
              } catch (err) {
                  console.error('Send error:', err);
              }
          }
      }

      messageInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter' && !messageInput.disabled) {
              sendMessage();
          }
      });

      connectWebSocket();
      [/highlight]
    </script>
  </body>
</html>
```

The `nes` client provides a sophisticated API layer above raw WebSocket connections, featuring built-in subscription management, request/response patterns, and automatic reconnection logic. The client establishes persistent connections and manages subscription lifecycles transparently.

Restart your server and return to `http://localhost:3000`. Enter a message and press Enter:

![Screenshot of message input in the Hapi demo interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f14f8e81-89c1-4bcc-ed3c-4c567c075200/lg2x =3248x1994)

You should see your message echoed back with an "Echo from Hapi:" prefix in real-time:

![Screenshot of echoed message in the Hapi interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb635a1c-17fe-42ea-6e2c-75cf75878200/lg2x =3248x1994)

Your Hapi WebSocket server is now operational. Next, we'll implement comprehensive connection management and error handling.

## Implementing connection tracking and error handling

Production WebSocket applications require sophisticated connection management to handle client lifecycles, network interruptions, and runtime exceptions gracefully. Let's enhance your Hapi implementation with robust connection tracking and comprehensive error handling mechanisms.

Upgrade your server with comprehensive connection management:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Nes from '@hapi/nes';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

[highlight]
// Connection tracking
const connections = new Map();
let connectionCounter = 0;

function trackConnection(socket) {
    const id = ++connectionCounter;
    const connectionInfo = {
        id,
        connectedAt: new Date(),
        lastActivity: new Date(),
        isActive: true
    };

    connections.set(socket, connectionInfo);
    console.log(`Client ${id} connected. Total connections: ${connections.size}`);
    return connectionInfo;
}

function removeConnection(socket) {
    const info = connections.get(socket);
    if (info) {
        connections.delete(socket);
        console.log(`Client ${info.id} disconnected. Remaining: ${connections.size}`);
    }
}
[/highlight]

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    [highlight]
    await server.register([
        Inert,
        {
            plugin: Nes,
            options: {
                onConnection: (socket) => {
                    trackConnection(socket);

                    // Send personalized welcome
                    const info = connections.get(socket);
                    server.publish('/websocket', `Welcome! You are user #${info.id}. ${connections.size} users online.`);
                },
                onDisconnection: (socket) => {
                    const info = connections.get(socket);
                    removeConnection(socket);
                    if (info) {
                        server.publish('/websocket', `User #${info.id} left. ${connections.size} users remaining.`);
                    }
                },
                onMessage: (socket, message) => {
                    const info = connections.get(socket);
                    if (info) {
                        info.lastActivity = new Date();
                        console.log(`Message from user #${info.id}:`, message);
                    }
                }
            }
        }
    ]);
    [/highlight]

    // Serve static files
    server.route({
        ...
    });

    // WebSocket subscription endpoint
    server.subscription('/websocket');

    // Handle WebSocket messages
    server.route({
        method: 'POST',
        path: '/message',
        handler: (request, h) => {
            [highlight]
            try {
                const { message } = request.payload;

                if (!message || message.trim().length === 0) {
                    return { success: false, error: 'Message cannot be empty' };
                }

                if (message.length > 500) {
                    return { success: false, error: 'Message too long (max 500 characters)' };
                }

                console.log('Broadcasting message:', message);
                server.publish('/websocket', `User message: ${message}`);

                return { success: true };
            } catch (error) {
                console.error('Message handling error:', error);
                return { success: false, error: 'Server error processing message' };
            }
            [/highlight]
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

The Nes plugin configuration now includes lifecycle hooks for thorough connection management. The `onConnection` handler detects new clients, `onDisconnection` handles cleanup tasks, and `onMessage` observes communication flow. Message validation enforces length limits and content filtering to ensure production reliability.

These improvements deliver detailed connection analytics, including unique client identification, activity tracking, and automated resource cleanup. The setup guarantees dependable connection state management and thorough audit logs for debugging and oversight.

Restart your server and test connection handling at `http://localhost:3000`. Opening and closing browser tabs will generate detailed diagnostic output:

```text
[output]
Restarting 'server.js'
Server running on http://localhost:3000
Client 1 connected. Total connections: 1
Client 1 disconnected. Remaining: 0
Client 2 connected. Total connections: 1
Client 2 disconnected. Remaining: 0
Client 3 connected. Total connections: 1
```

This thorough connection management creates a solid base for dependable multi-user applications, ensuring proper resource handling and helpful diagnostic features.

## Building multi-client broadcasting features

Most production WebSocket applications need to distribute messages to multiple connected clients at once. Let's enhance your implementation to enable advanced multi-client interactions, including better broadcasting and user management features.

Enhance your server with advanced message broadcasting and user management:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Nes from '@hapi/nes';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

[highlight]
// Enhanced connection and broadcasting management
class ConnectionManager {
    constructor() {
        this.connections = new Map();
        this.userCounter = 0;
        this.messageHistory = [];
        this.maxHistorySize = 20;
    }

    addConnection(socket) {
        const userData = {
            id: ++this.userCounter,
            nickname: `User${this.userCounter}`,
            connectedAt: new Date(),
            lastSeen: new Date(),
            messagesSent: 0
        };

        this.connections.set(socket, userData);
        console.log(`${userData.nickname} joined. Total users: ${this.connections.size}`);
        return userData;
    }

    removeConnection(socket) {
        const userData = this.connections.get(socket);
        if (userData) {
            this.connections.delete(socket);
            console.log(`${userData.nickname} left. Remaining users: ${this.connections.size}`);
            return userData;
        }
    }

    updateActivity(socket) {
        const userData = this.connections.get(socket);
        if (userData) {
            userData.lastSeen = new Date();
            userData.messagesSent++;
        }
    }

    addToHistory(message) {
        this.messageHistory.push({
            text: message,
            timestamp: new Date().toISOString()
        });

        if (this.messageHistory.length > this.maxHistorySize) {
            this.messageHistory.shift();
        }
    }

    getStats() {
        return {
            totalUsers: this.connections.size,
            totalMessages: this.messageHistory.length
        };
    }
}

const connectionManager = new ConnectionManager();
[/highlight]

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    [highlight]
    await server.register([
        Inert,
        {
            plugin: Nes,
            options: {
                onConnection: (socket) => {
                    const userData = connectionManager.addConnection(socket);
                    const stats = connectionManager.getStats();

                    // Send personalized welcome with stats
                    setTimeout(() => {
                        server.publish('/websocket',
                            `Welcome ${userData.nickname}! ${stats.totalUsers} users online, ${stats.totalMessages} messages today.`
                        );

                        // Notify others about new user
                        server.publish('/websocket',
                            `${userData.nickname} joined the chat! Say hello!`
                        );
                    }, 100);
                },
                onDisconnection: (socket) => {
                    const userData = connectionManager.removeConnection(socket);
                    if (userData) {
                        server.publish('/websocket',
                            `${userData.nickname} left the chat. ${connectionManager.getStats().totalUsers} users remain.`
                        );
                    }
                },
                onMessage: (socket, message) => {
                    connectionManager.updateActivity(socket);
                }
            }
        }
    ]);
    [/highlight]

    // Serve static files
    server.route({
        ...
    });

    // WebSocket subscription endpoint
    server.subscription('/websocket');

    // Enhanced message handling
    server.route({
        method: 'POST',
        path: '/message',
        handler: (request, h) => {
            try {
                ...
                if (message.length > 500) {
                    return { success: false, error: 'Message too long (max 500 characters)' };
                }

                [highlight]
                // Add to message history
                connectionManager.addToHistory(message);

                // Broadcast with timestamp and formatting
                const timestamp = new Date().toLocaleTimeString();
                const formattedMessage = `[${timestamp}] ${message}`;

                console.log('Broadcasting:', formattedMessage);
                server.publish('/websocket', formattedMessage);
                [/highlight]

                return { success: true };
            } catch (error) {
                console.error('Message handling error:', error);
                return { success: false, error: 'Server error processing message' };
            }
        }
    });

    [highlight]
    // Add stats endpoint
    server.route({
        method: 'GET',
        path: '/stats',
        handler: (request, h) => {
            return connectionManager.getStats();
        }
    });
    [/highlight]

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

The `ConnectionManager` class provides enterprise-level user tracking with automatic nickname assignment, activity monitoring, and persistent message history. The system broadcasts formatted messages with timestamps and manages comprehensive user lifecycle notifications for enhanced user experience.

The enhanced implementation includes message persistence, user analytics, and a REST API endpoint for retrieving real-time statistics. This architecture supports scalable communication patterns while maintaining comprehensive audit trails and user engagement metrics.

Restart your server and open multiple browser tabs to `http://localhost:3000`. Observe the comprehensive user join and leave notifications:

![Screenshot showing multiple user welcome messages and join notifications](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/021fd5b0-8398-4214-38d3-1ce6ded72000/lg1x =3248x1994)

Send messages from different tabs to verify real-time broadcasting with timestamps across all connected clients:

![Screenshot of timestamped message broadcasting across multiple clients](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f758e0d1-bb26-4f1c-58b2-12f2267c3000/md2x =3248x1994)

You've successfully implemented a comprehensive real-time multi-user communication system using Hapi's plugin architecture and the Nes WebSocket library.

## Final thoughts

This guide has taken you through building a full-featured real-time WebSocket application using Hapi's plugin architecture and the Nes library. You've started with simple message echoing and moved up to creating a sophisticated multi-user platform that includes connection management, message history, and thorough error handling.

For advanced WebSocket patterns and scaling strategies, take a look at the [@hapi/nes documentation](https://github.com/hapijs/nes) and [Hapi's plugin guides](https://hapi.dev/plugins/). It might also be helpful to think about adding authentication, message persistence, and horizontal scaling for your next real-time project.
