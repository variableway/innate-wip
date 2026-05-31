# Essential OpenTelemetry Best Practices for Robust Observability

In today's complex distributed systems, **effective observability is critical for
understanding application behavior, troubleshooting issues,** and maintaining
performance. [OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) has emerged as the leading open standard for
generating and collecting telemetry data, providing a unified approach to
instrumentation across different languages and frameworks.

However, **implementing OpenTelemetry effectively requires careful planning and
consideration**. Based on real-world experiences, this article
presents six essential best practices that will help you maximize the value of
your OpenTelemetry implementation while avoiding common pitfalls.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## 1. Start with Auto-instrumentation

The foundation of any successful OpenTelemetry implementation begins with a
thoughtful instrumentation strategy. How you instrument your applications will
directly impact the quality and usefulness of your telemetry data.

Auto-instrumentation provides an excellent starting point for your OpenTelemetry
journey. It automatically instruments common libraries and frameworks, giving
you immediate visibility into your application's behavior without requiring
extensive code changes.

Auto-instrumentation casts a wide net, collecting data from HTTP requests,
database queries, external API calls, and other common operations. This broad
coverage allows you to quickly identify performance bottlenecks and issues
without having to manually instrument every part of your application.

A critical but often overlooked detail is ensuring that OpenTelemetry is
initialized before any instrumented libraries are used. This means including the
OpenTelemetry SDK and configuration at the very beginning of your application's
startup sequence.

For JavaScript applications, this means importing and configuring the
OpenTelemetry SDK at the entry point of your application, before importing any
other libraries or modules that you want to instrument.

```javascript
// Initialize OpenTelemetry first - before other library imports
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Create and configure the tracer provider
const provider = new NodeTracerProvider();
const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces'
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// Register auto-instrumentations
registerInstrumentations({
  instrumentations: [
    // Add your instrumentations here
  ],
});

// Now import your application modules
const express = require('express');
const app = express();
```

If you don't initialize OpenTelemetry early enough, you risk missing important
spans and metrics from the early stages of your application's execution.

### Add targeted manual instrumentation

While auto-instrumentation provides excellent baseline coverage, it can't
capture everything. To get the most value from OpenTelemetry, you'll need to add
manual instrumentation for business-critical paths and custom code.

Manual instrumentation allows you to:

- Add context to automated spans with business-relevant attributes
- Create spans for code that isn't covered by auto-instrumentation
- Capture custom metrics specific to your application domain
- Add span events for important state transitions or milestones

When adding manual instrumentation, remember to always close your spans.
Unclosed spans can lead to incomplete traces and resource leaks. In JavaScript,
use async/await or Promises with finally blocks to ensure spans are properly
closed even when exceptions occur.

```javascript
const { trace, SpanStatusCode } = require('@opentelemetry/api');

async function processOrder(orderId, customerId) {
  const tracer = trace.getTracer('my-service');

  // Create a span for the operation
  const span = tracer.startSpan('processOrder');

  // Add relevant attributes
  span.setAttribute('order.id', orderId);
  span.setAttribute('customer.id', customerId);

  try {
    // Set the current span as active for context propagation
    return await tracer.startActiveSpan('processOrder', async (activeSpan) => {
      // Your business logic here
      await processPayment(orderId);

      // Add events to mark important milestones
      activeSpan.addEvent('payment.processed');

      const result = await updateInventory(orderId);
      activeSpan.addEvent('inventory.updated');

      return result;
    });
  } catch (error) {
    // Record the error on the span
    span.setStatus({ code: SpanStatusCode.ERROR });
    span.recordException(error);
    throw error;
  } finally {
    // Always end the span
    span.end();
  }
}
```

The most effective approach combines auto and manual instrumentation. Start with
auto-instrumentation to get broad coverage, then strategically add manual
instrumentation to fill gaps and add business context where needed.

## 2. Optimize attribute and context management

Attributes and context provide the critical metadata that makes your telemetry
data meaningful and useful. Effective attribute management ensures that you have
the information you need to understand your application's behavior without
collecting unnecessary data.

### Follow semantic conventions

OpenTelemetry defines [semantic conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/) that provide a common vocabulary for
describing different types of entities. Following these conventions ensures that
your data is consistent and interoperable across different services and tools.

Some key semantic conventions include:

- `http.method` and `http.status_code` for HTTP requests.
- `db.system` and `db.statement` for database operations.
- `messaging.system` and `messaging.destination` for messaging operations.

These conventions make it easier to build queries and visualizations that work
consistently across your entire system.

### Apply descriptive and consistent naming

When naming custom attributes and resources, prioritize descriptive names that
clearly communicate their purpose. Avoid using unfamiliar abbreviations or
acronyms that might confuse future readers of your data.

Establish a consistent style for:

- Capitalization (e.g. snake_case)
- Formatting (e.g., using prefixes like `app.` for application-specific
  attributes)
- Punctuation (e.g., using dots or underscores as separators)

Consistency makes your data easier to query and understand, reducing the
cognitive load when analyzing telemetry data.

### Include only relevant attributes

When adding attributes to spans, only include information that's relevant to the
operation the span represents. For example, if you're tracing an HTTP request,
include attributes like the request method, URL, and response status code, but
not unrelated information like system memory usage.

As a general rule, avoid:

- Putting metrics or logs as attributes in spans.
- Including redundant attributes that specify the same information.
- Adding high-cardinality attributes to every span (e.g., user IDs on spans that
  don't need them).

Remember that each attribute increases the size of your spans, which can impact
storage costs and query performance.

### Implement effective context propagation

Context propagation is essential for maintaining trace continuity across service
boundaries. Unless you have unique requirements, use the W3C Trace Context
standard, which is the default propagation format in most OpenTelemetry SDKs.

For HTTP and gRPC communication, auto-instrumentation typically handles context
propagation automatically. For custom communication channels, you'll need to
manually propagate context.

OpenTelemetry's baggage feature is particularly valuable for propagating
contextual information across service boundaries. It allows you to pass
key-value pairs from one service to another, ensuring that important context is
available throughout a transaction.

For example, if the first service in a chain knows the customer ID, you can add
it to baggage to make it available to downstream services:

```javascript
const { context, propagation, baggage } = require('@opentelemetry/api');

function enrichContextWithCustomerId(customerId) {
  // Create baggage with customer ID
  const customerBaggage = baggage.setBaggage(baggage.createBaggage(), 'customer.id', customerId);

  // Set as current context
  return context.with(propagation.setBaggage(context.active(), customerBaggage), () => {
    // Make downstream service call - the context will be propagated
    return callDownstreamService();
  });
}
```

This ensures that all spans in the trace can access the customer ID, even if
they don't directly have that information available.

[summary]
### Eliminate collector complexity with automatic instrumentation

While configuring collectors provides flexibility, [Better Stack Tracing](https://betterstack.com/tracing/) uses eBPF to automatically instrument your Kubernetes or Docker workloads without managing collector infrastructure. Your traces flow immediately with built-in processing and routing handled for you.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.
[/summary]

![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)

## 3. Deploy and configure collectors effectively

The [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) serves as a central hub
for processing and routing telemetry data. Using collectors effectively can
significantly improve the reliability, security, and flexibility of your
observability pipeline.

### Deploy collectors in all production environments

While it might be tempting to send telemetry data directly from your
applications to your observability backend in simple environments, using a
collector provides numerous benefits that make it worthwhile even in smaller
deployments:

- Buffer data during backend outages
- Centralize and manage authentication credentials
- Preprocess data before sending it to backends
- Route data to multiple destinations
- Reduce the load on your applications by offloading telemetry processing

### Choose the right deployment pattern

There are several common deployment patterns for collectors, each with its own
advantages:

1. **Agent pattern**: Deploy a collector alongside each application instance to
   minimize network traffic and provide isolation between applications.

2. **Gateway pattern**: Deploy centralized collectors that receive data from
   multiple applications and forward it to backends. This simplifies
   configuration management but creates potential single points of failure.

3. **Hierarchical pattern**: Combine agent and gateway collectors, with agents
   handling local processing and gateways handling aggregation and routing.

For most production environments, a hierarchical approach provides the best
balance of reliability and manageability.

### Buffer, batch, and process telemetry

Configuring appropriate buffering and batching in your collectors can
significantly improve performance and reliability:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  batch:
    send_batch_size: 10000
    timeout: 10s
  memory_limiter:
    check_interval: 1s
    limit_mib: 1000

exporters:
  otlp:
    endpoint: observability-backend:4317
    tls:
      insecure: false

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp]
```

This configuration batches telemetry data into larger chunks before sending it
to the backend, reducing network overhead and improving throughput. It also
includes a memory limiter to prevent the collector from using too much memory
during traffic spikes.

### Pre-process sensitive data

One of the most valuable capabilities of collectors is their ability to process
telemetry data before it leaves your environment. This is particularly important
for handling sensitive data like personally identifiable information (PII) or
protected health information (PHI).

You can configure processors to [redact, hash, or mask sensitive
data](https://betterstack.com/community/guides/observability/redacting-sensitive-data-opentelemetry/) before it's sent to your backend:

```yaml
processors:
  filter:
    spans:
      include:
        match_type: regexp
        attributes:
          - key: db.statement
            value: "(?i)(?:password|passwd|pwd)\\s*=\\s*[^\\s,;]+"
      actions:
        - key: db.statement
          action: update
          value: "REDACTED"
```

This configuration redacts database statements that contain password
information, ensuring that sensitive credentials aren't stored in your
observability platform.

[ad-logs]

## 4. Implement smart sampling strategies

As your system grows, the volume of telemetry data can become overwhelming.
[Sampling](https://betterstack.com/community/guides/observability/opentelemetry-sampling/) allows you to reduce the volume of data while
still maintaining visibility into your system's behavior.

The ideal sampling strategy balances the need for complete data with the costs
of collecting, transmitting, and storing that data. While collecting everything
might seem ideal, it can quickly become prohibitively expensive and even impact
application performance.

OpenTelemetry supports several sampling approaches:

1. **Head sampling**: Decisions are made at the beginning of a trace, before
   most spans are created. This is simple but can miss important data.

2. **Tail sampling**: Decisions are made after all spans in a trace are
   collected, allowing for more intelligent sampling based on the complete
   trace. However, this requires buffering all spans until the trace is
   complete.

3. **Probabilistic sampling**: Randomly samples a percentage of traces. Simple
   to implement but doesn't distinguish between normal and error cases.

4. **Rate limiting sampling**: Limits the number of traces per time period.
   Useful for controlling data volume during traffic spikes.

For most production systems, a combination of approaches works best. For
example, you might use probabilistic sampling for normal traffic and ensure that
all error traces are kept:

```javascript
const { ParentBasedSampler, TraceIdRatioBased } = require('@opentelemetry/sdk-trace-node');

// Create a sampler that keeps all error traces and samples 10% of normal traces
const errorAttributeSampler = {
  shouldSample(context, traceId, spanName, spanKind, attributes) {
    // Always sample if there's an error attribute
    if (attributes && attributes.error === true) {
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLED
      };
    }
    // Delegate to the base sampler
    return { decision: SamplingDecision.NOT_RECORD };
  }
};

const compositeSampler = {
  shouldSample(context, traceId, spanName, spanKind, attributes) {
    // Try the error sampler first
    const errorSamplerResult = errorAttributeSampler.shouldSample(
      context, traceId, spanName, spanKind, attributes
    );

    if (errorSamplerResult.decision === SamplingDecision.RECORD_AND_SAMPLED) {
      return errorSamplerResult;
    }

    // Fall back to 10% sampling for normal traces
    return new TraceIdRatioBased(0.1).shouldSample(
      context, traceId, spanName, spanKind, attributes
    );
  }
};

// Use parent-based sampling to maintain trace consistency
const sampler = new ParentBasedSampler({
  root: compositeSampler
});
```

When implementing sampling, it's important to ensure that your metrics remain
accurate. One approach is to generate metrics before sampling occurs, ensuring
that your metrics reflect all operations even if some traces are discarded.

The OpenTelemetry Collector's metrics generator processor can help with this:

```yaml
processors:
  metricsgenerator:
    rules:
      - name: span.count
        type: sum
        inputs:
          - name: span
            type: counter
        dimensions:
          - name: service.name
          - name: span.kind
          - name: status.code
```

This configuration generates count metrics for all spans before any sampling
occurs, ensuring that your metrics accurately reflect the total number of
operations even if some traces are sampled out.

## 5. Correlate telemetry data types

One of the most powerful aspects of OpenTelemetry is its ability to generate and
correlate different types of telemetry data: traces, metrics, and logs.
Effectively correlating these data types provides a comprehensive view of your
system's behavior.

To enable correlation, ensure that your logs include trace and span IDs when
available. This allows you to navigate from a log entry to the corresponding
trace, providing context for log messages.

```javascript
const winston = require('winston');
const { trace } = require('@opentelemetry/api');

// Configure your logger to include trace context
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format((info) => {
      const span = trace.getSpan(trace.context());
      if (span) {
        const context = span.spanContext();
        info.trace_id = context.traceId;
        info.span_id = context.spanId;
      }
      return info;
    })()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Now your logs will include trace and span IDs
logger.info('Processing order', { orderId: '12345' });
```

Similarly, adding service and instance information to both logs and metrics
enables correlation across all telemetry types.

### Implement span metrics for RED analysis

Rate, Error, and Duration (RED) metrics provide a high-level overview of service
health. OpenTelemetry can automatically generate these metrics from your trace
data using the span metrics processor:

```yaml
processors:
  spanmetrics:
    metrics_exporter: prometheus
    dimensions:
      - name: service.name
      - name: http.method
      - name: http.status_code
    dimensions_cache_size: 1000
    aggregation_temporality: AGGREGATION_TEMPORALITY_CUMULATIVE
```

This configuration generates request count, error count, and duration metrics
for each combination of service, HTTP method, and status code, allowing you to
monitor the overall health of your services without querying individual traces.

### Visualize system dependencies

Service graphs provide a visual representation of the relationships between your
services. The service graph processor can automatically generate these graphs
from your trace data:

```yaml
processors:
  servicegraph:
    metrics_exporter: prometheus
    store:
      ttl: 2s
      max_items: 1000
```

This configuration generates metrics that describe the connections between
services, which can be visualized in tools like Grafana to create service
dependency maps.

## 6. Performance optimization

OpenTelemetry is designed to be lightweight, but without proper optimization, it
can still impact your application's performance. Careful configuration can
minimize this impact while still providing valuable telemetry data.

Below are some strategies to explore:

### Batch and compress telemetry

Batching multiple telemetry items into a single transmission reduces network
overhead and improves throughput. Both the OpenTelemetry SDK and Collector
support batching:

```javascript
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces'
});

// Configure batch processing for better performance
const batchProcessor = new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,            // Maximum queue size
  maxExportBatchSize: 512,       // Number of spans to send at once
  scheduledDelayMillis: 5000,    // How frequently to send batches
  exportTimeoutMillis: 30000     // How long to wait for the export to complete
});

// Add the processor to your provider
provider.addSpanProcessor(batchProcessor);
```

Similarly, enabling compression can significantly reduce the amount of data
transmitted over the network:

```javascript
const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces',
  compression: 'gzip'  // Enable compression
});
```

These optimizations are particularly important for high-throughput applications
that generate large volumes of telemetry data.

### Monitor instrumentation impact

Even with optimization, it's important to monitor the impact of your
instrumentation on application performance. This includes:

- CPU usage by instrumentation components
- Memory usage, particularly for buffered telemetry data
- Network bandwidth consumed by telemetry transmission
- Latency added to operations by instrumentation

If you observe significant performance impact, consider adjusting your sampling
rate or reducing the amount of telemetry data collected.

### Implement circuit breakers

To prevent telemetry collection from impacting application availability during
outages or overload situations, implement circuit breakers in your telemetry
pipeline:

```javascript
const { Resource } = require('@opentelemetry/resources');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const exporter = new OTLPTraceExporter({
  url: 'http://collector:4318/v1/traces',
  timeoutMillis: 10000  // 10 second timeout for export operations
});

// Configure the processor with limits
const batchProcessor = new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,           // Limit memory usage
  maxExportBatchSize: 512,      // Reasonable batch size
  exportTimeoutMillis: 30000    // Timeout for exports
});

// Create the provider with the processor
const provider = new NodeTracerProvider({
  resource: new Resource({ 'service.name': 'my-service' })
});
provider.addSpanProcessor(batchProcessor);
provider.register();
```

This configuration sets timeouts for export operations and limits the amount of
memory used for buffering spans, ensuring that telemetry collection doesn't
consume excessive resources even if the backend is unavailable.

## Simplifying OpenTelemetry with Better Stack

We've covered best practices for implementing OpenTelemetry effectively: auto-instrumentation with manual additions, attribute management, collector deployment, sampling strategies, data correlation, and performance optimization. While these practices create robust observability, they require significant setup and ongoing maintenance.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Better Stack Tracing](https://betterstack.com/tracing/) takes a different approach that eliminates much of this complexity:

- eBPF-based automatic instrumentation captures traces without code changes or SDK configuration
- Databases like PostgreSQL, MySQL, Redis, and MongoDB get recognized and instrumented automatically
- No need to deploy, configure, or maintain collector infrastructure
- Context propagation and attribute management work automatically across services
- Built-in processing handles sensitive data redaction without custom processors
- Visual "bubble up" investigation surfaces performance issues through drag and drop
- AI analyzes your service map and logs during incidents, suggesting root causes
- OpenTelemetry-native architecture keeps your data portable

Instead of configuring samplers, processors, and exporters, you point Better Stack at your cluster and traces start flowing. The platform handles batching, compression, and routing automatically while ingesting all your data without sampling limitations.

If you'd like to maintain OpenTelemetry compatibility while avoiding the complexity of manual implementation, check out [Better Stack Tracing](https://betterstack.com/tracing/).


## Final thoughts

Implementing OpenTelemetry effectively requires careful planning and ongoing refinement. By following these six best practices, you can build a robust observability foundation that provides valuable insights into your system's behavior without excessive complexity or cost.

Remember that observability is a journey, not a destination. Start with the basics, learn from your experiences, and continuously improve your approach based on the evolving needs of your system and teams.

Whether you're just starting with OpenTelemetry or looking to optimize an existing implementation, **these best practices will help you maximize the value of your telemetry data** and build a more observable, reliable, and maintainable system.

If manual OpenTelemetry implementation feels overwhelming, [Better Stack Tracing uses eBPF for automatic instrumentation](https://betterstack.com/tracing/) while maintaining OpenTelemetry compatibility, eliminating much of the setup and maintenance work.