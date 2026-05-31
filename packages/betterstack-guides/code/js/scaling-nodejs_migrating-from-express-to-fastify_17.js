# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 17

// Hybrid approach during migration
import express from 'express';
import Fastify from 'fastify';
import { createProxyMiddleware } from 'http-proxy-middleware';

const expressApp = express();
const fastify = Fastify({ logger: true });

// Proxy specific routes to Fastify during migration
expressApp.use('/api/v2', createProxyMiddleware({
  target: 'http://localhost:3001'
}));

// Keep existing Express routes during transition
expressApp.use('/api/v1', existingExpressRoutes);