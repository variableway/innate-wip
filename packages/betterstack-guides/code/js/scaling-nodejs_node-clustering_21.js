# Source: https://betterstack.com/community/guides/scaling-nodejs/node-clustering/
# Original language: javascript
# Normalized: js
# Block index: 21

cluster.on("exit", (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} has terminated.`);
  console.log("Initiating replacement worker.");
  cluster.fork();
})