# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 11

[label web-streams-writable.js]
import { createMovieReadableStream } from "./web-streams-api-util.js";

// Create a writable stream using WritableStream
const writableStream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
  close() {
    console.log("Stream ended");
  },
  abort(err) {
    console.error("Stream error:", err);
  },
});

const readableStream = createMovieReadableStream();

readableStream.pipeTo(writableStream).catch((err) => {
  console.error("Stream error:", err);
});