# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 25

...
// Create the streams
const readableStream = createReadableStream();
const transformStream = createTransformStream();
const writableStream = createWritableStream();

// Pipe the streams together
readableStream
  .pipeThrough(transformStream)
  .pipeTo(writableStream)
  .catch((err) => {
    console.error("Pipeline error:", err);
  });