# Source: https://betterstack.com/community/guides/scaling-nodejs/node-clustering/
# Original language: javascript
# Normalized: js
# Block index: 8

[label cluster.js]
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cpuCount = availableParallelism();

console.log(`Primary pid=${process.pid}`);
cluster.setupPrimary({
  exec: __dirname + '/index.js',
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} has terminated.`);
  console.log('Initiating replacement worker.');
  cluster.fork();
});