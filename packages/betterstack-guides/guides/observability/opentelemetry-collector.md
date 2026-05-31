# A Beginner's Guide to the OpenTelemetry Collector

The first step towards observability with OpenTelemetry is instrumenting your
application to generate essential telemetry signals such as [traces, logs, and
metrics](https://betterstack.com/community/guides/observability/logging-metrics-tracing/).

Once telemetry data is being generated, it must be sent to a backend tool that
may perform many functions, including analysis, visualization, and alerting.

While you could send this data directly to the observability backend, using an
intermediary tool between your services and the backend offers significant
advantages.

In this article, we'll examine the reasons behind the growing popularity of the
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector),
and why it is often the recommended intermediary tool for building observability
pipelines.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ckcbPgZb3TU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

Before proceeding with this article, ensure that you're familiar with [basic
OpenTelemetry concepts](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).

## What is the OpenTelemetry Collector?

![OpenTelemetry Collector sits between instrumented services and the observability backend](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6e07fd96-5d60-4b3b-bd7b-efae0f38fe00/lg1x
=4016x1715)

The Collector is a core element of the OpenTelemetry observability framework,
acting as a neutral intermediary for collecting, processing, and forwarding
telemetry signals (traces, metrics, and logs) to an observability backend.

It aims to simplify your observability setup by eliminating the need for
multiple agents for different telemetry types. Instead, it consolidates
everything into a single, unified collection point.

This approach not only streamlines your setup but also acts as a buffer between
your applications and your observability backends to provide a layer of
abstraction and flexibility.

It natively supports the OpenTelemetry Protocol (OTLP) but also accommodates
other formats like Jaeger, Prometheus, Fluent Bit, and others. Its
vendor-neutral design also lets you export your data to various open-source or
commercial backends.

Built on Go and licensed under Apache 2.0, the OpenTelemetry Collector
encourages you to extend its functionality by incorporating custom components.
This flexibility is invaluable when you need to extend its capabilities beyond
standard use cases.

## Benefits of using OpenTelemetry Collector

![Preventing Vendor Lock-in diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1cc33bbe-b5ec-4f48-5320-0da8513b5d00/md2x
=809x496)

While sending telemetry data directly to an observability backend might seem
convenient at first, using the OpenTelemetry Collector as a middleman between
your services and the backend offers significant advantages for building a more
flexible and resilient observability pipeline.

Let's delve into a few of the most compelling reasons:

### 1. Preventing vendor lock-in

Direct telemetry reporting or using a vendor-specific agent can create a tight
coupling between your services and the specific backend you're using. This makes
it challenging to switch backends in the future or even experiment with multiple
backends simultaneously.

With the OpenTelemetry Collector, you can effectively decouple your applications
from any specific observability backend. By configuring the collector to send
data to various backends, or even multiple backends at once, you have the
freedom to choose the best tools for your needs without being locked into a
single platform.

If you ever decide to migrate to a different backend, you only need to update
the collector's configuration, and not your entire application codebase.

### 2. Consolidation of observability tooling

Using the OpenTelemetry Collector can simplify your observability stack by
acting as a unified collection point for telemetry data from various sources. By
supporting various open-source and commercial protocols and formats for logs,
traces, and metrics, it eliminates the need for multiple agents and shippers
which reduces complexity and cognitive load for your engineering teams.

### 3. Filtering sensitive data

![Illustration of OpenTelemetry Collector Process](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bb05587d-64c8-41f6-33ba-be8da679e800/orig
=929x214)

A common challenge in observability is the [inadvertent inclusion of sensitive
information](https://betterstack.com/community/guides/logging/sensitive-data/), such as API keys or user data like credit card
numbers, by monitored services. Without a collector, this data could be exposed
within your observability system, posing a significant security risk.

The Collector addresses this by allowing you to [filter and sanitize your
telemetry data](https://betterstack.com/community/guides/observability/redacting-sensitive-data-opentelemetry/) before it's exported.
This ensures compliance and strengthens your security posture by preventing
sensitive information from reaching the backend.

### 4. Reliable and efficient data delivery

The OpenTelemetry Collector optimizes telemetry data transmission through
efficient batching and retries to minimize network overhead and ensure reliable
data delivery even in the face of network disruptions.

### 5. Managing costs

Through features like filtering, sampling, and aggregation, the Collector can
help you move away from a "spray and pray" approach to signal collection by
selectively reducing the amount of data transmitted. This allows you to focus on
the most relevant information, minimizing unnecessary storage and analysis
costs.

### 6. The OpenTelemetry Collector is observable

A core strength of the OpenTelemetry Collector lies in its inherent
observability. It doesn't just collect and process telemetry data from your
applications; it also meticulously monitors its own performance and health by
emitting logs, metrics, and traces, to allow you to track key performance
indicators, resource utilization, and potential bottlenecks.

This level of transparency fosters confidence in your observability pipeline,
guaranteeing that the very tool responsible for gathering insights also remains
under close observation.

[ad-logs]

## How the OpenTelemetry Collector works

![Overview of how the OpenTelemetry Collector works](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/140b03c4-3fd6-4cd1-cbbb-f02a7fcb2800/md1x
=955x432)

At a high level, the OpenTelemetry Collector operates in three primary stages:

1. **Data reception**: It collects telemetry data from a variety of sources,
   including instrumented applications, agents, and other collectors. This is
   done through `receiver` components.

2. **Data processing**: It uses `processors` to process the collected data,
   performing tasks like filtering, transforming, enriching, and batching to
   optimize it for storage and analysis.

3. **Data transmission**: It sends the processed data to various backend
   systems, such as observability platforms, databases, or cloud services,
   through `exporters` for storage, visualization, and further analysis.

By combining receivers, processors, and exporters in the Collector
configuration, you can create pipelines which serve as a separate processing
lane for logs, traces, or metrics. Data enters from various sources, undergoes
transformations via processors, and is ultimately delivered to one or more
backends through exporters.

Connector components can also link one pipeline's output to another's input
allowing you to use the processed data from one pipeline as the starting point
for another. This enables more complex and interconnected data flows within the
Collector.

## Installing the OpenTelemetry Collector

There are several ways to install the OpenTelemetry Collector, and each release
comes with pre-built binaries for Linux, macOS, and Windows. For the complete
list of options,
[refer to the official docs](https://opentelemetry.io/docs/collector/installation/).

The key decision is choosing the appropriate
[distribution](https://opentelemetry.io/docs/concepts/distributions/) to
install.

- **[Core](https://github.com/open-telemetry/opentelemetry-collector-releases/blob/main/distributions/otelcol)**:
  This contains only the most essential components along with frequently used
  extras like filter and attribute processors, and popular exporters such as
  Prometheus, Kafka, and others. It's distributed under the `otelcol` binary.

- **[Contrib](https://github.com/open-telemetry/opentelemetry-collector-releases/blob/main/distributions/otelcol-contrib)**:
  This is the comprehensive version, including almost everything from both the
  [core](https://github.com/open-telemetry/opentelemetry-collector/) and
  [contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib)
  repositories, except for components that are still under development. It's
  distributed under the `otelcol-contrib` binary.

- **[Kubernetes](https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions/otelcol-k8s)**:
  This distribution is tailored for use within a Kubernetes cluster to monitor
  the Kubernetes infrastructure and the various services deployed within it.
  It's distributed under the `otelcol-k8s` binary.

- **[OTLP](https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions/otelcol-otlp)**:
  This is a minimal distribution that includes only the OpenTelemetry Protocol
  (OTLP) receiver and exporters, supporting both gRPC and HTTP transport. It is
  distributed under the `otelcol-otlp` binary.

There are also
[third-party distributions](https://opentelemetry.io/ecosystem/distributions/)
provided by various vendors, which are tailored for easier deployment and
integration with their specific backends.

The contrib distribution generally recommend for most users since it includes a
wider range of components and out-of-the-box functionality to address various
observability needs.

The easiest way to get started with the Collector is through the official Docker
images which you can download using:

```command
docker pull otel/opentelemetry-collector:latest # OpenTelemetry core
```

```command
docker pull otel/opentelemetry-collector-contrib:latest # OpenTelemetry contrib
```

```command
docker pull otel/opentelemetry-collector-k8s:latest # OpenTelemetry K8s
```

For production environments, the
[OpenTelemetry Collector Builder](https://github.com/open-telemetry/opentelemetry-collector/tree/main/cmd/builder)
offers the ability to create a custom distribution containing only the
components you need from the core, contrib, or even third-party repositories.
While beyond the scope of this article, we've provided a [detailed guide on how to do this here](https://betterstack.com/community/guides/observability/custom-opentelemetry-collector/).

## Configuring the OpenTelemetry Collector

![The OpenTelemetry Collector configuration file](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b05b12f5-7667-483e-437d-7d42f0318400/md1x
=3600x1992)

The Collector's configuration is managed through a YAML file. On Linux, this
file is typically found at `/etc/<otel-directory>/config.yaml`, where
`<otel-directory>` varies based on the specific Collector version or
distribution you're using (e.g., `otelcol`, `otelcol-contrib`).

You can also provide a custom configuration file when starting the Collector
using the `--config` option:

```command
otelcol --config=/path/to/otelcol.yaml
```

For Docker, mount your custom configuration file as a volume when launching the
container with:

```command
docker run -v $(pwd)/otelcol.yaml:/etc/otelcol-contrib/config.yaml otel/opentelemetry-collector-contrib:latest
```

The configuration can also be loaded from other sources, such as environmental
variables, YAML strings, or even external URLs, offering great flexibility in
how you choose to manage your settings.

```command
otelcol --config=env:OTEL_COLLECTOR_CONFIG
```

```command
otelcol --config=https://example.com/otelcol.yaml
```

```command
otelcol --config="yaml:exporters::debug::verbosity: normal"
```

If multiple `--config` flags are provided, they will be merged into a final
configuration.

The configuration also automatically expands environment variables within the
configuration so that you can keep sensitive data, like API secrets, secure
outside of the version-controlled configuration files.

```yaml
processors:
  attributes/example:
    actions:
      - key: ${env:API_SECRET}
        action: ${env:OPERATION}
```

Here's a quick overview of the basic structure of a Collector configuration
file:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  otlp:
    endpoint: jaeger:4317

extensions:
  health_check:

service:
  extensions: [health_check]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

This configuration sets up an OpenTelemetry Collector that receives trace data
via the OTLP protocol over HTTP on port 4318, applies `batch` processing, and
then exports the processed traces to a Jaeger endpoint located at `jaeger:4317`.
It also includes a `health_check` extension for monitoring the collector's
status.

Each component within the configuration is assigned a unique identifier using
the format `type/<name>`. The `<name>` part is optional if you only have a
single instance of a particular component type.

However, when you need to define multiple components of the same type, providing
a distinct `<name>` for each one becomes necessary:

```yaml
processors:
  batch:
  batch/2:
    send_batch_size: 10000
    timeout: 10s
  batch/test:
    timeout: 1s
```

The `service` section is also crucial, as it controls which configured
components are enabled. Any component not mentioned there is silently ignored,
even if it's configured in other sections.

Once you're done configuring your Collector instance, ensure to validate the
configuration with the `validate` command:

```command
otelcol validate --config=/path/to/config.yaml
```

![Screenshot of validation errors](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/05afc347-9331-4558-9045-3c5960218b00/md1x
=2292x930)

You can also use the [OTelBin web application](https://www.otelbin.io/) to
visualize your Collector configuration and validate it against supported
OpenTelemetry distributions.

![Screenshot of Otelbin homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/07a57dfa-5ecd-4d70-ae20-4905bfbcf600/md2x
=3440x2086)

In the next section, we'll dive deeper into the individual components of the
Collector configuration.

## Exploring the OpenTelemetry Collector components

![OpenTelemetry Collector Components](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/48b37e9c-182d-4a4a-3e63-0e3435789b00/md2x
=1108x636)

Let's now delve into the heart of the OpenTelemetry Collector: its components.
In this section, we'll explore the building blocks that enable the Collector to
receive, process, and export telemetry data.

We'll cover receivers, processors, exporters, extensions, and connectors,
understanding their roles and how they work together to create a powerful and
flexible observability pipeline.

Let's begin with the receivers first.

### Receivers

![Overview of the OpenTelemetry Collector receivers](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5e409682-bb31-4c9b-4cb1-910fdc9cb600/lg2x
=3600x2259)

Receivers are the components responsible for collecting telemetry data from
various sources, serving as the entry points into the Collector.

They gather traces, metrics, and logs from instrumented applications, agents, or
other systems, and translate the incoming data into OpenTelemetry's internal
format, preparing it for further processing and export.

For the Collector to work properly, your configuration needs to include and
enable at least one receiver. The core distribution includes the versatile OTLP
receiver, which can be used in trace, metric, and log pipelines:

```yaml
receivers:
  otlp:
```

The `oltp` receiver here starts an HTTP and gRPC server at `localhost:4318` and
`localhost:4317` respectively, then waits for the instrumented services to
connect and start transmitting data in the OTLP format.

Similarly, many other receivers come with default settings, so specifying the
receiver's name is enough to configure it. To change the default configuration,
you may override the default values. For example, you may disable the gRPC
protocol by simply not specifying it in the list of protocols:

```yaml
receivers:
  otlp:
    protocols:
      http:
```

You can also change the default endpoint through `http.endpoint`:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318
```

The
[contrib repository](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver)
boasts over 90 additional receivers, catering to a wide array of data formats
and protocols, including popular sources like Jaeger, Prometheus, Apache Kafka,
PostgreSQL, Redis, AWS X-Ray, GCP PubSub, and many more.

### Processors

![Overview of the OpenTelemetry Collector processors](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/81a4224b-8f7c-439b-68f9-fbc05d4ba100/md2x
=3600x984)

Processors are components that modify or enhance telemetry data as it flows
through the pipeline. They perform various operations on the collected telemetry
data, such as [filtering, transforming, enriching](https://betterstack.com/community/guides/observability/ottl/), and batching so that
it is ready to be exported.

While no processors are enabled by default, you'll typically want to include the
`batch` processor:

```yaml
processors:
  batch:
```

This processor groups spans, metrics, or logs into time-based and size-based
batches, enhancing efficiency. Additionally, it supports sharding data based on
[client metadata](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/batchprocessor/README.md#batching-and-client-metadata),
allowing for effective multi-tenant data processing even with high volumes.

Another processor in the `otelcol` core distribution is the
[memory_limiter](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/memorylimiterprocessor/README.md)
which helps prevent out-of-memory errors by periodically checking service memory
usage against defined limits:

```yaml
processors:
  memory_limiter:
    check_interval: 5s
    limit_mib: 4000 # 4 mebibytes hard limit
    spike_limit_mib: 800 # soft limit is `limit_mib` minus `spike_limit_mib` (3200)
```

It operates with a soft and a hard limit. Exceeding the soft limit results in
new data rejection until memory is freed up. Breaching the hard limit triggers
garbage collection so that memory usage drops below the soft limit.

This mechanism adds
[back pressure](https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7)
to the Collector, making it resilient to overload. However, it requires
receivers to handle data rejections gracefully, usually through retries with
exponential backoff.

Beyond these, the
[contrib repository](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor)
offers several other processors for tasks like filtering sensitive data, adding
geolocation details, appending Kubernetes metadata, and more.

### Exporters

![Overview of the OpenTelemetry Collector exporters](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/89a1bb67-b5b0-42db-8c8c-d30c0357c000/orig
=3600x1050)

Exporters serve as the final stage in the Collector's pipeline and are
responsible for sending processed telemetry data to various backend systems such
as observability platforms, databases, or cloud services, where the data is
stored, visualized, and analyzed.

To operate, the Collector requires at least one exporter configured through the
`exporters` property.

Here's an sample configuration exporting trace data to a local Jaeger instance:

```yaml
exporters:
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true
```

This configuration defines an exporter named `otlp/jaeger` that targets a local
Jaeger instance listening on port 4317 via gRPC. The `insecure: true` setting
disables encryption, which is not recommended for production environments.

For a broader range of destinations, the
[contrib repository](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter)
provides various other exporters, supporting diverse observability platforms,
databases, and cloud services.

### Extensions

![OpenTelemetry Collector extensions overview](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/32cf4cb6-a278-447e-1648-646b1e543600/lg1x
=3600x648)

Extensions add supplementary features to the OpenTelemetry Collector beyond the
core data collection, processing, and export function. They offer features like
health checks, performance profiling, authentication, and integration with
external systems.

Here's a sample configuration for extensions:

```yaml
extensions:
  pprof:
  health_check:
  zpages:
```

The `pprof` extension here enables Go's `net/http/pprof` endpoint on
`http://localhost:1777` so that you can collect performance profiles and
investigate issues with the service.

The `health_check` extension offers an HTTP URL (`http://localhost:13133/` by
default) that can be used to [monitor the collector's status](https://betterstack.com/community/guides/monitoring/health-checks/).
You can use this URL to implement liveness checks (to check if the collector is
running) and readiness checks (to confirm if the collector is ready to accept
data).

![Screenshot of Health Check extension](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/27266cde-25d7-460c-0738-d3b1ec53c300/lg1x
=2292x930)

[A new and improved health check extension](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/extension/healthcheckv2extension)
is currently being developed to enable individual components within the
collector (like receivers, processors, and exporters) to provide their own
health status updates.

The `zPages` extension is equally useful. It provides various HTTP endpoints for
monitoring and debugging the Collector without relying on any backend. This
enables you to inspect traces, metrics, and the collector's internal state
directly, assisting in troubleshooting and performance optimization.

![Screenshot of zPages extension](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a05ca65-3fe5-4f1d-6dde-970fd3d6f300/public
=2312x1004)

Authentication extensions also play a vital role in security by allowing you to
authenticate both incoming connections at the receiver level and outgoing
requests at the exporter level.

Beyond these examples, the contrib repository offers a wide array of
[extensions](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/extension/)
to further expand the Collector's capabilities.

### Connectors

![OpenTelemetry Collector connectors overview](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f90a7ad3-cec1-4477-99c3-e8abb70ebe00/public
=3600x849)

Connectors are specialized components that bridge the different pipelines within
the OpenTelemetry Collector.

They function as both an exporter for one pipeline and a receiver for another,
allowing telemetry data to flow seamlessly between pipelines, even if they
handle different types of data.

Some use cases for connectors are:

- **Conditional routing**: Direct telemetry data to specific pipelines based on
  predefined rules, ensuring that the right data reaches the appropriate
  destination for processing or analysis.

- **Data replication**: Create copies of data and send them to multiple
  pipelines, enabling diverse processing or analysis approaches.

- **Data summarization**: Condense large volumes of telemetry data into concise
  overviews for easier comprehension.

- **Data transformation**: Convert one type of telemetry data into another, such
  as transforming raw traces into metrics for simplified aggregation and
  alerting.

The `connectors` section in your Collector configuration file is where you
define these connections. Note that each connector is designed to work with
specific data types and can only connect pipelines that handle those types.

```yaml
connectors:
  count:
    logs:
      app.event.count:
        description: "Log count by event"
        attributes:
          - key: event
```

For instance, the `count` connector can count various telemetry data types. In
the above example, it groups incoming logs based on the `event` attribute and
counts the occurrences of each event type. The result is exported as the metric
`app.event.count`, allowing you to track the frequency of different events in
your logs.

### Services

![OpenTelemetry Collector Services overview](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/667a8494-8a3c-40a3-8754-3227681d8800/lg2x
=3600x2460)

The `service` section specifies which components, such as receivers, processors,
exporters, connectors, and extensions, are active and how they are
interconnected through pipelines. If a component is configured but not defined
within the `service` section, it will be silently ignored.

It consists of three subsections which are:

#### 1. Extensions

The `service.extensions` subsection determines which of the configured
extensions will be enabled:

```yaml
service:
  extensions: [health_check, pprof, zpages]
```

#### 2. Pipelines

The `service.pipelines` subsection configures the data processing pathways
within the Collector. These pipelines are categorized into three types:
`traces`, `metrics`, and `logs`.

```yaml
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

Each pipeline comprises a collection of receivers, processors, and exporters.
Note that each component must be configured in their respective sections
(`receivers`, `processors`, `exporters`) before incorporating them into a
pipeline.

Pipelines can have multiple receivers feeding data to the first processor. Each
processor processes and passes data to the next, potentially dropping some if
sampling or filtering is applied. The final processor distributes data to all
exporters in the pipeline, ensuring each receives a copy of the processed data.

#### 3. Telemetry

The `service.telemetry` section within the Collector configuration focuses on
controlling the telemetry data generated by the Collector itself.

**Metrics**

```yaml
service:
  telemetry:
    metrics:
      address: 0.0.0.0:8888
      level: detailed
```

Metrics are exposed through a Prometheus interface, which defaults to port
`8888` and there are four verbosity levels:

- `none`: No metrics are collected.
- `basic`: The most essential service telemetry.
- `normal`: The default level which adds a few more standard indicators to
  `basic`-level metrics.
- `detailed`: The most verbose level which emits additional low-level metrics
  like HTTP and RPC statistics.

You can also configure the Collector to scrape its metrics with a Prometheus
receiver and send them through configured pipelines, but this could put your
telemetry data at risk if the Collector isn't performing optimally.

Metrics cover resource consumption, data rates, drop rates, throttling states,
connection counts, queue sizes, latencies, and more. For the full list, refer to
the
[internal metrics page](https://opentelemetry.io/docs/collector/internal-telemetry/#lists-of-internal-metrics).

**Logs**

```yaml
service:
  telemetry:
    logs:
```

OpenTelemetry Collector logs are outputted to the standard error by default and
you can use the operating environment's logging mechanisms (`journalctl`,
[docker logs](https://betterstack.com/community/guides/logging/docker-logs/), etc) to view and manage the logs.

Logs provide insights into Collector events like startups, shutdowns, data
drops, and crashes. Just like with metrics, you can configure a [verbosity
level](https://betterstack.com/community/guides/logging/log-levels-explained/) (defaults to `INFO`) as well as [log sampling
policy](https://betterstack.com/community/guides/logging/log-sampling/), static metadata fields, and whether to [encode the logs
in JSON format](https://betterstack.com/community/guides/logging/json-logging/).

Under the hood, the Collector uses Uber's highly regarded [Zap](https://betterstack.com/community/guides/logging/go/zap/) library to
write the logs.

**Traces**

While the Collector doesn't currently expose traces by default, there's ongoing
work to change that. This involves adding the ability to configure the
OpenTelemetry SDK used for the Collector's internal telemetry. For now, this
functionality is controlled by the following
[feature gate](#understanding-feature-gates):

```command
otelcol --config=config.yaml --feature-gates=telemetry.useOtelWithSDKConfigurationForInternalTelemetry
```

Once enabled, you can then register a `service.telemetry.traces` section like
this:

```yaml
service:
  telemetry:
    traces:
      processors:
        batch:
          exporter:
            otlp:
              protocol: grpc/protobuf
              endpoint: jaeger:4317
```

## Understanding feature gates

The OpenTelemetry Collector's feature gates offer a valuable way to manage the
adoption of new features by allowing them to be easily turned on or off. This
provides a safe environment for testing and experimenting with new
functionalities in production without fully committing to them.

Each feature gate typically progresses through a lifecycle similar to
Kubernetes:

- **Alpha**: The feature is initially disabled by default and requires explicit
  activation.
- **Beta**: The feature becomes enabled by default but can be deactivated if
  necessary.
- **Stable**: The feature is considered fully integrated and generally
  available, and the feature gate is removed, leaving it permanently enabled.

In some cases, features might be deprecated if they prove unworkable. Such
features remain available for a limited time (typically two additional releases)
before being removed completely.

You can control feature gates using the `--feature-gates` flag:

```command
otelcol --config=config.yaml --feature-gates=transform.flatten.logs
```

To disable a feature gate, prefix its identifier with a `-`:

```command
otelcol --config=config.yaml --feature-gates=-transform.flatten.logs
```

If you use the
[zPages extension](https://github.com/open-telemetry/opentelemetry-collector/tree/main/extension/zpagesextension),
you can see all the feature gates you have enabled by going to
`http://localhost:55679/debug/featurez`:

![Screenshot of zPages Feature Gate](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/14ccee93-24b4-4911-d1a5-f1503a487100/lg2x
=4672x2676)

## Final thoughts

Throughout this article, we've explored the key concepts of OpenTelemetry
Collector, so you should now have a good grasp of its capabilities and how it
can help you build effective observability pipelines.

For a deeper dive into configuring the OpenTelemetry Collector, I recommend
exploring the
[opentelemetry-collector](https://github.com/open-telemetry/opentelemetry-collector)
and
[opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib)
repositories on GitHub and their
[official docs](https://opentelemetry.io/docs/collector/). These contain
extensive documentation and examples that will guide you through setting up and
tailoring the Collector to your specific requirements.

The best way to follow the development of the Collector is through its GitHub
repo. In particular, you will find the changes that are being planned for
upcoming releases on the
[roadmap page](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/ga-roadmap.md)
on GitHub. An official
[#otel-collector channel](https://cloud-native.slack.com/archives/C01N6P7KR6W)
on the [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf) also
exists for community discussions.

Thanks for reading, and until next time!
