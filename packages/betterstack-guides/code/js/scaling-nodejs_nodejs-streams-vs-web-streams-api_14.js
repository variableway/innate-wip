# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 14

[label node-streams-transform.js]
import { Transform } from "node:stream";
import { format } from "date-fns";
import {
  createMovieReadableStream,
  createMovieWritableStream,
} from "./node-streams-util.js";

// Create a transform stream to format release_date
const formatReleaseDate = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    if (chunk.release_date) {
      chunk.release_date = format(
        new Date(chunk.release_date),
        "MMMM dd, yyyy"
      );
    }
    callback(null, chunk);
  },
});

const writableStream = createMovieWritableStream();

createMovieReadableStream
  .pipe(formatReleaseDate)
  .pipe(writableStream)
  .on("finish", () => console.log("Stream ended"))
  .on("error", (err) => console.error("Stream error:", err));