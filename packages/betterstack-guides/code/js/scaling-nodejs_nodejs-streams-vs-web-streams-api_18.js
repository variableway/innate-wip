# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 18

[label node-streams-duplex.js]
import { format } from "date-fns";
import db from "./database.js";
import { Duplex } from "stream";

class MovieDuplexStream extends Duplex {
  constructor(options = {}) {
    super(options);
    this.offset = 0;
    this.CHUNK_SIZE = 10;
  }

  async _read() {
    try {
      const rows = await this.fetchData(this.offset, this.CHUNK_SIZE);
      if (rows.length > 0) {
        rows.forEach((row) => {
          // Stringify the object before pushing
          this.push(JSON.stringify(row));
        });
        this.offset += this.CHUNK_SIZE;
      } else {
        this.push(null); // Signal the end of the stream
      }
    } catch (err) {
      this.emit("error", err);
    }
  }

  _write(chunk, encoding, callback) {
    try {
      // Parse the stringified object
      const movie = JSON.parse(chunk);

      if (movie.release_date) {
        movie.release_date = format(
          new Date(movie.release_date),
          "MMMM dd, yyyy"
        );
      }
      console.log(movie);
      callback();
    } catch (err) {
      callback(err);
    }
  }

  fetchData(offset, chunkSize) {
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
  }
}

// Create and use the duplex stream
const movieDuplexStream = new MovieDuplexStream();

movieDuplexStream
  .on("data", (chunk) => {
    // Write the data back to the stream for the _write method to handle
    movieDuplexStream.write(chunk);
  })
  .on("end", () => {
    console.log("Stream ended");
  })
  .on("error", (err) => {
    console.error("Stream error:", err);
  });

// To start the stream processing
movieDuplexStream.resume();