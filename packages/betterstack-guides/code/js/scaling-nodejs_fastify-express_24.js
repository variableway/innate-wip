# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 24

import fs from 'fs';
import path from 'path';
import fastify from 'fastify';

const server = fastify({
  http2: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.crt')),
    allowHTTP1: true, // Enables fallback to HTTP/1
  },
});

server.get('/', (request, reply) => {
  reply.code(200).send({ message: 'Hello, HTTP/2!' });
});

server.listen(3000, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
...