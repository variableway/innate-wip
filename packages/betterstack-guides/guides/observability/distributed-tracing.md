# Distributed Tracing for Developers: A Primer

Modern internet applications are commonly implemented as cloud-native
distributed systems. **These systems consist of numerous interconnected
components**, often developed by different teams in different programming
languages, and deployed across diverse locations around the world.

While this approach offers many benefits, **it also introduces significant
complexity**. User requests often traverse multiple processes, machines, and
networks before they are completed, making it challenging to understand the flow
of data and ensure smooth operation.

To tackle these challenges, **monitoring the interactions between components is
crucial**. However, traditional troubleshooting methods—such as analyzing logs and
metrics—often lack the context needed to provide a complete picture of system
behavior.

![A complete trace example](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/043704df-d0b0-41f6-9e07-50163aa98b00/lg1x
=5150x1150)

This is where distributed tracing comes in. It refers to the tracking of
requests across all the different services and components, giving you a clear
picture of what's happening in real-time. This **makes it much easier to debug
errors, local performance problems**, and understanding of complex interactions
within your system.

The data collected through distributed tracing, known as a "[trace](#1-trace)",
offers a detailed view of system relationships. This trace acts as a visual map,
helping you quickly identify the root cause of errors and performance
bottlenecks in your system.

In this guide, we'll cover the basics of distributed tracing: how it works, its
core concepts, the benefits and challenges involved, and practices to follow for
a successful implementation.

Let's dive in!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Why is distributed tracing needed?

Over the last 15 years, a revolution in application design has been driven by
cloud computing, containerization, and microservices. This shift has enabled
greater scalability, efficiency, and faster feature delivery, but it has also
introduced new challenges and complexities. Understanding these complexities is
where distributed tracing becomes crucial.

![The evolution of application design](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/62d6e6aa-8bbd-4c68-b062-2a8a863cd800/lg2x
=2200x1443)

Consider a scenario where a user browses an e-commerce website, searches for
products, adds items to their shopping cart, and proceeds to checkout and
payment. The potential services involved and their interactions could include:

1. **Product catalog service**: Handles product queries by coordinating searches
   for categories, availability, shipping details, and pricing.

2. **Recommendation engine**: Provides personalized product suggestions based on
   user history, influencing search results and listings.

3. **Payment gateway**: Manages payment processing, interacting with external
   banking services or credit card networks.

4. **Order management system**: Processes orders after payment, coordinates
   inventory updates, and initiates shipping logistics.

In such a system, a single request can pass through several services or APIs,
and a failure or slowdown in any of these components can significantly impact
the user experience.

Pinpointing the root cause of issues in such distributed systems is challenging
due to a few reasons such as:

- Frequent service updates such as instance creation and destruction,
- The potential for shared resources to create ripple effects across seemingly
  unrelated requests,
- A lack of expertise across all services when teams are siloed,
- Data inconsistency issues,
- Lack of uniform instrumentation across the services,
- Hidden or undocumented dependencies.

This complexity gave rise to distributed tracing as a way to understand exactly
what happens to any request being investigated. It helps answer critical
questions like:

- What services did the request pass through?
- What did each service do, and how long did it take?
- Where are the bottlenecks in the pipeline?
- If there was an error, where did it originate?
- Did the request behave abnormally (compared to other identical requests)?
- What was the critical path?
- Who should be paged to investigate and resolve the issue?

The need for these kind of insights was popularized by Google's influential
[Dapper paper (2010)](https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/)
by Ben Sigelman et al, which brought the concept of distributed tracing for
understanding complex systems to the mainstream.

This sparked a wave of open-source projects, including prominent examples like
[Twitter's Zipkin (2012)](https://zipkin.io/) and [Uber's Jaeger
(2017)](https://betterstack.com/community/guides/observability/jaeger-guide/). These tools have helped establish the core concepts and
benefits of distributed tracing, despite differences in individual
implementations.

In the next section, we'll dive into the specifics of how distributed tracing
works.

[summary]
### Instrument tracing without code changes
Try [Better Stack Tracing](https://betterstack.com/tracing/) and instrument your Kubernetes or Docker workloads without code changes. Start ingesting traces in about 5 minutes.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.

[/summary]


![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)


## How distributed tracing works

A trace captures the entire lifecycle of an operation you're monitoring, such as
an HTTP request or a background task. When this operation spans multiple
services, the trace becomes a distributed trace as it consists of data gathered
from each service involved in the process.

![The initial span and trace ID generation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/802a8ddd-134a-41e1-8203-6fdaf082f500/md2x
=2068x954)

The primary purpose of distributed tracing is to enable you see relationships
among various services. This is achieved by collecting data the moment a request
is initiated and assigning a unique identifier called a trace ID to link
together all the events and data related to that specific request.

![Span creation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cc7c1a0b-c4d5-45ee-e019-d867ebafa600/lg1x
=3538x837)

As a request journeys through various services, each one creates one or more
[spans](#3-span) to represent the units of work done by the service. Spans
record timing information, the service name, and potentially contextual
attributes related to the work being performed.

![The basic structure of a trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e551cbc1-9b55-45a1-3d1e-e7954fd10f00/lg1x
=3787x1939)

Within each trace, there is a parent-child hierarchy of spans. The initial span
is the root, with subsequent spans nested within it, each with its own unique
ID. All spans inherit the trace ID from its parent, and critically, services
pass this context when communicating with each other. This links all the actions
taken for a request across the entire distributed system.

After the request is completed, the trace data is sent to a tracing backend or
monitoring platform. This is typically done by an agent like the [OpenTelemetry
Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/), which ingests the data, processes it, and
forwards it to the specified backend.

![Image of Gantt chart in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2e9c2927-321a-4f82-a8c3-a638c0f39d00/lg2x
=2570x1774)

The collected traces are often visualized in
[Gantt charts](https://en.wikipedia.org/wiki/Gantt_chart), revealing how
different services interact within a single request. Since spans are timed, you
will see a clear timeline of the request flow, which can help guide your
troubleshooting efforts accordingly.

## Distributed tracing components

Distributed tracing involves several components that work together to capture
and analyze the flow of requests across a distributed system. The key components
and their relationships are explained below:

### 1. Trace

![Screenshot of Trace in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f4fc1665-ece5-49e6-3810-a600bec7f900/md1x
=4029x1667)

A trace represents the end-to-end journey of a request as it passes through
various services and components in a system. It is simply a collection of
[spans](#3-span) that share the same trace ID.

### 2. Trace ID

![Trace ID in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/33ce55fe-9da1-42f2-6a13-c61d8a3c4700/public
=2357x220)

The trace ID is a unique identifier assigned to each distinct trace. It links
together all the spans that constitute a single trace, regardless of the
processes or services involved. It is generated at the entry point of the
request in a way that ensures global uniqueness with a high degree of certainty.

### 3. Span

A span is the fundamental unit of work in a trace. Each span has a unique ID, a
parent ID (except the root span), a start and end time, a name, and additional
metadata that describe the operation.

Here is a JSON representation of trace spans in the [OpenTelemetry
Protocol](https://betterstack.com/community/guides/observability/otlp/):

```jsonc
{
  "Name": "HTTP GET /",
  "SpanContext": {
[highlight]
    "TraceID": "e3c306d18bac2742de07756bdb9e607b",
    "SpanID": "3ee91f86b5468681",
[/highlight]
    "TraceFlags": "01",
    "TraceState": "",
    "Remote": false
  },
  "Parent": {
    "TraceID": "00000000000000000000000000000000",
    "SpanID": "0000000000000000",
    "TraceFlags": "00",
    "TraceState": "",
    "Remote": false
  },
  "SpanKind": 2,
[highlight]
  "StartTime": "2024-08-26T14:19:47.205308249+01:00",
  "EndTime": "2024-08-26T14:19:47.206802188+01:00",
[/highlight]
  "Attributes": [. . .],
  "Events": null,
  "Links": null,
  "Status": {
    "Code": "Unset",
    "Description": ""
  },
  "DroppedAttributes": 0,
  "DroppedEvents": 0,
  "DroppedLinks": 0,
  "ChildSpanCount": 0,
  "Resource": [. . .],
  "InstrumentationLibrary": {
    "Name": "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
    "Version": "0.53.0",
    "SchemaURL": ""
  }
}
```

### 4. Instrumentation

Instrumentation refers to the process of adding code to your application to
generate trace (or other telemetry) data. When an application is instrumented,
it becomes capable of creating spans that represent units of work and trace IDs
that help link spans together into complete traces.

For effective and standardized instrumentation, consider using
[OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/), an open-source observability framework
that supports not only traces but also logs and metrics, making it easy to
collect, process, and export comprehensive telemetry data for monitoring and
troubleshooting across your services.

You can get started quickly with OpenTelemetry's automatic instrumentation to
gain basic visibility into your services, and then progressively add more
detailed instrumentation as needed.

```go
// Basic example of instrumenting Go code with OpenTelemetry
func executeQuery(ctx context.Context, tracer trace.Tracer, db *sql.DB, query string) (*sql.Rows, error) {
	// 1. Create a new span
	var span trace.Span
	ctx, span = tracer.Start(ctx, "db query")
	// 2. Ensure that the span is completed regardless of whether the query
    // succeeded or failed
	defer span.End()

	// 3. Record which query is being executed
	span.SetAttributes(semconv.DBStatement(query))

	stmt, err := db.Prepare(query)
	if err != nil {
		// 4. Record that the query preparation failed
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	defer stmt.Close()

	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		// 5. Record that the query execution failed
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}

    // 6. Record that the query execution was successful
	span.SetStatus(codes.Ok, "query successful")

	return rows, nil
}
```

See our [observability guides](https://betterstack.com/community/guides/observability/) for detailed tutorials on
instrumenting applications written in various languages with OpenTelemetry.

### 5. Span attributes

![Span attributes in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/503f215f-c27c-4de0-4d38-0d9646199900/lg2x
=2934x907)

Span attributes are key-value pairs that provide additional context about a
specific span within a trace. They allow you to capture details about the
operation that are not captured by the span's name or other standard fields and
correlate them from one service to another.

For example, if a span tracks the process of executing a database query,
attributes could include the query type (e.g., `SELECT`, `UPDATE`), database
name, table name, query execution time, user ID initiating the query, and the
number of rows returned.

### 6. Span events or logs

![Span events in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/050e0b81-33ba-4afe-ade9-7b2f345e8c00/orig
=2932x921)

Think of span events like annotations of specific occurrences during a span's
lifetime. It represents a significant event that's too fleeting to get its own
span, and too distinct to be merged with the parent span.

For instance, consider a span representing a database query. Within that span,
span events could mark key steps, such as:

- When the query is dispatched to the database.
- When the system checks the cache but doesn't find the relevant data.
- When the database begins processing the returned rows.

These events provide a more detailed timeline, helping you understand specific
points within the broader span, such as unexpected delays or important
operations.

### 7. Trace context

The trace context is a set of identifiers that are propagated across service
boundaries to connect spans together and form a complete trace. It includes the
trace ID, parent span ID, timestamps, and other state information such as
whether the parent span was sampled or not.

### 8. Context propagation

This is the fundamental mechanism that underpins distributed tracing. It is the
process of carrying information about a request's state as it travels through
the various components, services, and networks in a distributed system.

It ensures that each service involved in handling a request has the necessary
metadata to link their operations together, enabling end-to-end visibility of
that request. For HTTP requests, context propagation is typically accomplished
through HTTP headers.

Distributed tracing is designed to be seamless so your instrumentation library
will automatically handles the propagation of trace context in almost all
situations. You'll only need to handle this manually in exceptional cases.

### 9. Trace sampling

Tracing every request in a busy system would create a huge amount of data. Trace
sampling strikes a balance between capturing valuable insights and managing
system performance and cost.

If you're instrumenting with OpenTelemetry, you can check the `IsRecording()`
property to avoid unnecessarily generating expensive telemetry data.

```go
if span.IsRecording() {
  // generate expensive data
}
```

### 10. Backend analysis tool

Tracing backends like Better Stack, Jaeger, Zipkin, and Grafana Tempo turn raw trace data into actionable insights:

- Easily explore and query your traces.
- Visualize request journeys and identify bottlenecks.
- Gain a deeper understanding of your application's behavior.
- Alert you when things go wrong.

If you want a backend that works well with OpenTelemetry and supports fast investigation workflows, [Better Stack Tracing](https://betterstack.com/tracing) is a good place to start. 

![Screenshot of Better Stack UI](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5ded9c6d-9da0-4029-f8cf-1bb8c8519100/lg2x =3680x2280)

It is especially useful when you want more than basic trace storage, such as:

* eBPF based zero code instrumentation for Kubernetes and Docker
* Control over sampling, compression, and batching in the collector
* Bubble up investigations to quickly find the root cause of slow requests

## How distributed tracing impacts observability

<!-- TODO: Log traces metrics image -->

Distributed tracing sits alongside logs, events, metrics, and profiles as the
[building blocks of observability](https://betterstack.com/community/guides/observability/what-is-observability/), but they serve
different purposes and complement each other.

Tracing provides context by linking related operations across services, which
helps you understand the behavior of distributed systems where issues may span
multiple components.

Logs and events provide depth by offering detailed, local information about the
work performed within each component. They can provide the "why" behind the
behavior observed in traces, such as detailed error messages or system states
leading up to an issue.

Metrics report aggregated statistics on service health like error rates, request
latency, and resource utilization, while continuous profiling helps you
understand resource usage down to the line number in your program.

## The distributed tracing ecosystem

Deploying a successful tracing system goes beyond simply instrumenting your
application and setting up a tracing backend. This section outlines some key
aspects of the distributed tracing ecosystem you should be aware of to ensure
full compatibility and interoperability with the wider ecosystem now and well
into the future.

### OpenTelemetry

In the past, instrumenting your code and getting telemetry data out of your
applications was a largely vendor-specific process, and every monitoring tool
had its way of doing things. This meant switching tools required a rewrite of
your instrumentation code, leading to friction and duplicated effort.

To combat this, the observability community developed open-source projects like
[OpenTracing](https://opentracing.io/) (from the Cloud Native Computing
Foundation (CNCF)) and [OpenCensus](https://opencensus.io/) (from Google). These
competing projects aimed to create a vendor-neutral way to generate and collect
telemetry data. In 2019, they merged to form
[OpenTelemetry (OTel)](https://opentelemetry.io/) under the CNCF.

OpenTelemetry offers a unified solution for generating and capturing traces,
metrics, logs, and other telemetry data. It's designed to be agnostic about
where you send this data for analysis, eliminating the lock-in of past solutions
while providing a robust, standardized approach to instrumentation. With OTel,
you can instrument your code once and switch observability backends at will.

**Learn more**: A Complete Introductory Guide to
[OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) and the [OpenTelemetry
Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/)

### Trace analysis tools

![Jaeger UI](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4ffe0193-48fd-4200-a4a1-8df5e7f68e00/orig
=4547x2321)

Trace analysis tools are designed to help you understand the behavior of complex
software systems by analyzing the already captured traces, which are then used
to:

- Provide graphical representations of how requests move through different
  components of a system, making it easier to identify bottlenecks or errors.

- Pinpoint slow or inefficient parts of your code or infrastructure.

- Trace errors back to their root cause by examining the sequence of events
  leading up to the error.

- Monitor the overall health of a system, identify trends, and alert when
  potential issues are uncovered.

There are numerous trace analysis tools available, both open source and proprietary, including Better Stack Tracing, Jaeger, Zipkin, and Grafana Tempo. In a separate article, we will guide you on how to choose the best tool to suit your needs.

### W3C Trace Context

In 2017, a coalition of vendors, cloud providers, and open source projects
established the W3C Distributed Tracing Working Group which focuses on creating
standards for tracing tool interoperability.

The problem was that existing distributed tracing implementations lacked a
standardized way to propagate context information across different vendors and
platforms.

This lack of standardization led to inability to correlate traces across
different vendors, difficulty propagating traces between vendors, potential loss
of vendor-specific metadata, and lack of support from cloud and service
providers.

![W3C Trace Context Header](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/016cd285-3ab3-40f3-a183-b07c11247e00/md2x
=2742x1666)

Their primary initiative, the
[Trace Context specification](https://www.w3.org/TR/trace-context/), provides a
vendor-neutral solution for propagating the [trace context](#7-trace-context)
across these distributed systems. It does this through two key HTTP headers:

- `traceparent`: This header carries the essential information for identifying
  and correlating requests within a trace. It includes:

  - **Trace ID**: A unique identifier for the entire trace, spanning all
    services involved.
  - **Parent ID**: The ID of the direct parent operation in the trace,
    establishing the relationship between operations.
  - **Flags**: Indicate sampling decisions and other trace-related options.

- `tracestate`: This header allows vendors to include their own custom tracing
  data alongside the standardized `traceparent` information. This enables
  interoperability while still supporting vendor-specific features.

### W3C Baggage

[The W3C Baggage](https://www.w3.org/TR/baggage/) specification standardizes the
representation and propagation of application-defined properties for a
distributed request or workflow execution. It is separate from the Trace Context
specification, and implemented as its own HTTP header which looks like this:

```text
baggage: userId=alice,serverNode=DF%2028,isProduction=false
```

Its purpose is to enable the propagation of system-specific contextual data
across services in a distributed system without requiring any modifications to
the services themselves. Each service can access existing contextual information
or add new ones to be shared with subsequent services in the workflow.

The term "baggage" was coined by Professor Rodrigo Fonseca from Brown
University. It draws from the concept of luggage or baggage that travelers carry
with them. Just as luggage contains items necessary for a journey, the `baggage`
header carries contextual information necessary for a request's journey through
a distributed system.

## Challenges of distributed tracing

Distributed tracing, while incredibly powerful for understanding complex
systems, presents several challenges:

### 1. Clock skew

![Clock skew warning in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a8309867-de30-437c-785c-980da39f1100/lg1x
=3421x399)

Clock skew refers to when there's a discrepancy between nodes in a distributed
system. For instance, if your application server's system time isn't
synchronized with that of your database server, the spans they create they might
appear out of order in the final trace. To mitigate this, utilize the
[Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol)
(NTP) or your cloud provider's clock synchronization services.

### 2. Instrumentation overhead

Capturing and transmitting trace data can introduce significant amounts of
latency especially in high-traffic environments. Careful configuration and
optimization are necessary to minimize this impact.

### 3. Learning curve

Understanding and implementing distributed tracing concepts can be complex,
requiring a good grasp of concepts like context propagation, instrumentation,
and sampling strategies. You'll need to invest a non-trivial amount of time to
learn and master these concepts. We have [detailed guides](https://betterstack.com/community/guides/observability/) to
help though.

### 4. Data volume and sampling

A major hurdle in distributed tracing is managing the sheer volume of generated
data. With potentially thousands of services generating a deluge of trace data
every second, questions arise: How to efficiently capture and store it? What
data to retain and for how long? How to scale data collection in line with the
ever-increasing request volume?

Sampling techniques help with managing data volume, but they introduce the
challenge of ensuring representative sampling without losing critical
information.

### 5. Protecting sensitive data

<!-- TODO: Add diagram describing data masking -->

While distributed tracing provides valuable insights, it's crucial to address
potential privacy risks. Sensitive data might be captured in traces, requiring
careful handling to comply with regulations like GDPR and CCPA.

Techniques like data masking or redaction, anonymization, and appropriate data
retention policies can help mitigate these risks. See our guide on [using the
OpenTelemetry Collector to redact sensitive
data](https://betterstack.com/community/guides/observability/redacting-sensitive-data-opentelemetry/) for more information.

## Final thoughts

I hope this article has helped you understand how distributed tracing can **help you decipher the interactions between the different services that make up your application**, and how to navigate the tracing ecosystem effectively.

You can put this into practice by exporting traces via OpenTelemetry to a backend such as [Better Stack Tracing](https://betterstack.com/tracing).

Thanks for reading, and happy tracing!
