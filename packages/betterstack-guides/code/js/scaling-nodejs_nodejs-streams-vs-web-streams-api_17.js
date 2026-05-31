# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 17

[label web-streams-transform.js]
import { format } from "date-fns";
import {
  createMovieReadableStream,
  createMovieWritableStream,
} from "./web-streams-api-util.js";

// Create a transform stream to format release_date
const formatReleaseDate = () => {
  return new TransformStream({
    transform(chunk, controller) {
      if (chunk.release_date) {
        chunk.release_date = format(
          new Date(chunk.release_date),
          "MMMM dd, yyyy"
        );
      }
      controller.enqueue(chunk);
    },
  });
};

const readableStream = createMovieReadableStream();
const writableStream = createMovieWritableStream();

readableStream
  .pipeThrough(formatReleaseDate())
  .pipeTo(writableStream)
  .catch((err) => {
    console.error("Pipeline error:", err);
  });