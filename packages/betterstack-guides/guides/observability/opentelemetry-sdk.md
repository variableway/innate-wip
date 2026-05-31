# Introduction to the OpenTelemetry SDK

Observability is a critical aspect of modern software development, particularly
in complex distributed systems. It empowers developers and operators to
understand, monitor, and troubleshoot their applications effectively.
**OpenTelemetry has emerged as a leading open-source standard for instrumenting
and collecting telemetry data**, providing a unified framework for traces,
metrics, and logs.

In this article series, we embark on a journey into the heart of OpenTelemetry.
**We'll explore its architecture, components, and integration techniques,** offering
a comprehensive understanding of how it empowers you to gain deep insights into
your systems.

In this first part, we focus on the OpenTelemetry SDK, the core library
responsible for instrumenting your applications and generating telemetry data.
**We'll delve into the intricacies of traces, metrics, and logs, and how they are
collected, processed, and prepared for export**. By the end of this article,
you'll have a solid grasp of how to leverage the OpenTelemetry SDK to instrument
your services and lay the foundation for a robust observability practice.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

Before proceeding with this article, ensure that you're familiar with the [basic
OpenTelemetry concepts](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).

## What is the OpenTelemetry SDK?

OpenTelemetry (OTel) streamlines the collection of crucial observability data
(logs, metrics, and traces) across diverse services, irrespective of their
underlying tech stacks. To accomplish this, OpenTelemetry offers:

- SDKs for popular languages: These SDKs (Software Development Kits) initiate
  OTel's core functionalities in languages like Python, Go, NodeJS, Rust, and
  Java.
- Library-specific instrumentations: These automatically capture signals and
  context specific to particular tools or frameworks, such as Starlette, HTTPX,
  or aiopika. Additionally, you can further customize your observability by
  instrumenting your codebase with traces and metrics tailored to your business
  logic.

There are two primary ways to set up OTel in your application:

- Automatic setup: Some languages allow an agent to configure OTel before the
  main application runs. However, this isn't universally supported; Golang, for
  instance, lacks this capability.

- Manual setup: You explicitly configure OTel within your code to initiate data
  collection.

To illustrate OTel SDK design and implementation, let's examine the manual setup
process in Python:

```go
package main

import (
    "context"
    "log"

    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
    "go.opentelemetry.io/otel/metric/global"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/otel/sdk/metric"
    "go.opentelemetry.io/otel/sdk/resource"
    "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

func main() {
    // Set up trace exporter to console (stdout)
    exporter, err := stdouttrace.New(stdouttrace.WithPrettyPrint())
    if err != nil {
        log.Fatal(err)
    }

    // Create a resource describing the service
    res, err := resource.New(context.Background(),
        resource.WithAttributes(
            semconv.ServiceNameKey.String("notifications"),
            semconv.ServiceVersionKey.String("v42"),
        ),
    )
    if err != nil {
        log.Fatal(err)
    }

    // Create trace provider with batching and the exporter
    bsp := trace.NewBatchSpanProcessor(exporter)
    tracerProvider := trace.NewTracerProvider(
        trace.WithSampler(trace.AlwaysSample()), // Sample all traces for this example
        trace.WithResource(res),
        trace.WithSpanProcessor(bsp),
    )

    // Set the global trace provider and text map propagator
    otel.SetTracerProvider(tracerProvider)
    otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))

    // Create a meter provider with a stdout exporter
    // (You might want a different exporter for real-world scenarios)
    metricExporter, err := metric.NewExporter(metric.WithReader(metric.NewPeriodicReader(metric.WithExporter(metric.NewManualReader())))
    if err != nil {
        log.Fatal(err)
    }
    meterProvider := metric.NewMeterProvider(metric.WithReader(metricExporter))
    global.SetMeterProvider(meterProvider)

    // Now you can use `otel.Tracer("...")` and `global.Meter("...")`
    // to instrument your code

    // ... your application logic ...

    // Clean up
    if err := tracerProvider.Shutdown(context.Background()); err != nil {
        log.Fatal(err)
    }
    if err := meterProvider.Shutdown(context.Background()); err != nil {
        log.Fatal(err)
    }
}
```

### Resource

In the Go example, we create a Resource using the following code:

```go
res, err := resource.New(context.Background(),
    resource.WithAttributes(
        semconv.ServiceNameKey.String("notifications"),
        semconv.ServiceVersionKey.String("v42"),
    ),
)
if err != nil {
    log.Fatal(err)
}
```

This Resource represents the entity (in this case, the `notifications` service)
that's generating the observability signals (traces and metrics). It's crucial
for providing context to these signals.

#### Attributes and Context

The core idea here is that most of the context in observability signals is
conveyed through attributes or tags, which are essentially key-value pairs. Your
observability backend can then process these attributes to correlate different
pieces of information and gain insights into your system's behavior.

OpenTelemetry makes a concerted effort to standardize attribute names across
different languages and libraries. This is where the `semconv` package comes in,
providing standardized semantic conventions for common attributes like service
name and version. By using these conventions, you ensure consistency across your
entire system, making it easier to analyze and understand your observability
data.

### Providers

In the Go example, we set global providers for both tracing and metrics using:

```go
otel.SetTracerProvider(tracerProvider)
global.SetMeterProvider(meterProvider)
```

These global providers act as central points of configuration and management for
tracing and metrics within your Go application. Once set, other parts of your
code can access and use these providers to create tracers and meters for
instrumenting specific components or functionalities.

OpenTelemetry SDKs, including the Go SDK, also provide "No-Op" implementations
for providers (e.g., `NoopTracerProvider`, `NoopMeterProvider`). These No-Op
providers essentially do nothing - they don't generate any actual traces or
metrics.

This design choice is a prime example of the Null Object Pattern. The idea is to
provide a default, "do-nothing" implementation that can be used in situations
where you might not have a fully configured observability setup (such as in a
testing environment).

## Traces

The `TracerProvider` is responsible for creating `Tracer` instances. Each Tracer
is associated with a specific trace, which represents a distinct workflow or
operation in your system. For example, a trace named `GET /users/{user_id}/`
could encompass all requests to an API endpoint that retrieves user data.

Within a trace, individual steps or actions are represented by spans. These
spans form a hierarchical tree, capturing the parent-child relationships between
different operations. For instance, within the `GET /users/{user_id}/` trace,
you might have a span for fetching user data from the database.

Spans can also carry additional context through attributes, which are key-value
pairs that record details like event occurrences, action statuses, or any other
relevant information.

The hierarchical structure of spans within a trace allows you to visualize the
entire flow of an operation in your observability backend. This visualization
helps you understand the sequence of events, identify performance bottlenecks,
and pinpoint potential issues within your system.

Once you have your tracer provider, you can crate a new trace with:

```go
ctx, span := tracer.Start(context.Background(), "users:get-info")
defer span.End()

span.SetAttributes(attribute.String("user_id", "..."))

// Nested span
_, childSpan := tracer.Start(ctx, "users:get-info:check-permissions")
defer childSpan.End()

// ... your logic for checking permissions ...
```

### Spans

In the OpenTelemetry protocol, traces are more of a conceptual entity that
provides a context for holding related spans. The actual data points collected,
processed, and exported are the spans themselves.

#### Anatomy of a Span

A span encapsulates a unit of work within a trace and comprises the following
elements:

- **Name**: A human-readable title describing the step or operation represented
  by the span
- **Kind**: Categorizes the span's nature (e.g., internal, server, client,
  producer, consumer)
- **Status**: Indicates the outcome of the operation (e.g., not set, ok, error)
- **Span Context**: Uniquely identifies the span within the trace
- **Parent Span Context**: Links the span to its parent in the trace hierarchy
- **Resource Context**: Provides information about the entity generating the
  span
- **Trace or Instrumentation Scope**: Associates the span with a specific trace
  or instrumentation library
- **Span Attributes**: Key-value pairs providing additional context about the
  span
- **Span Events**: Named events with timestamps and their own set of attributes,
  representing specific occurrences within the span's lifecycle
- **Span Links**: Connect the span to other spans that might have influenced or
  caused it
- **Start Time & End Time**: Timestamps indicating the span's duration

The Span class often acts as a context manager. This means that when a span is
started and subsequently exits its scope, the SpanProcessor is automatically
notified about these events, facilitating the collection and export of span data

### Span sampling

Span sampling is an optional technique used to filter out specific spans or
other data points based on certain criteria or even randomly.

The primary motivations for sampling include:

- Cost Optimization: Reduces the volume of data ingested and stored, leading to
  cost savings
- Focus on Relevant Data: Filters out routine, uninteresting data, retaining
  primarily spans with errors, those exceeding specific thresholds, or those
  possessing particular attributes
- Targeted Filtering: Enables selective filtering based on the presence or
  absence of specific attributes
- Early Filtering: Sampling at the SDK level allows for filtering at the
  earliest stage in the pipeline (head sampling), potentially improving
  efficiency Built-in Samplers

OpenTelemetry offers a few span samplers out of the box:

- StaticSampler: Always or never drops spans, providing a simple on/off
  mechanism
- TraceIdRatio: Probabilistically drops a specified proportion of spans based on
  their Trace ID.

These samplers can be configured to respect parent span decisions. If a parent
span is dropped due to sampling, all its child spans will also be discarded,
ensuring consistency in the trace data.

## Span processors

Once spans reach their completion, they are handed over to span processors. This
marks the final stage in a span's lifecycle within your service, just before
it's sent to an external exporter for further processing and storage.

OpenTelemetry leverages span processors to implement:

1. Batching: Spans are collected and grouped into batches for more efficient
   export.
2. Multiplexing: Batches of spans can be dispatched to multiple exporters
   simultaneously.

The `BatchSpanProcessor` is a commonly used implementation that collects spans
and exports them either periodically based on a schedule or when its internal
queue reaches its capacity.

It achieves this by utilizing a separate daemon thread to handle the batching
and export logic. The processor waits until a batch is formed or a timeout
occurs. This elegant waiting mechanism is often implemented using a
Threading.condition construct.

OpenTelemetry also offers two `MultiSpanProcessor` variants:

- Sequential MultiSpanProcessor: Processes spans sequentially through a list of
  span processors
- Concurrent MultiSpanProcessor: Utilizes a ThreadPoolExecutor to process spans
  concurrently across multiple span processors

Span processors play a crucial role in optimizing the export of span data from
your service. They enable batching for efficiency, support multiplexing to
various exporters, and offer flexibility in handling span processing through
sequential or concurrent approaches.

[summary]
### Skip manual SDK configuration with automatic instrumentation

While understanding the OpenTelemetry SDK provides deep control, [Better Stack Tracing](https://betterstack.com/tracing/) uses eBPF to automatically instrument your Kubernetes or Docker workloads without SDK configuration, span processors, or exporters. Your traces start flowing immediately with context propagation handled automatically.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.
[/summary]

![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)

## Context propagation

While we've discussed trace spans within the context of a single service, the
true power of distributed tracing lies in its ability to connect the dots across
various microservices involved in a workflow. To achieve this, OpenTelemetry
needs a mechanism to propagate context between services, ensuring that each
service can link its spans to the parent trace initiated at the workflow's
beginning.

OpenTelemetry stores propagatable information in the runtime context. In the
Python SDK, this is cleverly implemented using the `contextvars` standard
library, providing scoped "global" variables accessible within the context of
tasks.

By default, OpenTelemetry defines two essential context variables:

- Current Span: Holds a reference to the currently active trace span, allowing
  new spans to be created as children of this span, maintaining the trace
  hierarchy.
- Baggage: Stores arbitrary key-value information that should be propagated
  across all microservices involved in the workflow, providing additional
  context for each service.

In the realm of HTTP-based communication, OpenTelemetry adheres to the W3C Trace
Context specification to propagate context via HTTP headers. The specification
outlines the following headers for carrying span context:

- `traceparent`: Contains the trace ID, parent span ID, and flags (e.g.,
  indicating if the trace was sampled)
- `tracestate`: Carries vendor-specific trace context or identifiers While the
  baggage context isn't explicitly defined in the specification, OpenTelemetry
  conveniently transmits it using an additional HTTP header named baggage.

The receiving microservice must be equipped to recognize and extract context
information from these headers, setting it in its local runtime context. This
enables the creation of new spans that are correctly associated with the
propagated trace.

OpenTelemetry's design is inherently framework and transport-protocol agnostic.
It provides the necessary functions for context extraction and injection, but
the actual propagation mechanism is implemented through instrumentation of your
clients and servers.

A rich collection of auto-instrumentors is also provided to seamlessly handle
context propagation for various popular frameworks and libraries, streamlining
the process of enabling distributed tracing in your applications.

## Metrics

Let's shift our focus to Metrics, another vital pillar of observability, and
understand how their collection mechanism differs from that of traces.

Unlike traces, where spans are actively created and completed by user code,
metrics collection is a continuous process that persists throughout the
service's lifetime. This means the collection only ceases when the service
itself shuts down.

Given that service uptime can span days or even weeks, a different approach is
necessary for exporting metrics. Instead of exporting individual measurements as

Similar to traces, OpenTelemetry utilizes a `MeterProvider` to connect metrics
with their corresponding exporters. The `MeterProvider` is responsible for
creating instances of Meter.

Meters serve as instrumentation-specific measurement components. Each
OpenTelemetry instrumentation library establishes its own meter (e.g., dedicated
meters for HTTP clients and servers).

For custom measurements, it's generally recommended to have a single global
meter per service, although you have the flexibility to create more if needed.

For example, here's how to measure a custom metric in Go:

```go
// Globally defined custom metric
userInfoCacheMissCounter := global.Meter("users").NewInt64Counter(
    "users.cache.miss",
    metric.WithDescription("The number of cache misses when fetching user's info"),
)

// Later on, you can import the metric and measure what you need
userInfoCacheMissCounter.Add(context.Background(), 1, attribute.String("user.org_id", "..."))
```

In this Go example:

- We create a global `Int64Counter` metric named `users.cache.miss` using the
  global meter associated with the `users` component.
- We provide a description for the metric.
- Later in your code, you can import this metric and use its Add method to
  increment the counter whenever a cache miss occurs, attaching relevant
  attributes for context.

### Metric instruments

Now that we have a meter, we can create specific metric instruments to capture
the measurements we want to observe. OpenTelemetry broadly classifies metrics
into two categories:

1. **Synchronous metrics**: These are metrics that you directly measure within
   your service workflows. You observe them as soon as the relevant event
   occurs. For example, incrementing a counter metric during a user login
   process falls into this category.

2. **Asynchronous (or observable) metrics**: These metrics are read from
   external sources. Instead of directly measuring the value, you observe
   aggregated or in-time statistics. An example would be monitoring the number
   of items in a queue, where you can only read the queue's size property rather
   than instrumenting the queue itself.

### Metric types

OpenTelemetry supports a variety of metric types to suit different measurement
scenarios:

- Counter (and Observable Counter): Represents an ever-growing or monotonically
  increasing value. Ideal for tracking things like the total number of requests
  processed by a service.

- UpDownCounter (and Observable UpDownCounter): A value that can both increase
  and decrease. Useful for measuring quantities that fluctuate, like the number
  of in-flight requests.

- Histogram (and Observable Histogram): Suitable for measurements where you want
  to calculate statistics like percentiles or averages. A common use case is
  tracking request latency.

- Gauge: Similar to an Observable UpDownCounter, but each measurement is treated
  as an independent data point, not summed up. Gauges are well-suited for
  monitoring system resource utilization like CPU or RAM usage.

The choice of metric type depends on the nature of the measurement you want to
capture. Consider whether the value is always increasing, can fluctuate, or
requires statistical analysis.

Remember, effective observability relies on selecting the appropriate metric
instruments and collecting meaningful data that provides insights into your
system's behavior and performance.

## Logs

Let's now shift our focus to Logs, the most prevalent and historically
significant observability signal for gaining insights into code execution, but
this time, within the context of the Go OpenTelemetry setup.

Logs are inherently straightforward to work with. You can write them to standard
output or a file and then analyze them as needed. They don't require specialized
viewers like traces or metrics, making them easily accessible. This simplicity
has resulted in the abundance of readily available logging libraries across most
programming languages.

Paradoxically, despite their widespread adoption, logs were the last signal to
be incorporated into OpenTelemetry. For numerous languages, the integration is
still in an experimental phase or entirely absent.

As of now, OpenTelemetry's log integration in Go is still under development. The
community is actively working on providing a seamless way to bridge existing
logging libraries with OpenTelemetry's capabilities. While the exact
implementation might evolve, the core principles will likely mirror those seen
in other languages.

We can anticipate a similar architecture to what we've observed in the trace
component. There will likely be a dedicated LoggerProvider responsible for
managing log processors, with exporters attached to these processors. The
processors would then forward logs to the exporters for storage in your
preferred observability backend.

## Semantic conventions

Before concluding, let's address a crucial topic that impacts service
instrumentation and metrics: maintaining consistency.

Imagine three teams within a company, each managing distinct subsystems. If
asked to define "golden signal" metrics for their services, it's highly probable
that they'd come up with different metric names, even for conceptually identical
measurements. This discrepancy is even more likely if they employ different tech
stacks with varying conventions and naming standards.

This lack of consistency can create chaos and impede the reuse of dashboards,
alerts, and other observability tools. Similar issues can arise with traces when
instrumenting database queries, object storage access, and other common
operations.

Recognizing this challenge, OpenTelemetry has introduced a set of standardized
names for prevalent operations across all three signals – traces, metrics, and
logs. By adopting these conventions, you can establish a unified view of your
entire system, facilitating analysis and understanding through your
observability tools.

In essence, OpenTelemetry's emphasis on standardization helps overcome the
fragmentation that can arise when multiple teams and technologies converge. It
fosters a cohesive observability ecosystem where insights can be gleaned
efficiently and effectively across the entire system.

## Simplifying OpenTelemetry with Better Stack

This article explored the OpenTelemetry SDK in depth: configuring providers, creating tracers and meters, managing span processors, implementing context propagation, and defining metrics. While this knowledge provides comprehensive control over telemetry collection, it requires significant setup and ongoing maintenance.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/7tQ7haFmSXI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Better Stack Tracing](https://betterstack.com/tracing/) takes a different approach that eliminates SDK configuration complexity:

- eBPF-based automatic instrumentation captures traces without SDK setup or code changes
- Databases like PostgreSQL, MySQL, Redis, and MongoDB get recognized and instrumented automatically
- Context propagation works automatically across services without manual configuration
- No need to configure providers, processors, samplers, or exporters
- Span attributes and semantic conventions are handled automatically
- Visual "bubble up" investigation surfaces performance issues through drag and drop
- AI analyzes your service map and logs during incidents, suggesting root causes
- OpenTelemetry-native architecture keeps your data portable


## Final thoughts

In this article, we delved into the inner workings of OpenTelemetry's SDK, exploring its integration from a service development perspective. **We examined how OpenTelemetry handles traces, metrics, and logs, and the mechanisms it employs to collect, process, and export** this valuable observability data.

If manual SDK configuration and instrumentation feels overwhelming, [Better Stack Tracing](https://betterstack.com/tracing/) uses eBPF for automatic instrumentation while maintaining OpenTelemetry compatibility, eliminating the need for provider configuration, span processors, and manual context propagation.

Thanks for reading!