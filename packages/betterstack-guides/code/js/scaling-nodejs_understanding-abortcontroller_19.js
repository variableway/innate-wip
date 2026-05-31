# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 19

[label streams.js]
import fs from "fs";
import { addAbortSignal } from "stream";
import { setTimeout as delay } from "timers/promises";

const controller = new AbortController();
setTimeout(() => controller.abort(), 50);

const inputStream = addAbortSignal(
  controller.signal,
  fs.createReadStream("text.txt")
);
const outputStream = fs.createWriteStream("output.txt");

async function process(chunk) {
  console.log(`Processing chunk: ${chunk.length} bytes`);
  // Simulating some async processing
  await delay(10);
  return chunk;
}

(async () => {
  try {
    for await (const chunk of inputStream) {
      const processedChunk = await process(chunk);
      if (!outputStream.write(processedChunk)) {
        // Handle backpressure
        await new Promise((resolve) => outputStream.once("drain", resolve));
      }
    }
    console.log("Stream processing completed");
  } catch (e) {
    if (e.name === "AbortError") {
      console.log("The operation was cancelled");
    } else {
      console.error("An error occurred:", e);
      throw e;
    }
  } finally {
    outputStream.end();
    await new Promise((resolve) => outputStream.once("finish", resolve));
    console.log("Output stream closed");
  }
})();