# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 2

[label node-streams-readable.js]
import { Readable } from "node:stream";
import db from "./database.js";

// Function to fetch data from the database
const fetchData = (offset, chunkSize) =>
  new Promise((resolve, reject) => {
    db.all(
      "SELECT title, release_date, tagline FROM movies LIMIT ? OFFSET ?",
      [chunkSize, offset],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });

// Create a readable stream
const CHUNK_SIZE = 10;
let offset = 0;

const createReadableStream = new Readable({
  objectMode: true,
  async read() {
    try {
      const rows = await fetchData(offset, CHUNK_SIZE);
      if (rows.length) {
        rows.forEach((row) => this.push(row));
        offset += CHUNK_SIZE;
      } else {
        this.push(null); // End of stream
      }
    } catch (err) {
      this.destroy(err);
    }
  },
});

// Log the output from the stream
createReadableStream
  .on("data", console.log)
  .on("end", () => console.log("Stream ended"))
  .on("error", (err) => console.error("Stream error:", err));