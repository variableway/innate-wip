# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 16

await myQueue.add('job name', { /* your job data here */ }, { delay: 20000 });