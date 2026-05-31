# Node.js Performance Monitoring: A Beginners Guide

Looking for an easier way to identify performance bottlenecks in your
application? Monitoring tools can enhance observability and quickly help you
detect issues.

Node.js provides a [Performance API](https://nodejs.org/api/perf_hooks.html)
that simplifies measuring code performance. When used with
[Prometheus](https://prometheus.io/), this setup enables efficient metrics
collection, which allows a more straightforward analysis of your application's
health.

This article serves as a continuation of Part 1, which introduces the Node.js
Performance API. It will dig deeper into how you can apply the concepts
discussed in real-world applications.

## Prerequisites

Before beginning this tutorial, ensure you have installed the
[latest version](https://nodejs.org/en/download) of Node.js and have a basic
understanding of Node.js application development. Additionally, ensure
[Docker](https://docs.docker.com/engine/install/) and
[Docker Compose](https://docs.docker.com/compose/install/) are installed on your
system.

## Step 1 — Setting up the demo project

To showcase performance monitoring in a real-world Node.js application, I have
prepared a sample project. The application retrieves data from an SQLite
database, processes it, makes a fetch API request, and then displays the data.
Throughout this article, you'll use the Node.js Performance API to track the
time taken for each operation.

Begin by cloning the project repository to your local machine with the command:

```command
git clone https://github.com/betterstack-community/books-app
```

After cloning, navigate to the project directory:

```command
cd books-app
```

Next, install the necessary dependencies:

- [Express](https://expressjs.com/): a widely-used web framework.
- [Embedded JavaScript templates (EJS)](https://ejs.co/): a templating engine.
- [node-sqlite3](https://www.npmjs.com/package/sqlite3): asynchronous SQLite3
  bindings for Node.js.
- [autocannon](https://github.com/mcollina/autocannon): a high-performance load
  testing tool.

Run the following command to install them:

```command
npm install
```

Once the dependencies are installed, launch the development server, which
listens on port 3000:

```command
npm start
```

The server will start, and you should see this output:

```text
[output]
> books_app@1.0.0 start
> node --watch index

(node:324218) ExperimentalWarning: Watch mode is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Connection with SQLite has been established
Server is running on http://localhost:3000
```

The `--watch` flag enables the server to restart automatically upon file change.
Note that this feature is currently experimental.

Now, open your browser and go to `http://localhost:3000` to view the homepage:

![Screenshot of the homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5ead97ba-c0cf-498d-e102-43dcdf358c00/lg2x =3012x1776)

The application displays a subset of the database records to avoid overwhelming
the page with data. Specifically, it shows only 200 out of several thousand
records.

The application includes a `book.db` file sourced from the
[7k Books dataset](https://www.kaggle.com/datasets/dylanjcastillo/7k-books-with-metadata?resource=download),
which has been enhanced with additional data.

## Step 2 — Identifying code segments for monitoring

Before starting the performance measurement, it's essential to understand the
code segments that will be monitored. Open the `index.js` file to review the
code:

```javascript
[label index.js]
...
app.get("/", async (req, res) => {
  let modifiedRows = [];

  try {
    // Fetch data from the database
    let rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM books`, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows);
      });
    });

    // Fetch random advice from the API
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();
    const quote = data.slip.advice;

    modifiedRows = rows.map((book) => {
      const numPages = parseInt(book.num_pages);
      const pageSizeCategory = categorizePageSize(numPages); // Function to categorize page size
      return {
        ...book,
        pageSizeCategory: pageSizeCategory,
      };
    });

    // Render the template with the processed data
    res.render("index", { books: modifiedRows.slice(0, 200), quote });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});
```

When a GET request is made, the code queries the database to retrieve all rows
from the "books" table. Following that, it reaches out to an external API at
`https://api.adviceslip.com/advice` to fetch random advice. After retrieving the
data, it processes these entries to append a `pageSizeCategory`, calculated
using the `categorizePageSize()` function. Finally, it renders a template with
the data obtained from the database and the API.

We will assess and monitor the performance of each of these segments: database
querying, API fetching, data processing, and template rendering. Here’s why
monitoring these segments is important:

- Database Query Performance: Measuring this helps spot inefficiencies in
  database interactions, possibly due to slow queries, inefficient connections,
  or indexing issues.

- External API Request Performance: This measurement helps measure the delay
  introduced by external services, indicating network speed or connectivity
  issues.

- Data Processing Performance: Monitoring this helps identify bottlenecks in
  data manipulation, which could be optimized with efficient algorithms for
  better performance.

- Template Rendering Performance: Measuring this reveals the impact of rendering
  on application performance, potentially highlighting issues in the rendering
  engine or data integration.

Now that you understand the parts you need to monitor and the reasons why, you
will begin measuring the database query performance.

## Step 3 — Measuring database querying performance

In this step, you'll use the User Timing API to evaluate the performance of
database query operations. This API offers `performance.mark()` to set markers
around query executions and `performance.measure()` to compute the durations
between these markers. Additionally, an Observer will be used to track these
measurements in real-time.

Open the `index.js` file and include the following code:

```javascript
[label index.js]
app.get("/", async (req, res) => {
  let modifiedRows = [];
[highlight]
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`);
    });
  });
  observer.observe({ entryTypes: ["measure"] });
[/highlight]
  try {
    // Fetch data from the database
[highlight]
    performance.mark("fetchDatabaseStart");
[/highlight]
    let rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM books`, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(rows);
      });
    });
[highlight]
    performance.mark("fetchDatabaseEnd");
    performance.measure(
      "fetchDatabase",
      "fetchDatabaseStart",
      "fetchDatabaseEnd"
    );
[/highlight]
    ...
  }
  ...
})
```

In this code, you configure the `PerformanceObserver` to log performance
metrics, showing the duration of each event in milliseconds. You then mark the
start of the database operation with `fetchDatabaseStart` and the end with
`fetchDatabaseEnd`. The elapsed time is then calculated using
`performance.measure()`.

After saving these changes, Node.js will restart the development server
automatically.

To see the duration, refresh the endpoint at `http://localhost:3000/` using the
following command in the second terminal:

```command
curl http://localhost:3000/
```

Then, return to the first terminal, and you should see output similar to this:

```text
[output]
fetchDatabase: 170.752ms
```

This indicates that the database took approximately 170 milliseconds to process
the queries. This duration might vary depending on your system. And after making
multiple GET requests to the endpoint, I get different results each time:

```text
[output]
fetchDatabase: 134.784ms
fetchDatabase: 134.784ms
fetchDatabase: 108.899ms
fetchDatabase: 108.899ms
fetchDatabase: 108.899ms
fetchDatabase: 113.404ms
```

With this setup, you can now accurately track the time it takes to execute
database queries in milliseconds. Next, you will measure the performance of
fetching data from external APIs.

## Step 4 — Measuring API requests

Next, you'll measure the performance of external API requests. Fortunately,
Resource Timing is incorporated into the Performance API, which automatically
captures network timing data, such as DNS lookups and request durations.

Instead of using the `mark()` method, you can directly retrieve these
measurements from the performance timeline. Update your code and adjust the
observer to monitor entries of type `resource`:

```javascript
[label index.js]
app.get("/", async (req, res) => {
  let modifiedRows = [];
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
[highlight]
      if (entry.entryType === "resource") {
        console.log(`API fetch duration: ${entry.duration}ms`);
      } else {
[/highlight]
        console.log(`${entry.name}: ${entry.duration}ms`);
[highlight]
      }
[/highlight]
    });
  });
[highlight]
  observer.observe({ entryTypes: ["measure", "resource"] });
[/highlight]
  ...
})
```

In this setup, the `PerformanceObserver` tracks `measure` and `resource`
entries. If an entry is of type `resource`, the observer's callback logs the API
fetch duration.

After saving your modifications, refresh the `http://localhost:3000/` endpoint
in your second terminal:

```command
curl http://localhost:3000/
```

You should see output like this:

```text
[output]
fetchDatabase: 166.424ms
API fetch duration: 369.531ms
```

With that, you can successfully measure the fetch API requests by accessing the
duration inside the performance timeline. Now, you'll move on to measuring the
performance of data processing tasks.

## Step 5 — Measuring data processing duration

After fetching the rows and making an API request, the database data is
processed. In this section, you'll add markers to measure the duration of this
task.

Open your `index.js` file and insert the following markers:

```text
[label index.js]
...
app.get("/", async (req, res) => {
  ...
  try {
    ...
[highlight]
    performance.mark("modifyRowsStart");
[/highlight]
    modifiedRows = rows.map((book) => {
      const numPages = parseInt(book.num_pages);
      const pageSizeCategory = categorizePageSize(numPages); // Function to categorize page size
      return {
        ...book,
        pageSizeCategory: pageSizeCategory,
      };
    });
[highlight]
    performance.mark("modifyRowsEnd");
    performance.measure("modifyRows", "modifyRowsStart", "modifyRowsEnd");
[/highlight]

    // Render the template with the processed data
    res.render("index", { books: modifiedRows, quote });
  }...
});
```

This code snippet sets up markers at the start and end of the data processing
segment. You then use `performance.measure()` to calculate the duration between
these markers.

Save your code, and refresh the homepage endpoint in the second terminal:

```command
curl http://localhost:3000/
```

Return to the first terminal to see an output similar to this:

```text
[output]
fetchDatabase: 148.151ms
API fetch duration: 313.107ms
modifyRows: 21.162ms
```

On my system, the data processing step takes approximately 21 milliseconds.

With the ability to measure data processing, you can calculate the rendering
time.

## Step 6 — Measuring rendering time

In this section, you'll measure your application's rendering time using a
similar approach to the previous steps: adding markers around the `render()`
function.

Update your `index.js` file with the following code:

```text
[label index.js]
app.get("/", async (req, res) => {
    // Render the template with the processed data
[highlight]
    performance.mark("renderStart");
[/highlight]
    res.render("index", { books: modifiedRows, quote });
[highlight]
    performance.mark("renderEnd");
    performance.measure("render", "renderStart", "renderEnd");
[/highlight]
  ...
});
```

This addition places markers at the start and end of the rendering process and
measures the duration between these points.

After saving your updates, refresh the homepage in the second terminal:

```command
curl http://localhost:3000/
```

Return to the first terminal to see output like this:

```text
[output]
fetchDatabase: 152.925ms
API fetch duration: 352.291ms
modifyRows: 14.151ms
render: 15.965ms
```

On my machine, the rendering time is approximately 15 milliseconds.

With this, you can measure the rendering time.

## Step 6 — Implementing custom metrics for Prometheus

In this section, you'll create custom metrics from the measurements and expose
them to an endpoint that Prometheus can scrape. Prometheus is a powerful
open-source monitoring tool that collects and stores metrics data by scraping
specified endpoints.

### Setting up the Prometheus client

To create a metric endpoint, you'll use the
[prom-client](https://www.npmjs.com/package/prom-client) package, which you can
install with the following command:

```command
npm install prom-client
```

Next, modify your `index.js` file to set up a metrics registry:

```javascript
[label index.js]
...
[highlight]
import { Registry, Histogram } from "prom-client";
[/highlight]
...

[highlight]
const register = new Registry();
[/highlight]

app.get("/", async (req, res) => {
  ...
});
[highlight]
app.get("/metrics", function (req, res) {
  res.setHeader("Content-Type", register.contentType);

  register.metrics().then((data) => res.status(200).send(data));
});
[/highlight]
```

Here, you instantiate the Registry class. The registry keeps track of all
metrics, and it's where all the metrics you create will be registered before
they are exposed to an endpoint.

Next, you define a `/metrics` endpoint, where you invoke the `metrics()` method
of the `register` object to retrieve all the metrics data.

After updating your code, access the metrics endpoint by visiting
`curl http://localhost:3000/metrics` in your browser. Initially, this will yield
an empty response because no metrics have been defined yet:

![Metrics page empty](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ddef1cd5-d72d-4175-04b3-af34910d3300/lg2x =3024x1776)

### Creating metrics for database durations

After measuring database query durations, you'll set up a metric to capture this
data effectively. The histogram metric from Prometheus is ideal for representing
data distributions.

A histogram organizes data into "buckets" based on set intervals. Each bucket
tallies measurements within its range. For example, the durations of 2, 5, and 8
seconds correspond to individual buckets marked by these upper limits.

It's essential to define these buckets carefully to accurately calculate useful
percentiles. If most durations exceed the highest bucket or are below the
lowest, the histogram will not offer insightful data.

Begin with load testing to gauge the typical duration ranges of your tasks.
Exercise caution, particularly if your application interacts with external
services, to avoid being rate-limited due to excessive requests.

First, restart the server and redirect the output to a file:

```command
npm start >> duration_measurements.txt
```

In another terminal, run a load test:

```command
npx autocannon --renderStatusCodes http://localhost:3000/
```

Expect output similar to this:

```text
[output]
Running 10s test @ http://localhost:3000/
10 connections


┌─────────┬────────┬────────┬─────────┬─────────┬───────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%   │ 99%     │ Avg       │ Stdev     │ Max     │
├─────────┼────────┼────────┼─────────┼─────────┼───────────┼───────────┼─────────┤
│ Latency │ 677 ms │ 896 ms │ 1635 ms │ 1771 ms │ 958.18 ms │ 230.95 ms │ 1771 ms │
└─────────┴────────┴────────┴─────────┴─────────┴───────────┴───────────┴─────────┘
┌───────────┬─────┬──────┬────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%  │ 2.5% │ 50%    │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────┼──────┼────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 0   │ 0    │ 11     │ 13      │ 9.9     │ 3.57   │ 9       │
├───────────┼─────┼──────┼────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 1.4 MB │ 1.65 MB │ 1.26 MB │ 453 kB │ 1.14 MB │
└───────────┴─────┴──────┴────────┴─────────┴─────────┴────────┴─────────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 99    │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 10

109 requests in 10.04s, 12.6 MB read
```

After the test, stop redirecting the output to the file:

```command
npm start
```

Now, open the `duration_measurements.txt` file containing various duration
entries. Review this file to assess the range of expected database durations.
Here are some common durations I recorded in my own time:

```text
[outupt]
fetchDatabase: 57.32739600000059
fetchDatabase: 77.634014999996ms
fetchDatabase: 85.30363499999658ms
fetchDatabase: 102.61748900000384ms
fetchDatabase: 177.79476599999907ms
fetchDatabase: 212.01999899999646ms
fetchDatabase: 316.96253199999774ms
fetchDatabase: 363.4207549999992ms
fetchDatabase: 456.38386100000207ms
fetchDatabase: 500.81285899999784ms
fetchDatabase: 543.1071999999986ms
fetchDatabase: 611.9672449999998ms
fetchDatabase: 652.9836989999967ms
fetchDatabase: 759.9638239999986ms
```

From these data points, I've formulated bucket ranges in seconds that cover the
observed values:

```javascript
[0.01, 0.1, 0.4, 0.6, 0.7, 0.8, 1, 1.5]
```

In your `index.js`, integrate the following code to create and use a histogram
for tracking these durations:

```javascript
[label index.js]
...
[highlight]
const fetchDatabaseHistogram = new Histogram({
  name: "fetch_database_duration_seconds",
  help: "Duration of fetching data from the database",
  registers: [register],
  buckets: [0.01, 0.8, 0.1, 0.4, 0.6, 0.7, 1, 1.5],
});
[/highlight]
app.get("/", async (req, res) => {
  ...
  try {
    // Fetch data from the database
    performance.mark("fetchDatabaseStart");
    let rows = await new Promise((resolve, reject) => {
      ...

    });
    performance.mark("fetchDatabaseEnd");
[highlight]
   const measureFetchDatabase = performance.measure(
      "fetchDatabase",
      "fetchDatabaseStart",
      "fetchDatabaseEnd"
    );
    const fetchDatabaseDuration = measureFetchDatabase.duration / 1000;
    fetchDatabaseHistogram.observe(fetchDatabaseDuration);
[/highlight]
    ...
  } catch (err) {
    ...
  }
});
...
```

In this code, you create a Histogram named `fetch_database_duration_seconds`.
The `help` parameter describes what the metric represents. The `registers`
option specifies the registry where this metric will be registered, which is the
`register` you instantiated earlier. Next, the `buckets` define the boundaries
of the buckets in seconds, where each bucket represents a range of durations.

In the `/` endpoint, you retrieve the duration of the performance measurement
named "fetchDatabase" and divide the result by 1000 to convert milliseconds to
seconds. Finally, the `fetchDatabaseHistogram.observe()` function observes the
duration by recording it in the histogram.

With the metric created, save your file.

Return to your browser and test the `http://localhost:3000/metrics` endpoint.

Upon running, you will see output that looks similar to the following:

```text
[output]
# HELP fetch_database_duration_seconds Duration of fetching data from the database
# TYPE fetch_database_duration_seconds histogram
fetch_database_duration_seconds_bucket{le="0.01"} 0
fetch_database_duration_seconds_bucket{le="0.1"} 0
fetch_database_duration_seconds_bucket{le="0.4"} 0
...
fetch_database_duration_seconds_bucket{le="+Inf"} 0
fetch_database_duration_seconds_sum 0
fetch_database_duration_seconds_count 0
```

A histogram metric includes the following components:

- Histogram Buckets: Each bucket within a histogram is identified with a
  `_ bucket` suffix and functions as a counter. The `le` label, standing for
  "less than or equal to," denotes the upper limit of the bucket's range.
  Measurements within or under this value are counted within that particular
  bucket.

- Sum Counter: This counter, indicated by the `_sum` suffix, represents the
  total sum of all recorded measurement values.

- Count Counter: Designated by the `_count` suffix, this counter records the
  total number of measurements taken, providing an overall count of all data
  points measured.

Refreshing the homepage in your browser and re-checking the metrics endpoint,
the histogram will update to reflect the measured durations:

```text
[output]
fetch_database_duration_seconds_bucket{le="0.01"} 0
fetch_database_duration_seconds_bucket{le="0.8"} 1
fetch_database_duration_seconds_bucket{le="0.1"} 1
fetch_database_duration_seconds_bucket{le="0.4"} 1
fetch_database_duration_seconds_bucket{le="0.6"} 1
fetch_database_duration_seconds_bucket{le="0.7"} 1
fetch_database_duration_seconds_bucket{le="1"} 1
fetch_database_duration_seconds_bucket{le="1.5"} 1
fetch_database_duration_seconds_bucket{le="+Inf"} 1
fetch_database_duration_seconds_sum 0.11492313899999863
fetch_database_duration_seconds_count 1
```

Now, you see some of the histogram values incremented by one.

### Creating metrics for fetch, data processing, and rendering

In this section, you will set up histogram metrics for fetch operations, data
processing, and rendering. In my own time, I analyzed the
`duration_measurements.txt` file to determine the appropriate bucket values
based on the durations I observed.

Here's the updated code for your `index.js`:

```javascript
[label index.js]
...
[highlight]
import { Registry, Counter, Histogram } from "prom-client";
[/highlight]
...
const fetchDatabaseHistogram = new Histogram({
  ...
});

[highlight]
const fetchDurationHistogram = new Histogram({
  name: "fetch_duration_seconds",
  help: "Duration of fetch API requests",
  registers: [register],
  buckets: [0, 0.5, 1, 2, 4, 6, 8, 12],
  labelNames: ["method", "status_code", "route"],
});

const fetchRequestsCounter = new Counter({
  name: "fetch_requests_total",
  help: "Total number of fetch API requests",
  registers: [register],
});

const dataTransferSizeHistogram = new Histogram({
  name: "data_transfer_size_bytes",
  help: "Data transfer size of fetch API requests",
  registers: [register],
  buckets: [100, 200, 300, 400, 500],
});

const modifyRowsHistogram = new Histogram({
  name: "modify_rows_duration_seconds",
  help: "Duration of modifying rows",
  registers: [register],
  buckets: [0, 0.01, 0.05, 0.1, 0.4, 0.6, 1],
});

const renderHistogram = new Histogram({
  name: "render_duration_seconds",
  help: "Duration of rendering",
  registers: [register],
  buckets: [0, 0.1, 0.02, 0.03, 0.07, 0.09, 0.1,],
});
[/highlight]
```

The provided code snippet configures several histograms and a counter for
monitoring various performance metrics in an application:

- fetchDurationHistogram: Measures the duration of fetch API requests, with
  buckets ranging from 0 to 12 seconds, and includes labels for method, status
  code, and route.

- fetchRequestsCounter: Counts the total number of fetch API requests.

- dataTransferSizeHistogram: Monitors the data transfer size of fetch API
  requests, with buckets set at 100-byte increments up to 500 bytes.

- modifyRowsHistogram: Tracks the time taken to modify rows, with fine-grained
  buckets from 0 to 1 second, emphasizing shorter durations.

- renderHistogram: Measures the duration of rendering tasks, with detailed
  buckets for short durations ranging up to 0.1 seconds.

Now modify the `"/"` endpoint to record the measurements into the specified
histograms:

```javascript
[label index.js]
...
app.get("/", async (req, res) => {
  let modifiedRows = [];
  ...
  try {
    ...
    // Fetch random advice from the API
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();
[highlight]
    // Increment fetch requests counter
    fetchRequestsCounter.inc();

    const resources = performance
      .getEntriesByType("resource")
      .filter((entry) => entry.name === "https://api.adviceslip.com/advice")
      .sort((a, b) => b.fetchStart - a.fetchStart); // Sort by fetchStart in descending order

    // If resources are found, observe the duration of the latest fetch
    if (resources.length > 0) {
      const fetchDuration = resources[0].duration / 1000;
      const transferSize = resources[0].transferSize;
      fetchDurationHistogram
        .labels(req.method, res.statusCode, req.originalUrl)
        .observe(fetchDuration / 1000);
      dataTransferSizeHistogram.observe(transferSize);
    }
[/highlight]
    const quote = data.slip.advice;

    performance.mark("modifyRowsStart");
    modifiedRows = rows.map((book) => {
      const numPages = parseInt(book.num_pages);
      const pageSizeCategory = categorizePageSize(numPages); // Function to categorize page size
      return {
        ...book,
        pageSizeCategory: pageSizeCategory,
      };
    });
    performance.mark("modifyRowsEnd");
[highlight]
    const measureModifiedRows = performance.measure(
      "modifyRows",
      "modifyRowsStart",
      "modifyRowsEnd"
    );
    // Measure modifyRows duration
    const modifyRowsDuration = measureModifiedRows.duration / 1000;
    modifyRowsHistogram.observe(modifyRowsDuration);
[/highlight]
    // Render the template with the processed data
    performance.mark("renderStart");
    res.render("index", { books: modifiedRows.slice(0, 200), quote });
    performance.mark("renderEnd");
[highlight]
    const renderMeasurement = performance.measure(
      "render",
      "renderStart",
      "renderEnd"
    );

    const renderDuration = renderMeasurement.duration / 1000;
    renderHistogram.observe(renderDuration);
[/highlight]
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});
```

In this code snippet, whenever a fetch API request occurs, the
`fetchRequestsCounter` is incremented using the `inc()` method to track the
total number of requests made.

To measure the fetch duration, the code retrieves relevant performance entries
associated with resource fetches and computes the duration. This duration is
then recorded using `fetchDurationHistogram.observe()`.

Additionally, the code records the time taken for modifying rows and rendering
operations with the `modifyRowsHistogram.observe()` and
`renderHistogram.observe()` methods,

After saving your changes, open your browser and visit the
`http://localhost:3000/metrics` endpoint. You'll see that additional histograms
and a counter have been included:

![Screenshot showing more metrics added to the `/metrics` endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9cc97efa-a6ac-4cec-64e3-b4a3de211b00/lg2x =3020x1892)

The `/metrics` endpoint now includes histograms tracking durations for fetch API
requests, row modifications, and rendering, alongside a counter for total fetch
requests and a histogram for data transfer sizes.

Next, conduct another load test to see these observe these metrics after
multiple requests:

```command
npx autocannon --renderStatusCodes http://localhost:3000/
```

Once the load test is complete, revisit the `http://localhost:3000/metrics`
endpoint in your browser:

![Screenshot showing updated metrics after the load test](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a1223368-0515-44c6-cb85-6b01e67fe400/lg1x =3024x1888)

With the metrics now established, the next step is to set up Prometheus to
scrape and analyze these data points.

## Step 7 — Collecting performance metrics with Prometheus

In the previous section, you instrumented your code to generate metrics, but
it's only useful if these metrics end up in a monitoring system. In this step,
you'll set up Prometheus using Docker to monitor the `/metrics` endpoint.

Start by creating a `prometheus.yml` configuration file in the root directory of
your project:

```text
[label prometheus.yml]
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: "books-app"
    scrape_interval: 5s
    static_configs:
      - targets: ["host.docker.internal:3000"]
```

The configuration sets a global scrape and evaluation interval of 15 seconds. It
includes a scrape job for Prometheus and introduces another job labeled
"books-app" targeting `host.docker.internal:3000` at a 5-second interval, which
points to localhost.

Then, configure Docker with a `docker-compose.yml` file:

```text
[label docker-compose.yml]
version: '3.7'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - "./prometheus.yml:/etc/prometheus/prometheus.yml"
```

Launch the services in the background with:

```command
docker compose up -d
```

You’ll see output indicating the successful launch of the services:

```text
[output]
[+] Running 13/13
 ✔ prometheus Pulled                                                                                                                             31.9s
   ✔ 6ce8b87a9754 Pull complete                                                                                                                   1.9s
   ✔ d2f8aae8d80e Pull complete                                                                                                                   1.8s
   ✔ 182d9d309ff1 Pull complete                                                                                                                  19.9s
   ✔ c2fa747da51f Pull complete                                                                                                                  24.3s
   ✔ f848819b7ed5 Pull complete                                                                                                                   7.3s
   ✔ 0247d5834b2a Pull complete                                                                                                                  10.4s
   ✔ ad5885e090f3 Pull complete                                                                                                                  17.4s
   ✔ db4850bb40b9 Pull complete                                                                                                                  20.2s
   ✔ 06fdf4bd78df Pull complete                                                                                                                  21.8s
   ✔ 69ee172690fb Pull complete                                                                                                                  22.3s
   ✔ 2dea29fb8931 Pull complete                                                                                                                  24.5s
   ✔ 0a8ee26210e1 Pull complete                                                                                                                  24.8s
[+] Running 2/2
 ✔ Network books-app_default         Created                                                                                                      0.0s
 ✔ Container books-app-prometheus-1  Started                                                                                                      0.2s
```

Now, open your browser and navigate to `http://localhost:9090/graph`. You should
see the Prometheus homepage as shown below:

![Screenshot of Prometheus homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/421a4087-5313-43b6-e76f-96ccea109600/lg1x =3024x1386)

To check if Prometheus is actively monitoring the endpoint, click on **Status**
followed by **Targets** in the navigation menu, as shown in the below:

![Screenshot showing where to click the "Targets" link](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c1e1e92d-fb99-42ad-bc8b-76ad690aef00/lg1x =1822x1046)

You will be taken to a page where the application endpoint is listed with the
label "UP" next to it, which indicates that Prometheus is successfully
monitoring it:

![Screenshot showing the application endpoint with an "UP" status in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6e087e9c-267b-48ac-3aee-4f6b21d4b700/lg2x =3024x1492)

Next, you can proceed to query the metrics within the Prometheus interface.

## Step 8 — Querying Metrics in Prometheus

Before analyzing the metrics, you must ensure enough data is available to work
with. Do that by running a load test that runs for five minutes:

```command
npx autocannon -d 300 --renderStatusCodes http://localhost:3000/
```

After the load test runs for about two minutes, head to `http://localhost:9090/`
in your browser.

With the necessary data collected, you'll focus on three main areas for
analysis: The total number of requests Average duration of database fetching.
The 99th percentile of database fetch durations

To start querying these metrics, go to the Prometheus homepage and use PromQL.

First, to check the total number of requests, input the query
`fetch_requests_total`. The result should appear similar to the one shown below:

![Screenshot showing the result of the query](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6ab28a11-bbfb-451f-65bc-1d7988451c00/lg1x =3012x1124)

After the load test concludes, you can calculate the average duration of
database requests using the following expression:

```text
rate(fetch_database_duration_seconds_sum[2m]) / rate(fetch_database_duration_seconds_count[2m])
```

This calculation will give you insights into the average duration, as
illustrated in this screenshot:

![Screenshot showing the result of calculating the average](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eb9529fb-2526-403d-2422-78fdd8c14900/md2x =3016x1782)

Lastly, to compute the 99th percentile (0.99 quantile) of database durations,
use this expression:

```text
histogram_quantile(0.99, rate(fetch_database_duration_seconds_bucket[2m]))
```

The result will provide the percentiles, as depicted in the following
screenshot:

![Screenshot of percentiles](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aec6bf06-1341-473e-8ac6-382941466c00/md1x =3012x1882)

## Final thoughts

This article demonstrated how to monitor a Node.js application's performance
using the Performance API. We set up tailored metrics for Prometheus and used
them for performance analysis.

With Prometheus at your disposal, you can gain insights into your application's
health from the collected metrics.

Thanks for reading, and happy monitoring!