# Source: https://betterstack.com/community/guides/scaling-nodejs/hono-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 11

import { Hono } from 'hono';

const app = new Hono();

// Edge deployment (Cloudflare Workers)
export default app;

// Serverless deployment (AWS Lambda)
import { handle } from 'hono/aws-lambda';
export const handler = handle(app);

// Traditional server
import { serve } from '@hono/node-server';
serve({ fetch: app.fetch, port: 3000 });