# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 8

[label node-streams-writable.js]
import { createMovieReadableStream } from "./node-streams-util.js";
import { Writable } from "node:stream";

// Create a writable stream function
const createWritableStream = () => {
  return new Writable({
    objectMode: true,
    write(movie, encoding, callback) {
      console.log(movie);
      callback();
    },
  });
};

const writableStream = createWritableStream();

// Pipe the readable stream to the writable stream
createMovieReadableStream
  .pipe(writableStream)
  .on("end", () => console.log("Stream ended"))
  .on("error", (err) => console.error("Stream error:", err));