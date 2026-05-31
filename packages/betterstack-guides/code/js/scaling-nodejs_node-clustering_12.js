# Source: https://betterstack.com/community/guides/scaling-nodejs/node-clustering/
# Original language: javascript
# Normalized: js
# Block index: 12

process.send({
  msgFromWorker: `Message sent from a worker.`
});