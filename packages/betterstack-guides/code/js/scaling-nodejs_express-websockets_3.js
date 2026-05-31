# Source: https://betterstack.com/community/guides/scaling-nodejs/express-websockets/
# Original language: javascript
# Normalized: js
# Block index: 3

[label server.js]
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;