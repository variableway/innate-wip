# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-file-uploads/
# Original language: javascript
# Normalized: js
# Block index: 6

[label utils.js]
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadsDir = path.join(__dirname, 'uploads');

export const ensureUploadDir = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
};