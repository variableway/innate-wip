# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 14

// Every 3 days
myQueue.add(
  "job_name",
  {
    /* your job data here */
  },
  {
    repeat: {
      cron: "0 0 */3 * *",
    },
  }
);

// Every 3 weeks
myQueue.add(
  "job_name",
  {
    /* your job data here */
  },
  {
    repeat: {
      cron: "0 0 */21 * *",
    },
  }
);