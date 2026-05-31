# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: js
# Normalized: js
# Block index: 5

[label index.js]
import { Queue } from "bullmq";

export const redisOptions = { host: "localhost", port: 6379 };

const myQueue = new Queue("myQueue", { connection: redisOptions });

async function addJob(job) {
  const options = { repeat: { every: 5000 } };
  await myQueue.add(job.name, job, options);
}

export const welcomeMessage = () => {
  console.log("Sending a welcome message every few seconds");
};

await addJob({ name: "welcomeMessage" });