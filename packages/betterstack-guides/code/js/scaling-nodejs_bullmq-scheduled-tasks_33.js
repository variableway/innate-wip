# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 33

[label backup-worker.js]
import { Worker } from "bullmq";
import { backupDatabase, redisOptions } from "./backup.js";

const processJob = async (job) => {
  console.log(`Processing job: ${job.name}`);
  await backupDatabase(job);
};

const worker = new Worker("backupQueue", processJob, {
  connection: redisOptions,
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

console.log("Worker started!");