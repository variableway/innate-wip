# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 18

await myQueue.add(
  "job name",
  {
    /* your job data here */
  },
  { removeOnComplete: true, removeOnFail: true }
);