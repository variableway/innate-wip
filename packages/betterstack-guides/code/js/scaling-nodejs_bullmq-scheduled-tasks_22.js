# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 22

import { Worker, Job } from "bullmq";

const worker = new Worker(
  queueName,
  async (job: Job) => {
    // Do something with the job
  },
  { concurrency: 60 }
);