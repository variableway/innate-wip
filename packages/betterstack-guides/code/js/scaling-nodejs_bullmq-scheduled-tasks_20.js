# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 20

import { Queue } from "bullmq";

const queue = new Queue("email");

await queue.drain();