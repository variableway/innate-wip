# Sampling in OpenTelemetry: A Beginner's Guide

In distributed tracing, **sampling is the process of selectively capturing and
analyzing a subset of traces** instead of recording every request that flows
through a system. This approach is essential because storing and processing
every trace at scale would be prohibitively expensive and resource-intensive.

A well-designed sampling strategy ensures that you retain meaningful insights
into system behavior while significantly reducing the overhead associated with
trace collection, processing, and storage.

**There are different sampling techniques, including head-based sampling**, where
the decision to sample is made at the start of a request, and tail-based
sampling, where traces are evaluated after they complete to determine their
relevance.

In the following sections, we’ll explore these approaches in depth, but first,
let’s establish why sampling is necessary in high-traffic systems.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Why is sampling important?

Sampling is crucial in distributed tracing because modern systems generate an
overwhelming volume of trace data.

Without it, storing and processing every trace would impose significant overhead
in terms of storage costs, network bandwidth, and computational resources. In
extreme cases, this overhead could degrade the performance of the very system
you’re trying to observe.

The core idea behind sampling is **statistical representativeness**—when
implemented effectively, sampled traces provide an accurate picture of system
behavior while using only a fraction of the resources.

This concept is similar to how election polls predict outcomes by surveying a
small yet representative group of voters instead of the entire population.

![Trace sampling meme](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1901508e-286e-41d3-f748-7ee0396a6300/public =729x500)

However, achieving meaningful observability requires a sampling strategy that
captures both typical behavior and critical edge cases, such as errors and
performance anomalies.

For example, in a system handling millions of requests per hour, collecting
traces for just 1% of requests can still yield statistically significant
insights into performance trends, bottlenecks, and failure patterns—all while
keeping resource consumption manageable.

The key to effective sampling is ensuring a well-balanced and diverse selection
of traces that includes both normal operations and exceptional cases. When done
correctly, sampling enables teams to maintain high-quality observability without
unnecessary overhead.

[summary]
### Eliminate sampling complexity with complete trace ingestion

While sampling helps manage costs, it means potentially losing important traces. [Better Stack Tracing](https://betterstack.com/tracing/) uses eBPF to automatically instrument your workloads and processes traces efficiently at scale without cardinality limitations, so you can ingest all your trace data instead of sampling.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.
[/summary]

![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)


## When to implement sampling

You should consider implementing sampling when:

- Your system processes **millions of requests per day**, making full trace
  collection infeasible.
- The volume of trace data is **negatively impacting system performance** or
  observability tools.
- **Trace storage costs** are becoming a significant concern.
- **Network bandwidth usage** for trace data is growing unsustainably.

However, sampling may not be necessary when:

- Your system has **low traffic**, allowing full trace collection without major
  resource concerns.
- You're troubleshooting **specific issues**, where capturing every trace is
  necessary for detailed analysis.
- You're working with **mission-critical systems**, such as those in regulated
  industries, where missing any trace could lead to compliance or operational
  risks.

The main tradeoffs to consider with sampling is observability versus resource
usage. While sampling reduces observability costs, it potentially means losing
some important traces.

This risk can be mitigated through intelligent sampling strategies, but it's
still a fundamental tradeoff. The decision often comes down to balancing the
cost of collecting and storing traces against the value of having complete trace
data for troubleshooting and analysis.

Another consideration is the complexity sampling adds to your observability
pipeline. Implementing and maintaining sampling logic, especially sophisticated
strategies like adaptive sampling, requires additional engineering effort and
ongoing maintenance.

Depending on your needs, it could even be cheaper to allocate extra resources
for observability rather than sampling data.

## What's involved in sampling?

When a request enters your system, it generates a trace, which consists of
multiple spans that track the request’s journey through different services and
operations. Sampling determines which traces are retained and sent to an
observability backend, and this decision can happen at various points in the
request lifecycle.

At the edge of your system, **head-based sampling** makes immediate decisions
about whether to sample a trace as the request first arrives. This is efficient
but lacks context about how the request will behave as it flows through the
system.

During processing, **rate-limiting sampling** might kick in at collectors or
aggregation points to manage data volume. This approach helps regulate ingestion
volume but does not differentiate between high-value and low-value traces.

**Tail-based sampling** happens after a trace is fully formed, allowing for more
intelligent decision-making. By evaluating completed traces, the system can
retain those with errors, high latencies, or other indicators of interest while
discarding less significant ones.

The sampling process itself involves evaluating sampling rules against trace
attributes. These rules might consider factors like service name, customer ID,
error status, or duration.

When a trace is sampled, all its spans are typically kept to maintain context.
Sampling decisions are propagated through trace context to ensure consistent
behavior across services.

Practical implementation usually involves configuring samplers in your
instrumentation code, setting up sampling rules in collectors or agents, and
ensuring your observability backend is configured to handle the sampled data
appropriately.

Modern observability platforms often provide additional capabilities like
adaptive sampling that automatically adjusts rates based on traffic patterns,
and intelligent sampling that ensures important traces (like those containing
errors) are always captured, making the sampling process more dynamic and
context-aware.

## Understanding Head-based sampling

Head-based sampling makes the sampling decision at the very start of a request,
typically at the service entry point.

When a request enters the system, the sampler determines whether to sample the
request based on a predefined criteria such as random probability or specific
request attributes.

This decision is then propagated throughout the entire trace lifecycle so that
downstream services do not have to do extra work recording spans if the trace is
not sampled.

The key advantage of head-based sampling is its simplicity and efficiency. Since
the decision is made early (typically at the start), you avoid the overhead of
collecting spans that would ultimately be discarded.

However, the main drawback is that decisions are made without knowing the
request's eventual outcome or importance. You might miss capturing important
traces containing errors or performance issues that weren't apparent at the
start.

To prevent this, you can implement tail-based sampling since it can make
informed sampling decisions after seeing the complete trace. Let's look at how
it works next.

## Understanding Tail-based sampling

Tail-based sampling makes sampling decisions after a trace completes, allowing
decisions based on the full trace context including duration, errors, and
complete request behavior.

This typically happens at a collector or aggregation point where traces are
temporarily buffered before the sampling decision is made, and it allows the
system to retain the most valuable traces while discarding routine, less
informative traces.

The biggest advantage of tail-based sampling is its ability to selectively
retain traces that provide meaningful insights into system behavior and
performance. For example you could:

- Keep all traces where any service returns a 5xx error.
- Sample traces with unusual latency patterns, like when the request duration
  exceeds your SLO thresholds.
- Retain a larger share of traces that went through specific critical paths.
- Capture traces from specific high-value customers while discarding those from
  free-tier users.

Since the decision is made at the end of a trace’s lifecycle, the sampling
decision is more intelligent so that traces that meet the criteria you're after
are always kept.

### Challenges of tail-based sampling

While tail sampling sounds like the ideal way to surface the most important
traces while controlling the volume of data, it comes with its own set of
challenges. Without proper planning, it can introduce complexity and operational
overhead that outweigh its benefits.

Let's explore some of the most important things to consider before adopting a
tail-based sampling approach to distributed tracing:

1. **Resource consumption**: Since all spans must be temporarily stored and
   processed before sampling decisions can be made, substantial processing and
   storage resources need to be dedicated to the sampler even for traces that
   will ultimately be discarded. This is a scaling challenge as the demand grows
   linearly with traffic volume.

2. **Late-arriving data and completeness**: Determining when a trace is actually
   complete is fundamentally challenging since spans often arrive out of order
   or can be delayed for a variety of reasons. You must make the difficult
   trade-off between waiting for potentially late spans and making timely
   decisions at the risk of losing visibility by discarding interesting data.

3. **Latency in decision marking**: Tail sampling also introduces a delay
   between span generation and sampling decisions, as it needs to collect enough
   trace data to make informed choices. This added latency will affect your
   ability to observe your systems in real-time.

4. **Sampling policy complexity**: Creating and maintaining effective sampling
   policies is inherently complex since they must balance multiple factors
   depending on how sophisticated your distributed systems are. As they evolve,
   these policies require ongoing refinement to remain effective.

## Implementing trace sampling with OpenTelemetry

In OpenTelemetry, sampling can be implemented at both the SDK level (in your
application code) and at the [collector level](https://betterstack.com/community/guides/observability/opentelemetry-collector/). Let's
look at both approaches in this section.

### Head-based sampling

**Using the OpenTelemetry SDK is the best approach when you need head-based
sampling**, where the sampling decision is made at the beginning of a request.
This ensures that only selected traces are recorded and sent downstream,
reducing overhead at the source. The SDK supports multiple built-in samplers:

- **AlwaysOn**: Samples every trace which is useful in development or testing
  environments, or in low-traffic systems where you want complete visibility.
  This is the default behavior if no sampling is specified.
- **AlwaysOff**: Use this if you'd like to disable tracing entirely.
- **TraceIdRatioBased**: This allows you to capture a configurable percentage of
  traces (such 10% of requests).
- **ParentBased**: Respects the sampling decision of the parent span if one
  exists. If there's no parent span, it delegates to a configured root sampler.

You configure any of these directly in your application's OpenTelemetry
initialization:

```javascript
[otel.js]
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
[highlight]
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-node";
[/highlight]

const exporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [getNodeAutoInstrumentations()],
[highlight]
	sampler: new TraceIdRatioBasedSampler(0.1), // sample 10% of traces
[/highlight]
});

sdk.start();
```

Another way to configure head-sampling is through the following environmental
variables:

```bash
[label .env]
export OTEL_TRACES_SAMPLER="traceidratio"
export OTEL_TRACES_SAMPLER_ARG="0.1"
```

After implementing head-based sampling, it's crucial to understand how to check
sampling status and make decisions during span processing.

The `span.IsRecording()` method tells you whether the current span is recording
data, which is different from checking if it's sampled.

A span can be recording even if it won't ultimately be exported. This is
important when deciding whether to add attributes or events to spans:

By checking this attribute, you can avoid unnecessary work on spans that won't
be exported.

```javascript
const span = tracer.startSpan("my-operation");
if span.isRecording() {
  // do your expensive computation here
}
```

### Tail-based sampling

Tail-based sampling in OpenTelemetry is implemented at the collector level so
you need to configure your applications to send all traces to the OpenTelemetry
Collector.

In your collector configuration, set up the
[tail sampling processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor):

```yaml
[label otelcol.yaml]
processors:
  tail_sampling:
    decision_wait: 10s # How long to wait for traces
    num_traces: 100 # Maximum traces to keep in memory
    expected_new_traces_per_sec: 1
    policies:
      [
        {
          name: retain-payment-service,
          type: string_attribute,
          string_attribute: {
            key: service.name,
            values: [payment-service]
          }
        }
      ]

service:
  pipelines:
    traces:
      receivers: [otlp]
[highlight]
      processors: [tail_sampling, batch]
[/highlight]
      exporters: [otlp/jaeger]
```

The `tailsamplingprocessor` allows you specify a variety of options to control
how traces are sampled and when. The most important one is `policies` where you
can specify one or more polices that should be used to make a sampling decision.

In this above snippet, a simple policy is defined that retains a trace if any of
its spans was generated by the `payment-service`.

With this configuration in place, only requests that pass through the
`payment-service` are retained while all others are dropped. You can then
forward the retained spans to the observability backend for inspection and
analysis.

![Payment service trace in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/89ec3516-0014-4d2b-e3d3-9b38791b2b00/orig =2426x701)

## Limitations of OpenTelemetry's tail-based sampling

The journey with client-hosted tail-based sampling solutions like the
OpenTelemetry Collector starts simply enough.

You can deploy a collector to centralize your sampling decisions and, with
modest traffic, everything works smoothly. The collector buffers spans in
memory, makes informed sampling decisions, and life is good.

But as your system grows, cracks begin to appear. **Tail sampling requires all
spans from a trace to arrive at the same collector instance for
decision-making**.

With a single collector, this isn't an issue. But as your trace volume
increases, that lone collector starts struggling under the memory pressure of
buffering all those spans. The CPU strain of processing span attributes for
sampling decisions becomes noticeable.

However, you can't just add more collectors and call it a day. You need to
ensure that all spans from the same trace reach the same collector instance, or
you'll end up with fragmented traces and poor sampling decisions.

This forces you to implement routing mechanisms or sticky sessions, adding new
layers of complexity to your system. This
[load balancing exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/loadbalancingexporter/README.md)
was developed with this problem in mind.

High availability and disaster recovery also present significant challenges. If
a collector instance fails, all buffered traces in that instance could be lost.
Implementing redundancy and failover mechanisms for tail sampling adds another
layer of complexity to the system architecture.

This is why many organizations eventually turn to vendor-hosted solutions that
can provide more robust and scalable tail-based sampling capabilities without
the operational overhead of managing the sampling infrastructure themselves.


## Avoiding sampling complexity with Better Stack

Throughout this article, we've explored the complexities of trace sampling: **head-based sampling misses important traces**, tail-based sampling requires significant infrastructure, and both approaches force you to make tradeoffs between observability and cost.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Better Stack Tracing](https://betterstack.com/tracing/) takes a different approach that eliminates sampling complexity entirely:

- Ingest all your trace data without sampling limitations or cardinality concerns
- eBPF-based automatic instrumentation captures traces without code changes
- Architecture handles JSON wide events at scale efficiently
- No need to manage collector infrastructure or routing logic
- Complete trace data means you never miss critical errors or performance issues
- OpenTelemetry-native so your data remains portable
- Predictable pricing up to 30x cheaper than alternatives like Datadog

Instead of deciding which traces to keep, you can capture everything and use the visual "bubble up" feature to investigate issues. Select services and timeframes through drag and drop to surface what's causing problems, with AI assistance suggesting root causes during incidents.

If managing sampling infrastructure and the risk of losing important traces concerns you, check out [Better Stack Tracing](https://betterstack.com/tracing/) for a simpler approach.

## Final thoughts


Vendor solutions typically offer built-in high availability, automatic scaling, and advanced strategies like [adaptive sampling](https://medium.com/jaegertracing/adaptive-sampling-in-jaeger-50f336f4334) to make sophisticated decisions and end up with useful data for observing your systems.

If you want to **skip sampling complexity entirely**, Better Stack Tracing uses eBPF for automatic instrumentation and handles trace data at scale without sampling, so you can ingest everything while keeping costs predictable.

Thanks for reading!