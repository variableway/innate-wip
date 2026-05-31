# New to OpenTelemetry Metrics? Start Here

Metrics are one of the three recognized "pillars" of observability, alongside
logs and traces, which together provide a comprehensive view of your
application's health and performance.

While logs offer detailed records of events, and traces track the flow of
requests, metrics capture quantitative measurements about your system, allowing
you to understand trends, identify anomalies, and make data-driven decisions.

In this article, you'll learn the key concepts of OpenTelemetry metrics and how
to instrument your applications for effective monitoring.

Let's dive in!

[ad-logs]

## What are metrics?

Metrics are numerical representations of a system's state or behavior over time.
They are quantitative measurements collected at regular intervals and used to
track the performance, health, and behavior of various system or application
components.

For example, we have common application and resource utilization metrics such
as:

- CPU and memory usage.
- Response time (latency).
- Error rate.
- Request rate (throughput).
- Disk usage.
- Network utilization.
- Queue length.
- and many others.

The classic application of metrics is using them to plot dashboards and
implement alerts to help developers and SREs to understand how well systems are
functioning at a glance, and quickly identify and resolve issues.

![Screenshot of a Better Stack Node Exporter Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90019f35-5c3f-443a-b760-1885c598f200/md1x
=3200x1471)

## What are OpenTelemetry metrics?

OpenTelemetry metrics are a standard set of tools for collecting, aggregating,
and sending metrics data from your applications to backend monitoring systems.
It's part of the larger [OpenTelemetry project](https://betterstack.com/community/guides/observability/what-is-opentelemetry/), which
aims to standardize how you collect and manage telemetry data.

The
[design goals](https://opentelemetry.io/docs/specs/otel/metrics/#design-goals)
for metrics focus on three main objectives:

1. **Integration with other signals**. With OpenTelemetry, Metrics can be
   seamlessly correlated with other telemetry data like traces and logs. This is
   achieved through
   [exemplars](https://opentelemetry.io/docs/specs/otel/metrics/data-model/#exemplars),
   which link metrics to specific traces, and by providing consistent metadata
   using Baggage, Context, and Resource.

2. **Providing a migration path from OpenCensus** allowing users to transition
   without significant changes to their existing instrumentation.

3. **Compatibility with existing standards** like Prometheus and StatsD.
   OpenTelemetry offers clients and a Collector that can collect metrics
   instrumented in such formats to ensure a seamless integration with existing
   tools and workflows.

To get the most out of OpenTelemetry Metrics, it's helpful to understand its
underlying data model. Let's take a quick look at how it represents and manages
your metrics data.

## Exploring the metrics data model

The metrics data model is designed for flexible and efficient handling of
metrics data. It enables interoperability with existing metrics systems,
generating metrics from spans or logs, accurate translation between formats
without loss of semantics, and efficient data transformations and processing.

The OpenTelemetry Collector utilizes this model to ingest, process, and export
metrics data to various backends, including Prometheus, without losing
information.

OpenTelemetry has three models for metrics:

1. **The Event Model** which focuses on capturing raw measurements using
   Instruments and transforming them into metric streams.

2. **The Timeseries Model** which defines how backend systems store the
   collected metric data.

3. **[The OTLP Stream Model](https://betterstack.com/community/guides/observability/otlp/#the-otlp-data-model)**
   which governs how metric data streams are exchanged between the Event model
   and the Timeseries storage, ensuring consistent representation and efficient
   transmission.

This article primarily focuses on the **Event Model**, where your application
code interacts with OpenTelemetry to capture and transform metric data. By
understanding this layer, you'll gain a solid foundation for effectively
instrumenting your applications and collecting meaningful metrics.

## Understanding the metrics API

The OpenTelemetry Metrics API provides a standardized way to instrument your
application code and collect quantitative measurements about its performance and
behavior. Here's a breakdown of key concepts you need to know:

### 1. MeterProvider

The `MeterProvider` is the entry point for instrumenting your application and
collecting metrics data. You can think of it like a factory or a registry for
creating and managing `Meter` instances. It's key responsibilities are:

- Creating `Meter`s with a unique name and version.
- Associating metrics with resources which provide context about the environment
  where they're being collected.
- Configuring exporters to determine where your metrics data is sent.

Typically, a `MeterProvider` is global to a service and is expected to be
accessed from a central place. Therefore, most OpenTelemetry SDKs often provide
a way to register and access a global default `MeterProvider`:

```go
meterProvider, _ := newMeterProvider(res)

// Register as global meter provider so that it can be used via otel.Meter
// and accessed using otel.GetMeterProvider.
// Most instrumentation libraries use the global meter provider as default.
// If the global meter provider is not set then a no-op implementation
// is used, which fails to generate data.
otel.SetMeterProvider(meterProvider)
```

Here's an example of how a function that creates a `MeterProvider` in Go:

```go
func newMeterProvider(res *resource.Resource) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New()
	if err != nil {
		return nil, err
	}

	meterProvider := metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			metric.WithInterval(3*time.Second))),
	)
	return meterProvider, nil
}
```

In this example, the `MeterProvider` is set up to:

- Collect metrics data every three seconds.
- Send the collected data to standard output.
- Associate the metrics with the provided `resource.Resource`, which adds
  context such as service name and version to your metrics.

### 2. Meter

The primary function of a `Meter` is to create [instruments](#3-instrument) like
Counters, UpDownCounters, Histograms, and Gauges. You use then these instruments
to record specific [Measurements](#4-measurement) within your application.

Each `Meter` has a unique name and an optional version to help with organizing
and distinguishing your metrics, especially when you have multiple components or
libraries contributing to the overall instrumentation

A `Meter` inherits resource information from the `MeterProvider` it was created
from to ensure that all instruments created by a `Meter` are associated with the
same resource.

Once you've initialized a `MeterProvider` instance, you can create a new `Meter`
with a unique name and optional version like this:

```go
meter := meterProvider.Meter("example-meter", metric.WithInstrumentationVersion("0.1.0"))
```

### 3. Instrument

Instruments are the primary means of capturing metric data in a service. Each
instrument is designed to measure a particular metric and provide the raw data
that is then aggregated and exported to your monitoring system.

Here's a breakdown of the
[main instrument types](#understanding-the-metric-instruments) and their
purposes:

- **Counter**: Tracks values that monotonically increase, like the number of
  requests, errors, or completed tasks.
- **UpDownCounter**: Similar to a `Counter`, but the value can also decrease.
  Useful for tracking values that fluctuate, like the number of active
  connections or items in a queue.
- **Histogram**: Measures the statistical distribution of a set of values, such
  as request latency or response sizes. It groups values into buckets and counts
  how many fall into each bucket.
- **Gauge**: Captures the current value of something, like CPU usage, memory
  available, or temperature.

You create instruments using your initialized `Meter` instance:

```go
// A Counter Instrument
httpRequestsCounter, _ := meter.Int64Counter(
	"http.server.requests_total",
	metric.WithDescription("Total number of HTTP requests received."),
	metric.WithUnit("{requests}"),
)

// A Histogram Instrument
requestDurHistogram, err := meter.Float64Histogram(
	"http.request.duration",
	otelMetric.WithDescription("The duration of an HTTP request."),
	otelMetric.WithUnit("s"),
)
```

Each instrument has the following key characteristics:

- A name.
- The kind (`Counter`, `Gauge` etc) and nature (synchronous or asynchronous).
- An optional unit of measure.
- An optional description.
- Optional advisory parameters.

### 4. Measurement

A measurement is simply a single data point you record using an instrument. It's
the raw data that you feed into your instruments to track things like the number
of requests, response times, or errors.

Measurements are composed of the value that was measured, optional attributes
that provide context about the measurement, and a timestamp. The way they are
used varies depending on the instrument:

- **Counters**: Each measurement increases the counter's value.
- **UpDownCounters**: Each measurement increases or decreases the counter's
  value.
- **Histograms**: Each measurement adds a value to the histogram's distribution.
- **Gauges**: Each measurement updates the gauge's current value.

Here's an example of a measurement that increments a `Counter` instrument:

```go
httpRequestsCounter.Add(r.Context(), 1)
```

Now that you understand the core building blocks of the metrics API, let's see
how they work together in a real-world scenario.

In the next section, we'll walk through a simple example to demonstrate the
basic instrumentation workflow.

## Getting started with the metrics API

Let's see how the pieces of the OpenTelemetry Metrics API fit together in a real
application. The following Go code snippet instruments a simple web server to
count HTTP requests:

```go
package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
	otelMetric "go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

func main() {
	// 1. Create a Resource.
	res, err := newResource()
	if err != nil {
		panic(err)
	}

	// 2. Create a MeterProvider.
	meterProvider, err := newMeterProvider(res)
	if err != nil {
		panic(err)
	}

	// Handle shutdown properly so nothing leaks.
	defer func() {
		if err := meterProvider.Shutdown(context.Background()); err != nil {
			log.Println(err)
		}
	}()

	otel.SetMeterProvider(meterProvider)

	// 3. Create a Meter
	meter := meterProvider.Meter(
		"example-meter",
		otelMetric.WithInstrumentationVersion("0.1.0"),
	)

	// 4. Create a Counter Instrument
	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests_total",
		otelMetric.WithDescription("Total number of HTTP requests received."),
		otelMetric.WithUnit("{requests}"),
	)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// 5. Create a Measurement on each HTTP Request
		httpRequestsCounter.Add(r.Context(), 1)
	})

	http.ListenAndServe(":8000", mux)
}

func newResource() (*resource.Resource, error) {
	return resource.Merge(resource.Default(),
		resource.NewWithAttributes(semconv.SchemaURL,
			semconv.ServiceName("my-service"),
			semconv.ServiceVersion("0.1.0"),
		))
}

func newMeterProvider(res *resource.Resource) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New()
	if err != nil {
		return nil, err
	}

	meterProvider := metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			metric.WithInterval(3*time.Second))),
	)

	return meterProvider, nil
}
```

Here's a step-by-step breakdown of what each part does:

1. A `Resource` is created to describe the application or service sending
   telemetry data. Attributes like `ServiceName` and `ServiceVersion` identify
   this service as `my-service` version `0.1.0` which is necessary for
   distinguishing data from different services.

2. A `MeterProvider` is created with a custom configuration that collects
   metrics every three seconds and exports it to the standard output. The
   `meterProvider` is subsequently registered as the global default.

3. A `Meter` named `example-meter` is created to house instruments for this
   application. Each meter can carry a version identifier to differentiate
   metric data across versions.

4. A Counter instrument named `httpRequestsCounter` is created to keep track of
   the total number of HTTP requests received by the server.

5. When a new HTTP request is received, the `httpRequestsCounter` is incremented
   by 1 to record a new measurement.

This instrumentation will produce a metric output similar to this:

```jsonc
{
  "Resource": [. . .],
  "ScopeMetrics": [
    {
      "Scope": {
        "Name": "example-meter",
        "Version": "0.1.0",
        "SchemaURL": ""
      },
      "Metrics": [
        // A Counter metric
        {
          "Name": "http.server.requests_total",
          "Description": "Total number of HTTP requests received.",
          "Unit": "{requests}",
          "Data": {
            "DataPoints": [
              {
                "Attributes": [],
                "StartTime": "2024-10-26T20:09:37.211330188+01:00",
                "Time": "2024-10-26T20:09:43.212680907+01:00",
                "Value": 3
              }
            ],
            "Temporality": "CumulativeTemporality",
            "IsMonotonic": true
          }
        }
      ]
    }
  ]
}
```

This output shows the resource information (truncated), the meter name and
version, and the aggregated value of the `http.server.requests_total` counter.

Now that you've seen how the different components of the metrics API work
together, let's take a closer look at the available metric instruments.

## Understanding the metric instruments

OpenTelemetry offers a variety of metric instruments to capture different
aspects of your application's performance. These instruments provide the raw
data that fuels your observability efforts, allowing you to gain insights into
everything from request rates and error counts to resource usage and latency
distributions.

You've already been introduced to the available instruments in the previous
sections, but we'll dig deeper into each one here so that you'll understand when
and how to wield them effectively.

### 1. Counter and Observable Counter

![Count timeseries data model](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bb18ca2b-5305-4278-4d41-4b8098973100/md2x =1515x954)

Counters are one of the most commonly used metric types. They track either the
count or size of events, and are primarily used to monitor how frequently a
specific code path is executed.

For example, you can use counters to track the total number of:

- Exceptions encountered.
- HTTP request received.
- Processed jobs.
- Sent emails.
- Cache hits or misses.
- Failed transactions.

The primary characteristic of a `Counter` is that it is
[monotonic](https://en.wikipedia.org/wiki/Monotonic_function) (it cannot
decrease), making it ideal for tracking cumulative values. Counters are also
updated synchronously when the event happens, providing immediate updates to the
metric.

On the other hand, `ObservableCounter`s are designed for metrics that are
recorded periodically or asynchronously. Instead of recording data immediately
upon an event, asynchronous counters register a callback that periodically
updates the metric value.

This is useful for values that are computed or observed rather than directly
counted as they occur. Like regular counters, observable counters only allow
values to increase.

In OpenTelemetry, a `Counter` works by accepting a compulsory increment value
which must be non-negative along with optional attributes which are analogous to
Prometheus labels.

An `ObservableCounter`, on the other hand, expects an absolute value (not an
increment/delta). To determine the reported rate the counter is changing, the
difference between successive measurements is calculated internally.

Here's a simple implementation of both types of counters in Go:

```go
package main

import (
	"net/http"

	"go.opentelemetry.io/otel/metric"
)

func main() {
	start := time.Now()

    [highlight]
	// 1. Create a counter to track the number of HTTP requests received.
	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests_total",  // More descriptive and standard metric name
		metric.WithDescription("Total number of HTTP requests received."),
		metric.WithUnit("{requests}"),
	)
    [/highlight]
	if err != nil {
		panic(err)
	}

    [highlight]
	// 2. Create an observable counter to track application uptime
	if _, err := meter.Float64ObservableCounter(
		"uptime",
		metric.WithDescription("The duration since the application started."),
		metric.WithUnit("s"),
		metric.WithFloat64Callback(func(_ context.Context, o metric.Float64Observer) error {
			// Notice that the absolute value is what is observed here
			o.Observe(float64(time.Since(start).Seconds()))
			return nil
		}),
    [/highlight]
	); err != nil {
		panic(err)
	}

	// Instrument the HTTP handler to increment the counter for each request.
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        [highlight]
		// A counter metric expects an increment value (a.k.a delta)
		httpRequestsCounter.Add(r.Context(), 1)
        [/highlight]

		// Handle the API request...
	})
}
```

### 2. UpDownCounter and Observable UpDownCounter

An `UpDownCounter` is like a regular `Counter`, but with a twist: it can go both
up and down. This makes it perfect for tracking values that fluctuate over time
such as:

- Number of active user sessions,
- In-flight requests,
- Current memory usage,
- Current queue length,
- Open file handles.

The `ObservableUpDownCounter` is simply the asynchronous version of
`UpDownCounter`. It's useful for tracking values that might be expensive to
calculate or that come from external systems.

A good example is tracking the total number of active network connections across
a cluster of servers. Each server can report its own connection count, and these
values can be combined to get the overall total.

In the OpenTelemetry API, `UpDownCounters` work similarly to regular `Counters`,
except that their `Add()` method accepts both positive and negative values.
`ObservableUpDownCounters`, on the other hand, use an `Observe()` method to
report an absolute value, which can increase or decrease over time.

Here's how you can use both types of counters in Go:

```go
import (
	"context"
	"runtime"

	"go.opentelemetry.io/otel/metric"
)

var queueSizeCounter metric.Int64UpDownCounter // Use an UpDownCounter for the current queue size

func main() {
    [highlight]
    var err error
	queueSizeCounter, err = meter.Int64UpDownCounter(
		"queue.size",
		metric.WithDescription("Current size of the queue."),
		metric.WithUnit("{items}"),
	)
    [/highlight]
	if err != nil {
		panic(err)
	}

    [highlight]
	_ , err = meter.Int64ObservableUpDownCounter(
		"system.memory.heap_allocation",
		metric.WithDescription("Memory usage of the allocated heap objects."),
		metric.WithUnit("By"),
		metric.WithInt64Callback(
			func(ctx context.Context, o metric.Int64Observer) error {
				memoryUsage := getMemoryUsage()
				o.Observe(int64(memoryUsage))
				return nil
			},
		),
	)
    [/highlight]
	if err != nil {
		panic(err)
	}
}

func getMemoryUsage() uint64 {
	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)

	// Current memory usage in bytes
	currentMemoryUsage := memStats.HeapAlloc

	return currentMemoryUsage
}

func enqueue(items []any{}) {
	// Adds items to the queue
	queueSizeCounter.Add(context.Background(), len(items))
}

func dequeue(items []any{}) {
	// Remove items from the queue
	queueSizeCounter.Add(context.Background(), -len(items))
}
```

### 3. Gauge and Observable Gauge

In OpenTelemetry, `Gauge` and `ObservableGauge` instruments measure values that
can go up or down over time. Unlike `UpDownCounters`, which track the cumulative
change in a value, gauges capture the current value at a specific moment.

Think of things like:

- **Battery level**: It goes up when you charge it and down as you use it.
- **Network bandwidth**: The amount of data flowing through a network connection
  fluctuates constantly.
- **CPU utilization**: The percentage of CPU being used varies depending on the
  workload.

Gauges are not meant to be added together over different dimensions or time
periods. For example, summing the CPU usage of different servers wouldn't give
you a meaningful "total CPU usage".

The OpenTelemetry API for both `Gauge` and `ObservableGauge` requires you to
provide the current absolute value of the metric is provided as a compulsory
argument to the instrument along with optional attributes.

The difference is that `Gauge` should be used when the measurement cycle is
synchronous to an external change, while `ObservableGauge` should be used when
the measurement cycle is independent of external events.

In Go, an example of creating and using on `ObservableGauge` would look like
this:

```go
_, err = meter.Int64ObservableGauge(
	"system.memory.heap",
	metric.WithDescription(
		"Memory usage of the allocated heap objects.",
	),
	metric.WithUnit("By"),
	metric.WithInt64Callback(
		func(ctx context.Context, o otelMetric.Int64Observer) error {
			memoryUsage := getMemoryUsage()
			o.Observe(int64(memoryUsage))
			return nil
		},
	),
)
```

### 4. Histogram

Histograms are specialized instruments that capture the distribution of a set of
values. Imagine them as buckets of different sizes, each collecting measurements
that fall within its range. This allows you to understand not just the average
value, but also the spread of the data, including percentiles and outliers.

For example, if you're measuring how long API requests take, you might define
histogram buckets like this:

- 0-100 milliseconds
- 100-200 milliseconds
- 50-100 milliseconds
- 100-500 milliseconds
- 500+ milliseconds

Each time a request is processed, its response time is recorded, and the count
of the corresponding bucket increases. This gives you a rich picture of your
API's performance, revealing:

- What percentage of requests are fast (e.g., under 100ms).
- How many requests are experiencing high latency (e.g., over 500ms).
- The typical (median) response time.

Histograms provide valuable summaries of the data, including the minimum,
maximum, total count, and sum of the recorded values. They also show how many
values fall into each bucket. This information is often visualized as bar charts
or heatmaps to quickly identify patterns and potential issues.

In OpenTelemetry, the `Histogram` instrument has a single `Record()` method
which takes a non–negative observation value and an optional set of attributes
to be attached:

```go
func main() {
    [highlight]
	requestDurHistogram, err := meter.Float64Histogram(
		"http.request.duration",
		metric.WithDescription("The duration of an HTTP request."),
		metric.WithUnit("s"),
	)
    [/highlight]
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// do some work in an API call

		duration := time.Since(start)
        [highlight]
		requestDurHistogram.Record(r.Context(), duration.Seconds())
        [/highlight]
	})
}
```

This code produces a metric that looks like this:

```json
{
  "Name":"http.request.duration",
  "Description":"The duration of an HTTP request.",
  "Unit":"s",
  "Data":{
    "DataPoints":[
      {
        "Attributes":[],
        "StartTime":"2024-10-27T19:47:25.477241011+01:00",
        "Time":"2024-10-27T19:47:34.478340202+01:00",
        "Count":1,
        "Bounds":[0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000],
        "BucketCounts":[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Min":0.00001627,
        "Max":0.00001627,
        "Sum":0.00001627
      }
    ],
    "Temporality":"CumulativeTemporality"
  }
}
```

Notice the `Bounds` property which shows the default bucket boundaries for a
Histogram metric:

```text
[0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000]
```

These were originally chosen with durations in milliseconds in mind. However,
OpenTelemetry now recommends using seconds for durations ([via Semantic
Conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/)). This means the default
boundaries might not be the best fit for your needs, as most of your data might
end up in the first few buckets.

To ensure your histogram accurately captures the distribution of your data, you
can (and often should) customize the bucket boundaries:

```go
requestDurHistogram, err := meter.Float64Histogram(
	"http.request.duration",
	metric.WithDescription("The duration of an HTTP request."),
	metric.WithUnit("s"),
[highlight]
	metric.WithExplicitBucketBoundaries(0, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2),
[/highlight]
)
```

## Metric views and aggregations

Metric views give you fine-grained control over how your metrics are collected
and presented. They allow you to customize which metrics to capture, how to
aggregate them, and which attributes to include or discard. This customization
helps optimize data collection and tailor the granularity of your metrics to
your specific monitoring needs.

For example, in the
[Go SDK](https://pkg.go.dev/go.opentelemetry.io/otel/sdk/metric), you can use
`View` type to override instrument or attribute names, default boundaries for
histograms, or drop attributes that add noise or unnecessary cardinality.

For example, you can target the `http.server.requests_total` metric and rename
it to `http.server.total_requests` using:

```go
view := metric.NewView(metric.Instrument{
	Name: "http.server.requests_total",
	Scope: instrumentation.Scope{
		Name:    "example-meter",
		Version: "0.1.0",
	},
}, metric.Stream{Name: "http.server.total_requests"})
```

Once you register the view with
`metric.NewMeterProvider(metric.WithView(view))`, the metric name will be
updated to the provided value in the final output. This is a useful way to
transform instrument or attribute naming to fit organizational naming
conventions or make them more descriptive.

Views also allow you to customize how metrics are aggregated. The available
aggregation types include:

- **Sum**: Calculates the cumulative or delta sum of values (useful for
  counters).
- **Explicit Bucket Histogram**: Groups values into buckets for distribution
  analysis.
- **Last Value**: Keeps only the last recorded value.
- **Drop**: Discards unnecessary metrics entirely to reduce data volume.

Here's the default aggregation for each instrument type:

| Instrument                             | Default Aggregation       | Monotonic |
| -------------------------------------- | ------------------------- | --------- |
| Counter / ObservableCounter            | Sum                       | Yes       |
| UpDownCounter/ ObservableUpDownCounter | Sum                       | No        |
| Histogram                              | Explicit Bucket Histogram | No        |
| Gauge / Observable Gauge               | Last Value                | No        |

You can override these defaults using views. For example, to customize the
bucket boundaries for all histograms:

```go
view := metric.NewView(
	metric.Instrument{
		Name:  "*",
		Scope: instrumentation.Scope{Name: "example-meter"},
	},
	metric.Stream{
        [highlight]
		Aggregation: metric.AggregationExplicitBucketHistogram{
			Boundaries: []float64{0, 20, 50, 100, 200, 500, 1000},
		},
        [/highlight]
	},
)
```

Or you can drop a metric entirely by changing the aggregation type to `Drop`:

```go
view := metric.NewView(
	metric.Instrument{
		Name:  "latency",
		Scope: instrumentation.Scope{Name: "http"},
	},
	metric.Stream{Aggregation: metric.AggregationDrop{}},
)
```

## Exporting metrics

While instruments are great at capturing measurements, the sheer volume of data
they generate, especially from synchronous instruments, can easily overwhelm
metric pipelines. OpenTelemetry tackles this challenge with a multi-stage export
process:

### 1. Aggregation and views

Every instrument is linked to an aggregating view (or assigned a default view if
none is explicitly defined). This view specifies how the raw measurements should
be aggregated, filtered, and transformed before being exported.

### 2. Metric reader

The `MetricReader` observes the aggregated data from instruments. It handles
attaching default views and can change the temporality of metrics (from
cumulative to delta).

A common approach is to use a `PeriodicReader` that collects and exports metric
data to the exporter at a defined interval (60 seconds by default).

```go
metric.WithReader(metric.NewPeriodicReader(metricExporter,
	// Default is 1m. Set to 3s for demonstrative purposes.
	metric.WithInterval(3*time.Second))),
)
```

### 3. Metric exporter

The `MetricExporter` sends the processed metric data directly to an
Observability backend or the OpenTelemetry Collector which can further process
and export the data. Some common exporters are:

- **Stdout**: Outputs metrics to the console for debugging or testing.
- **OTLP**: Sends metrics to any system supporting the OpenTelemetry Protocol
  over gPRC or HTTP.
- **Prometheus**: Allows Prometheus to scrape metrics (pull) or sends metrics
  via Prometheus remote write protocol (push).

```go
metricExporter, _ := stdoutmetric.New()
```

## Final thoughts

You've covered a lot in this guide, and you should now have a good understanding
of OpenTelemetry's metrics API and its role in monitoring applications
effectively.

By mastering the different instrument types and understanding how to configure
views and exporters, you'll be well-equipped to start collecting and analyzing
valuable performance data from your applications.

To go further, consider exploring
[OpenTelemetry's official documentation](https://opentelemetry.io/docs/specs/otel/metrics/)
for more advanced features and configuration options. The
[OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=go)
is also a great resource for finding various integrations and libraries for
extending your observability setup with popular frameworks and platforms.

If you're looking for a robust and cost-effective OpenTelemetry backend to
store, monitor, and visualize your metrics, check out
[Better Stack](https://betterstack.com/).

As you implement OpenTelemetry metrics, remember to thoroughly test and validate
your instrumentation to ensure accurate and meaningful data capture.

Thanks for reading, and happy monitoring!
