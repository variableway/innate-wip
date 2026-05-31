# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 40

[label backup.js]
[highlight]
import 'dotenv/config';
[/highlight]
. . .
const processJob = async (job) => {
  console.log(`Processing job: ${job.name}`);
  await backupDatabase(job);
[highlight]
  const response = await fetch(process.env.HEARTBEAT_URL);
  if (!response.ok) throw new Error(response.statusText);
[/highlight]
};
. . .