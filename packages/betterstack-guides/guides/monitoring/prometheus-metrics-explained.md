# A Practical Guide to Prometheus Metric Types

<iframe width="100%" height="315" src="https://www.youtube.com/embed/jN9YpPOom3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Prometheus metrics are numerical representations of the state or behavior of a
system that are collected over time to enable monitoring and alerting.

These metrics are stored as
[time-series data](https://en.wikipedia.org/wiki/Time_series), meaning that each
metric is associated with a timestamp and can be queried to analyze changes and
trends.

Metrics are typically exposed by applications on HTTP endpoints (typically
`/metrics`), and scraped periodically by Prometheus. This pull-based model
ensures that Prometheus has control over data collection frequency and
consistency.

![Prometheus metric types](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/26fb0099-3af5-40e8-5b55-cfc110bf8b00/lg2x
=3348x1334)

Prometheus offers four core metric types to capture diverse system behaviors:

1. **Counters** for tracking ever-increasing values, like the total number of
   exceptions thrown.
2. **Gauges** for measuring fluctuating values, such as current CPU usage.
3. **Histograms** for observing the distribution of values within predefined
   buckets.
4. **Summaries** for calculating quantiles (percentiles) of observed values.

Each metric can be enriched with labels, which are key-value pairs that allow
you to distinguish metrics by attributes like HTTP method, response code, or
server region.

By pairing metrics with visualization and alerting tools, you can quickly see
how well your systems are functioning at a glance, and get alerted when an issue
arises.

![Screenshot of a Better Stack Node Exporter Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90019f35-5c3f-443a-b760-1885c598f200/md1x
=3200x1471)

In this article, we'll explore the significance of Prometheus metrics in detail
and discuss how use them to monitor, visualize, and alert on the performance of
your services and infrastructure.

Let's dive right in.

[ad-logs]

## Understanding the Prometheus data model

Each time series in Prometheus has a unique fingerprint composed of:

- **Name**: A descriptive name like `http_requests_total` or
  `cpu_usage_seconds_total`
  ([see naming guidelines here](https://prometheus.io/docs/practices/naming/)).
- **Labels**: Key-value pairs that provide context and allow you to filter and
  aggregate data across multiple dimensions.
- **Timestamp**: The time at which the data point was collected.
- **Value**: The actual numerical value of the metric at that timestamp.

To use metrics in Prometheus, you need to instrument your code to record a value
whenever the event you're tracking occurs, and use [PromQL](https://betterstack.com/community/guides/monitoring/promql/) to analyze, visualize,
and set alerts on your collected metrics.

Let's go right ahead and explore each metric type in detail with practical use
cases to help you understand their applications.

## The Counter

In Prometheus, a Counter represents a single, cumulative value that can only
[monotonically increase over time](https://en.wikipedia.org/wiki/Monotonic_function),
except when it resets to zero.

You can think of a counter metric like a running tally that never decreases. It
tracks the total count of something, such as the number of HTTP requests
received by a service.

Each new request increases the counter, providing a cumulative record of all
requests ever received, and this ever-growing count helps you understand the
overall volume of activity over time.

Let's illustrate how it works with a JavaScript example:

```javascript
[label server.js]
import express from "express";
import promClient from "prom-client";

const app = express();

// 1. Create a counter to track the total number of HTTP requests
const httpRequestsCounter = new promClient.Counter({
	name: "http_requests_total",
	help: "Total number of HTTP requests received",
	labelNames: ["method", "route", "status"], // Labels add dimensions for querying the metric
});

// 2. Middleware to instrument HTTP requests
app.use((req, res, next) => {
	// Increment the counter for each request
	res.on("finish", () => {
		httpRequestsCounter
			.labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
			.inc();
	});
	next();
});
```

The `promClient.Counter()` method defines the `http_requests_total` metric for
tracking the total number of incoming HTTP requests. A description is provided
via the `help` property, and the `labelNames` property allows the metric to be
grouped by
[dimensions](https://betterstack.com/community/guides/observability/high-cardinality-observability/)
for later querying.

To increment the counter each time a request is received to any route, it is
placed within a middleware function that is executed on each request, associated
with the appropriate label values, and incremented with the `inc()` method.

This produces a `http_requests_total` metric that looks like this when you visit
your metrics endpoint:

```text
# HELP http_requests_total Total number of HTTP requests received
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/metrics",status="200"} 3
http_requests_total{method="GET",route="/docs",status="404"} 1
http_requests_total{method="POST",route="/user/create",status="200"} 2
http_requests_total{method="GET",route="/",status="200"} 4
```

You can also increment counters by more than 1, which is useful for counting
aggregated values, or if the rate of change is more than 1:

```javascript
counter.inc(5) // defaults to 1 if unspecified
```

Once a counter metric is being scraped by Prometheus, you can enter its name
into the expression input field and execute the query:

![Screenshot of the http_requests_total metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95f1863a-97e7-4262-9910-cd3afdb17a00/md1x
=1186x585)

If you switch to the graph tab, you'll notice that the counter continues to
increase. It will always continue this way as long as the server is processing
HTTP requests.

![The cumulative total of a metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/df30d7d2-6177-4427-9a2c-36cf4cf17a00/orig
=1721x1138)

The cumulative total number of a metric is usually not very interesting. It's
often more useful to see the total increase in a counter metric's value over a
specific time period (such as the last five minutes). You can do this with
`increase()`:

```text
increase(http_requests_total[5m])
```

![The increase() function in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c0304255-8571-4bdc-b480-322be8bcb700/lg2x
=1190x560)

Prometheus doesn't always have data points perfectly aligned with the start and
end of your time window. It often needs to extrapolate the values at the
boundaries which can lead to the fractional results shown above.

Another useful way to query counters is to find the rate at which they increase.
This allows you to see how quickly events are happening over time, which is
often more informative than just the raw count.

```text
rate(http_requests_total[5m])
```

![The rate of the HTTP metric](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3b453872-daa2-4a83-e610-9baf09dcb500/md2x
=3260x2034)

This graph clearly shows how the metric has changed over the past five minutes.
Initially, the requests held steady, then experienced a sudden drop of 50%.
Following a brief recovery, the requests began a consistent decline once again.

With either function, you can use labels to isolate the specific attributes
you're interested in:

```text
rate(http_requests_total{status="500"}[1h])
```

```text
increase(http_requests_total{route="/login"}[15m])
```

You can also query counters with PromQL aggregators (like `sum()`, `avg()`,
`max()`) to analyze counters across multiple instances or labels, such as
viewing the top routes by request count over a given period:

```text
topk(5, sum(http_requests_total[10m]) by (route))
```

![The top 5 routes by request count in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/68cb3f18-2e89-4883-0d49-7b9f1e9d2700/lg2x
=1051x666)

Since counters inherently increase, alerts should focus on significant changes
in their rate of increase such as:

- Unexpected drops in the rate of processed jobs in a queue which might indicate
  an issue with a scheduled task.
- Sudden spikes in error rates, especially when it exceeds your error budget.
- When the rate of transaction failures exceeds a safe threshold.

Let's look at the `Gauge` metric next.

## The Gauge

Gauges offer a snapshot of a system's current state. Unlike counters, where the
rate of change is what you care about, gauges focus on the present value, which
can fluctuate up and down.

You can think of it like the battery level on your phone or laptop which
decreases with use and increases when charged.

Gauges are ideal for tracking things like:

- The number of logged-in users.
- The conversion rate of a desired action.
- Current CPU or memory usage of a process.
- The size of a job queue or pending tasks

In your instrumentation, you have three primary ways to interact with a gauge
metric. You can nudge it up and down with `inc()` and `dec()` respectively:

```javascript
[label server.js]
// 1. Create a gauge to track the current number of active connections
const activeConnectionsGauge = new promClient.Gauge({
    name: "http_active_connections",
    help: "Current number of active HTTP connections",
});

app.use((req, res, next) => {
    // Increment the gauge when a request starts
[highlight]
    activeConnectionsGauge.inc();
[/highlight]

    // Decrement the gauge when the request finishes
    res.on("finish", () => {
[highlight]
        activeConnectionsGauge.dec();
[/highlight]
    });
    next();
});
```

Or you can set it manually to an exact value with `set()`:

```javascript
[label server.js]
import express from "express";
import promClient from "prom-client";

const app = express();
const PORT = 3000;

const register = new promClient.Registry();

// Create a gauge to track memory usage
const memoryUsageGauge = new promClient.Gauge({
  name: 'node_memory_usage_bytes',
  help: 'Memory usage of the Node.js process in bytes',
  labelNames: ['type'],
});

// Register the gauge with the Prometheus registry
register.registerMetric(memoryUsageGauge);

// Function to update the memory usage gauge
const updateMemoryMetrics = () => {
  const memoryUsage = process.memoryUsage();
[highlight]
  memoryUsageGauge.set({ type: 'rss' }, memoryUsage.rss); // Resident Set Size
  memoryUsageGauge.set({ type: 'heapTotal' }, memoryUsage.heapTotal); // Total heap size
  memoryUsageGauge.set({ type: 'heapUsed' }, memoryUsage.heapUsed); // Used heap size
  memoryUsageGauge.set({ type: 'external' }, memoryUsage.external); // External memory
[/highlight]
};

// Update memory metrics every 5 seconds
setInterval(updateMemoryMetrics, 5000);
```

Either way, you'll get a gauge metric that looks like this:

```text
[output]
# HELP http_server_active_connections Current number of active HTTP connections
# TYPE http_server_active_connections gauge
http_server_active_connections 15

# HELP node_memory_usage_bytes Memory usage of the Node.js process in bytes
# TYPE node_memory_usage_bytes gauge
node_memory_usage_bytes{type="rss"} 52428800
node_memory_usage_bytes{type="heapTotal"} 21495808
node_memory_usage_bytes{type="heapUsed"} 12582912
node_memory_usage_bytes{type="external"} 1048576
```

The output above indicates that there are currently 15 active HTTP connections
to the server and provides a breakdown of the current memory usage by type. The
values are already meaningful so you don't need to do any further work besides
interpret them correctly in their respective context.

In the Prometheus interface, you can query a gauge metric to see the recorded
values over time which is usually what you're most interested in:

![Example of a gauge metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/86fbf243-c32b-40c8-3f39-4253d5880c00/md1x
=1769x1211)

PromQL also provides several other functions for working with gauges. For
example, you can visualize historical trends by using the `avg_over_time()`
function:

```text
avg_over_time(node_memory_usage_bytes[5m])
```

![Average over time of a gauge metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9fa74685-4e2e-4cfa-48e9-141f017ff000/md2x
=1769x1211)

You can also reveal the highest and lowest values of the gauge recorded over a
time period with `max_over_time()` and `min_over_time()` respectively.

```text
max_over_time(http_server_active_connections[1d])
```

```text
min_over_time(http_server_active_connections[1d])
```

There's also `quantile_over_time()` which provides a statistical view of your
data to help you understand its distribution and focus on specific parts of it.

For example, you can query the 0.95 quantile (95th percentile) memory usage over
the last five minutes with:

```text
quantile_over_time(0.95, node_memory_usage_bytes[5m])
```

Or you can compute the median value to understand typical behavior without being
skewed by extreme outliers:

```text
quantile_over_time(0.50, node_memory_usage_bytes[5m])
```

One thing to note with gauges is that they can be affected by Prometheus'
scraping interval. Since Prometheus only captures snapshots of the metric at
each scrape, rapid fluctuations in gauge values might be missed.

For example, if your application's memory usage spikes briefly between scrapes.
Prometheus might only record the lower values before and after the spike which
could be misleading when looking at your metric charts.

## The Histogram

The Histogram metric is a powerful way to understand the distribution of values
in your measurements. It works by dividing a range of values, such as HTTP
response times, into predefined "buckets" and counting how many observations
fall into each bucket.

For instance, histograms enable you to track the 95th or 99th percentile to
identify outlier requests that disproportionately impact load times.

By addressing these slowest requests, you can ensure that even the most delayed
elements load within an acceptable timeframe, improving overall user experience.

Here's how to instrument a histogram metric in JavaScript:

```javascript
[label server.js]
// Create a histogram to track request durations
const httpRequestDurationHistogram = new promClient.Histogram({
    name: "http_request_duration_seconds",
    help: "Histogram of HTTP request durations in seconds",
});

app.use((req, res, next) => {
    const end = httpRequestDurationHistogram.startTimer(); // Start the timer

    res.on("finish", () => {
        end(); // Stop the timer and record the duration
    });

    next();
});
```

Or you can use the `observe()` method:

```javascript
const httpRequestDurationHistogram = new promClient.Histogram({
    name: "http_request_duration_seconds",
    help: "Histogram of HTTP request durations in seconds",
});

app.use((req, res, next) => {
    const start = performance.now(); // Start high-resolution timer

    res.on("finish", () => {
        const elapsedTime = (performance.now() - start) / 1000; // Calculate elapsed time
[highlight]
        httpRequestDurationHistogram.observe(elapsedTime);
[/highlight]
    });

    next();
});
```

Either way, you'll get an `http_request_duration_seconds` metric that looks like
this:

```text
# HELP http_request_duration_seconds Histogram of HTTP request durations in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.005"} 11
http_request_duration_seconds_bucket{le="0.01"} 11
http_request_duration_seconds_bucket{le="0.025"} 11
http_request_duration_seconds_bucket{le="0.05"} 11
http_request_duration_seconds_bucket{le="0.1"} 11
http_request_duration_seconds_bucket{le="0.25"} 35
http_request_duration_seconds_bucket{le="0.5"} 77
http_request_duration_seconds_bucket{le="1"} 77
http_request_duration_seconds_bucket{le="2.5"} 77
http_request_duration_seconds_bucket{le="5"} 77
http_request_duration_seconds_bucket{le="10"} 77
http_request_duration_seconds_bucket{le="+Inf"} 77
http_request_duration_seconds_sum 19.730312268000002
http_request_duration_seconds_count 77
```

![Screenshot of basic histogram metric query in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f4110de3-8a96-48c0-1804-cd661aa63d00/public
=1769x956)

A histogram metric consists of the following three components:

1. Several buckets, which are exposed as counters with a `_bucket` suffix in the
   metric name. These buckets have a `le` (less than or equal) label that
   specifies the upper bound of the bucket.

2. A counter that accumulates the sum of all observed values (represented by the
   `_sum` suffix).

3. A counter that tracks the total number of recorded observations (represented
   by a `_count` suffix)

The above tells us that 77 requests were measured in total
(`http_request_duration_seconds_count`), with a combined duration of 19.73
seconds (`http_request_duration_seconds_sum`).

The buckets show the distribution of these requests: 11 requests took less than
or equal to 0.25 seconds, 35 took less than or equal to 0.5 seconds, and the
remaining 31 took longer, with the majority falling below 1 second.

You will notice that the default buckets for a Histogram metric range from 5
milliseconds to 10 seconds to capture typical web application latencies. It also
includes `+Inf` to ensure that all values are captured, including those that
exceed the largest bucket:

```text
[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, +Inf]
```

However, you can customize these buckets if needed. Note that if your buckets
are too small or too large, they won't accurately capture the distribution of
your data.

```javascript
const httpRequestDurationHistogram = new promClient.Histogram({
	name: "http_request_duration_seconds",
	help: "Histogram of HTTP request durations in seconds",
[highlight]
    buckets: [0.1, 0.5, 1, 2.5, 5, 10], // Define the bucket ranges
[/highlight]
});
```

With PromQL, you can run several types of queries on Prometheus histograms to
gain insights into the distribution of your data.

Since each individual `_bucket`, `_sum`, and `_count` metric are all counters,
you can use any PromQL function that works with counters such as `rate()` or
`increase()`:

```text
rate(http_request_duration_seconds_bucket[1m]) / rate(http_request_duration_seconds_bucket[1m])
```

More importantly though, the `histogram_quantile()` function can calculate
quantiles from histograms or even aggregations of histograms. For example, you
can estimate the 95th percentile (0.95 quantile) of request durations over the
last five minutes with:

```text
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

This tells you the value below which 95% of the request durations fall:

![Using histogram_quantile to inspect buckets](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e55ec47e-9681-4c8e-030c-31680b11e500/public
=2069x1147)

These are just a few examples of how you can query histogram metrics with
Prometheus. You can combine these functions and use labels to create more
complex queries aggregated across multiple dimensions.

Just be aware that calculating quantiles from histograms can be
computationally-intensive. To address this, Prometheus provides
[recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/),
which allow you to pre-calculate common percentiles for improved query
performance.

Also, keep in mind that calculating a percentile is not meaningful with fewer
than 100 samples. It's best to work with a large sample size to ensure
statistical significance and reduce the impact of outliers.

### A brief note on native histograms

Prometheus v2.40 introduced experimental support for
[native histograms](https://promcon.io/2022-munich/talks/native-histograms-in-prometheus/).
Unlike the classic histograms discussed above, a native histogram represent data
using a single time series.

It dynamically adjusts the number of buckets while also recording the sum and
count of observations, providing significantly higher resolution with far
greater efficiency in query performance and resource usage.

As of the v3.0 release, native Histograms are still experimental and not yet
enabled by default. To use this feature, you'll need to start Prometheus with
the `--enable-feature=native-histograms` flag.

## The Summary

Summaries are similar to histograms in that they track the distribution of
observations, like request latency or response sizes. The major difference is
that summaries calculate and expose quantiles directly on the client side, while
histograms calculate quantiles on the server side with the
`histogram_quantile()` function.

For instance, when monitoring a database query, you can use a summary to track
the 95th percentile of query execution times. If the 95th percentile is 150ms,
95% of the queries were completed in less than 150ms, while the remaining 5%
took longer.

Instrumenting a summary metric is similar to a histogram. Its primary method is
`observe()`, to which you pass the size of the event:

```javascript
[label server.js]
const apiRequestDurationSummary = new promClient.Summary({
	name: "api_request_duration_seconds",
	help: "Summary of API request durations in seconds",
	labelNames: ["url"],
});

const observer = new PerformanceObserver((list) => {
	for (const entry of list.getEntries()) {
		if (entry.initiatorType === "fetch") {
[highlight]
			apiRequestDurationSummary
				.labels(entry.name)
				.observe(entry.duration / 1000);
[/highlight]
		}
	}

	performance.clearResourceTimings();
});

observer.observe({ entryTypes: ["resource"] });
```

In the above snippet, the `api_request_duration_seconds` metric tracks request
duration metrics recorded in the Node.js performance timeline. It specifically
focuses on values recorded into the timeline by the `fetch()` API and observes
each reported duration as it is entered while associating the URL as a label for
later filtering.

The result is a summary metric that looks like this:

```text
# HELP api_request_duration_seconds Summary of API request durations in seconds
# TYPE api_request_duration_seconds summary
api_request_duration_seconds{quantile="0.01",url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds{quantile="0.05",url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds{quantile="0.5",url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds{quantile="0.9",url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds{quantile="0.95",url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds{quantile="0.99",url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds{quantile="0.999",url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds_sum{url="https://jsonplaceholder.typicode.com/posts"} 0.5889730749999998
api_request_duration_seconds_count{url="https://jsonplaceholder.typicode.com/posts"} 1

api_request_duration_seconds{quantile="0.01",url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds{quantile="0.05",url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds{quantile="0.5",url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds{quantile="0.9",url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds{quantile="0.95",url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds{quantile="0.99",url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds{quantile="0.999",url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds_sum{url="https://covid-api.com/api/reports/total"} 1.8197589250000001
api_request_duration_seconds_count{url="https://covid-api.com/api/reports/total"} 1

api_request_duration_seconds{quantile="0.01",url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds{quantile="0.05",url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds{quantile="0.5",url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds{quantile="0.9",url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds{quantile="0.95",url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds{quantile="0.99",url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds{quantile="0.999",url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds_sum{url="https://ipinfo.io/json"} 0.45094010100000015
api_request_duration_seconds_count{url="https://ipinfo.io/json"} 1
```

Like histograms, summaries capture the distribution of the recorded values. In
addition to the total number of observations (`_count`) and the sum of all
observed values (`_sum`), they also calculate quantiles over a sliding time
window.

For example, the 0.9-quantile indicates that 90% of the observed requests to
`https://jsonplaceholder.typicode.com/posts` completed in less than 0.501
seconds, while the same quantile `https://covid-api.com/api/reports/total` is
1.819 seconds.

The default quantiles include `0.01`, `0.05`, `0.5`, `0.9`, `0.95`, `0.99`, and
`0.999`. However, you can customize these with a `percentiles` array:

```javascript
const apiRequestDurationSummary = new promClient.Summary({
	name: "api_request_duration_seconds",
	help: "Summary of API request durations in seconds",
[highlight]
    percentiles: [0.01, 0.1, 0.9, 0.99],
[/highlight]
	labelNames: ["url"],
});
```

Generally, you don't want latency metrics to reflect the entire runtime of an
application but rather focus on a meaningful time interval. To achieve this, a
configurable sliding window is often used:

```javascript
const apiRequestDurationSummary = new promClient.Summary({
	name: "api_request_duration_seconds",
	help: "Summary of API request durations in seconds",
	labelNames: ["url"],
[highlight]
    maxAgeSeconds: 600, // 10 minutes
    ageBuckets: 5,
[/highlight]
});
```

The `maxAgeSeconds` option defines how long a bucket can retain data before it
resets, while `ageBuckets` determines the number of buckets within the sliding
window. Together, these properties ensure your data remains relevant and
reflects recent performance.

In PromQL, the most useful way to query a summary metric is by directly
accessing the precomputed quantiles, such as the median (50th percentile) or the
95th percentile. You can then set alerts to trigger if a specific quantile
exceeds a certain threshold.

```text
api_request_duration_seconds{quantile="0.95"}
```

![Querying summary metrics in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eaa5916b-b249-4616-ae45-cf10c48a0400/lg1x
=2069x1206)

You can also calculate the per-second rate of change of the 99th percentile over
a time period with:

```text
rate(api_request_duration_seconds{quantile="0.99"}[5m])
```

Although you cannot aggregate quantiles from different instances, you can use
the `sum()` and `count()` functions to calculate the total number of
observations and their cumulative sum across all instances. This allows you to
analyze trends and compute averages across a distributed system.

## When to use histograms and when to use summaries

Histograms are generally preferred in most monitoring scenarios for their
flexibility and ability to aggregate data.

Summaries, on the other hand, shine best when you need more accurate percentiles
or when averages are sufficient for your analysis.

The table below summarizes the differences between the two metric types:

| Aspect                           | Histograms                                                   | Summaries                                                     |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| **Quantile calculation**         | On the server side with `histogram_quantile()`               | On the client side, precomputed and exposed                   |
| **Aggregation across instances** | Supported with PromQL (e.g., `sum(rate(...))`)               | Not aggregatable, aggregation may produce invalid results     |
| **Flexibility**                  | Allows ad-hoc quantile calculation and time range adjustment | Requires preconfigured quantiles and time window              |
| **Performance**                  | Lightweight client-side; server processes quantiles          | Higher client-side cost due to streaming quantile calculation |
| **Error margin**                 | Determined by bucket size                                    | Configurable in terms of quantile accuracy                    |

In general, use histograms when:

- You need to aggregate quantiles across multiple instances.
- You want the flexibility to calculate different quantiles or use different
  time windows later on.
- You are monitoring system-wide Service Level Objectives (SLOs).

Use summaries when:

- You are monitoring a single instance or service.
- You need high precision for specific quantiles with low server-side overhead.
- Aggregation is not required or practical.

**Learn more**: [8 Prometheus Best Practices](https://betterstack.com/community/guides/monitoring/prometheus-best-practices/)

## Collecting and visualizing Prometheus metrics with Better Stack

Prometheus is a powerful monitoring tool, but it can struggle to keep up as your
systems grow.

It traditionally runs on a single server, collecting data from various
endpoints. When you have many services, this central server can become
overwhelmed.

Organizations often turn to solutions like federated architectures or external
databases to overcome this, but it adds more complexity and can be quite costly
to manage.

[Better Stack](https://betterstack.com/) offers a simpler, more scalable
approach that makes it easy to gain insights into your systems without the
headaches of scaling and managing your own Prometheus infrastructure.

For the cost of a fancy coffee, you can have Better Stack manage a billion data
points for you, visualize them in low-latency dashboards, and alert you when
things go wrong. Self-hosting Prometheus just doesn't make sense anymore.

[Give it a try today](https://betterstack.com/users/sign-up) with a completely
free account, which includes 2 billion ingested metric data points with a 30-day
retention.

Thanks for reading, and happy monitoring!