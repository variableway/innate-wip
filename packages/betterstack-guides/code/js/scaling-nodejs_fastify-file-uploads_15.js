# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-file-uploads/
# Original language: javascript
# Normalized: js
# Block index: 15

[label server.js]
import Fastify from 'fastify';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import path from 'path';
[highlight]
import { randomUUID } from 'crypto';
[/highlight]
import { uploadsDir, ensureUploadDir } from './utils.js';
[highlight]
import { FileValidator } from './validators.js';
[/highlight]

const fastify = Fastify({ logger: true });

// Register multipart plugin for file uploads
await fastify.register(import('@fastify/multipart'));

// Create uploads directory
await ensureUploadDir();

[highlight]
// Set up validator
const validator = new FileValidator();
[/highlight]

fastify.post('/upload/single', async (request, reply) => {
  const data = await request.file();
  
  if (!data) {
    return reply.code(400).send({ error: 'No file uploaded' });
  }
  
  [highlight]
  // Validate the file
  const validation = validator.validateFile(data.filename);
  
  if (!validation.valid) {
    return reply.code(400).send({
      error: 'File validation failed',
      details: validation.errors
    });
  }
  
  // Create unique filename to prevent conflicts
  const ext = data.filename.substring(data.filename.lastIndexOf('.'));
  const uniqueFilename = `${randomUUID()}${ext}`;
  const filepath = path.join(uploadsDir, uniqueFilename);
  [/highlight]
  
  try {
    await pipeline(data.file, createWriteStream(filepath));
    
    return {
      success: true,
      [highlight]
      originalFilename: data.filename,
      storedFilename: uniqueFilename,
      [/highlight]
      mimetype: data.mimetype,
      encoding: data.encoding,
      path: filepath
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to save file' });
  }
});

...