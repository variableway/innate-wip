# Source: https://betterstack.com/community/guides/scaling-nodejs/file-uploads-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 11

[label server.js]
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
[highlight]
import Boom from '@hapi/boom';
[/highlight]
import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
[highlight]
import { v4 as uuidv4 } from 'uuid';
import { FileValidator } from './validators.js';
[/highlight]

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory
const UPLOAD_DIR = path.join(__dirname, 'uploads');
try {
    await fs.access(UPLOAD_DIR);
} catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Register the inert plugin
await server.register(Inert);

[highlight]
// Create validator instance
const fileValidator = new FileValidator(20 * 1024 * 1024);  // 20MB limit
[/highlight]

server.route({
    method: 'POST',
    path: '/upload/single',
    options: {
        payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            maxBytes: 25 * 1024 * 1024  // 25MB limit
        }
    },
    handler: async (request, h) => {
        const { file } = request.payload;
        
        if (!file || !file.hapi || !file.hapi.filename) {
[highlight]
            throw Boom.badRequest('No file provided');
[/highlight]
        }
        
[highlight]
        // Validate the file
        const validation = fileValidator.validateFile(file, file.hapi.filename);
        
        if (!validation.valid) {
            throw Boom.badRequest('File validation failed', {
                errors: validation.errors
            });
        }
        
        // Generate unique filename to prevent conflicts
        const fileExt = path.extname(file.hapi.filename);
        const uniqueFilename = `${uuidv4()}${fileExt}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFilename);
[/highlight]
        
        // Save file to disk with proper promise handling
        return new Promise((resolve, reject) => {
[highlight]
            const fileStream = fsSync.createWriteStream(filePath);
[/highlight]
            
            file.on('error', (err) => reject(err));
            fileStream.on('error', (err) => reject(err));
            
            fileStream.on('finish', () => {
                resolve({
[highlight]
                    success: true,
                    originalFilename: file.hapi.filename,
                    storedFilename: uniqueFilename,
[/highlight]
                    size: file.hapi.headers['content-length'],
                    contentType: file.hapi.headers['content-type'],
[highlight]
                    uploadTime: new Date().toISOString(),
[/highlight]
                    location: filePath
                });
            });
            
            file.pipe(fileStream);
        });
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: () => {
        return { message: 'Hapi.js File Upload Server is running' };
    }
});

const start = async () => {
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();