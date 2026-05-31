# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 26

[label read-files.js]
import * as fs from "node:fs";

const nodeReadable = fs.createReadStream("input.txt", {
  encoding: "utf-8",
});

const nodeWritable = fs.createWriteStream("output.txt", { encoding: "utf-8" });

nodeReadable.pipe(nodeWritable);

nodeWritable.on("finish", () => {
  console.log("Piping complete");
});

nodeWritable.on("error", (err) => {
  console.error("Error during piping:", err);
});