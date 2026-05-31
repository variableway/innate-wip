# File Uploads with Hapi.js


[Hapi.js](https://hapi.dev/) offers server-side development with its configuration-focused approach and a powerful plugin system. When it comes to file uploads, many developers face challenges with security vulnerabilities and poor user experiences. Hapi.js provides reliable tools to manage file uploads safely and efficiently.

File upload functionality is crucial for modern web applications; however, many developers implement it poorly. They risk security issues or create frustrating user experiences. Hapi.js gives you the framework to build it correctly from the beginning.

This detailed guide walks you through creating production-ready file upload systems with Hapi.js. You will learn everything from simple single-file uploads to advanced features like progress tracking and batch processing.

## Prerequisites

You'll need [Node.js 18](https://nodejs.org/en/download) or later installed on your system. This tutorial expects familiarity with JavaScript ES modules, async/await patterns, and basic web server concepts.

Understanding HTTP multipart encoding is also helpful since file uploads rely on this protocol to transmit binary data alongside form information.

## Setting up your Hapi.js file upload server

Building a reliable file upload system demands careful planning and solid project organization. You need a foundation that scales as your application expands.

Start by creating a new project directory and establishing a clean development workspace:

```command
mkdir hapi-file-uploads && cd hapi-file-uploads
```

```command
npm init -y
```

Configure your project to use ES modules by updating your `package.json`:

```command
npm pkg set type="module"
```

Install the essential packages for handling file operations:

```command
npm install @hapi/hapi @hapi/inert @hapi/boom uuid
```

Each package serves a specific purpose in your file upload system:

* `@hapi/hapi`: The core framework that manages requests and file handling.
* `@hapi/inert`: Official plugin for serving static files and handling file uploads.
* `@hapi/boom`: Error handling utilities for consistent API responses.
* `uuid`: Generates unique filenames to prevent naming conflicts.

Begin with a minimal Hapi.js server to ensure your environment is properly configured. Create your `server.js` file:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
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
```

Test this basic setup to verify your environment works correctly. Launch the server:

```command
node server.js
```

```text
[output]
Server running at: http://localhost:3000
```

Navigate to `http://localhost:3000` in your browser. You should see:

```json
{"message": "Hapi.js File Upload Server is running"}
```

![Screenshot showing the basic Hapi.js response in a browser with the JSON message confirming the server is running](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7c1a84ab-673f-4220-7110-93b72a337100/md2x =3248x1994)

Your Hapi.js server is operational and ready for file upload functionality.

## Getting started and testing your setup

Now you'll add file upload capabilities to your server. Hapi.js requires the `@hapi/inert` plugin to handle multipart form data and file uploads effectively.

Update your `server.js` with file upload functionality:

```javascript
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
```

This code adds file upload functionality to your basic server. The `@hapi/inert` plugin enables multipart form handling. The `payload` configuration sets streaming mode with `multipart: true` for efficient file processing. The Promise wrapper handles the async file streaming properly.

Start your enhanced server:

```command
node server.js
```

Test your file upload endpoint using curl. Create a simple test file first:

```command
echo "This is a test file for Hapi.js upload" > test-file.txt
```

Upload the file:

```command
curl -X POST -F "file=@test-file.txt" http://localhost:3000/upload/single
```

You should receive a successful response:

```json
{
  "filename": "test-file.txt",
  "contentType": "text/plain",
  "location": "/path/to/your/project/uploads/test-file.txt"
}
```

Check your project directory — you'll find an `uploads` folder containing your test file. This confirms your basic file upload system functions correctly.


## Building comprehensive file validation systems

Your current upload endpoint works but lacks security measures for production use. Users can upload any file type or size, which could crash your system or lead to security issues.

You need validation that checks file types and sizes before accepting uploads. Let's add this to your existing upload endpoint.

Create a simple `validators.js` file:

```javascript
[label validators.js]
import path from 'path';

export class FileValidator {
    constructor(maxSize = 15 * 1024 * 1024) {  // 15MB default
        this.maxSize = maxSize;
        this.allowedExtensions = ['.pdf', '.txt', '.json'];
    }
    
    validateFile(file, filename) {
        const errors = [];
        
        // Check if file exists
        if (!filename || filename.trim() === '') {
            errors.push('No file selected');
            return { valid: false, errors };
        }
        
        // Check file extension
        const fileExt = path.extname(filename).toLowerCase();
        if (!this.allowedExtensions.includes(fileExt)) {
            errors.push(
                `File extension '${fileExt}' not allowed. Use: .pdf, .txt, or .json`
            );
        }
        
        // Check file size
        const fileSize = parseInt(file.hapi.headers['content-length']) || 0;
        if (fileSize > this.maxSize) {
            errors.push(
                `File too large (${fileSize} bytes). Maximum: ${this.maxSize} bytes`
            );
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
```
This validator class creates a reusable system for checking files. The constructor sets maximum file size and allowed extensions. The `validateFile` method runs three checks: filename existence, extension validation using `path.extname()`, and size limits from the HTTP headers. It returns an object with validation results and any error messages.


Now update your `server.js` file to add validation:

```javascript
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
```

The new imports add essential functionality: `@hapi/boom` provides standardized HTTP error responses, `uuid` generates unique identifiers, and your custom validator handles file checking. 

The validator instance gets created with a 20MB size limit. Inside the handler, we first run validation using `fileValidator.validateFile()`, which returns success status and any errors. If validation fails, `Boom.badRequest()` sends a proper HTTP 400 response with error details.

For successful uploads, `uuid.v4()` creates a unique filename by combining a UUID with the original file extension. This prevents filename conflicts when multiple users upload files with the same name. The response now includes both original and stored filenames, plus a timestamp for tracking.

Your upload endpoint now validates files before saving them and uses unique filenames to prevent conflicts.

Restart your server:

```command
node server.js
```

Test with a valid file:

```command
curl -X POST -F "file=@test-file.txt" http://localhost:3000/upload/single
```

You should see a successful response.

Now test with an invalid file type. Create a fake image file:

```command
echo "fake image content" > test.jpg
curl -X POST -F "file=@test.jpg" http://localhost:3000/upload/single
```

You should get an error response:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "File validation failed"
}
```

Your validation system protects your server while providing clear feedback when uploads fail.


## Handling multiple file uploads

Single-file uploads work great, but users often need to upload multiple files simultaneously. Think document batches, photo collections, or backup files. Hapi.js handles this with a small change to your endpoint configuration.

You need to process multiple files while keeping the same validation and error handling. Let's add a new endpoint for batch uploads.

Add this new route to your `server.js` file:

```javascript
[label server.js]
// ... existing imports and setup

[highlight]
server.route({
    method: 'POST',
    path: '/upload/multiple',
    options: {
        payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            maxBytes: 100 * 1024 * 1024  // 100MB for multiple files
        }
    },
    handler: async (request, h) => {
        const { files } = request.payload;
        
        if (!files) {
            throw Boom.badRequest('No files provided');
        }
        
        // Handle both single file and array
        const fileArray = Array.isArray(files) ? files : [files];
        
        if (fileArray.length > 10) {
            throw Boom.badRequest('Too many files. Maximum 10 files allowed');
        }
        
        const results = [];
        
        for (const file of fileArray) {
            // Validate each file
            const validation = fileValidator.validateFile(file, file.hapi.filename);
            
            if (!validation.valid) {
                results.push({
                    filename: file.hapi.filename,
                    success: false,
                    errors: validation.errors
                });
                continue;
            }
            
            // Save valid files
            const fileExt = path.extname(file.hapi.filename);
            const uniqueFilename = `${uuidv4()}${fileExt}`;
            const filePath = path.join(UPLOAD_DIR, uniqueFilename);
            
            try {
                await new Promise((resolve, reject) => {
                    const fileStream = fsSync.createWriteStream(filePath);
                    
                    file.on('error', (err) => reject(err));
                    fileStream.on('error', (err) => reject(err));
                    fileStream.on('finish', () => resolve());
                    
                    file.pipe(fileStream);
                });
                
                results.push({
                    filename: file.hapi.filename,
                    storedFilename: uniqueFilename,
                    success: true,
                    location: filePath
                });
            } catch (error) {
                results.push({
                    filename: file.hapi.filename,
                    success: false,
                    errors: [`Failed to save: ${error.message}`]
                });
            }
        }
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        return {
            totalFiles: fileArray.length,
            successful: successful.length,
            failed: failed.length,
            uploadTime: new Date().toISOString(),
            results: results
        };
    }
});
[/highlight]

// ... rest of existing routes
server.route({
  method: "GET",
  path: "/",
...
})
...
```

The new endpoint changes the payload field from `file` to `files` and handles both single files and arrays. The `Array.isArray()` check ensures compatibility with different client implementations. Each file gets validated individually using your existing validator, and the system continues processing even if some files fail.

The `for...of` loop processes files sequentially to avoid overwhelming the server. Each file operation is wrapped in a try-catch block to handle individual file errors without stopping the entire batch. The response provides detailed feedback showing which files succeeded and which failed.

Restart your server:

```command
node server.js
```

Create multiple test files:

```command
echo "First test file" > test1.txt
```
```command
echo '{"data": "test"}' > test2.json  
```
```command
echo "fake image" > test3.jpg
```

Upload multiple files using curl:

```command
curl -X POST \
  -F "files=@test1.txt" \
  -F "files=@test2.json" \
  -F "files=@test3.jpg" \
  http://localhost:3000/upload/multiple
```

You should see a response showing results for each file:

```json
[output]
{
  "totalFiles": 3,
  "successful": 2,
  "failed": 1,
  "uploadTime": "2025-07-23T11:23:45.050Z",
  "results": [
    {
      "filename": "test1.txt",
      "storedFilename": "2c8e7c31-e50d-4483-a74d-e3aadf40526f.txt",
      "success": true,
      "location": "harpi-file-uploads/hapi-file-uploads/uploads/2c8e7c31-e50d-4483-a74d-e3aadf40526f.txt"
    },
    {
      "filename": "test2.json",
      "storedFilename": "d6e64d7d-55b1-4534-a6b6-7f9d63da4b48.json",
      "success": true,
      "location": "hapi-file-uploads/uploads/d6e64d7d-55b1-4534-a6b6-7f9d63da4b48.json"
    },
    {
      "filename": "test3.jpg",
      "success": false,
      "errors": [
        "File extension '.jpg' not allowed. Use: .pdf, .txt, or .json"
      ]
    }
  ]
}
```


Your multiple file upload system processes each file individually and gives you clear feedback about the entire batch operation. 

The system gracefully handles mixed results, allowing valid files to be saved while rejecting invalid ones with helpful error messages.

## Final thoughts

You've built a complete file upload system with Hapi.js that manages single and multiple file uploads while validating everything before saving. Your system now guards against unsafe uploads and provides users with clear feedback when issues occur.

Next, you could add features like file deletion endpoints, image processing, or cloud storage integration. The foundation you've created makes these enhancements easy to implement.

For more advanced features and deployment tips, check out the [Hapi.js documentation](https://hapi.dev/) and consider adding a database to track file metadata.