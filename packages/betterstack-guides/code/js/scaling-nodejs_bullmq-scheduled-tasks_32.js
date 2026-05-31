# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 32

[label backup.js]
...
import { format } from "date-fns";
[highlight]
import { Queue } from "bullmq";

export const redisOptions = { host: "localhost", port: 6379 };
const backupQueue = new Queue("backupQueue", { connection: redisOptions });
[/highlight]
...
[highlight]
export const backupDatabase = async () => {
[/highlight]
  ...
}
...
// Initiate the database backup
backupDatabase().catch((err) => console.error(err));

[highlight]
async function addJob(job) {
  const options = { repeat: { every: 60000 } };
  await backupQueue.add(job.name, job, options);
}

await addJob({ name: "backupMongoDB" });
[/highlight]