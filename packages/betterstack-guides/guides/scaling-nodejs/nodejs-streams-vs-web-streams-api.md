# Node.js Streams vs. Web Streams API

It's common for applications to read large files or datasets, which can be 1 GB
or even more than 30 GB. Reading these large files with Node.js can be tricky,
as it reads the file contents into memory, often resulting in high-memory
consumption that can cause performance bottlenecks or even lead to the the
the application being killed.

To address this issue, Node.js introduced the Streams API, a solution that
allows you to read and process data incrementally in smaller chunks in memory.
This optimizes memory consumption and provides relief, knowing that your
applications can process large data sets even on a machine with relatively low
resources.

In recent years, the WHATWG introduced the
[Web Streams API](https://streams.spec.whatwg.org/), which became a standard way
to stream data in JavaScript environments. The Web Streams API is now supported
in all major JavaScript environments, including browsers, Node.js, and Deno.

In this article, we will compare the Node.js Streams API and the Web Streams API
to understand their differences, best uses, and the pros and cons of each.

## Prerequisites

To follow this guide, you should:

- Have the latest version of
  [Node.js installed](https://nodejs.org/en/download/package-manager) on your
  machine.
- Understand how to use [Node.js streams](https://nodejs.org/api/stream.html).

## Downloading the demo project

In this section, you'll download the program code from a repository to your
machine. The repository contains the necessary code and a database with four
thousand rows of movie data. You will read data from the database in chunks
using Node.js streams and the Web Streams API.

To do that, clone the repository to your machine:

```command
git clone https://github.com/betterstack-community/node-streams-demo
```

Now move into the project directory:

```command
cd node-streams-demo
```

The directory has the following contents so far:

- `database.js`: Contains code for connecting to the SQLite3 database.
- `movies.db`: The SQLite3 database contains thousands of movie data rows.
- `node-streams-util.js`: Exports readable and writable streams made with
  Node.js streams, which you will reuse to avoid repetition.
- `web-streams-api-util.js`: Contains readable and writable streams made with
  the Web Streams API, which you will reuse to avoid duplication.

Next, install the dependencies with the following command, which only includes
the the sqlite3 package:

```command
npm install
```

From now on, you will work in this repository and run code from it.

With the demo code downloaded, proceed to the next section to learn more about
streams.

## What are Streams?

Streams are a fundamental concept in Node.js and modern JavaScript for
efficiently handling large or continuous flows of data. This approach allows you
to start working with data immediately without waiting for the entire dataset to
be available. Streams are also composable, meaning they can be easily chained
together to create complex data processing pipelines. For example, in log
analysis, you might chain multiple stream operations to read log files, filter
for specific error types, transform the data into a more usable format, and then
aggregate the results in a single, efficient pipeline. Streams also excel at
handling backpressure, which means they can manage data flow between components
with varying processing speeds, preventing memory overload.

Streams have numerous practical applications. In video streaming, streams enable
playback to begin before the entire video file is downloaded, allowing for
immediate viewing and reducing buffering times. Similarly, in file processing,
you can start handling a large file, like a 40GB CSV file, immediately. Each
chunk can be processed as it's read, even before the entire file has been
loaded. Data transformation is another use case where streams can transform data
on the fly, such as compressing, encrypting, or modifying data as it's being
read or written. In Observability, streams are crucial for shipping telemetry
data in real time, allowing for continuous monitoring and analysis of system
performance and behaviour.

## History of Node.js Streams

Since its early days, Node.js has included streaming capabilities through its
`streams` module. Over the years, it has evolved to offer features such as
piping data between streams, handling backpressure, and implementing custom
streaming logic. Many built-in Node.js APIs, including `fs` (file system),
`HTTP`, and `process.stdin/stdout`, use this streaming interface. Despite
improvements, the API for Node.js streams was often seen as complex.

In browsers, the increasing demand for applications capable of efficiently
managing streaming data, such as video streams or real-time updates, highlighted
the shortcomings of traditional JavaScript data handling methods. The Web
Streams API was created to address these issues and enhance incremental data
processing. While the API's developers drew inspiration from Node.js streams,
the API evolved into its own standardized approach.

Recognizing its advantages, modern web browsers swiftly integrated the Web
Streams API. Server-side JavaScript environments like Node.js, Deno, and Bun
followed suit. In Node.js, an experimental version was introduced in v16.5 and
became stable with the release of Node.js v21.0.0.

Today, while Node.js maintains its original streams for backward compatibility,
the Web Streams API is the standard for streaming in JavaScript environments,
promoting consistency and interoperability across runtimes.

## Streams API Overview

As mentioned, Node.js streams were introduced early in Node.js' development.
Long before the Web Streams API was introduced, streams could be categorized
into four main types:

- `Readable`: These streams produce data that can be read and consumed by other
  streams or processes. Common use cases include reading data from files,
  network requests, and standard input.
- `Writable`: These streams consume data and act as destinations. They are often
  used for writing to files, sending HTTP responses, or outputting to the
  console.
- `Transform`: These streams modify data as it passes through. They are useful
  for tasks like encryption, compression, and data parsing.
- `Duplex`: These streams combine both readable and writable capabilities,
  allowing them to produce and consume data. An example is `net.Socket`.

Now that you've been introduced to the various stream types, you'll explore each
category in detail. This examination will compare and contrast how these streams
are implemented in Node.js and the Web Streams API.

## Readable streams

Readable streams produce data that other streams or processes can consume. They
can operate in two modes:

- **Flowing mode**: Data is automatically pushed to the consumer as soon as it
  is available.
- **Paused mode**: The consumer requests data explicitly when it is ready.

To understand how readable streams can help manage large amounts of data without
overloading the system, you'll examine an example that involves fetching data
from a database in chunks using Node.js readable streams.

### Node.js streams

Node.js allows you to create readable streams through the `Readable` stream
available in the `stream` module.

Here is an example of how to create a readable stream with Node.js:

```javascript
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
```

This code creates a readable stream to fetch and output data from a database in
chunks.

The `fetchData()` function retrieves data from the database. It accepts an
`offset` and `chunkSize` as parameters, queries for rows, and returns a promise
with the results or an error.

The stream operates in object mode to handle JavaScript objects. It fetches 10
rows per read operation, starting at an offset of 0. Inside the stream's `read`
method, `fetchData` is called asynchronously to retrieve data. Fetched rows are
pushed into the stream, and the `offset` is incremented by the chunk size. If no
rows are returned, `null` is pushed to signal the end of the stream.

Event handlers log the data, handle the end of the stream, and log any errors.
The `data` event logs each chunk, the `end` event logs when the stream ends, and
the `error` event logs any errors during streaming. This setup allows continuous
fetching and outputting of data chunks from the database until all data is
processed.

After adding the code to your program, save and run it:

```command
node-streams-readable.js
```

You will see that the rows from the database are being logged incrementally as
they are fetched in chunks:

```text
[output]
...
{
  title: 'Signed, Sealed, Delivered',
  release_date: '2013-10-13',
  tagline: null
}
{
  title: 'My Date with Drew',
  release_date: '2005-08-05',
  tagline: null
}
Stream ended
```

As you can see, the rows are being logged to the console in chunks,
demonstrating how readable streams can efficiently handle large datasets. This
approach would be effective even if the database had over 10 million rows, as
the stream processes only a few chunks at a time.

Now that you know how readable streams work with Node.js streams, let's see how
to reimplement the same example using the Web Streams API.

### Web streams API

The Web Streams API allows you to create readable streams with the
`ReadableStream` class, available by default in Node.js, so you don't need to
import it.

Let's rewrite the program used in the previous section using the Web Streams
API:

```javascript
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
```

The `createReadableStream` function sets up a `ReadableStream` that fetches data
incrementally using the `fetchData` function, pushing each row into the stream
via the `controller.enqueue` method. If no more data is available, the stream is
closed using `controller.close`. The `cancel` method logs any reason for
cancellation.

The `processStream` function is defined to read and log the data. This function
creates a reader from the stream and uses an asynchronous loop to read chunks
from the stream. Each chunk is logged to the console, and when the stream ends,
a message is logged.

Run the code, and you will see the same output you saw in the previous section:

```command
node web-streams-readable.js
```

```text
[output]
{
  title: 'My Date with Drew',
  release_date: '2005-08-05',
  tagline: null
}
Stream ended
```

With that, let's look at the differences between the two APIs:

| Aspect              | Web Streams API                                                                              | Node.js Streams                                                            |
| ------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Readable Streams    |                                                                                              |                                                                            |
| `.read()` method    | Asynchronous `.read()`                                                                       | Async `.on("readable", ...)` plus synchronous `.read()`                    |
| Reader & locking    | Supports exclusive reader and locking concepts                                               | Does not have exclusive reader and locking concepts                        |
| Cancellation        | Includes cancellation semantics                                                              | Does not have cancellation semantics                                       |
| Flow control        | More precise flow control via `desiredSize` signal                                           | Uses backpressure management with pause/resume                             |
| Teeing support      | Built-in teeing support                                                                      | Does not have built-in teeing support                                      |
| `"data"` event      | Removed                                                                                      | Uses `"data"` event for reading                                            |
| Pause/resume        | Removed                                                                                      | Uses pause/resume for managing backpressure                                |
| `unshift` method    | Removed                                                                                      | Uses `unshift` method for putting chunks back into the queue after reading |
| Queueing strategies | Custom chunk types via queueing strategies; no "binary/string mode" vs. "object mode" switch | Switch between "binary/string mode" and "object mode"                      |
| Size parameter      | Uses BYOB readers instead of an optional and sometimes-working size parameter while reading  | Optional and sometimes-working size parameter                              |

The table shows the differences between readable streams in Node.js streams and
the Web Streams API. Now that you are familiar, you can explore writable streams
in the next section.

## Writable streams

Writable streams are destinations for data in a stream pipeline. They consume
data produced by `Readable` or `Transform` streams, typically writing it to some
an external resource like a file, console, database, or network socket.

### Node.js streams

First, let's look at how a writable stream can be written using Node.js streams
to send output to the console.

The following code demonstrates how to create a custom `Writable` stream for
logging movie data in the console:

```javascript
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
```

In this code snippet, you use the `createMovieReadableStream`, which is the same
readable stream you created in the previous section but with a different name.
The exportable version resides in `node-streams-util.js`.

The `createWritableStream` function defines a new writable stream in object
mode, allowing it to process JavaScript objects directly. Inside this function,
the `write()` method logs each movie object to the console and then calls
`callback()` to signal the completion of the writing process.

When you pipe the `createMovieReadableStream` into the `writableStream`, each
chunk of data read from the file is processed by the Writable stream's `write`
method, logging each movie object to the console.

Save and run the file:

```command
node node-streams-writable.js
```

Upon running, the output will look similar to the following:

```text
[output]
...
{
  title: 'My Date with Drew',
  release_date: '2005-08-05',
  tagline: null
}
```

Now that you know how Node.js writable streams can be implemented, let's explore
how writable streams can be implemented using the Web Streams API.

### Writable Stream

Node.js provides a `WritableStream` for creating writable streams. Similar to
the `ReadableStream` class, it is already available by default and doesn't need
to be imported.

The following code rewrites the previous example to create a writable stream
using the Web Streams API:

```javascript
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
```

In this example, you import the `createMovieReadableStream` from
`web-streams-api-util.js`, which contains the readable stream that incrementally
reads data from the database using the Web Streams API.

The `writableStream` is created using the `WritableStream` class from the Web
Streams API. This writable stream handles the data chunks as they are written to
it.

- `write(chunk)`: This method is invoked whenever data is written to the stream.
  In this case, it logs the data chunk (representing movie data) to the console.
- `close()`: This method is called when the stream has finished receiving data.
  It logs "Stream ended" to indicate that the streaming process is complete.
- `abort(err)`: This method is triggered if an error occurs during the streaming
  process. It logs the error message to the console.

The `readableStream` and `writableStream` are then connected using the `pipeTo`
method. This setup ensures that data from the readable stream is passed through
to the writable stream, which logs the movie objects.

When you save and run the file, the output will be similar to that shown by the
program using Node.js streams:

```command
node web-streams-writable.js
```

```text
[output]
...
{
  title: 'My Date with Drew',
  release_date: '2005-08-05',
  tagline: null
}
Stream ended
```

When compared to Node.js streams, key differences include:

| **Aspect**                      | **Web Streams API**                        | **Node.js Streams**                                              |
| ------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| **Writable Streams**            |                                            |
| Main class for writable streams | `WritableStream`                           | `Writable`                                                       |
| Write method                    | async `write(chunk)`                       | `write(chunk, encoding, callback)`                               |
| Error handling                  | Try/catch in write method                  | Error events or callbacks                                        |
| Asynchronous operations         | Uses async/await                           | Traditionally uses callbacks, newer versions support async/await |
| Backpressure handling           | Automatic                                  | Often requires manual management                                 |
| Closing the stream              | `close()` method                           | `end()` method                                                   |
| Aborting writes                 | `AbortSignal` can be passed to constructor | `destroy()` method                                               |
| High water mark                 | Controlled by `queuingStrategy`            | Controlled by `highWaterMark` option                             |

Now that you have seen how writable streams differ between Node.js and Web API
streams, let's examine the differences for transform streams.

## Transform streams

Transform streams modify data as it passes through. They are versatile tools
used for tasks such as data format conversion, encryption/decryption,
compression/decompression, and various other data manipulations. Examples
include:

- Converting JSON to CSV.
- Encrypting data during writing.
- Applying filters to images as they are streamed.

Let's explore how transform streams differ with an example that formats the
`release_date` field in the objects being read from the database into a more
human-readable date.

### Node.js streams

The next part of the code involves transforming the data. For this, you will
define a transform stream using Node.js streams that format a date in the
`node-streams-transform.js` file:

```javascript
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
```

In this example, you reuse the readable and writable streams in
`node-streams-util.js`.

The `formatReleaseDate` transform stream is created using the `Transform`
constructor in object mode. The `transform` method formats each movie object's
`release_date` field. It receives three parameters: the `chunk` (movie object),
the `encoding` (unused in object mode), and the `callback` function.

Within the `transform` method, the `release_date` field is formatted using the
`format` function from the `date-fns` library. The formatted date is then passed
by calling `callback(null, chunk)`, signalling the complete transformation and
making the data available to the next stage.

Save and run the file:

```command
node node-streams-transform.js
```

```text
[output]
...
{
  title: 'Signed, Sealed, Delivered',
  release_date: 'October 13, 2013',
  tagline: null
}
...
{
  title: 'My Date with Drew',
  release_date: 'August 05, 2005',
  tagline: null
}: null
Stream ended
```

You should now see that the `release_date` is more human-readable.

Now that you know how transform streams work, let's explore how they function
with the Web Streams API.

### Web streams API

The Web Streams API includes a `TransformStream`, which is available by default
and doesn't need to be imported.

The following example uses the Web Streams API to create transform streams
similar to those in the previous example:

```javascript
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
```

In this example, you reuse the readable and writable streams from
`web-streams-api-util.js`.

The `formatReleaseDate` function creates a transform stream that formats each
movie object's `release_date` field. The `transform` method formats the date
using the `date-fns` library and enqueues the modified chunk.

Finally, the readable stream is piped through the `formatReleaseDate` transform
stream and then to the writable stream, ensuring the data is processed and
logged correctly. If an error occurs during the process, it is caught and
logged.

When comparing the Web Streams API to Node.js streams, several key differences
are evident. The Web Streams API uses `TransformStream`, while Node.js uses the
`Transform` class from its `stream` module. Additionally, the transform method
parameters differ: Web Streams' `transform` method receives
`(chunk, controller)`, whereas Node.js's `transform` method receives
`(chunk, encoding, callback)`. For error handling, Web Streams use
`controller.error()` to emit errors, while Node.js calls the `callback` with an
error as the first argument.

Here is a comparison table that highlights the differences between the Web
Streams API and Node.js Streams, specifically focusing on Transform Streams:

| Aspect                | Web Streams API                       | Node.js Streams                                                                  |
| --------------------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| Transform Streams     |                                       |                                                                                  |
| Transform interface   | `TransformStream`                     | `stream.Transform`                                                               |
| Backpressure handling | Automatic via queuing strategy        | Manual implementation required                                                   |
| Data types            | Handles any JavaScript value natively | Primarily Buffer/string, object mode available                                   |
| Cork/Uncork           | No cork/uncork support yet            | Supports `cork` and `uncork` methods to temporarily buffer writes for efficiency |

Now that you have looked at transform streams, the next section explores duplex
streams.

## Duplex Streams

Duplex streams implement readable and writable interfaces, allowing them to
handle reading and writing operations within a single stream. This dual
functionality is ideal for bi-directional communication, such as in network
protocols like TCP, where data is sent and received on the same connection. In
file processing, duplex streams can read from and write to a file for on-the-fly
modifications. Additionally, they are used in data compression and decompression
utilities, handling both tasks within the same stream.

### Node.js streams

Node.js streams include a `Duplex` stream type, combining `Readable` and
`Writable` stream functionality into a single interface. This design choice was
driven by Node.js's server-side focus, where bidirectional communication is
common in network protocols and file I/O operations.

Here is an example that makes use of the `Duplex` stream type:

```javascript
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
```

This duplex stream, `MovieDuplexStream`, combines both readable and writable
functionalities to process movie data from a database. It reads data in chunks
from the database using its `_read()` method, which fetches rows, stringifies
them, and pushes them into the stream.

As data becomes available, the stream's 'data' event is triggered, and the event
listener immediately writes this data back into the stream. This write operation
activates the `_write()` method, which parses the stringified data, formats the
release date if present, and logs the movie object.

This creates a continuous cycle where data is read from the database, passed
through the stream, processed, and logged. The stream starts when `resume()` is
called and continues until all database rows have been processed, emitting an
'end' event.

Upon saving your file and running the code, you will see the following:

```command
node web-streams-transform.js
```

```text
[output]
...
{
  title: 'My Date with Drew',
  release_date: 'August 05, 2005',
  tagline: null
}
Stream ended
```

As you can see in the output, the `movieDuplexStream` reads data from the
database, transforms it, and writes it to the console.

### Web streams API

Unlike Node.js streams, the Web Streams API doesn't explicitly include a Duplex
stream type, opting for a more modular approach instead. This design choice
promotes simplicity, composability, and aligns better with typical web platform
needs.

Instead of a dedicated Duplex type, you can create duplex-like functionality by
combining `ReadableStream` and `WritableStream`, often represented as
`{ readable, writable }`. This approach is covered in the
[Web Streams specification](https://streams.spec.whatwg.org/#example-both).

Here is how the concept is applied to code that was previously using duplex
streams:

```javascript
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
```

This code implements a streaming system to process movie data from a database.
It creates a pair of streams:

- `MovieDatabaseReader`: A readable stream that fetches movie data from the
  database in chunks.
- `MovieDataProcessor`: A writable stream that processes this data.

The `MovieDatabaseReader` queries the database for movie information in batches
of 10, stringifies each row, and enqueues it into the stream. The
`MovieDataProcessor` reads these chunks, parses them back into objects, formats
the release date, and logs each movie. The streams are connected using
`pipeTo()`, creating a pipeline where data flows from the database through the
readable stream, into the writable stream for processing.

With that, you created a duplex-like functionality by using a `ReadableStream`
(MovieDatabaseReader) and a `WritableStream` (MovieDataProcessor).

You can run the file like this:

```command
node web-streams-api-duplex.js
```

It will yield the following output:

```text
[output]
...
{
  title: 'My Date with Drew',
  release_date: 'August 05, 2005',
  tagline: null
}
Movie processing completed
Movie stream processing completed
```

With that, you can learn more about the differences in chaining streams in the
next section.

## Chaining streams

Chaining streams is a powerful technique for building complex data processing
pipelines. By using streams' composability, you can create flexible and
efficient data flows.

### Node.js streams

Central to this approach is the `.pipe()` method, which facilitates seamless
data transfer between streams, allowing a smooth flow of data from one stream to
the next.

Take a look at the folllowing:

```javascript
...
createMovieReadableStream
  .pipe(formatReleaseDate)
  .pipe(createWritableStream())
  .on("finish", () => {
    console.log("Stream ended");
  })
  .on("error", (err) => {
    console.error("Stream error:", err);
  });
```

In this example, `createMovieReadableStream` generates movie objects. These
objects are then piped through `formatReleaseDate` to format the release dates
and finally piped to the writable stream created with `createWritableStream()`,
which logs each movie object to the console. This chaining creates a complete
data flow from generation to transformation to output.

This output shows the progression of movie objects being generated, transformed,
and logged, demonstrating the entire streaming process.

### Web streams API

Now let's examine how to pipe all the streams together using the Web Streams
API, utilizing the `pipeThrough()` and `pipeTo()` methods. Consider the
following code:

```javascript
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
```

This code demonstrates chaining streams to form a data processing pipeline. It
starts with a readable stream of movie data, passes it through a transform
stream to format the `release_date` field, and writes the processed data to the
console using a writable stream. The `pipeThrough()` method connects the
readable stream to the transform stream, while `pipeTo()` connects the transform
stream to the writable stream, allowing seamless data flow.

Compared to Node.js streams, which use a single `pipe()` method, the Web Streams
API provides distinct methods for handling transform and writable streams,
making the code clearer and more manageable. This approach highlights the
flexibility and efficiency of the Web Streams API in creating robust data
pipelines.

| Aspect         | Web Streams API                                                                         | Node.js Streams                                                            |
| -------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Piping methods | Split into `pipeTo(writable)` and `pipeThrough(transform)`                              | Uses a single `pipe` method for all stream types                           |
| Chaining       | Distinct methods allow clear chaining: `source.pipeThrough(transform).pipeTo(writable)` | Uses the same method for chaining: `source.pipe(transform).pipe(writable)` |
| Return value   | `pipeTo()` returns a promise that resolves when piping is complete                      | `pipe()` returns the destination stream                                    |

Now that you have looked at Web Streams and understand how they differ from
Node.js streams, you can effectively use them in various JavaScript
environments.

## Transitioning from Node.js Streams to Web Streams

Transitioning from Node.js streams to Web Streams enhances code modernization
and portability. While Web Streams are preferred for new projects, many existing
Node.js libraries still use Node.js streams, often requiring a hybrid approach
or gradual transition.

Node.js bridges these paradigms with `toWeb()` and `fromWeb()` methods, allowing
conversion between Node.js and Web Streams. This allows you to integrate both
stream types in one application and leverage the modern Web Streams API even
with Node.js stream sources.

This approach comes with the following benefits:

1. **Standardization**: It allows a more standardized syntax throughout your
   code, improving consistency and readability.
2. **Future-proofing**: As Web Streams gain more traction, code using this API
   will likely be more adaptable to future JavaScript environments.

Here is the program code using built-in methods that already implement Node.js
streaming:

```javascript
[label read-files.js]
import * as fs from "node:fs";

const nodeReadable = fs.createReadStream("input.txt", {
  encoding: "utf-8",
});

const nodeWritable = fs.createWriteStream("output.txt", { encoding: "utf-8" });

nodeReadable.pipe(nodeWritable);

nodeWritable.on("finish", () => {
  console.log("Piping complete");
});

nodeWritable.on("error", (err) => {
  console.error("Error during piping:", err);
});
```

The original code uses `fs.createReadStream` and `fs.createWriteStream`, which
return Node.js streams. It then uses the `pipe()` method and event listeners to
handle the stream flow and error cases. This approach is typical of Node.js
stream usage but lacks the benefits of modern JavaScript features like promises.

Save the code and run the file:

```command
node read-files.js
```

You will see that it creates an `output.txt` file containing the text read by
the program.

If you have adopted the Web Streams API and want to maintain that approach, you
can convert to Web Streams using the `toWeb()` method like this:

```javascript
[label read-files.js]
import * as fs from "node:fs";
import { Readable, Writable } from "node:stream";

const nodeReadable = fs.createReadStream("input.txt", {
  encoding: "utf-8",
});
const webReadableStream = Readable.toWeb(nodeReadable);

const nodeWritable = fs.createWriteStream("output.txt", { encoding: "utf-8" });
const webWritableStream = Writable.toWeb(nodeWritable);

// Pipe the Web Streams
webReadableStream
 .pipeTo(webWritableStream)
 .then(() => {
    console.log("Piping complete");
 })
 .catch((err) => {
    console.error("Error during piping:", err);
 });
```

In this updated example, the `toWeb()` method transforms both the readable and
writable Node.js streams into their Web Stream counterparts. This conversion
allows using the `pipeTo()` method, which returns a promise. Consequently, the
code can use `.then()` and `.catch()` to handle successful completion and
errors, respectively. This promise-based approach aligns better with modern
JavaScript practices and can lead to more readable and maintainable code.

## When to Use Node.js Streams vs. Web Streams

When deciding between Node.js streams and Web Streams, it's essential to
consider both the context of your application and the evolving landscape of
JavaScript technologies. The general rule of thumb is to favour the Web Streams
API when starting new projects or working in environments that support it. This
preference stems from Web Streams being a more official standard, offering
greater portability across different JavaScript environments like browsers,
Deno, and even Node.js itself.

Web Streams, with its modern, flexible API and precise separation between
different types of streams (readable, writable, and transform), offer several
advantages. These include better integration with promises, automatic
backpressure handling, and a more intuitive approach to chaining and error
propagation. These features make Web Streams particularly well-suited for
complex streaming operations and code that must run in multiple environments.

It's important to note that Node.js streams are not being phased out. The
Node.js core team has
[committed to maintaining built-in stream support](https://github.com/nodejs/node/issues/39093#issuecomment-864440696),
recognizing their importance in the Node.js ecosystem. Many Node.js built-in
modules and third-party packages still rely heavily on Node.js streams.
Furthermore, for most common use cases, the default methods in Node.js implement
streams efficiently, and there's a wealth of existing libraries and tools built
around Node.js streams.

An important consideration is the ability to convert between these two stream
types. Node.js provides methods to convert Web Streams to Node.js streams and
vice versa, offering a bridge between the two APIs. This interoperability means
you can leverage the strengths of both APIs within the same application when
necessary.

The following table can help you make decisions based on your needs:

| Factor                 | Web Streams                                           | Node.js Streams                      |
| ---------------------- | ----------------------------------------------------- | ------------------------------------ |
| Environment            | Cross-platform (browsers, Deno, Node.js)              | Node.js-specific environments        |
| Standardization        | Official web standard                                 | Node.js-specific API                 |
| Legacy compatibility   | May require conversion for older Node.js libraries    | Better for existing Node.js projects |
| API design             | Promise-based, more modern design                     | Callback-based, event-driven         |
| Ecosystem support      | Growing, especially in browser environments           | Extensive in Node.js ecosystem       |
| Performance in Node.js | Good, but may have slight overhead due to abstraction | Highly optimized                     |
| Future-proofing        | Standardized, portable across platforms               | Stable, but limited to Node.js       |

By evaluating these factors, you can choose the stream API that best suits your
project's requirements and future goals.

## Final thoughts

This article has explored the key distinctions between
[Node.js streams](https://nodejs.org/api/stream.html) and
[Web Streams](https://nodejs.org/api/webstreams.html), highlighting their
respective strengths and use cases. Understanding these differences is crucial
for making informed decisions in your development process.

As a general guideline, favour the Web Streams API for new projects due to its
standardization and cross-platform compatibility. For existing Node.js projects
or when working with Node.js-specific modules, use the `toWeb()` method to
integrate Web Streams where beneficial.

Thanks for reading, and happy streaming!