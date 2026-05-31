# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 11

[label file-upload-server.js]
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
 if (req.method === 'POST' && req.url === '/upload') {
   // Create a unique filename
   const filename = path.join(__dirname, 'uploads', `upload-${Date.now()}.file`);

   // Create a writable stream
   const fileStream = fs.createWriteStream(filename);

   // Handle file stream errors
   fileStream.on('error', (err) => {
     console.error('File write error:', err);
     res.statusCode = 500;
     res.end('Error saving file');
   });

   // Track upload progress
   let uploadedBytes = 0;
   req.on('data', (chunk) => {
     uploadedBytes += chunk.length;
     console.log(`Received ${uploadedBytes} bytes`);
   });

   // Pipe the request body to the file
   req.pipe(fileStream);

   // When the upload is finished
   fileStream.on('finish', () => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify({
       success: true,
       filename: path.basename(filename),
       size: uploadedBytes
     }));
   });

   // Handle request errors
   req.on('error', (err) => {
     console.error('Request error:', err);
     fileStream.destroy(err);
   });

   // If the client aborts the request
   req.on('aborted', () => {
     fileStream.destroy();
     fs.unlink(filename, () => {});
   });
 } else {
   res.statusCode = 404;
   res.end('Not found');
 }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
 fs.mkdirSync(uploadsDir);
}

server.listen(3000, () => {
 console.log('Upload server listening on port 3000');
});