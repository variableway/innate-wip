# Monitoring Node.js Apps with Prometheus

Monitoring your applications is crucial for maintaining infrastructure
reliability and stability. Metrics like request counts, database query times,
API request durations, and bytes sent offer valuable insights into your apps'
health and performance. By instrumenting your application to collect and
visualize these metrics, you can understand trends, measure consumption, track
error rates, and monitor performance changes. This enables you to respond
swiftly to any issues.

To instrument your application, you can use Prometheus, an open-source
monitoring and alerting tool that collects and exposes metrics. Prometheus
includes a time series database for storing these metrics and offers a query
language for dashboard visualization.

This guide will show you how to use Prometheus to monitor your system's health
and performance.

[ad-uptime]

## Prerequisites

Before diving into this tutorial, it's important to ensure you have the
following prerequisites in place:

- [Node.js installed](https://nodejs.org/en/download/package-manager) on your
  system.
- Basic knowledge of Node.js web frameworks, such as
  [Fastify](https://fastify.dev/). We will use Fastify, but you can still follow
  along if you have not used it.
- Understanding of Node.js performance hooks. For more information, refer to the
  [introduction guide](https://betterstack.com/community/guides/scaling-nodejs/performance-apis/).
- Docker and Docker Compose installed from step 3 onwards.

## Step 1 — Downloading the demo project

To demonstrate the importance of monitoring your application, we'll use a demo
project with Fastify. This application handles user login and logout with
session management and serves a list of movies from an SQLite database.

Start by cloning the repository with the following command:

```command
git clone https://github.com/betterstack-community/nodejs-prometheus-demo
```

Move into the newly created directory:

```command
cd nodejs-prometheus-demo
```

You will find the `index.js` file, which contains the following code. Soem of
the important parts of the code arein is athu

```javascript
[label index.js]
...
// In-memory user store for demo purposes
const users = {
  user1: { username: "user1", password: "password1" },
  user2: { username: "user2", password: "password2" },
};


// Handle login form submissions
fastify.post("/login", async (request, reply) => {
  const { username, password } = request.body;
  ...
});

// Handle logout
fastify.post("/logout", async (request, reply) => {
  ...
});

fastify.get("/", async (request, reply) => {
  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT title, release_date, tagline FROM movies",
    ...
    });
  });

  return rows.splice(0, 8);
});

...
```

The `POST /login` endpoint validates user credentials against an in-memory store
and handles user session data.

The `POST /logout` endpoint deletes user session data if the user is logged in;
otherwise, it returns an error message.

In a real-world application, user credentials should be stored in a database,
passwords should be hashed, and sessions should be managed using JWT, etc.

The `/` endpoint retrieves movie titles, release dates, and taglines from an
SQLite database, returning the first eight results.

Now that you understand the application you will monitor, you can install all
the dependencies. The command will also install additional tools, including
`nodemon` for automatically restarting the server upon saving and `autocannon`
for load testing:

```command
npm install
```

After the packages have been installed, launch the development server:

```command
npm run dev
```

You will see output similar to this:

```text
[output]
> nodejs-prometheus-demo@1.0.0 dev
> nodemon

[nodemon] 3.1.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
Connection with SQLite has been established
{"level":30,"time":1718533820757,"pid":14043,"hostname":"MACOOKs-MBP","msg":"Server listening at http://[::1]:3000"}
{"level":30,"time":1718533820758,"pid":14043,"hostname":"MACOOKs-MBP","msg":"Server listening at http://127.0.0.1:3000"}
server listening on 3000
```

Now, leave the server running and open a second terminal where you will input
subsequent commands. Once open, visit the `/` endpoint with curl:

```command
curl http://localhost:3000/
```

Following that, you will see the following movies:

```text
[output]
[{"title":"Avatar","release_date":"2009-12-10","tagline":"Enter the World of Pandora."},{"title":"Pirates of the Caribbean: At World's End","release_date":"2007-05-19","tagline":"At the end of the world, the adventure begins."},{"title":"Spectre","release_date":"2015-10-26","tagline":"A Plan No One Escapes"},{"title":"The Dark Knight Rises","release_date":"2012-07-16","tagline":"The Legend Ends"},{"title":"John Carter","release_date":"2012-03-07","tagline":"Lost in our world, found in another."},{"title":"Spider-Man 3","release_date":"2007-05-01","tagline":"The battle within."},{"title":"Tangled","release_date":"2010-11-24","tagline":"They're taking adventure to new lengths."},{"title":"Avengers: Age of Ultron","release_date":"2015-04-22","tagline":"A New Age Has Come."}]
```

You can log in with the details in the `users` variable:

```command
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}' \
  -c cookies.txt
```

Upon success, you will see the following success message:

```text
[output]
{"message":"Login successful","username":"user1"}%
```

You can also log out with the following command:

```command
curl -X POST http://localhost:3000/logout \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}'
```

You will see a message confirming that the logout was successful:

```text
[output]
{"message":"Logout successful"}%
```

With the application set up, proceed to the next section to instrument the
application.

## Step 2 — Understanding metrics and Prometheus

Before you start instrumenting your application, let's take a deep dive into
Prometheus and the different types of metrics it supports.

### What are Metrics and why do we collect them?

[Metrics](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/) are crucial for understanding the performance, health, and behavior of
applications, providing real-time insights into your application's inner
workings. For instance, you can track the number of requests your application
handles, the latency of these requests, the error rates, and resource
utilization like CPU and memory usage.

Imagine a web application that handles e-commerce transactions. By monitoring
metrics, you can answer various critical questions, such as how many
transactions are processed per minute and the average response time for these
transactions to ensure a smooth user experience.

Prometheus supports four main types of metrics: Counter, Gauge, Histogram, and
Summary.

A Counter is a cumulative metric that only increases over time, such as the
total number of processed transactions or the number of HTTP requests received.
For example, `http_requests_total` is a common counter metric that helps you
understand the traffic volume to your application.

A Gauge represents a value that can go up and down, like the current number of
active sessions or the amount of memory usage. An example would be
`memory_usage_bytes`, which can help you monitor how much memory your
application is consuming at any given moment, allowing you to detect and respond
to memory leaks promptly.

Histograms are useful for measuring the distribution of values, such as request
durations. They divide the observations into configurable buckets and provide
counts for each bucket, helping to identify latency patterns. For example,
`http_request_duration_seconds` can show you the distribution of request times,
helping you to pinpoint performance bottlenecks.

Summaries are similar to Histograms but provide a total count of observations
and the sum of all observed values. They are particularly useful for calculating
quantiles, which can show the 95th or 99th percentile latency. For instance, a
`request_duration_seconds` summary can give you detailed insights into the
distribution of request durations, including average and percentile values,
ensuring that most of your users experience acceptable performance levels.

### What is Prometheus?

Prometheus is a monitoring tool composed of various components that work
together to collect, store, and process metrics from applications.

The following are the three major components:

- **Client Libraries:** These are libraries available for many programming
  languages. You can use them to instrument your application and expose metrics
  on an endpoint.
- **Prometheus Server:** This scrapes the endpoints with metrics and saves the
  metrics in a time-series database. It provides a query language called PromQL,
  which you can use to query the metrics.
- **Prometheus UI:** You can query, analyze, and visualize the metrics in the
  user interface using the query language. You can also monitor the status of
  different targets or jobs.
- **Alertmanager:** This handles the management and routing of alerts that
  Prometheus triggers. You can create alerting rules with the same PromQL
  queries and forward these alerts to different receivers like Slack, Gmail,
  etc.

## Step 3 — Setting up automatic instrumentation

The easiest metrics to start with are those that your Node.js process exposes,
which include useful information such as CPU usage, memory usage, event loop
utilization, and more. These metrics already provide value without requiring
additional work, and you can forward them to Prometheus for analysis. Collecting
and exposing these metrics is known as instrumentation.

To get started, add the following code to your `index.js` file:

```javascript
[label index.js]
...
[highlight]
import metricsPlugin from "fastify-metrics";
[/highlight]

const fastify = Fastify({ logger: true });
[highlight]
await fastify.register(metricsPlugin, { endpoint: "/metrics" });
[/highlight]
...
```

In this code snippet, you configure the Fastify application to integrate the
`fastify-metrics` plugin by registering the plugin. This setup creates an
`/metrics` endpoint dedicated to exposing metrics data.

To use the plugin, install the `fastify-metrics` package:

```command
npm i fastify-metrics
```

Save the changes, and the server will automatically reload.

Then, load test the application:

```command
npx autocannon --renderStatusCodes http://localhost:3000
```

When the load testing is done, you can visit the `/metrics` endpoint:

```comamnd
curl http://localhost:3000/metrics
```

The output will look like this (edited for brevity):

```text
[output]
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 10.783692

...
# HELP nodejs_heap_space_size_available_bytes Process heap space size available from Node.js in bytes.
# TYPE nodejs_heap_space_size_available_bytes gauge
nodejs_heap_space_size_available_bytes{space="read_only"} 0
...
nodejs_heap_space_size_available_bytes{space="shared_large_object"} 0

# HELP nodejs_version_info Node.js version info.
# TYPE nodejs_version_info gauge
nodejs_version_info{version="v20.1.0",major="20",minor="1",patch="0"} 1

# HELP nodejs_gc_duration_seconds Garbage collection duration by kind, one of major, minor, incremental or weakcb.
# TYPE nodejs_gc_duration_seconds histogram
nodejs_gc_duration_seconds_bucket{le="0.001",kind="incremental"} 7
...
nodejs_gc_duration_seconds_sum{kind="minor"} 0.048222003000788397
nodejs_gc_duration_seconds_count{kind="minor"} 100

# HELP http_request_duration_seconds request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.005",method="GET",route="/",status_code="200"} 0
...
http_request_duration_seconds_count{method="GET",route="/",status_code="200"} 1605
...
```

You can also view this output in the browser:

![Prometheus Metrics in Browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa7127f2-96e7-464e-f177-319f21a91b00/public =3010x1754)

The output showcases metrics used to monitor the health and performance of a
Node.js application.

Counters like `process_cpu_user_seconds_total` track CPU usage, while gauges
like `nodejs_heap_space_size_available_bytes` show available heap memory,
helping identify memory leaks.

Histograms such as `nodejs_gc_duration_seconds` and
`http_request_duration_seconds` provide insights into garbage collection
duration and request processing times, respectively.

.

## Step 4 — Understanding Prometheus metric types

You might find that the default metrics are insufficient for your needs, so you
may want to create custom metrics.

To generate custom metrics, you need to instrument your running application with
a client library. In Node.js, you can use the
[prom-client](https://github.com/siimon/prom-client) library.

Install the `prom-client` package with the following command:

```command
npm i prom-client
```

With the client library installed, you can now instrument the code, starting
with a Counter metric.

### Counter

A counter is a metric type that increments and resets to zero on application
restart, making it suitable for tracking cumulative events or occurrences that
increase over time. Counters are ideal for monitoring values that only go up,
such as the number of requests, completed tasks, or errors. This allows you to
check the rate at which the value increases later.

In the application, you will create a counter to track the number of times the
homepage is accessed, regardless of whether the user is logged in. This will
provide insights into overall traffic and usage patterns.

In the `index.js` file, add the highlighted code below to instrument it with a
counter metric:

```javascript
[label index.js]
...
[highlight]
import { register, Counter } from "prom-client";
[/highlight]

const fastify = Fastify({ logger: true });

[highlight]
// Prometheus metrics
const requestCounter = new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route"],
  });
[/highlight]
...
fastify.get("/", async (request, reply) => {
[highlight]
  requestCounter.labels(request.method, request.routerPath).inc();
[/highlight]
  ...
  return rows.splice(0, 8);
});

fastify.listen({ port: 3000 }, (err) => {
  ...
});
```

You begin by importing `register` and `Counter` from the `prom-client` library.
Then, you define a `requestCounter` metric to count HTTP requests. The metric is
named `http_requests_total` and tracks the total number of HTTP requests, with
labels for `method` (HTTP method) and `route` (endpoint path) to categorize
metrics.

In the root endpoint `/`, you increment the counter using
`requestCounter.labels(...).inc();`, where you specify the HTTP method and the
endpoint path.

Once you have finished making the changes, save the file. `Nodemon` will
automatically restart the server.

Now, you can query the `http://localhost:3000/metrics` endpoint:

```command
curl http://localhost:3000/metrics
```

At the beginning, you will see metrics in the output that look like this:

```text
[output]
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
...
```

The output provides metrics for `http_requests_total`, a counter that tracks the
total number of HTTP requests. However, no value has been set because the
homepage was not visited since the server was restarted automatically.

Next, query the `/` endpoint:

```command
curl http://localhost:3000/
```

Then, query the `/metrics` endpoint again to check for any changes:

```command
curl http://localhost:3000/metrics
```

You will see:

```text
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/"} 1
...
```

This shows that 1 HTTP GET request has been made to the route "/." The metrics
include labels specifying the HTTP method (`GET`) and the path (`/`).

Now, send ten more requests to the `/` endpoint using the `autocannon` load
testing tool:

```command
npx autocannon --renderStatusCodes -a 10 http://localhost:3000/
```

This command runs load tests on the application with ten requests sent to the
specified homepage.

Upon running, the output will resemble the following:

```text
[output]
Running 10 requests test @ http://localhost:3000/
10 connections


┌─────────┬───────┬───────┬───────┬───────┬─────────┬──────────┬───────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg     │ Stdev    │ Max   │
├─────────┼───────┼───────┼───────┼───────┼─────────┼──────────┼───────┤
│ Latency │ 26 ms │ 54 ms │ 81 ms │ 81 ms │ 55.7 ms │ 18.01 ms │ 81 ms │
└─────────┴───────┴───────┴───────┴───────┴─────────┴──────────┴───────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┼─────────┤
│ Req/Sec   │ 10      │ 10      │ 10      │ 10      │ 10      │ 0     │ 10      │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┼─────────┤
│ Bytes/Sec │ 9.54 kB │ 9.54 kB │ 9.54 kB │ 9.54 kB │ 9.54 kB │ 0 B   │ 9.54 kB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────┴─────────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 10    │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 1

10 requests in 1.02s, 9.54 kB read
```

Now, return to the `http://localhost:3000/metrics` endpoint:

```command
curl http://localhost:3000/metrics
```

You will see that the counter has been updated to the number of requests sent by
autocannon:

```text
[output]
...
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/"} 11
```

Now you see that the total requests are now 11. The value will keep increasing
as the number of visitors increases.

### Gauge

The second metric type is a Gauge. A Gauge tracks values that can increase and
decrease, making it useful for metrics such as memory usage, the number of
active sessions, or items in a queue. Unlike a counter, a Gauge does not need to
track the rate of change.

The application supports authentication, and in a real-world scenario, it could
have hundreds of thousands of active login sessions, which can go up or down
depending on user activity. To monitor this, you will use a Gauge metric.

In the `index.js` file, add the following code:

```javascript
[label index.js]

...
[highlight]
import { register, Counter, Gauge } from "prom-client";
[/highlight]
// Prometheus metrics
const requestCounter = new Counter({
  ...
});

[highlight]
const loginUsersGauge = new Gauge({
  name: "logged_in_users",
  help: "Number of currently logged-in users",
});

[/highlight]
...
fastify.post("/login", async (request, reply) => {
  ...
  if (user && user.password === password) {
    request.session.user = { username: user.username };
[highlight]
    loginUsersGauge.inc(); // Increment gauge on successful login
[/highlight]
    return reply.send({ message: "Login successful", username: user.username });
  } else {
    return reply.status(401).send({ error: "Invalid username or password" });
  }
});

// Handle logout
fastify.post("/logout", async (request, reply) => {
  if (request.session.user) {
[highlight]
    loginUsersGauge.dec(); // Decrement gauge on logout
[/highlight]
    delete request.session.user;
    return reply.send({ message: "Logout successful" });
  } else {
    return reply.status(401).send({ error: "Not logged in" });
  }
});
...
```

Here, you import the `Gauge` class from the `prom-client` library to set up
metrics. Using this Gauge, you define a metric named "logged_in_users" to track
the users currently logged into your application. When a user successfully logs
in via the `/login` route, you increase the gauge value with
`loginUsersGauge.inc()`. Conversely, when a user logs out via the `/logout`
route, the gauge decreases with `loginUsersGauge.dec()`. This approach allows
you to see how many users are actively engaged with your application in real
time, providing valuable insights into user interaction and application usage.

With that, save the modifications, and the server should automatically restart.

To ensure a successful login, remove the `cookies.txt` file with the following
command:

```command
rm cookies.txt
```

Now, first visit the `/` endpoint so the counter can increment:

```command
curl http://localhost:3000/
```

Then log in with one user:

```command
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}' \
  -c cookies.txt
```

```text
[output]
{"message":"Login successful","username":"user1"}
```

Now check the `/metrics` endpoint:

```command
curl http://localhost:3000/metrics
```

You will see the metrics, including the updated Gauge at the beggining:

```text
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/"} 1

# HELP logged_in_users Number of currently logged-in users
# TYPE logged_in_users gauge
logged_in_users 1
...
```

This output shows that 1 HTTP GET request was made to the route "/" and 1
currently logged-in user.

Now, enter the following command to log out the user:

```command
curl -X POST http://localhost:3000/logout \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}'
```

```text
[output]
{"message":"Logout successful"}%
```

Then check the `/metrics` endpoint again:

```command
curl http://localhost:3000/metrics
```

You will see the Gauge metric updated:

```text
[output]
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/"} 1

# HELP logged_in_users Number of currently logged-in users
# TYPE logged_in_users gauge
logged_in_users 0
...
```

The number of logged-in users is 0 because no users are currently logged in. The
Gauge metric for `logged_in_users` will fluctuate up and down based on the
number of active user sessions.

### Histogram

Unlike counters that track the frequency of events, histograms offer a detailed
breakdown within defined intervals. For instance, while a counter provides a
server's total count of HTTP requests, a histogram categorizes these requests
based on response times (e.g., <10ms, 10-50ms, 50-100ms, >100ms). This breakdown
is essential for pinpointing performance bottlenecks, understanding variations
in user experience, and optimizing server response times.

In our application, you'll use a histogram to analyze the distribution of
database query durations. Instead of relying on a single average time, a
histogram divides these durations into buckets (e.g., 0-100ms, 100-200ms),
showing how many queries fall into each time range. This method helps identify
whether most queries are fast or if there are significant numbers of slower
ones.

Choosing appropriate bucket sizes is crucial for insightful histograms. For
example, if you expect database query times ranging from milliseconds to
seconds, using buckets like 0-100ms and 100-200ms provides a clearer view of the
distribution within the expected range.

To begin, open the `index.js`. Then add the following code:

```javascript
[label index.js]
[highlight]
import { register, Counter, Gauge, Histogram } from "prom-client";
import { performance } from "perf_hooks";
[/highlight]
const fastify = Fastify({ logger: true });

// Prometheus metrics
...

[highlight]
const dbQueryDurationHistogram = new Histogram({
  name: "db_query_duration_seconds",
  help: "Histogram of database query durations in seconds",
  labelNames: ["method", "route"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.075, 0.1],
});
[/highlight]

// Define a route for '/'
fastify.get("/", async (request, reply) => {
  requestCounter.labels(request.method, request.routerPath).inc();
[highlight]
  const dbQueryStart = performance.now();
[/highlight]
  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT title, release_date, tagline FROM movies", (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
 }
      resolve(rows);
 });
 });

[highlight]
  const dbQueryDuration = (performance.now() - dbQueryStart) / 1000;
  dbQueryDurationHistogram
 .labels(request.method, request.routerPath)
 .observe(dbQueryDuration);
[/highlight]
  return rows.splice(0, 8);
});
```

In this code, you import the `Histogram` module from the `prom-client` library
and the `performance` module from `perf_hooks` to track database query
durations.

You then define a histogram metric, `dbQueryDurationHistogram`, which records
the duration of database queries labeled by HTTP method and route, with bucket
ranges of 0.005, 0.01, 0.025, 0.05, 0.075, and 0.1 seconds. These buckets
provide a detailed query times distribution.

Within the root endpoint (`/`), you record the start time of the database query
using `performance.now()`. After the query, you calculate the duration by
subtracting the start time from the current time and converting it to seconds.
This duration is then recorded in the `dbQueryDurationHistogram`, labelled by
HTTP method and route. This approach allows for precise monitoring of database
query performance, enabling the identification of slow queries and potential
bottlenecks.

When you are done, save the changes, and the server will automatically restart.

Load test the application with as many requests as `autocannon` can send:

```command
npx autocannon --renderStatusCodes http://localhost:3000
```

After the load test, you will see an output indicating the number of requests
sent:

```text
[output]
Running 10s test @ http://localhost:3000
....
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 1559  │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 10

2k requests in 10.02s, 1.49 MB read628
```

This time, more requests have been sent.

Now visit the `/metrics` endpoint:

```command
curl http://localhost:3000/metrics
```

You will see output similar to the following:

```text
[output]
...
# HELP db_query_duration_seconds Histogram of database query durations in seconds
# TYPE db_query_duration_seconds histogram
db_query_duration_seconds_bucket{le="0.005",method="GET",route="/"} 0
db_query_duration_seconds_bucket{le="0.01",method="GET",route="/"} 17
db_query_duration_seconds_bucket{le="0.025",method="GET",route="/"} 190
db_query_duration_seconds_bucket{le="0.05",method="GET",route="/"} 1052
db_query_duration_seconds_bucket{le="0.075",method="GET",route="/"} 1542
db_query_duration_seconds_bucket{le="0.1",method="GET",route="/"} 1559
db_query_duration_seconds_bucket{le="+Inf",method="GET",route="/"} 1569
db_query_duration_seconds_sum{method="GET",route="/"} 70.72987211300241
db_query_duration_seconds_count{method="GET",route="/"} 1569
...
```

The output presents detailed metrics for `db_query_duration_seconds`, a
histogram showing the distribution of query durations. Most queries (1,559 out
of 1,569 tracked) completed within 0.1 seconds. The histogram buckets indicate
query counts across various time intervals, such as 17 queries under 0.01
seconds and 1,542 queries under 0.075 seconds. Overall, the queries totalled
approximately 70.73 seconds of execution time.

### Summary

Summary metrics and histograms share similarities in their aim to understand
value distributions. However, they differ in how they calculate percentiles:
summaries compute them directly on the application server, while histograms
delegate this task to the Prometheus server.

This distinction has trade-offs. Summaries offer flexibility by not requiring
predefined buckets, which is advantageous when the value range is uncertain.
However, unlike histograms, they cannot easily aggregate data across multiple
application instances, which limits their utility for analyzing system-wide
behaviour involving multiple servers.

Summaries are best suited for quick percentile or average calculations,
prioritizing speed over absolute precision. They work well for initial
explorations or when exact value distribution is optional.

In this section, you'll create a summary metric to track HTTP response sizes in
bytes. To do this, update the code in index.js as follows:

```javascript
[label index.js]
[highlight]
import { register, Counter, Gauge, Histogram, Summary } from "prom-client";
[/highlight]

...
[highlight]
const responseSizeSummary = new Summary({
  name: "http_response_size_bytes",
  help: "Summary of HTTP response sizes in bytes",
  labelNames: ["method", "route"],
});
[/highlight]

// In-memory user store for demo purposes
const users = {
  user1: { username: "user1", password: "password1" },
  user2: { username: "user2", password: "password2" },
};
[highlight]
// Middleware to track response size for '/' endpoint only
const trackResponseSize = async (request, reply, payload) => {
  if (payload && request.routerPath === "/") {
    const responseSizeBytes = JSON.stringify(payload).length;
    responseSizeSummary
      .labels(request.method, request.routerPath)
      .observe(responseSizeBytes);
  }
};

// Apply middleware to track response size
fastify.addHook("onSend", trackResponseSize);
[/highlight]
```

This code tracks the size of HTTP responses using a metric called
`responseSizeSummary`. This summary-type metric efficiently calculates
percentiles and averages. It is categorized by HTTP method and route using
labels to analyze the response size distribution for different API calls.

The code defines a middleware function named `trackResponseSize`, specifically
triggered for requests to the root path `/`. It calculates the size of the
response payload in bytes and records this value in the `responseSizeSummary`
metric. The HTTP method and route are used as labels to associate the data with
the specific request type. The middleware is attached to the Fastify instance
using the `onSend` hook, ensuring it runs after the response is sent and
captures the final payload size.

After that, load test the application:

```command
npx autocannon --renderStatusCodes http://localhost:3000
```

```text
[output]
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 1608  │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 10

2k requests in 10.02s, 1.53 MB read
```

When that finishes, query the metrics endpoint:

```command
curl http://localhost:3000/metrics
```

You will see output like:

```text
[output]
# HELP http_response_size_bytes Summary of HTTP response sizes in bytes
# TYPE http_response_size_bytes summary
http_response_size_bytes{quantile="0.01",method="GET",route="/"} 880
http_response_size_bytes{quantile="0.05",method="GET",route="/"} 880
http_response_size_bytes{quantile="0.5",method="GET",route="/"} 880
http_response_size_bytes{quantile="0.9",method="GET",route="/"} 880
http_response_size_bytes{quantile="0.95",method="GET",route="/"} 880
http_response_size_bytes{quantile="0.99",method="GET",route="/"} 880
http_response_size_bytes{quantile="0.999",method="GET",route="/"} 880
http_response_size_bytes_sum{method="GET",route="/"} 1423840
http_response_size_bytes_count{method="GET",route="/"} 1618637
```

In this example, all quantile values are identical at 880 bytes, indicating that
every GET response to the root path has the same size. This consistency suggests
either static data being served or a highly consistent response format. Given
that the `/` endpoint returns eight results and the data likely doesn't change
frequently, a uniform response size is expected. However, if the database
contained regularly updated information, response sizes and quantile values
would likely vary more, reflecting the dynamic nature of the data.

## Step 5 — Collecting performance metrics with Prometheus

So far, you have generated custom metrics and set up automatic Node.js metrics.
You have been viewing them on the endpoint, but you need to set up a Prometheus
server for effectiveness. The server will scrape the metrics at specified
intervals and store them in a time-series database, allowing you to monitor and
query them properly.

To set up Prometheus, begin by creating a `prometheus.yml` configuration file in
the root directory of your project:

```text
[label prometheus.yml]
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: "movies-app"
    scrape_interval: 5s
    static_configs:
      - targets: ["host. Docker.internal:3000"]
```

The `prometheus.yml` configuration file sets a global scrape interval of 15
seconds for Prometheus. It includes two scrape configurations: one for the
Prometheus server itself, with a 5-second scrape interval targeting
`localhost:9090`, and another for the Fastify application named "movies-app,"
also with a 5-second scrape interval, targeting `host.docker.internal:3000`.

Next, create a `docker-compose.yml` file with the following content to set up
Prometheus using Docker:

```text
[label docker-compose.yml]
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - "./prometheus.yml:/etc/prometheus/prometheus.yml"
```

This configuration sets up a Prometheus service using the `prom/prometheus`
image and maps port `9090` of the container to port `9090` on your host machine.
It also mounts the `prometheus.yml` configuration file into the container.

Launch the service and run it in the background with the following command:

```command
docker compose up -d
```

The output will look similar to the following:

```text
[output]
[+] Running 13/13
 ✔ prometheus Pulled                                                                                                                             77.3s
   ✔ 6ce8b87a9754 Pull complete                                                                                                                   8.3s
   ✔ d2f8aae8d80e Pull complete                                                                                                                   7.8s
   ...
   ✔ 9afdc6cdd365 Pull complete                                                                                                                  61.5s
   ✔ be6157533a37 Pull complete                                                                                                                  61.7s
[+] Running 2/2
 ✔ Network nodejs-prometheus-demo_default         Created                                                                                         0.0s
 ✔ Container nodejs-prometheus-demo-prometheus-1  Started                                                                                         0.3s
```

At this point, open your preferred browser and visit
`http://localhost:9090/graph` to see the Prometheus UI homepage:

![Prometheus UI Homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c169d3be-7b8a-4ad2-0b12-33d103b0cd00/lg2x =3010x1756)

Next, you need to verify that Prometheus is actively monitoring the
application's `/metrics` endpoint. To do that, click on **Status**, then click
on **Targets** in the navigation menu:

![Prometheus Target link](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/30f1eb0c-0f42-4604-4e3e-4c8082ad9000/public =1132x606)

You will be redirected to a page that shows that the application `/metrics`
endpoint is being successfully monitored by Prometheus with the label "UP" next
to it:

![Prometheus Targets page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a53059b6-510b-4783-d043-4905a195b500/orig =3024x1624)

By setting up Prometheus, you now have a powerful tool to collect and visualize
performance metrics from your Fastify application. This allows you to gain
insights into your application's behavior and performance over time, enabling
proactive monitoring and troubleshooting.

## Step 6 — Querying metrics in Prometheus

While you can generate valuable metrics, you need to query them using Prometheus
to extract meaningful insights.

Raw metrics data provides a foundational layer, but true understanding comes
from analyzing it. Prometheus' query language, PromQL, allows you to ask
specific questions about your application's performance.

In this step, you'll focus on two key metrics:

1. **Total Requests:** Indicates how many requests your application handled
   during the load test, reflecting its overall capacity.
2. **Database Fetch Latency:** Measures the average time spent fetching data
   from the database.

To gather meaningful data, run another load test for five minutes:

```command
npx autocannon -d 300 --renderStatusCodes http://localhost:3000/
```

After the load test is complete, visit `http://localhost:9090/` in your browser.

To check the total number of requests, provide the input query
`http_requests_total`. The result will be similar to this:

![Query Total Number of Requests](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/064dd0fb-2d5d-4ab1-93b2-c72e85d81700/orig =3000x1764)

You can also check the rate at which requests are increasing over the last two
minutes with:

```text
rate(http_requests_total[2m])
```

This will show you the following output when you switch to the graph tab:

![Screenshot ](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7ea197a7-d4d1-4a11-7194-19f3cf836800/orig =3024x1776)

You can also calculate the average duration of database requests using the
following expression:

```text
rate(db_query_duration_seconds_sum[3m]) / rate(db_query_duration_seconds_count[3m])
```

This query calculates the average duration over the last 3 minutes. The result
will show the average duration as follows:

![Query Average Duration](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/243fd7eb-da34-45b7-5910-ef839da42f00/lg1x =3022x1770)

To compute the 99th percentile (0.95 quantile) for database durations, use this
expression:

```text
histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[2m]))
```

The result will provide the 99th percentile for the database query durations, as
depicted in the following screenshot:

![Query 99th Percentile](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b315a4ac-c7ef-4a32-3098-294d6f8c0700/md1x =3020x1766)

## Step 7 - Setting Up alerts with Alertmanager

Now that you can query metrics to analyze the data, it's time to set up alerts.
Alerts are a critical part of your monitoring and deployment workflow as they
notify you of any critical issues.

Alertmanager is a tool that is part of the Prometheus stack. It allows you to
receive alerts from Prometheus. You create rules that trigger alerts, and
Alertmanager intercepts these alerts and sends them to configured receivers,
such as Gmail, Slack, etc.

In this section, you will configure Alertmanager to forward alerts to Gmail.

To set up Alertmanager, modify the `docker-compose.yml` file to include the
Alertmanager service:

```text
[label docker-compose.yml]
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - "./prometheus.yml:/etc/prometheus/prometheus.yml"
[highlight]
      - ./rules.yml:/etc/prometheus/rules.yml

  alertmanager:
    image: prom/alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"

    volumes:
      - ./alertmanager/alertmanager.yml:/alertmanager.yml
    command: --config.file=/alertmanager.yml --log.level=debug
[/highlight]
```

In this Docker Compose configuration, you set up the Prometheus service with
custom alerting rules by mounting a local `rules.yml` file into the container.
You also define the Alertmanager service using the `prom/alertmanager` image,
with a policy to restart unless stopped, and expose port 9093. This
configuration ensures that Prometheus can utilize specific alerting rules while
Alertmanager is ready to manage and route alerts based on those rules.

Next, you will specify the rules file for alerting rules in the `prometheus.yml`
file and configure Alertmanager:

```text
[label rules.yml]
groups:
  - name: high_request_rate_alerts
    rules:
      - alert: HighRequestRate
        expr: rate(http_requests_total[1m]) > 120
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "High rate of HTTP requests"
          description: "The rate of HTTP requests has exceeded 120 requests per minute over the last 1 minute."
```

In this configuration you define a Prometheus alerting rule group named
`high_request_rate_alerts`. Within this group, you specified a rule named
`HighRequestRate` to trigger an alert when the rate of HTTP requests exceeds 120
per minute over a 1-minute period. The alert is labeled as `critical` and
includes annotations for a summary ("High rate of HTTP requests") and a detailed
description of the alert condition.

Next, you will specify the rules file for alerting rules in the `prometheus.yml`
file and configure Alertmanager:

```text
[label prometheus.yml]
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: "movies-app"
    scrape_interval: 5s
    static_configs:
      - targets: ["host.docker.internal:3000"]

[highlight]
rule_files:
  - "/etc/prometheus/rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - "alertmanager:9093"
[/highlight]
```

In the highlighted code, you specify the location of alerting rules with
`rule_files` set to `/etc/prometheus/rules.yml` and configure Prometheus to send
alerts to Alertmanager at `alertmanager:9093`.

With this done, you are now ready to set up a receiver, which will be Gmail. To
do that, you need to configure an app password for your Gmail account so that
Alertmanager can send emails.

You can do this by visiting
[Google My Account → Security](https://myaccount.google.com/security?hl=en) and
enabling 2-Step Verification.

![Screenshot showing 2-step verification enabled](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e8262d3b-7bf2-46eb-307a-7025533ce000/orig =1682x418)

After this, locate the
[App passwords](https://myaccount.google.com/apppasswords) section and create a
new app password. Type "Alertmanager" or any name of your choice in the
resulting text field, then click the **Create** button.

![Screenshot showing the name of the app filled](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/87b3d9b3-6e7f-4905-1257-87316fd05b00/orig =1272x1286)

Now, copy the password presented in the popup dialog and save it somewhere safe,
as you won't be able to see it again.

![Screenshot of the popup dialog with the app password](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d2336ae1-5c65-4ee2-c2cd-8d4d743e8700/lg1x =1120x936)

Next, return to your text editor and create the `alertmanager/alertmanager.yml`
file with the following contents:

```text
[label alertmanager/alertmanager.yml]
global:
  resolve_timeout: 1m

route:
  group_by: ["alertname"]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h
  receiver: "gmail-notifications"

receivers:
- name: 'gmail-notifications'
  email_configs:
  - to: <example2@gmail.com>
    from: <example@gmail.com>
    smarthost: smtp.gmail.com:587
    auth_username: <example@gmail.com>
    auth_identity: <example@gmail.com>
    auth_password: <app_password>
    send_resolved: true
```

Here, replace all instances of `<example@gmail.com>` with the Gmail account that
Alertmanager should use to send emails. Update the `to` property with the
receiver's email address. If you do not have another email address, you can use
the same email address everywhere. In the `auth_password` property, replace
`<app_password>` with the app password you generated with your Google account.

With this, you can stop all the services:

```command
docker compose down
```

Now build new services and rebuild the existing ones with the following command:

```command
docker compose up -d --force-recreate --no-deps --build
```

When the services are up, visit `http://localhost:9093/#/alerts` in your
browser. You should see something like this confirming that it works.

![Screenshot of the Alertmanager working](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7924af5a-4716-4b22-e4f8-8f5418254400/lg2x =3024x1720)

Now, let's do a load test that will trigger the alert. With the application
server still running, run the following command to perform a load test for over
300 seconds:

```command
npx autocannon -d 300 --renderStatusCodes http://localhost:3000/
```

After a minute, visit `http://localhost:9090/alerts?search` to see the
Prometheus alerts. You will observe that the alert is firing:

![Screenshot of the alert firing](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/39f4b211-fd07-4f3b-0ff5-58b67c97c800/lg2x =3020x1442)

If you visit the Alertmanager interface, you will see it as well:

![Screenshot of the alert fired](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a68d7b3d-6af2-42ab-a723-17b744900100/lg1x =3024x1606)

After that, check your email, and you will see a message containing the details
that triggered the alert:

![Screenshot of the alert email](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e7cc4a1a-2ed4-44a6-f2db-d044fef6af00/md2x =1114x1052)

With this setup, you can successfully monitor your application and be notified
of any issues.

## Step 8 - Monitoring with Better Stack

Better Stack allows you to forward and store your metrics, enabling
comprehensive monitoring and analysis. By leveraging Better Stack, you can
create detailed dashboards that provide real-time insights into your
application's performance. It also supports logging, helping you stay informed
about your system's status and troubleshoot issues more effectively.

In addition, you can set up alerts to notify you of any critical issues or
performance degradations, configuring alert rules based on the metrics and logs
you are tracking. This setup with Better Stack enables you to monitor the health
of your application, quickly identify and diagnose issues, and ensure optimal
performance. It provides a comprehensive view of your system's behavior,
allowing you to maintain high availability and reliability.

See the
[Node.js demo dashboard live](https://telemetry.betterstack.com/dashboards/xnwf6j).

<iframe src="https://telemetry.betterstack.com/dashboards/xnwf6j" width="100%" height="400"></iframe>


## Final thoughts

This article walked you through monitoring a Node.js application using
Prometheus and Fastify. It covered generating custom metrics, setting up a
Prometheus server to scrape and store these metrics, and querying them with
PromQL.

For more information, refer to the
[Prometheus documentation](https://prometheus.io/). Prometheus isn't the only
monitoring tool available; you can explore OpenTelemetry and see how it compares
to Prometheus in [this guide](https://betterstack.com/community/guides/observability/opentelemetry-vs-prometheus/).
