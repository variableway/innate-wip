# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 17

const targetTime = new Date("01-01-2040 11:40");
const delay = targetTime - new Date();

await myQueue.add(
  "job name",
  {
    /* your job data here */
  },
  { delay }
);