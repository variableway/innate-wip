# OpenTelemetry Context Propagation Explained

In modern distributed systems, context propagation is the backbone of effective
request tracking across multiple services. As microservices become the standard
for application architecture, **maintaining visibility into the flow of requests
is critical for diagnosing issues, identifying bottlenecks,** and optimizing
performance.

OpenTelemetry provides a powerful framework for tracing these requests, enabling
developers to monitor their journey seamlessly across the entire system. By
ensuring trace context is consistently passed between services, OpenTelemetry
simplifies the challenge of correlating and analyzing distributed workflows.

In this article, **we’ll dive into the fundamentals of OpenTelemetry context
propagation**, explore its importance in distributed systems, and discuss how you
can implement it to achieve better observability and system reliability.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## What is context propagation in OpenTelemetry

Context propagation is a fundamental concept in distributed tracing as it
enables the seamless tracking of requests as they traverse complex systems. In
the context of OpenTelemetry, it involves the transmission of essential
information, known as trace and span contexts, between different components of
an application.

### Trace context

A trace context represents the overarching journey of a request or transaction.
It encompasses:

- **Trace ID**: A unique identifier that links all spans belonging to a specific
  trace.
- **Timestamps**: Precise timestamps that mark the initiation and completion of
  the trace.
- **Baggage**: Optional key-value pairs that can be added to carry additional
  context, such as user IDs, session IDs, or other relevant data.

### Span context

A span context focuses on individual operations or units of work within a trace.
It includes:

- **Span ID**: A unique identifier for the specific span.
- **Trace ID**: The same trace ID as the parent trace, linking the span to the
  broader context.
- **Timestamps**: Timestamps that denote the start and finish times of the span.

Context propagation enables these trace and span contexts to travel seamlessly
across service boundaries. As a request moves from one service to another, these
contexts are transmitted via protocols such as HTTP headers, gRPC metadata, or
message queues. This continuity ensures that every step of the request’s journey
is linked, even in complex, distributed architectures.

By maintaining this chain of context, OpenTelemetry empowers organizations to
achieve robust observability, uncover performance bottlenecks, and enhance the
reliability of their systems. It transforms the chaos of distributed systems
into a clear, traceable narrative, providing invaluable insights for modern
application development.

[summary]
### Simplify OpenTelemetry implementation

While manual context propagation gives you control, [Better Stack Tracing](https://betterstack.com/tracing/) automatically handles OpenTelemetry instrumentation for your Kubernetes or Docker workloads without code changes. Context propagation works out of the box.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.

[/summary]
![Better Stack Tracing bubble up](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)

## Where context propagation fits in distributed tracing

**Instrumentation** integrates OpenTelemetry into your application to capture meaningful events as spans within a trace. This provides OpenTelemetry with the data needed to create a detailed view of your application's behavior.

Once instrumentation is in place, OpenTelemetry automatically generates **trace and span contexts**, which include unique identifiers and timestamps to link operations across your system.

**Context propagation** transmits these contexts between services using mechanisms like HTTP headers, gRPC metadata, or message queues, ensuring the continuity of traces across components.

Spans break down complex operations into manageable units, capturing timing and metadata to identify performance bottlenecks and areas for optimization.

Finally, **OpenTelemetry exports telemetry data**—such as traces, metrics, and logs—to a backend system for storage and analysis, enabling valuable insights into application performance and reliability.

## W3C trace context

![W3C Trace Context Header](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/016cd285-3ab3-40f3-a183-b07c11247e00/md2x
=2742x1666)

The W3C Trace Context standard provides a standardized way to propagate trace
context information across distributed systems. This ensures that tracing tools
can consistently follow, analyze, and debug transactions, regardless of the
underlying technologies or platforms.

It has two major components: `traceparent` and `tracestate`:

- The `traceparent` contains essential information about the trace, including
  the trace and span IDs and flags indicating whether the trace is sampled or
  not.

- On the other hand, `tracestate` is an optional header used to carry additional
  context information, such as vendor-specific data or baggage items.

[ad-logs]

## Context propagation mechanisms

### 1. HTTP headers

HTTP headers are a common mechanism for propagating context in web-based
applications. The traceparent and tracestate headers are used to carry trace and
span IDs, as well as additional context information.

### 2. gRPC metadata

In gRPC-based systems, metadata is used to propagate context between services.
OpenTelemetry seamlessly integrates with gRPC to ensure smooth context
propagation.

### 3. Message queues

For message-driven architectures, context is propagated by embedding it within
messages. This allows for the correlation of events and the tracing of messages
as they flow through the messaging system.

### 4. Custom propagation

In specific scenarios, you may need to implement custom propagation mechanisms
tailored to your application's unique requirements. OpenTelemetry provides the
flexibility to design custom approaches.

## Manual context propagation

While OpenTelemetry often handles context propagation automatically, there are
instances where manual intervention is necessary. Consider a scenario involving
two microservices, Service A and Service B, communicating via Kafka:

### Service A

- _Create a span_: Initiate a new span for the operation.
- Inject context into message: Use the TraceContextTextMapPropagator to inject
  the current trace context into the message.
- Publish message: Send the message with the embedded trace context to Kafka.

```go
package main

import (
        "context"

        "go.opentelemetry.io/otel"
        "go.opentelemetry.io/otel/propagation"
        "go.opentelemetry.io/otel/trace"
)

func main() {
        // Assuming you have a tracer already set up
        tracer := otel.Tracer("your-service-name")

        // Start a new span
        ctx, span := tracer.Start(context.Background(), "My Operation")
        defer span.End()

        // Create a custom message
        message := map[string]interface{}{
                "payload": "Request data",
        }

        // Inject the current span context into the message headers
        propagator := propagation.TraceContext{}
        propagator.Inject(context.Background(), message, propagation.HeaderCarrier(message))

        // Send the message (using Kafka, for example)
        // ...
}
```

### Service B

- **Extract context from message**: Upon receiving the message, extract the
  trace context using the `TraceContextTextMapPropagator`.
- **Create a span**: Start a new span in Service B, using the extracted context
  to link it to the parent trace.
- **Process message**: Proceed with processing the message.

```go
package main

import (
	"context"
	"log"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/trace"
)

func main() {
	// Initialize propagator for trace context
	propagator := otel.GetTextMapPropagator()

	// Receive message from Kafka
	message := receiveFromKafka()

	// Extract context from headers
	headers := propagation.MapCarrier(message["headers"].(map[string]string))
	ctx := propagator.Extract(context.Background(), headers)

	// Retrieve the span from the extracted context (optional)
	span := trace.SpanFromContext(ctx)
	if span.SpanContext().IsValid() {
		log.Println("Span successfully extracted from context")
	} else {
		log.Println("No valid span found in the context")
	}

	// Set the context for the processing logic
	// (if needed, you could start a new span here)
	processRequest(message)
}
```

By manually propagating context, you can ensure that traces are accurately
correlated across different services and components, even in complex scenarios.

## Final thoughts


In modern microservice architectures, **context propagation is essential for sharing critical information across service boundaries**. This information, often referred to as "context", can include user IDs, session IDs, or other relevant data.

By leveraging OpenTelemetry's context propagation capabilities, you can enhance traceability, improve security, optimize performance, and personalize user experiences.

If you'd prefer to skip the manual instrumentation and context propagation setup, [Better Stack Tracing](https://betterstack.com/tracing/) handles OpenTelemetry automatically for Kubernetes and Docker workloads using eBPF. **Context propagation works immediately without writing injection and extraction code**.

Thanks for reading!