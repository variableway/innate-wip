# A Deep Dive into the OpenTelemetry Protocol (OTLP)

The increasing complexity, distributed nature, and microservices architecture of
modern software systems have made effective observability essential for
maintaining application performance and reliability.

OpenTelemetry addresses this challenge by offering a comprehensive toolkit and
standards for collecting telemetry data—logs, metrics, and traces—across an
application's entire infrastructure.

At the heart of this initiative is the OpenTelemetry Protocol (OTLP), a
standardized format for encoding and transmitting telemetry data between
different components within the OpenTelemetry ecosystem.

In this article, you'll learn about the key features of OTLP, how it works, and
how to implement it in your services to standardize telemetry encoding and
delivery, and ultimately break the vendor lock-in cycle.

[ad-logs]

## What is the OpenTelemetry Protocol?

OTLP is a telemetry data exchange protocol used to encode, transmit, and deliver
telemetry such as [traces, metrics, and logs](https://betterstack.com/community/guides/observability/logging-metrics-tracing/) across
the wire between the components of the OpenTelemetry ecosystem such as
instrumented applications and infrastructure, the [OpenTelemetry
Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/), other telemetry agents and forwarders, and
various observability backends.

It is a crucial aspect of the OpenTelemetry project that's designed to ensure
that telemetry data, regardless of its source or vendor, can be delivered in a
reliable manner and processed by consistently.

Here are some of its main characteristics:

- It is a general-purpose format for transmitting telemetry data across various
  tools which promotes interoperability and vendor neutrality.

- It uses gRPC with protocol buffers for efficient, real-time communication but
  it also supports `http/protobuf` and `http/json` for situations where gRPC may
  not be ideal.

- It is designed to have low CPU and memory usage for serialization and
  de-serialization to support high throughput and low latency scenarios.

- The protocol buffer-based encoding allows for future additions and extensions
  without breaking backward compatibility.

- It is designed to have high reliability in data delivery and provide clear
  visibility when data fails to be transmitted.

- It allows for backpressure signalling so that if the server is overloaded or
  unable to keep up with the incoming data rate, it can signal the client to
  reduce its transmission rate, preventing data loss and system instability.

## Exploring the OTLP specification

The OpenTelemetry Protocol uses a request-based communication model, where
telemetry data is transmitted from a client (sender) to a server (receiver)
through distinct requests which are carried out over gPRC or HTTP.

Both transport mechanisms use protocol buffers to define the structure of the
telemetry data payload, but HTTP/JSON is also supported in some cases.
Additionally, servers are required to support Gzip compression for payloads,
although uncompressed payloads are also accepted.

Here's how the process typically plays out:

### 1. Data collection

A program instrumented with OpenTelemetry collects telemetry data and packages
it into an OTLP-compliant request through the OTLP exporter provided by the
relevant SDK.

### 2. Data transmission

The request is sent to a server that supports OTLP at a specified endpoint. This
is usually the OpenTelemetry collector but it could be any tool or service with
OTLP ingestion capabilities.

### 3. Acknowledgment

The server processes the data and responds to the client with an acknowledgment
of successful receipt. If there's an issue, an error message is returned
instead. If no acknowledgement was received, the client will re-send such data
to guarantee delivery which may result in duplicate data on the server side. To
prevent overload, servers should signal backpressure to clients, which must then
throttle their data transmission accordingly.

While OTLP focuses on reliable delivery between individual client-server pairs,
it does not guarantee end-to-end delivery across multiple intermediary nodes.
Acknowledgments occur only between direct client-server pairs and do not span
across the entire delivery path.

## Benefits of OTLP

OTLP offers several compelling reasons for its adoption:

1. **Unified standard**: OTLP provides a single, well-defined format for
   telemetry data which eliminates the need to juggle different formats and
   simplifies data ingestion into various observability backends.

2. **Vendor neutrality**: By using OTLP, you gain the freedom to choose the best
   observability tools for your needs and switch between them without
   re-instrumenting your applications.

3. **Simplified instrumentation**: With OTLP, you only need to instrument your
   code once, and it will work with any system supporting OTLP.

4. **Interoperability**: OTLP enables seamless integration between different
   components in your observability pipeline, from your application code and
   infrastructure to agents, collectors, and backends.

5. **Performance and reliability**: OTLP is designed for performance to allow
   for minimal CPU and memory overhead, even in high-throughput scenarios. High
   data delivery guarantees are also built into the specification.

6. **Future-proofing**: It is designed in a way that ensures that clients and
   servers that implement different versions can still interoperate and exchange
   telemetry data.

## The OTLP data model

At its core, the OTLP establishes a well-defined and structured data model for
representing telemetry data to facilitate consistent and efficient handling
throughout the observability pipeline. This model encompasses the three major
types of telemetry: traces, metrics, and logs.

### Traces

In OTLP, traces are composed of spans which represent specific operations within
a transaction or request. Spans capture the context of their execution, forming
the foundation of [distributed tracing](https://betterstack.com/community/guides/observability/distributed-tracing/).

The entire protobuf encoding of an OTLP trace can be found
[here](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/trace/v1/trace.proto),
but here is a simplified overview:

```proto
[label trace.proto]
// https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/trace/v1/trace.proto
message TracesData {
  repeated ResourceSpans resource_spans = 1;
}

message ResourceSpans {
  opentelemetry.proto.resource.v1.Resource resource = 1;
  repeated ScopeSpans scope_spans = 2;
}

message ScopeSpans {
  opentelemetry.proto.common.v1.InstrumentationScope scope = 1;
  repeated Span spans = 2;
}

message Span {
  bytes trace_id = 1;
  bytes span_id = 2;
  string trace_state = 3;
  bytes parent_span_id = 4;
  fixed32 flags = 16;
  string name = 5;
  enum SpanKind {}
  SpanKind kind = 6;
  fixed64 start_time_unix_nano = 7;
  fixed64 end_time_unix_nano = 8;
  Status status = 15;
  message Event {}
  repeated Event events = 11;
  repeated opentelemetry.proto.common.v1.KeyValue attributes = 9;
  uint32 dropped_attributes_count = 10;
  uint32 dropped_events_count = 12;
  message Link {}
  repeated Link links = 13;
  uint32 dropped_links_count = 14;
  Status status = 15;
}


message Status {}

enum SpanFlags {}
```

In OTLP, trace data is organized hierarchically like this:

```text
TracesData -> ResourceSpans -> ScopeSpans -> Span
```

Here's an explanation of some of the major components in this structure:

- `TracesData`: A collection of `ResourceSpans` which represent telemetry data
  associated with specific resources such as a specific service or host.

- `ResourceSpans`: This contains information about the `Resource` itself and
  multiple `ScopeSpans` for grouping spans based on their instrumentation scope.

- `ScopeSpans`: Groups multiple spans that share the same `InstrumentationScope`
  (the library or component responsible for generating the span).

- `Span`: This is the core building block of a trace that represents a single
  operation or activity.

  - It includes identifiers like `trace_id` and `span_id` for linking spans
    within a trace.
  - Captures timing information with `start_time_unix_nano` and
    `end_time_unix_nano`.
  - Contains `attributes` (key/value pairs) which follow the [semantic attribute
    conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/) to help provide additional
    context.
  - Can include events (`Event` objects) representing specific occurrences
    during the span's lifetime.
  - Can have links (`Link` objects) to other spans, potentially in different
    traces.
  - Carries a `Status` object indicating the success or failure of the span
    (`UNSET`, `OK`, and `ERROR`), and an optional message providing details.

Here's a succinct example of an OTLP trace in JSON format, showing the
hierarchical data model:

```json
{
  "resourceSpans": [
    {
      "resource": {
        "attributes": [
          {
            "key": "service.name",
            "value": {
              "stringValue": "my-awesome-service"
            }
          }
        ]
      },
      "scopeSpans": [
        {
          "scope": {
            "name": "super.library",
            "version": "2.5.1",
            "attributes": [
              {
                "key": "my.awesome.scope.attribute",
                "value": {
                  "stringValue": "amazing scope attribute!"
                }
              }
            ]
          },
          "spans": [
            {
              "traceId": "123456789ABCDEF0123456789ABCDEF0",
              "spanId": "FEDCBA9876543210",
              "parentSpanId": "FEDCBA9876543211",
              "name": "I'm a fantastic client span",
              "startTimeUnixNano": "1678886400000000000",
              "endTimeUnixNano": "1678886401000000000",
              "kind": 3,
              "attributes": [
                {
                  "key": "my.amazing.span.attr",
                  "value": {
                    "stringValue": "a truly valuable value"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Metrics

Metric data is also organized hierarchically by associating measurements with
resources and instrumentation scopes. Each metric has a specific data type, and
data points within them carry the actual values along with timestamps and
additional context.

Here's a simplified view of the
[full metrics definition](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/metrics/v1/metrics.proto):

```proto
[label metrics.proto]
message MetricsData {
  repeated ResourceMetrics resource_metrics = 1;
}

message ResourceMetrics {
  reserved 1000;
  opentelemetry.proto.resource.v1.Resource resource = 1;
  repeated ScopeMetrics scope_metrics = 2;
  string schema_url = 3;
}

message ScopeMetrics {
  opentelemetry.proto.common.v1.InstrumentationScope scope = 1;
  repeated Metric metrics = 2;
  string schema_url = 3;
}

message Metric {
  reserved 4, 6, 8;
  string name = 1;
  string description = 2;
  string unit = 3;
  oneof data {
    Gauge gauge = 5;
    Sum sum = 7;
    Histogram histogram = 9;
    ExponentialHistogram exponential_histogram = 10;
    Summary summary = 11;
  }
  repeated opentelemetry.proto.common.v1.KeyValue metadata = 12;
}

. . .
```

The most important fields are described as follows:

- `MetricsData`: A collection of `ResourceMetrics`, which ties metrics to
  specific resources.

- `ResourceMetrics`: Contains resource details and multiple `ScopeMetrics` for
  grouping metrics based on instrumentation scope.

- `ScopeMetrics`: Groups metrics sharing the same instrumentation scope and
  contains multiple `Metric` objects.

- `Metric`: This is the fundamental unit, representing a specific measurement.
  It is composed of metadata and data.

  - It has a `name`, `description`, and `unit` for identification and context
    (metadata).
  - One of five data types: Guage, Sum, Histogram, Exponential Histogram, and
    Summary.
  - Each metric contains datapoints with timestamps, attributes, and one of the
    possible value type fields.

#### Types of metrics in OTLP

1. **Gauge**: This represents a value at a specific point in time (e.g., current
   CPU usage, number of items in a queue, etc). It is a number that can either
   go up or down.

2. **Sum**: This is analogous to the `Counter` metric type in Prometheus. It
   represents a running total that increases over time (such as number of
   requests or errors).

3. **Histogram**: These are used to represent a distribution of measurements by
   sampling observations and counting them in configurable buckets.

4. **Exponential Histogram**: They are a special type of histogram used to
   efficiently represent a distribution of values in [high-cardinality
   scenarios](https://betterstack.com/community/guides/observability/high-cardinality-observability/) where the range of values can vary
   significantly.

5. **Summary**: Summaries are included in OpenTelemetry for legacy support. The
   OpenTelemetry APIs and SDK do not produce `Summary` metrics.

Here's the metric data model in OTLP/JSON with a single gauge metric:

```json
{
  "resourceMetrics": [
    {
      "resource": {
        "attributes": [
          {
            "key": "service.name",
            "value": {
              "stringValue": "awesome.service"
            }
          }
        ]
      },
      "scopeMetrics": [
        {
          "scope": {
            "name": "fantastic.library",
            "version": "2.0.0",
            "attributes": [
              {
                "key": "awesome.scope.attribute",
                "value": {
                  "stringValue": "super scope attribute"
                }
              }
            ]
          },
          "metrics": [
            {
              "name": "amazing.gauge",
              "unit": "seconds",
              "description": "I am a Gauge",
              "gauge": {
                "dataPoints": [
                  {
                    "asDouble": 12.34,
                    "startTimeUnixNano": "1678886400000000000",
                    "timeUnixNano": "1678886400000000000",
                    "attributes": [
                      {
                        "key": "my.gauge.attr",
                        "value": {
                          "stringValue": "a wonderful value"
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Logs

OTLP's data model for logs offers a standardized way to represent log data from
various sources including application logs, machine-generated events, system
logs, and more.

This model allows for unambiguous mapping from existing log formats, ensuring
compatibility and ease of integration. It also enables reverse mapping back to
specific log formats, provided those formats support equivalent features.

You can check out the
[protocol buffer representation](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/logs/v1/logs.proto)
or
[read the full design document](https://opentelemetry.io/docs/specs/otel/logs/data-model/),
but here's a concise summary of the model:

```proto
[label logs.proto]
message LogsData {
  repeated ResourceLogs resource_logs = 1;
}

message ResourceLogs {
  reserved 1000;
  opentelemetry.proto.resource.v1.Resource resource = 1;
  repeated ScopeLogs scope_logs = 2;
  string schema_url = 3;
}

message ScopeLogs {
  opentelemetry.proto.common.v1.InstrumentationScope scope = 1;
  repeated LogRecord log_records = 2;
  string schema_url = 3;
}

enum SeverityNumber {}

enum LogRecordFlags {}

message LogRecord {
  reserved 4;
  fixed64 time_unix_nano = 1;
  fixed64 observed_time_unix_nano = 11;
  SeverityNumber severity_number = 2;
  string severity_text = 3;
  opentelemetry.proto.common.v1.AnyValue body = 5;
  repeated opentelemetry.proto.common.v1.KeyValue attributes = 6;
  uint32 dropped_attributes_count = 7;
  fixed32 flags = 8;
  bytes trace_id = 9;
  bytes span_id = 10;
}
```

Besides the `LogsData`, `ResourceLogs`, and `ScopeLogs` entities which perform a
similar function of organizing log data in a hierarchical manner similar to the
corresponding items in the trace and metrics data model, the main thing to pay
attention to is the `LogRecord` object which is the fundamental unit
representing a single log entry.

It consists of of the following attributes:

- **Timestamps**: Such as `time_unix_nano` (when the log was created at the
  source) and `observed_time_unix_nano` (when the log was ingested by the log
  shipper / collector).
- **Severity**: The `severity_number` is a numeric representation of the [log
  severity](https://betterstack.com/community/guides/logging/log-levels-explained/) ranging from ranging from `TRACE` (least
  severe) to `FATAL` (most severe), while `severity_text` is the human-readable
  description of the log severity.
- **Trace Context Fields**: The `trace_id` and `span_id` fields allow for
  optionally linking the log to a specific trace and span for correlation.
- **Body**: This `body` is the actual log message content. It uses the
  `AnyValue` type to accommodate structured, semi-structured and unstructured
  records.
- **Attributes**: This holds key-value pairs providing additional context about
  the record.

Here's the OTLP data model of a log record in JSON format:

```json
{
  "resourceLogs": [
    {
      "resource": {
        "attributes": [
          {
            "key": "service.name",
            "value": {
              "stringValue": "super.service"
            }
          }
        ]
      },
      "scopeLogs": [
        {
          "scope": {
            "name": "awesome.library",
            "version": "3.1.4",
            "attributes": [
              {
                "key": "fantastic.scope.attribute",
                "value": {
                  "stringValue": "wonderful scope attribute"
                }
              }
            ]
          },
          "logRecords": [
            {
              "timeUnixNano": "1678886400000000000",
              "observedTimeUnixNano": "1678886400000000000",
              "severityNumber": 9,
              "severityText": "Info",
              "traceId": "ABCDEF0123456789ABCDEF0123456789",
              "spanId": "123456789ABCDEF0",
              "body": {
                "stringValue": "A delightful log message"
              },
              "attributes": [
                {
                  "key": "amazing.attribute",
                  "value": {
                    "intValue": 123
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Implementing OTLP in your services

Generating, collecting, and transmitting OTLP-encoded telemetry data, be it
logs, metrics, or traces, is really straightforward. You only need to choose the
appropriate language-specific SDK for your services, then configure an OTLP
endpoint to receive the data.

Let's look at the necessary steps in more detail.

### 1. Instrumenting your application

Begin by selecting the appropriate [OpenTelemetry SDK](https://betterstack.com/community/guides/observability/opentelemetry-sdk/), then
initialize it and instrumenting your code accordingly. A list of the supported
languages and their respective SDKs can be found on the
[OpenTelemetry website](https://opentelemetry.io/docs/languages/).

You also need to ensure that your services are configured to export telemetry
data to an OTLP endpoint through the appropriate exporter. By default, OTLP
exporters use `http://localhost:4317` for OTLP/gRPC and `http://localhost:4318`
for OTLP/HTTP, but these can be customized via
[environment variables](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)
to match your setup.

Here's a minimal example in Node.js showing the configuration of its
OpenTelemetry SDK along with an OTLP exporter for traces:

```javascript
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";

const exporter = new OTLPTraceExporter();
const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [
		getNodeAutoInstrumentations(),
	],
});

sdk.start();
```

### 2. Configuring the OpenTelemetry Collector

While many observability backends now offer direct OTLP endpoints via gRPC or
HTTP, utilizing the [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) as an
intermediary is recommended for its flexibility and advanced processing
capabilities.

For example, here's a configuration snippet demonstrating how to receive OTLP
trace data over HTTP and export it to Jaeger in its native format:

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
  otlp/jaeger:
    endpoint: jaeger:4317

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
```

You can use the
[OTLP collector distribution](https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions/otelcol-otlp)
if you're only interesting in receiving and exporting OTLP data, or consider
[building your own distribution](https://betterstack.com/community/guides/observability/custom-opentelemetry-collector/).

### 3. Converting other formats to OTLP

If you're already generating telemetry data through other instrumentation
libraries or formats (such as Prometheus metrics), you can still leverage OTLP
and the OpenTelemetry ecosystem.

The OpenTelemetry Collector supports a
[wide range of receivers](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver)
that can ingest data in various formats and map it to OTLP. For example, to
collect Prometheus metrics and export it to an OTLP endpoint, you can use the
following collector configuration:

```yaml
[label otelcol.yaml]
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: node-exporter
          scrape_interval: 10s
          static_configs:
            - targets: ['node-exporter:9100']

processors:
  attributes/betterstack:
    actions:
      - key: better_stack_source_token
        value: <source_token>
        action: insert
  batch:

exporters:
  otlp/betterstack:
    endpoint: https://in-otel.logs.betterstack.com:443

service:
  pipelines:
    metrics/betterstack:
      receivers: [prometheus]
      processors: [batch, attributes/betterstack]
      exporters: [otlp/betterstack]

```

### 4. Sending OTLP data to an observability backend

The final step, after emitting OTLP-encoded telemetry data from your services
and infrastructure, is to ensure that the generated data reaches your
observability backend.

For example, Better Stack supports ingesting OTLP data over gRPC, HTTP/protobuf,
and HTTP/JSON.
[See our documentation](https://betterstack.com/docs/logs/open-telemetry/) for
more details!

## Choosing between gRPC and HTTP for OTLP

When it comes to exporting telemetry data in OpenTelemetry, most SDKs provide
options for OTLP transmission over either `grpc` or `http/protobuf`, with some
exporters (like JavaScript) also supporting `http/json`.

Here's what to consider when deciding between gRPC and HTTP:

- Ensure the chosen protocol is supported in the context where it will be used.
  For example, gRPC cannot be used in the browser, so for web applications, you
  must use `http/json` or `http/protobuf`.

- The default protocol for OTLP data transmission can vary across SDKs and it is
  sometimes easier to stick with the default due to varying support levels. For
  instance, the Go SDK defaults to gRPC, while the Node.js SDK uses
  `http/protobuf` by default.

- gRPC can introduce larger dependencies into your codebase, which might be a
  factor if keeping dependencies minimal is a priority.

- gRPC uses HTTP/2, which might have variable support across your network setup,
  including firewalls, proxies, and load balancers. Ensure to verify that your
  infrastructure supports HTTP/2 if you plan to use gRPC.

- gRPC is generally more efficient than HTTP and supports streaming, making it
  suitable for high-throughput scenarios or larger payloads.

Note that the default port for OTLP over gRPC is `4317`, while OTLP over HTTP
uses port `4318`.

## OTLP best practices

When implementing OTLP in your observability pipelines, it's important to adhere
to certain best practices to ensure optimal performance and reliable delivery.

Here are some key recommendations:

### 1. Choose the right transport protocol

Whenever feasible, use gRPC/protobuf as the transport protocol for OTLP. It
offers performance advantages over HTTP, particularly for large volumes of data
or in high-throughput scenarios.

### 2. Use Gzip compression

Use Gzip compression for your telemetry payloads to reduce network bandwidth
usage, especially in high-volume environments.

### 3. Set up retry and backpressure mechanisms

Ensure to configure the appropriate retry mechanisms with exponential backoff to
ensure data is delivered even during temporary network issues.

If the server indicates that it cannot keep up with the rate of data flow,
adjust the client's sending rate accordingly.

### 4. Monitor and adjust batch sizes

The `batch` processor in the OpenTelemetry Collector is useful for balancing
throughput and latency by grouping telemetry data before forwarding it.

Ensure to monitor how batching affects your data delivery and adjust the sizes
and timeouts based on the specific load patterns of your application.

### 5. Use TLS/SSL

To protect telemetry data during transmission, verify that all OTLP endpoints,
are configured for secure data exchange with TLS/SSL.

### 6. Adhere to semantic conventions

When instrumenting your services, follow the naming guidelines provided by
[OpenTelemetry's semantic conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/) to
improve data consistency and interoperability.

### 7. Use the OpenTelemetry Collector

The Collector simplifies working with OTLP by offering an easy way to receive,
process, and export telemetry data. It even offers an
[OTLP-focused distribution](https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions/otelcol-otlp)
to bootstrap your efforts.

## OTLP challenges and solutions

Navigating the world of OTLP can sometimes present challenges. Based on my
experience, here's a guide to some common pitfalls and how to overcome them,
ensuring a smoother OTLP implementation:

### 1. Handling duplicate data

When using retry mechanisms, there is a risk of duplicate data being delivered
to the backend if the client re-sends data packets due to a lack of
acknowledgment.

**Solution**: Implement deduplication logic on the backend side or within the
OpenTelemetry Collector. This can involve tracking unique identifiers like to
identify and filter out duplicate spans or data points.

### 2. Data loss during failures

In cases of network failures or when an OTLP endpoint is temporarily
unavailable, telemetry data might be lost which could lead to gaps in
observability.

**Solution**: Enable retry mechanisms in the OpenTelemetry SDK and configure a
buffer (such as Apache Kafka) to ensure data persistence during short outages.
Also, ensure that in-memory buffers are flushed before your service shuts down.

### 3. OTLP version mismatch

While OTLP is designed to be tolerant to mismatched versions between the sender
and receiver, newer versions may add new fields that will be ignored by clients
and servers that do not understand them which can cause issues down the line.

**Solution**: Ensure to keep all components (SDKs, Collectors, backends) on the
same OTLP version where possible. If updating all components simultaneously is
infeasible, prioritize the Collector first to handle potential version
mismatches between senders and receivers.

### 4. Payload size limits

OTLP data, especially with large traces or batches of metrics, can easily exceed
size limits imposed by network infrastructure or the receiving backend which
could lead to data truncation or rejection.

**Solution**: Be aware of payload size limits in your OTLP pipeline. These
limits may be imposed by various components and exceeding them can lead to data
loss. Monitor your payload sizes and adjust batching accordingly.

### 5. Non-retryable errors

If the receiving server detects bad data in a request, it will send an error
response that indicates that such data should be dropped and the request should
not be retried. This can happen when the data cannot be deserialized or
processed by the server.

**Solution**: In such cases, the client is required to keep track of such
dropped data so you must monitor this count and investigate the root cause.
Also, consider implementing a dead-letter queue to temporarily store this data
while you address the issue to ensure no valuable telemetry is lost.

## Final thoughts

By standardizing the exchange of telemetry data between applications,
collectors, and backend services, OTLP plays a crucial role in the OpenTelemetry
ecosystem. This vendor-neutral approach ensures interoperability and
flexibility, allowing you to effectively collect, transmit, and analyze logs,
metrics, and traces across diverse systems.

To deepen your understanding of OTLP and OpenTelemetry and make sense of how
they fit into the modern observability landscape, ensure to read the full
[OTLP spec](https://opentelemetry.io/docs/specs/otlp/) and visit the
corresponding
[GitHub repository](https://github.com/open-telemetry/opentelemetry-proto).

Thanks for reading!
