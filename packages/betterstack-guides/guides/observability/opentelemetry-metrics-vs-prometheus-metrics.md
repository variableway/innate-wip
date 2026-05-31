# A Deep Dive into OpenTelemetry and Prometheus Metrics

[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) has long been the go-to solution for instrumenting, collecting, and
analyzing application and infrastructure metrics with its mature and widely
adopted ecosystem.

Meanwhile, OpenTelemetry has evolved from its initial focus on distributed
tracing, to supporting metrics and logs. It now aims to provide a unified
framework for collecting and correlating telemetry data in distributed systems.

In this article, we'll explores the key differences, strengths, and trade-offs
between OpenTelemetry and Prometheus as far as metric instrumentation and
collection is concerned.

Whether you're starting from scratch on a greenfield project or evaluating the
future trajectory of metrics in your organization, understanding these two
ecosystems will help you make an informed decision for generating and managing
metrics in your applications and infrastructure.

Let's dive in!

[ad-logs]

## OpenTelemetry vs Prometheus: Scope differences

![OpenTelemetry vs Prometheus Scope](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/06ee77eb-c695-45fc-0c05-bb003347ec00/lg2x =2536x676)

While both OpenTelemetry and Prometheus play crucial roles in [achieving
observability](https://betterstack.com/community/guides/observability/what-is-observability/), they approach this goal from different
angles.

At its core, OpenTelemetry is a vendor-neutral instrumentation framework for
collecting, transforming, and exporting metrics (as well as logs and traces) in
a standardized format.

However, it doesn't provide storage or visualization capabilities. You'll need
to pair it with a backend platform for these functions.

By concentrating solely on the instrumentation and collection layer,
OpenTelemetry decouples the generation of observability data from its storage
and analysis.

This means that you can instrument your services with the [OpenTelemetry
SDK](https://betterstack.com/community/guides/observability/opentelemetry-sdk/), collect and process the data with the [OpenTelemetry
Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/), and forward it to any OTLP-compatible
observability tool of your choice.

Prometheus, on the other hand, is a comprehensive metrics-based monitoring
system that goes beyond instrumentation. It offers storage, querying,
visualization, and alerting, all integrated into its ecosystem.

Its key features include:

- A time-series database optimized for metrics storage.
- [PromQL](https://betterstack.com/community/guides/monitoring/promql/), a powerful query language for analyzing metrics.
- Built-in alerting capabilities.
- Basic visualization tools.

Prometheus' text-based metrics format has become the de facto standard in the
monitoring ecosystem. Many tools, such as Kubernetes, natively support it, and a
large number of exporters bridges compatibility gaps for systems that do not.

While Prometheus has been deeply entrenched in the monitoring ecosystem for a
long time, OpenTelemetry has gained momentum since its stabilization in 2022.

Interestingly, OpenTelemetry metrics often end up being stored and queried in a
Prometheus itself, thanks to features like
[Prometheus normalization](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/translator/prometheus#full-normalization)
in the OpenTelemetry Collector.

Let's look the core differences in how they instrument and process metrics next.

## Comparing OpenTelemetry metrics and Prometheus metrics

In Prometheus, metrics are stored as dimensional data, where each metric has a
name, a timestamp, and a value. Metrics can also have labels (key/value pairs)
that add dimensions, so you can filter and aggregate data based on these labels.

It also uses a text-based exposition format, which is human-readable and easy to
scrape via HTTP:

```text
# HELP http_requests_total The total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET", status="200"} 1027
http_requests_total{method="POST", status="201"} 15

# HELP http_request_duration_seconds The HTTP request latencies in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 2400
http_request_duration_seconds_bucket{le="0.2"} 5000
http_request_duration_seconds_bucket{le="0.5"} 8000
http_request_duration_seconds_bucket{le="1.0"} 10000
http_request_duration_seconds_bucket{le="+Inf"} 12000
http_request_duration_seconds_sum 329.45
http_request_duration_seconds_count 12000

# HELP memory_usage_bytes Memory usage in bytes
# TYPE memory_usage_bytes gauge
memory_usage_bytes{application="app1"} 256000000
memory_usage_bytes{application="app2"} 128000000
```

In Prometheus, you have four metric types, which are

1. **Counters** for counting ever-increasing values,
2. **Gauges** for tracking fluctuating values,
3. **Histograms** for tracking the distribution of measurements,
4. And **Summaries** for pre-computing percentiles and quantiles.

It follows a **pull-based model** where metrics are scraped from endpoints that
expose them at regular intervals. It offers a
[pushgateway](https://github.com/prometheus/pushgateway) service to allow you
implement push-based monitoring, but this is only intended as a workaround for
collecting metrics from services that cannot be scraped.

When metrics are scraped, they are stored in the native time-series database and
indexed by their names and labels. You can then use PromQL to query and analyze
the metrics as you see fit.

With OpenTelemetry, [the metrics data model](https://betterstack.com/community/guides/observability/opentelemetry-metrics/) is aimed at
facilitating importing data from existing systems and exporting to diverse
backends. It also allows for lossless translation of popular metric formats like
Prometheus and Statsd, efficient data transformations, as well as metric
generation from span or log streams.

OpenTelemetry metrics are defined by their name, description, attributes, and
timestamps. They also include the unit of measurement, value type (integer or
float), and the associated instrument.

The available metric instruments are:

- **Counter** for tracking monotonically increasing values,
- **UpDownCounter** for tracking values that can go up or down,
- **Histogram** for tracking the distribution of measurements,
- **Gauge** for capturing the current value of a measurement.

Unlike Prometheus, OpenTelemetry follows a push-based system where metrics are
actively sent to a backend via [OTLP](https://betterstack.com/community/guides/observability/otlp/). Usually, you'll have the
OpenTelemetry Collector collect the metrics, transform and batch them, before
shipping it off to the configured backend.

Since the OpenTelemetry metric model is inherently interoperable, other metric
models (including Prometheus) can be easily translated to it. However, since it
doesn't include a query language, querying depends on the backend system in
which the metrics are stored.

## Converting from Prometheus to OpenTelemetry

To understand how [Prometheus metrics](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/) are
converted into OpenTelemetry's native format, let's examine some examples.

You'll need to configure the OpenTelemetry Collector and use the
[Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/prometheusreceiver/README.md)
to scrape your metric endpoints. It fully supports all Prometheus's
configuration options, making it a convenient drop-in solution.

There's also the
[Prometheus Remote Write Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusremotewritereceiver)
which aims to implement the
[remote-write specification](https://prometheus.io/docs/specs/remote_write_spec_2_0/)
but is currently in early development.

While OpenTelemetry doesn't have a text-based representation like Prometheus,
you can use the Collector's
[Debug Exporter](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/debugexporter/README.md)
to generate a textual representation of the captured metrics.

Here's a sample configuration you can play with:

```yaml
[label otelcol.yaml]
receivers:
[highlight]
  prometheus:
    config:
      scrape_configs:
        - job_name: demo-app
          scrape_interval: 10s
          static_configs:
            - targets: ['localhost:8000']
[/highlight]

processors:
  batch:

exporters:
[highlight]
  debug:
    verbosity: detailed
[/highlight]

service:
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [batch]
      exporters: [debug]
```

This configuration assumes that you have an application that generates metrics
at `http://localhost:8000/metrics`. You can update the `targets` property if
your metrics are exposed on a different host or port.

When the `prometheus` receiver scrapes the metrics, it'll extract some
information from the environment and create a `Resource` that is attached to all
metrics from the application:

```text
Resource SchemaURL:
Resource attributes:
     -> service.name: Str(demo-app)
     -> net.host.name: Str(demo-app)
     -> server.address: Str(demo-ap)
     -> service.instance.id: Str(localhost:8000)
     -> net.host.port: Str(8000)
     -> http.scheme: Str(http)
     -> server.port: Str(8000)
     -> url.scheme: Str(http)
ScopeMetrics #0
ScopeMetrics SchemaURL:
InstrumentationScope github.com/open-telemetry/opentelemetry-collector-contrib/receiver/prometheusreceiver 0.111.0
```

Let's look at how each Prometheus metric translates to OpenTelemetry next.

### 1. Counter

In Prometheus, Counters are represented like this:

```text
# HELP http_requests_total Total number of HTTP requests received
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/",status="200"} 121
```

In OpenTelemetry, this `http_requests_total` is translated into a metric of type
`Sum`, retaining its cumulative nature (`IsMonotonic: true`) and aggregating
over time (`AggregationTemporality: Cumulative`):

```text
Metric #7
Descriptor:
     -> Name: http_requests_total
     -> Description: Total number of HTTP requests received
     -> Unit:
     -> DataType: Sum
     -> IsMonotonic: true
     -> AggregationTemporality: Cumulative
NumberDataPoints #0
Data point attributes:
     -> method: Str(GET)
     -> path: Str(/)
     -> status: Str(200)
StartTimestamp: 2024-11-28 16:18:13.804 +0000 UTC
Timestamp: 2024-11-28 16:25:43.804 +0000 UTC
Value: 121.000000
```

OpenTelemetry organizes it into a structured data point with attributes (method,
path, status) providing context. The counter value (`121`) is reported alongside
explicit timestamps for when data collection started and ended, adding temporal
precision.

However, you'll notice that there's no `Unit` specified since Prometheus uses a
suffix in the metric name to describe the unit, and the `prometheus` receiver
does not extract them by default at the time of writing.

### 2. Gauge

Similarly, a Prometheus gauge that looks like this:

```text
# HELP http_active_requests Number of active users in the system
# TYPE http_active_requests gauge
http_active_requests 2
```

Will be represented like this in OpenTelemetry:

```text
Metric #6
Descriptor:
     -> Name: http_active_requests
     -> Description: Number of active users in the system
     -> Unit:
     -> DataType: Gauge
NumberDataPoints #0
StartTimestamp: 1970-01-01 00:00:00 +0000 UTC
Timestamp: 2024-11-28 17:04:23.804 +0000 UTC
Value: 2.000000
```

### 3. Histogram

Prometheus histograms consist of bucket time series (`_bucket`), sum time series
(`_sum`), and count time series (`_count`):

```text
# HELP http_request_duration_seconds Duration of HTTP requests
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.005"} 2
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.01"} 2
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.025"} 5
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.05"} 11
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.1"} 18
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.25"} 34
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.5"} 74
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="1"} 121
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="2.5"} 121
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="5"} 121
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="10"} 121
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="+Inf"} 121
http_request_duration_seconds_sum{method="GET",path="/",status="200"} 51.009393553
http_request_duration_seconds_count{method="GET",path="/",status="200"} 121
```

But in OpenTelemetry, they are consolidated into one data point:

```text
Metric #5
Descriptor:
     -> Name: http_request_duration_seconds
     -> Description: Duration of HTTP requests
     -> Unit:
     -> DataType: Histogram
     -> AggregationTemporality: Cumulative
HistogramDataPoints #0
Data point attributes:
     -> method: Str(GET)
     -> path: Str(/)
     -> status: Str(200)
StartTimestamp: 2024-11-28 16:18:13.804 +0000 UTC
Timestamp: 2024-11-28 16:25:43.804 +0000 UTC
Count: 121
Sum: 51.009394
ExplicitBounds #0: 0.005000
ExplicitBounds #1: 0.010000
ExplicitBounds #2: 0.025000
ExplicitBounds #3: 0.050000
ExplicitBounds #4: 0.100000
ExplicitBounds #5: 0.250000
ExplicitBounds #6: 0.500000
ExplicitBounds #7: 1.000000
ExplicitBounds #8: 2.500000
ExplicitBounds #9: 5.000000
ExplicitBounds #10: 10.000000
Buckets #0, Count: 2
Buckets #1, Count: 0
Buckets #2, Count: 3
Buckets #3, Count: 6
Buckets #4, Count: 7
Buckets #5, Count: 16
Buckets #6, Count: 40
Buckets #7, Count: 47
Buckets #8, Count: 0
Buckets #9, Count: 0
Buckets #10, Count: 0
Buckets #11, Count: 0
```

Here, the `ExplicitBounds` property represents the upper bounds of the histogram
buckets (corresponding to the `le` label), and each bucket explicitly lists the
count of observations within the bucket, not cumulative like in Prometheus.

### 4. Summary

A Prometheus summary looks like this:

```text
# HELP post_request_duration_seconds Duration of requests to https://jsonplaceholder.typicode.com/posts
# TYPE post_request_duration_seconds summary
post_request_duration_seconds{quantile="0.5"} 0.15260272
post_request_duration_seconds{quantile="0.9"} 0.182577072
post_request_duration_seconds{quantile="0.99"} 0.58300406
post_request_duration_seconds_sum 13.936881877000005
post_request_duration_seconds_count 81
```

After being converted to OpenTelemetry, you'll see:

```text
Metric #0
Descriptor:
     -> Name: post_request_duration_seconds
     -> Description: Duration of requests to https://jsonplaceholder.typicode.com/posts
     -> Unit:
     -> DataType: Summary
SummaryDataPoints #0
StartTimestamp: 2024-11-28 16:17:43.804 +0000 UTC
Timestamp: 2024-11-28 17:15:33.804 +0000 UTC
Count: 81
Sum: 13.936882
QuantileValue #0: Quantile 0.500000, Value 0.15260272
QuantileValue #1: Quantile 0.900000, Value 0.182577072
QuantileValue #2: Quantile 0.990000, Value 0.58300406
```

While OpenTelemetry does not offer a Summary instrument, it does offer a
`Summary` type for the sake of compatibility with Prometheus. The output is
similar to a histogram, except that quantiles are listed instead of bucket
boundaries and counts.

---

Once you've converted your metrics to the OpenTelemetry format, you can explore
the
[available processors](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor)
to transform your metrics data before it is sent to an OTLP-compatible backend.
The
[metrics transform processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor)
may be of particular interest.

## Converting from OpenTelemetry to Prometheus

While
[Prometheus now natively supports OpenTelemetry's OTLP format](https://prometheus.io/blog/2024/03/14/commitment-to-opentelemetry/),
there might still be situations where you need to export metrics to a backend
that only understands the traditional Prometheus format.

For such cases, OpenTelemetry offers two exporters:

1. **Prometheus Exporter**: This exporter converts OTLP data into the standard
   Prometheus format and exposes it via an HTTP endpoint for scraping. While
   simple to set up, scraping can face scalability issues as your metric volume
   grows.

2. **Prometheus Remote Write Exporter**: For improved scalability, this exporter
   allows you to push metrics data from multiple Collector instances to a
   Prometheus-compatible backend.

![Prometheus and Remote Write Exporter](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c51afb4a-1db3-4b5c-7074-c4b9de649600/md2x =2730x910)

Below is a sample Collector configuration that receives OTLP metrics, converts
them to Prometheus format, and exposes it at `http://localhost:1212/metrics`:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
        endpoint: localhost:4318

processors:
  batch:

exporters:
  prometheus:
    endpoint: localhost:1212 # metrics will be available at http://localhost:1212/metrics

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

It's worth noting that OpenTelemetry's flexible data model allows for metric
configurations that cannot be directly represented in Prometheus due to its more
limited model.

For example, it can represent metrics as **deltas** in addition to the
traditional **cumulative** values. In Prometheus, all metrics are cumulative by
design, and delta values can only be derived at query time.

Histograms are another area of significant variance. OpenTelemetry can attach
additional metadata to histograms to track the observed minimum and maximum
values. It also supports an **exponential histogram** aggregation type, which
uses formulas and scales to calculate bucket sizes dynamically.

Prometheus histograms currently lack these features, though experimental
[native histograms in v3.0](https://prometheus.io/blog/2024/11/14/prometheus-3-0/#native-histograms)
aims to bridge this gap.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/jN9YpPOom3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Here's how the exporters currently handle these discrepancies:

- **Delta temporality**: Prometheus exporter converts delta temporality metrics
  to cumulative, while the Remote Write exporter drops them.

- **Summaries and Histograms**: The Remote Write exporter also drops summary and
  histogram metrics, but the Prometheus exporter handles them seamlessly.

- **Integers**: OpenTelemetry metrics with integer values are converted to
  floats for compatibility with Prometheus.

Prometheus's ongoing improvements, such as better UTF-8 support in metric and
label names and experimental native histograms, reflect efforts to enhance
interoperability with OpenTelemetry metrics.

These developments aim to close the gaps between the two systems, making
integrations smoother and more robust in the future.

You can read more about
[OpenTelemetry support in Prometheus here](https://prometheus.io/blog/2024/03/14/commitment-to-opentelemetry/).

## Final thoughts

This article has explored the similarities and differences between OpenTelemetry
and Prometheus regarding metric generation, collection, storage, and analysis.

Choosing the right solution depends on whether you require a comprehensive
observability solution that unifies metrics, logs, and traces, or if you need a
mature, stable solution for metrics-based monitoring.

In most cases, you'll likely want to adopt a hybrid approach where Prometheus
handles infrastructure monitoring with its extensive integrations while
OpenTelemetry is used for service instrumentation.

![Choosing both OpenTelemetry and Prometheus metrics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/56098449-5c33-49b5-d874-5986b7b58e00/public
=1194x443)

You can achieve this by:

1. **Deploying an OpenTelemetry collector to scrape metrics from existing
   Prometheus endpoints**. This effectively replaces the original Prometheus
   server, and allows you to retain existing instrumentation when switching to a
   new backend.

2. **Instrumenting your application metrics with the OpenTelemetry SDK**, then
   use the Collector with appropriate receivers to collect metrics and send them
   to the same unified backend.

If you're looking for an observability platform to store, query, and visualize
your OpenTelemetry or Prometheus metrics, check out
[Better Stack](https://betterstack.com/telemetry). Our free offering includes up
to 2 billion metric data points with a 30-day retention period.

Thanks for reading!
