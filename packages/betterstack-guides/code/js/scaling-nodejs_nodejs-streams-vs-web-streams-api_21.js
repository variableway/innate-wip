# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 21

[label web-streams-api-duplex.js]
import { format } from "date-fns";
import db from "./database.js";

function createMovieStreamPair() {
  return {
    readable: new ReadableStream(new MovieDatabaseReader()),
    writable: new WritableStream(new MovieDataProcessor()),
  };
}

class MovieDatabaseReader {
  constructor() {
    this.offset = 0;
    this.CHUNK_SIZE = 10;
  }

  start(controller) {
    this._controller = controller;
    this._fetchAndEnqueue();
  }

  async _fetchAndEnqueue() {
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all(
          "SELECT title, release_date, tagline FROM movies LIMIT ? OFFSET ?",
          [this.CHUNK_SIZE, this.offset],
          (err, rows) => (err ? reject(err) : resolve(rows))
        );
      });

      if (rows.length > 0) {
        rows.forEach((row) => this._controller.enqueue(JSON.stringify(row)));
        this.offset += this.CHUNK_SIZE;
        this._fetchAndEnqueue();
      } else {
        this._controller.close();
      }
    } catch (err) {
      this._controller.error(err);
    }
  }

  cancel() {
    this._controller.close();
  }
}

class MovieDataProcessor {
  start(controller) {
    this._controller = controller;
  }

  async write(chunk) {
    try {
      const movie = JSON.parse(chunk);
      if (movie.release_date) {
        movie.release_date = format(
          new Date(movie.release_date),
          "MMMM dd, yyyy"
        );
      }
      console.log(movie);
    } catch (err) {
      this._controller.error(err);
    }
  }

  close() {
    console.log("Movie processing completed");
  }

  abort(reason) {
    console.error("Movie processing aborted:", reason);
  }
}

// Create and use the movie stream pair
const { readable, writable } = createMovieStreamPair();

readable
  .pipeTo(writable)
  .then(() => console.log("Movie stream processing completed"))
  .catch((err) => console.error("Movie stream processing error:", err));