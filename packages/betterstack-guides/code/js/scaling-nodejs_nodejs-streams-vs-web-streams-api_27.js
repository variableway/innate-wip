# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 27

[label read-files.js]
import * as fs from "node:fs";
import { Readable, Writable } from "node:stream";

const nodeReadable = fs.createReadStream("input.txt", {
  encoding: "utf-8",
});
const webReadableStream = Readable.toWeb(nodeReadable);

const nodeWritable = fs.createWriteStream("output.txt", { encoding: "utf-8" });
const webWritableStream = Writable.toWeb(nodeWritable);

// Pipe the Web Streams
webReadableStream
 .pipeTo(webWritableStream)
 .then(() => {
    console.log("Piping complete");
 })
 .catch((err) => {
    console.error("Error during piping:", err);
 });