# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 19

import { Queue } from "bullmq";

const emailQueue = new Queue("email");

// Add email jobs to the queue
const jobs = await emailQueue.addBulk([
  { name: "welcomeEmail", data: { email: "user1@example.com" } },
  { name: "orderConfirmation", data: { email: "user2@example.com" } },
  { name: "passwordReset", data: { email: "user3@example.com" } },
]);