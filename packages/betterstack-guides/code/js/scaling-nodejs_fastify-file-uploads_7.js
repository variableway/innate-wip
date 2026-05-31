# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-file-uploads/
# Original language: javascript
# Normalized: js
# Block index: 7

[label server.js]
import Fastify from 'fastify';
[highlight]
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { uploadsDir, ensureUploadDir } from './utils.js';
[/highlight]

const fastify = Fastify({ logger: true });

[highlight]
// Register multipart plugin for file uploads
await fastify.register(import('@fastify/multipart'));

// Create uploads directory
await ensureUploadDir();

fastify.post('/upload/single', async (request, reply) => {
  const data = await request.file();
  
  if (!data) {
    return reply.code(400).send({ error: 'No file uploaded' });
  }
  
  const filename = data.filename;
  const filepath = path.join(uploadsDir, filename);
  
  try {
    await pipeline(data.file, createWriteStream(filepath));
    
    return {
      success: true,
      filename: filename,
      mimetype: data.mimetype,
      encoding: data.encoding,
      path: filepath
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to save file' });
  }
});
[/highlight]

fastify.get('/', async (request, reply) => {
  return { message: 'Fastify File Upload Service is ready' };
});

...