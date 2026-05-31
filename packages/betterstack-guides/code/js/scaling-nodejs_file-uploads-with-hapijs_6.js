# Source: https://betterstack.com/community/guides/scaling-nodejs/file-uploads-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 6

[label server.js]
import Hapi from '@hapi/hapi';
[highlight]
import Inert from '@hapi/inert';
import { promises as fs } from 'fs';
import fsSync from 'fs';  // For createWriteStream
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory
const UPLOAD_DIR = path.join(__dirname, 'uploads');
try {
    await fs.access(UPLOAD_DIR);
} catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
}
[/highlight]

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

[highlight]
// Register the inert plugin for file handling
await server.register(Inert);

server.route({
    method: 'POST',
    path: '/upload/single',
    options: {
        payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            maxBytes: 10 * 1024 * 1024  // 10MB limit
        }
    },
    handler: async (request, h) => {
        const { file } = request.payload;
        
        if (!file || !file.hapi || !file.hapi.filename) {
            return h.response({ error: 'No file provided' }).code(400);
        }
        
        const filename = file.hapi.filename;
        const filePath = path.join(UPLOAD_DIR, filename);
        
        // Save file to disk with proper promise handling
        return new Promise((resolve, reject) => {
            const fileStream = fsSync.createWriteStream(filePath);
            
            file.on('error', (err) => reject(err));
            fileStream.on('error', (err) => reject(err));
            
            fileStream.on('finish', () => {
                resolve({
                    filename: filename,
                    size: file.hapi.headers['content-length'],
                    contentType: file.hapi.headers['content-type'],
                    location: filePath
                });
            });
            
            file.pipe(fileStream);
        });
    }
});
[/highlight]

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