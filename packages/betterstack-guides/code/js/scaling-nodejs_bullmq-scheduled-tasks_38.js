# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 38

[label backup.js]
import { spawn } from "child_process";
// ...
[highlight]
import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
[/highlight]

export const redisOptions = { host: "localhost", port: 6379 };

const backupQueue = new Queue("backupQueue", { connection: redisOptions });

[highlight]
const serverAdapter = new ExpressAdapter();
const bullBoard = createBullBoard({
  queues: [new BullMQAdapter(backupQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/admin");

const app = express();
app.use("/admin", serverAdapter.getRouter());
[/highlight]

// ...
app.listen(3000, function () {
  console.log("Server running on port 3000");
});