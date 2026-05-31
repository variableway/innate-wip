# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 13

[label streaming-api.js]
const http = require('http');
const { Readable } = require('stream');

class DataSource extends Readable {
 constructor(options = {}) {
   super(options);
   this.counter = 0;
   this.max = options.max || 1000000;
   this.interval = options.interval || 100;
   this.timer = null;
 }

 _read() {
   this.timer = setInterval(() => {
     this.counter++;

     if (this.counter <= this.max) {
       // Create a data point
       const data = {
         id: this.counter,
         timestamp: new Date().toISOString(),
         value: Math.random() * 100
       };

       // Push as JSON with newline for streaming
       this.push(JSON.stringify(data) + '\n');
     } else {
       // End of stream
       clearInterval(this.timer);
       this.push(null);
     }
   }, this.interval);

   // Handle premature stream destruction
   this.on('close', () => {
     clearInterval(this.timer);
   });
 }
}

const server = http.createServer((req, res) => {
 if (req.url === '/api/data') {
   // Parse query parameters
   const url = new URL(req.url, `http://${req.headers.host}`);
   const max = parseInt(url.searchParams.get('max') || '100');
   const interval = parseInt(url.searchParams.get('interval') || '500');

   // Set appropriate headers for streaming
   res.setHeader('Content-Type', 'application/json');
   res.setHeader('Transfer-Encoding', 'chunked');

   // Create the data source
   const dataSource = new DataSource({ max, interval });

   // Stream data to client
   dataSource.pipe(res);

   // Handle client disconnect
   req.on('close', () => {
     dataSource.destroy();
   });
 } else {
   res.statusCode = 404;
   res.end('Not found');
 }
});

server.listen(3000, () => {
 console.log('Streaming API server listening on port 3000');
});