# Source: https://betterstack.com/community/guides/scaling-nodejs/node-clustering/
# Original language: javascript
# Normalized: js
# Block index: 14

[label message.js]
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running.`);
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    // Receive messages from workers and handle them in the Primary process.
    worker.on('message', msg => {
      console.log(
        `Primary ${process.pid} received a message from worker ${worker.process.pid}:`,
        msg
      );
    });
  }
} else if (cluster.isWorker) {
  console.log(`Worker ${process.pid} is active.`);
  // Send a message to the Primary process.
  process.send({
    msgFromWorker: `Message sent from worker ${process.pid}.`,
  });
}