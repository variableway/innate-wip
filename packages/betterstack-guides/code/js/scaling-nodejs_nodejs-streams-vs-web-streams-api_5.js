# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 5

[label web-streams-readable.js]
import db from "./database.js";

// Function to fetch data from the database
const fetchData = (offset, chunkSize) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT title, release_date, tagline FROM movies LIMIT ? OFFSET ?",
      [chunkSize, offset],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// Function to create a readable stream from the database
const createReadableStream = () => {
  let offset = 0;
  const CHUNK_SIZE = 10;

  return new ReadableStream({
    async pull(controller) {
      try {
        const rows = await fetchData(offset, CHUNK_SIZE);
        if (rows.length > 0) {
          rows.forEach((row) => controller.enqueue(row));
          offset += CHUNK_SIZE;
        } else {
          controller.close(); // Signal the end of the stream
        }
      } catch (err) {
        controller.error(err);
      }
    },
    cancel(reason) {
      console.log("Stream cancelled:", reason);
    },
  });
};

// Create the readable stream
const movieStream = createReadableStream();

// Function to process and log the output from the stream
const processStream = async () => {
  const reader = movieStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log("Stream ended");
      break;
    }
    console.log(value);
  }
};

// Run the processStream function to show the output
processStream();