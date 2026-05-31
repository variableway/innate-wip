# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 23

// Worker 1
const worker = new Worker("myQueue", async (job) => {
  console.log(`Worker 1 processing job: ${job.id}`);
  // Your job processing logic here
});

// Worker 2
const worker = new Worker("myQueue", async (job) => {
  console.log(`Worker 2 processing job: ${job.id}`);
  // Your job processing logic here
});