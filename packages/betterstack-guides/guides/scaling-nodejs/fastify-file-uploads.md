#  File Uploads with Fastify

[Fastify](https://fastify.dev/) has changed how developers build Node.js web applications. It's fast, easy to use, and handles file uploads well without the usual complexity.

File uploads can be challenging to get right. You can often create security holes or build systems that frustrate users. Fastify provides the tools to build file upload systems that function effectively and remain secure.

This guide demonstrates how to implement file upload functionality that is reliable in production.

[ad-logs]

## Prerequisites

You need [Node.js 18](https://nodejs.org/en/download/) or later installed on your computer. This tutorial assumes you are familiar with JavaScript basics, understand async/await, and have experience building web applications.


## Creating your Fastify file upload foundation

Building a good file upload system starts with proper planning. You need a structure that can grow with your app and handle edge cases properly.

Create a new project directory and set up a clean workspace:

```command
mkdir fastify-file-uploads && cd fastify-file-uploads
```

```command
npm init -y
```

Configure your project for ESM modules:

```command
npm pkg set type="module"
```

Install the packages you need for file handling:

```command
npm install fastify @fastify/multipart @fastify/static sharp file-type
```

Here's what each package does:

* `fastify`: The main framework that handles requests and file uploads with great performance.
* `@fastify/multipart`: Parses multipart form data, which is how file uploads work on the web.
* `@fastify/static`: Serves uploaded files from your server with proper caching.
* `sharp`: Processes and optimizes images with professional quality.
* `file-type`: Checks file types by looking at the actual file content, not just the extension.

Start with a basic Fastify server to make sure everything works. Create your main application file:

```javascript
[label server.js]
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
  return { message: 'Fastify File Upload Service is ready' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Fastify file upload server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

Test your setup before adding more features. Start the server:

```command
node server.js
```

```text
{"level":30,"time":1752570010045,"pid":63742,"hostname":"MacBookPro","msg":"Server listening at http://[::1]:3000"}
{"level":30,"time":1752570010046,"pid":63742,"hostname":"MacBookPro","msg":"Server listening at http://127.0.0.1:3000"}
Fastify file upload server running on http://localhost:3000
```

Go to `http://localhost:3000` in your browser. You should see:

```json
{"message": "Fastify File Upload Service is ready"}
```

![Screenshot showing the basic Fastify response in a browser with the JSON message confirming the service is ready](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1f8d68ae-91f8-4c5f-f381-59a5a2c73000/lg1x =3248x1996)

Your Fastify server is working and ready for file upload features.

## Implementing basic file upload functionality

Now let's add file upload capabilities to your server. Fastify's plugin system makes this easy while keeping performance high.

First, create a helper module for file operations:

```javascript
[label utils.js]
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadsDir = path.join(__dirname, 'uploads');

export const ensureUploadDir = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
};
```

Update your main server file to handle file uploads:

```javascript
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
```

This code uses Node.js streams to handle files efficiently. The `request.file()` method gives you a stream that you can pipe directly to the file system using `pipeline()`. This handles errors properly and uses memory efficiently.

Restart your server:

```command
node server.js
```

Test your file upload with curl:

```command
echo "This is a test file for Fastify upload" > test-file.txt
```

```command
curl -X POST -F "file=@test-file.txt" http://localhost:3000/upload/single
```

You should see a successful response:

```json
{
  "success": true,
  "filename": "test-file.txt",
  "mimetype": "text/plain",
  "encoding": "7bit",
  "path": "/Users/your_username/fastify-file-uploads/uploads/test-file.txt"
}
```


Verify the file was actually saved:

```command
ls -la uploads/
```

```command
cat uploads/test-file.txt
```

```text
[output]
This is a test file for Fastify upload
```
You should see your test file listed and its contents displayed. This confirms your basic file upload system works.


Create a second test file for Postman testing:

```command
echo "This is a Postman test file" > postman-test.txt
```

You can also test your upload using Postman by creating a new POST request to `http://localhost:3000/upload/single`, going to the `Body` tab, selecting "form-data", adding a key called "file" with type "File", selecting your test file, and clicking **Send**.

You should see the same JSON response in Postman's response panel. This visual method makes it easier to test different files and see the responses formatted nicely.

![Screenshot of Postman interface showing the file upload configuration with form-data body type and file selection](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1164c241-c094-470c-3512-3ba03ef90800/lg2x =3248x1500)

Check your project directory. You should see a new `uploads` folder with your test file inside. This confirms your basic file upload system works with both command-line tools and GUI applications.


## Building file validation systems

Your current upload system accepts any file type and size. This can create security problems and potentially crash your system. Production apps need good validation before accepting uploads.

Let's add basic file extension validation to show how this works:

```javascript
[label validators.js]
export class FileValidator {
  constructor() {
    this.allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.txt'];
  }

  validateFile(filename) {
    const result = { valid: true, errors: [] };
    
    // Check filename exists
    if (!filename || filename.trim() === '') {
      result.valid = false;
      result.errors.push('No filename provided');
      return result;
    }
    
    // Check file extension
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    if (!this.allowedExtensions.includes(ext)) {
      result.valid = false;
      result.errors.push(`File extension '${ext}' not allowed. Allowed: ${this.allowedExtensions.join(', ')}`);
    }
    
    return result;
  }
}
```

This validator class checks if uploaded files have acceptable extensions. It creates a list of allowed file types and compares the file extension against this list. If the file doesn't match an allowed extension, it returns validation errors with helpful messages.

Update your main server file to use validation:

```javascript
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
```
First, you imported the `randomUUID` function from Node's crypto module and your new `FileValidator` class. 

Then you created a validator instance that will check file extensions. In your upload endpoint, you now validate each file before saving it - if validation fails, you return an error message with details about what went wrong. 

You also generate unique filenames using `randomUUID()` to prevent files from overwriting each other, and you return both the original filename and the stored filename in your response.

Restart your server and test with different file types:

```command
node server.js
```

Test with a valid file:

```command
curl -X POST -F "file=@test-file.txt" http://localhost:3000/upload/single
```

Try uploading a file type that's not allowed:

```command
echo "fake content" > test.exe
```

```command
curl -X POST -F "file=@test.exe" http://localhost:3000/upload/single
```

You should get a validation error:

```json
[output]
{
  "error": "File validation failed",
  "details": [
    "File extension '.exe' not allowed. Allowed: .jpg, .jpeg, .png, .pdf, .txt"
  ]
}
```

![Screenshot showing Postman displaying the validation error response when uploading an invalid file type](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0e9174f9-877a-45f8-2dd5-431bba2ea900/lg1x =3248x2000)

Your validation system now protects against unwanted file types and gives users clear feedback about what went wrong.

## Managing multiple file uploads efficiently

Many apps need users to upload multiple files at once. Photo galleries, document collections, and batch processing all benefit from multi-file uploads.

Fastify handles multiple files through the same multipart interface, but you need to process each file separately while keeping the same validation standards.

Add a multiple file upload endpoint to your server:

```javascript
[label server.js]
fastify.post("/upload/single", async (request, reply) => {
 ...
});
// Add this endpoint after your existing single upload endpoint

[highlight]
fastify.post('/upload/multiple', async (request, reply) => {
  const parts = request.parts();
  const results = [];
  const maxFiles = 10;
  let fileCount = 0;
  
  for await (const part of parts) {
    if (part.file) {
      fileCount++;
      
      // Check file limit
      if (fileCount > maxFiles) {
        return reply.code(400).send({
          error: `Too many files. Maximum ${maxFiles} files allowed.`
        });
      }
      
      // Validate each file
      const validation = validator.validateFile(part.filename);
      
      if (!validation.valid) {
        results.push({
          filename: part.filename,
          success: false,
          errors: validation.errors
        });
        continue;
      }
      
      // Save valid files
      const ext = part.filename.substring(part.filename.lastIndexOf('.'));
      const uniqueFilename = `${randomUUID()}${ext}`;
      const filepath = path.join(uploadsDir, uniqueFilename);
      
      try {
        await pipeline(part.file, createWriteStream(filepath));
        
        results.push({
          originalFilename: part.filename,
          storedFilename: uniqueFilename,
          success: true,
          path: filepath
        });
      } catch (error) {
        fastify.log.error(error);
        results.push({
          filename: part.filename,
          success: false,
          errors: ['Failed to save file']
        });
      }
    }
  }
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  return {
    totalFiles: results.length,
    successful: successful.length,
    failed: failed.length,
    uploadTime: new Date().toISOString(),
    results: results
  };
});
[/highlight]
const start = async () => {
  ...
};
```

This endpoint uses `request.parts()` to process multiple files as they arrive. It validates each file individually, saves the valid ones, and tracks both successful uploads and failures. The system processes files one at a time to use memory efficiently and enforces a maximum file limit to prevent abuse.

Restart your server and test multiple file uploads:

```command
node server.js
```

Create several test files:

```command
echo "First test file" > test1.txt
```

```command
echo "Second test file" > test2.txt
```

```command
echo "Invalid file content" > test3.exe
```

Test multiple file upload with curl:

```command
curl -X POST \
  -F "file1=@test1.txt" \
  -F "file2=@test2.txt" \
  -F "file3=@test3.exe" \
  http://localhost:3000/upload/multiple
```

You should get a detailed response showing successful uploads and validation failures:

```json
{
  "totalFiles": 3,
  "successful": 2,
  "failed": 1,
  "uploadTime": "2024-07-15T10:30:45.123Z",
  "results": [
    {
      "originalFilename": "test1.txt",
      "storedFilename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.txt",
      "success": true,
      "path": "/path/to/uploads/a1b2c3d4-e5f6-7890-abcd-ef1234567890.txt"
    },
    {
      "originalFilename": "test2.txt",
      "storedFilename": "b2c3d4e5-f6g7-8901-bcde-f23456789012.txt",
      "success": true,
      "path": "/path/to/uploads/b2c3d4e5-f6g7-8901-bcde-f23456789012.txt"
    },
    {
      "filename": "test3.exe",
      "success": false,
      "errors": [
        "File extension '.exe' not allowed. Allowed: .jpg, .jpeg, .png, .pdf, .txt"
      ]
    }
  ]
}
```

Your multi-file upload system processes each file separately and gives you clear feedback for both successful uploads and validation failures.

## Final thoughts

You've built a complete file upload system using Fastify that handles single files, multiple files, and includes validation. Your system validates file extensions, generates unique filenames, and provides clear feedback for uploads and failures.

This foundation is production-ready and can be extended with features like cloud storage or image processing. For more capabilities, check out the [Fastify documentation](https://fastify.dev/).