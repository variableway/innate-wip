# Source: https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/
# Original language: javascript
# Normalized: js
# Block index: 8

[label index.js]
...
[highlight]
export const exportData = (job) => {
  const { name, path } = job.data.jobData;
  console.log(`Exporting ${name} data to ${path}`);
};
[/highlight]

await addJob({ name: "welcomeMessage" });
[highlight]
await addJob({
  name: "dataExport",
  jobData: {
    name: "Sales report",
    path: "/some/path",
  },
});
[/highlight]