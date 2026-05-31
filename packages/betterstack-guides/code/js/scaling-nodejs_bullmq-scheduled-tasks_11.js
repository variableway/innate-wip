# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 11

[label index.js]
...
[highlight]
async function addJob(job, priority) {
[/highlight]
  const options = { repeat: { every: 5000 } };
[highlight]
  if (priority !== undefined) {
    options.priority = priority;
  }
[/highlight]
  await myQueue.add(job.name, job, options);
}

...
[highlight]
await addJob({ name: "welcomeMessage" }, 10);
[/highlight]
...