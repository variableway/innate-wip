# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 9

[label worker.js]
...
[highlight]
import { welcomeMessage, exportData, redisOptions } from "./index.js";
[/highlight]
...
const jobHandlers = {
  welcomeMessage: welcomeMessage,
[highlight]
  dataExport: exportData,
[/highlight]
};
...