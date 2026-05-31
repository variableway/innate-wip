# The Top 7 Log Shippers and How to Choose One

Logs serve as records that offer insight into the operations taking place within
your system. When issues arise, they play a crucial role in identifying the root
causes and facilitating their resolution. [Centralizing logs](https://betterstack.com/community/guides/logging/log-aggregation/)
streamlines the review process, enabling you to analyze information from various
sources within a singular location, rather than navigating separate systems for
log retrieval.

While it appears convenient to employ a [logging library](https://betterstack.com/community/guides/logging/logging-framework/) for
funnelling logs to a central repository, this approach poses several challenges.
As log entries accumulate, resource consumption will typically intensify which
may result in performance degradation or application failures. Also, if the
application crashes, the logging tool will fail alongside it leading to
disruptions in log message forwarding. Furthermore, modifying your logging
pipeline necessitates altering application code—a cumbersome endeavor. Adopting
a log shipper is a prudent solution to circumvent these issues.

A log shipper serves as an independent tool that amasses logs from diverse
origins and subsequently routes them to one or more designated destinations.
Many log shippers can be strategically load-balanced to accommodate escalating
system demands and integrate safeguards to mitigate log loss during network
interruptions. Another benefit is that switching log shippers can be done
anytime without changing your application code.

This article will explore seven distinct log shippers in detail and help you
choose the right solution for your next project.

|           Feature |                       OpenTelemetry Collector                       |                                                      Vector                                                       |                Fluentd                |   Fluent Bit    |          Filebeat          |               Logstash               |                      Rsyslog                       |
| ----------------: | :-------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: | :-----------------------------------: | :-------------: | :------------------------: | :----------------------------------: | :------------------------------------------------: |
|      Memory usage |                        ~50-200 MB                         |                                                       ~5 MB                                                       |            Around 30-40 MB            |     ~1-3 MB     |           ~42 MB           |             ~2GB memory              |                      ~2-3 MB                       |
|        Deployment | Moderately complex due to extensive configuration options |                                                  Easy to deploy                                                   | A bit challenging due to dependencies |      Easy       |            Easy            | Complex due to dependencies like JVM | Simple and is included in Linux systems by default |
| Plugins available |  Over 150 components (receivers, processors, exporters)   |                                                     Over 100                                                      |               Over 1000               |    Over 100     |          Over 50           |               Over 200               |                      Over 400                      |
|      Dependencies |          No external dependencies; single binary          | Depends on only [libc](https://man7.org/linux/man-pages/man7/libc.7.html), which is already found in most systems |     Depends on Fluentd C Library      | No dependencies |      No dependencies       |            Depends on JVM            |                  No dependencies                   |
|       Ease of use |  Moderate; powerful but can have a steep learning curve   |                                                     Moderate                                                      |      Relatively straightforward       |    Moderate     | Relatively straightforward |               Moderate               |                                                    |

## What is a log shipper?

A log shipper is a tool designed to gather, process, and transport log data from
various sources to a specified destination. It can be envisioned as a pipeline
that takes various logs (such as application logs, system logs, or database
logs) as input, optionally transforms them in some manner, then forwards them to
one or more destinations for storage or further processing.

The following are some of the workflows you achieve with log shippers:

- Collect unstructured logs from a file → Transform them into a structured
  format (such as JSON) → Forward the transformed data to the
  [Elastic Stack](https://www.elastic.co/what-is/elk-stack).
- Collect logs from the standard output → Filter all levels lower than errors
  → send to AWS Cloudwatch.
- [Collect your PostgreSQL logs](https://betterstack.com/community/guides/logging/how-to-start-logging-with-postgresql/) from a
  file → Redact any sensitive data → Send to a log management service like
  [Better Stack](https://betterstack.com/logs).
- [Collect Docker container logs](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/) → Enrich
  the logs with metadata → Send to Better Stack.
- Collect web server logs → Geolocate IP addresses → Send to Grafana Loki for
  visualization.
- Retrieve compliance-related logs from various systems → Apply encryption to
  ensure security → Archive the logs in Amazon S3.

Log shippers typically run in the background, vigilantly observing data streams
from configured sources. New data is captured, processed, and forwarded to
designated destinations regularly. This ensures continuous access to the latest
data, informing you about the system's ongoing activities.

[ad-logs]

## Factors to consider when choosing a log shipper

When faced with the task of choosing a suitable log shipper, several factors
warrant careful consideration. We'll examine some of the most important ones
below:

### 1. Performance

A good log shipper must excel at collecting and processing large volumes of data
without using a lot of resources, such as memory, CPU, or disk. Otherwise,
there's a risk of degrading system performance or even causing outages due to
resource overconsumption.

One important consideration for log shippers its performance and resource
consumption. An insightful question to ask is: What is its peak throughput for
your workloads on certain hardware? If your systems generate about 10,000 log
messages per second, your chosen log shipper should adeptly manage this load and
demonstrate room for further scalability.

Note that the programming language used to develop a log shipper significantly
influences its performance. For example, log shippers crafted in languages like
C, Rust, or Go will typically outperform those scripted in Ruby or Python.

### 2. Reliability

A log shipper that is very performant and memory efficient isn't worth a grain
of salt if it constantly crashes under heavy load or lacks contingencies in the
face of network disruptions. So it's essential to look for one that has safety
measures in place to prevent data loss in the event of network failures.

Most shippers use buffers to store log messages in memory temporarily, and when
the buffer memory is full, it writes the logs to a file on a disk. Though
writing/reading logs to a disk is slower, it is useful when the log shipper
exits unexpectedly. Upon recovery, it can read the file on the disk and pick up
from where it left off.

Buffers also come in handy when the source sends more logs than the log shipper
can handle or if the processing speed at the destination suddenly slows down. To
ensure reliability, the log shipper must throttle the transmission to reduce
back pressure on the destination.

### 3. Scalability

High-traffic sites use distributed systems, deploying numerous servers to handle
the substantial user load. Naturally, a single log shipper instance cannot
handle all the load. Therefore, the chosen shipper needs to be configurable for
high availability to keep up with the data flowing through the system. For
example, Fluentd can be configured for scalability as shown in the following
diagram:

![fluentd_ha.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b5fcc4a3-5f10-4ef1-681a-1eb5c27ab300/lg1x =807x574)

The log shipper here has been decoupled into two components to allow for
horizontal scaling if the demand increases:

- **Log forwarders**: instances on every node delivering the log messages to
  aggregators.
- **Log aggregators**: daemons that receive logs, buffer them and forward them
  to their destination.

If you plan to run a log shipper on a single machine, it should be capable of
using all available CPUs rather than being limited to one. This is important now
more than ever since CPU clock speeds have plateaued, and the focus has shifted
towards augmenting the number of CPUs. Given this trend, a log shipper should be
able to take full advantage of the available CPU resources.

### 4. Community and extensibility

Log shippers with strong communities will have abundant instructional resources
covering the tool. Beyond educational assets, an active community contributes
new features, bug reports, and solutions to common problems through various
channels.

Also, given the diversity of inputs and destinations that log shippers need to
accommodate, a well-designed one will embrace extensibility through the
incorporation of plugins so that you can easily add custom data sources,
transforms, and destinations.

### 5. Vendor neutrality

While some cloud log management services offer their own log shippers, we
generally don't recommend using them so that you're not locked into their
service. You must anticipate scenarios such as:

- Potential deterioration in the quality of the vendor's offerings.
- Sudden price surges, necessitating cost-effective alternatives.
- Misalignment of a vendor's direction with your evolving needs.

A good log shipper should be vendor-neutral, permitting effortless transitions
between vendors as needed. This necessitates the capacity to interface with
various sources and destinations, either through plugins or built-in
functionality.

### 6. Monitoring

A good log shipper should be also be observable and offer a monitoring system
that can help you understand its behavior. By exposing metrics such as queued
messages, error count, uptime, HTTP errors, buffered events, and more, you'll be
well equipped to identify potential problems and predict how much capacity is
needed for your workloads.

---

Now that you're familiar with some of the crucial factors to consider when
choosing a log shipper, let's delve into the top five shippers worth
considering.

## 1. OpenTelemetry Collector

[OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) is an open-source observability framework that standardizes the collection and export of telemetry data—such as metrics, logs, and traces—from your applications and infrastructure. Central to this framework is the [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/), a vendor-agnostic agent designed to receive, process, and export telemetry data without tying you to a specific backend or analysis tool.

The OpenTelemetry Collector serves as a unified pipeline for telemetry data, eliminating the need to manage multiple agents or collectors for different data formats or backends. It supports various open-source observability data formats like Jaeger, Prometheus, and Fluent Bit, and can send data to multiple open-source or commercial backends. The Collector can be deployed in two primary ways:

- **As an agent**: Runs locally alongside your application, collecting telemetry data with minimal processing before forwarding it.
- **As a service**: Runs as a standalone service within your infrastructure, capable of more intensive processing, aggregation, and exporting to various backends.


### How the OpenTelemetry Collector works

![Diagram illustrating the OpenTelemetry Collector's operation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2217b359-9173-473d-a86e-4858b4f09800/public)

The OpenTelemetry Collector operates through key components defined in its configuration file, which is typically structured as follows:

```yaml
receivers:
  <unique_receiver_name>:
    # Receiver configuration

processors:
  <unique_processor_name>:
    # Processor configuration

exporters:
  <unique_exporter_name>:
    # Exporter configuration

service:
  pipelines:
    <pipeline_name>:
      receivers: [<receiver_names>]
      processors: [<processor_names>]
      exporters: [<exporter_names>]
```

Here's what each component does:

- [Receivers](https://opentelemetry.io/docs/collector/configuration/#receivers): Act as entry points for telemetry data, specifying the sources to be ingested. They collect data from various sources and formats without the need to alter your application's code.

- [Processors](https://opentelemetry.io/docs/collector/configuration/#exporters): Modify or enhance data as it flows through the pipeline, specifying how the data should be processed. They can perform tasks like filtering, transforming, and enriching the telemetry data.

- [Exporters](https://opentelemetry.io/docs/collector/configuration/#exporters): Define destinations for the processed data, sending it to designated backends or analysis tools. They enable you to forward data to one or more destinations simultaneously.

- [Service](https://opentelemetry.io/docs/collector/configuration/#service): Defines pipelines that connect receivers, processors, and exporters. Each pipeline handles a specific type of telemetry data (traces, metrics, or logs) and routes data through the configured components.

You can have multiple components as needed. For instance, to collect logs from multiple sources, you would create multiple receiver components, each with a unique name, and configure them accordingly. This structure allows you to define multiple sources, specify how data should be processed, and set multiple destinations for the processed data—all within a single, unified configuration file.

Let's focus on a practical example of collecting logs from a file and forwarding them to a third party like Better Stack using OpenTelemetry. This demonstrates setting up the OpenTelemetry collector to read logs from a file and export them to your chosen backend.

The configuration file for OpenTelemetry is named `otel-config.yaml` and contains the following content:

```yaml
[label otel-config.yaml]
receivers:
  filelog:
    include: ["/var/log/nginx/access.log"]
    start_at: end
    operators:
      - type: regex_parser
        regex: '^(?P<timestamp>\S+) (?P<level>\S+) (?P<message>.*)$'
        timestamp:
          parse_from: attributes.timestamp
          layout_type: gotime
          layout: "2006-01-02T15:04:05Z07:00"
```

The `filelog` receiver reads logs from `/var/log/nginx/access.log"`, starting at the end to capture new entries. The `regex_parser` operator transforms unstructured logs into structured records with `timestamp`, `level`, and `message` attributes.

Next, the configuration includes the `processors` section:

```yaml
[label otel-config.yaml]
...
processors:
  batch:
  memory_limiter:
    limit_mib: 400
    spike_limit_mib: 100
    check_interval: 1s
```

The `processors` section includes `batch` to optimize export performance and `memory_limiter` to prevent excessive memory usage, setting limits and intervals for memory checks.

The `exporters` section is configured like this:

```yaml
[label otel-config.yaml]
...
exporters:
  otlphttp:
    endpoint: "https://ingest.betterstack.com/otlp"
    headers:
      Authorization: "Bearer YOUR_BETTER_STACK_API_KEY"
```

Here, the `otlphttp` exporter sends the processed logs to Better Stack using the OTLP over HTTP protocol. The `endpoint` is set to `"https://ingest.betterstack.com/otlp"`/

Finally, the `service` section defines the pipelines:

```yaml
[label otel-config.yaml]
...
service:
  pipelines:
    logs:
      receivers: [filelog]
      processors: [memory_limiter, batch]
      exporters: [otlphttp]
```

This `logs` pipeline connects the `filelog` receiver to the processors and exporter, dictating the flow of log data through the Collector. Logs received by the `filelog` receiver are processed by the `memory_limiter` and `batch` processors before being exported via the `otlphttp` exporter to Better Stack.

### Supported receivers, processors, and exporters in OpenTelemetry

Let's review some of the useful receivers, processors, and exporters that OpenTelemetry supports.

When it comes to receivers, the collector provides various options to ingest data from multiple sources and formats:

- [OTLP Receiver](https://github.com/open-telemetry/opentelemetry-collector/blob/main/receiver/otlpreceiver/README.md): Collects telemetry data in the OpenTelemetry Protocol (OTLP) format over gRPC or HTTP.
- [Jaeger Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/jaegerreceiver/README.md): Receives trace data from applications instrumented with Jaeger.
- [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/prometheusreceiver/README.md): Scrapes metrics from Prometheus endpoints.
- [Syslog Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/syslogreceiver/README.md): Collects logs sent via the Syslog protocol.
- [Fluent Forward Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/fluentforwardreceiver/README.md): Receives logs from Fluentd and Fluent Bit agents.

When it comes to processors, the collector offers components that modify or enhance telemetry data as it flows through the pipeline:

- [Attributes Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/attributesprocessor/README.md): Modifies attributes of spans, metrics, or logs, allowing you to add, update, or delete attributes.
- [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md): Filters out telemetry data based on specified criteria, such as attribute values or resource attributes.
- [Resource Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md): Modifies resource attributes, which are shared across all telemetry data coming from a source.
- [Metric Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/metricstransformprocessor/README.md): Performs advanced transformations on metric data, such as renaming metrics or aggregating data.

For more processors, review the [relevant documentation page](https://opentelemetry.io/docs/collector/configuration/#processors).

When it comes to exporters, the collector supports multiple options for sending processed telemetry data to your chosen backends or analysis tools:

- [OTLP Exporter](https://opentelemetry.io/docs/specs/otel/protocol/exporter/): Sends data in the OTLP format over gRPC or HTTP to another OpenTelemetry Collector or backend.
- [Prometheus Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusexporter/README.md): Exposes metrics in a format that can be scraped by Prometheus.
- [OpenSearch Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/opensearchexporter): Exports data to OpenSearch for storage and analysis.
- [Sentry Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/sentryexporter): Sends telemetry data to Sentry for error tracking and performance monitoring.
- [Syslog Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/syslogexporter/README.md): Exports logs via the Syslog protocol to Syslog-compatible systems.

### OpenTelemetry advantages


- **Preventing vendor lock-in**: By decoupling your applications from specific observability backends, the collector allows you to switch or use multiple backends without changing your instrumentation code.

- **Consolidation of observability tooling**: It acts as a unified collection point for telemetry data from various sources, reducing the need for multiple agents or shippers.

- **Filtering sensitive data**: The collector can filter and sanitize telemetry data before it's exported, helping to prevent sensitive information from reaching backends.

- **Reliable and efficient data delivery**: It optimizes data transmission through batching and retries, ensuring reliable delivery even during network disruptions.

- **Managing costs**: Features like filtering, sampling, and aggregation help reduce data volume, minimizing storage and analysis costs.

- **Collector's own observability**: The collector is observable itself, emitting logs, metrics, and traces about its performance and health.

### OpenTelemetry disadvantages

- **Maturity variations:** Some components, especially around logging and metrics, may not be as mature or stable as tracing components, potentially leading to inconsistencies or the need for workarounds.

- **Complexity:** The richness of features and flexibility can lead to a steep learning curve, requiring time and effort to understand and effectively implement OpenTelemetry in your projects fully.

- **Documentation gaps:** Rapid development and frequent updates may result in documentation lagging behind, making it challenging to find up-to-date information or best practices for certain use cases.

- **Performance overhead:** Instrumentation can introduce performance overhead if not properly managed, especially in high-throughput systems, necessitating careful optimization and monitoring.

**Learn more:** [A complete introductory guide to OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/)

## 2. Vector

[Vector](https://betterstack.com/community/guides/logging/vector-explained/) is a lightweight, open-source, high-performance
log shipper that collects, processes, and transmits logs, metrics, and traces
(coming soon) to any destination you choose. It claims to be 10x faster than any
other log shipper, and it provides
strong data delivery guarantees. Its memory efficiency is a notable advantage, partly attributed to its
implementation in Rust, a language acclaimed for its low memory footprint.

Despite being a relative newcomer in the log shippers space, Vector has rapidly
garnered recognition, amassing over 14,000 GitHub stars over 100,000 daily
downloads. Major industry players like Discord, Comcast, T-Mobile, and Zendesk
are among its esteemed users. The largest Vector user is processing no less than
[30TB of data daily](https://github.com/vectordotdev/vector#community).

### How Vector works

![vector.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/147f8cb5-2295-48e9-a0dc-f47c222b2400/md2x =1346x598)

Vector defines its data sources, transforms, and designated destinations using a
configuration file. This file is located at `/etc/vector/vector.yaml` and its
typically organized as follows:

```text
[label /etc/vector/vector.yaml]
sources:
  <unique_source_name>:
    # source configuration properties go here

transforms:
  <unique_transform_name>:
    # transform configuration properties go here

sinks:
  <unique_destination_name>:
    # sink configuration properties go here
```

Let's look at what each component does:

- `sources`: specifies the source data to be ingested.
- `transforms`: specifies how the data should be processed.
- `sinks`: defines a destination for the processed data.

You can have as many components are you like. For instance, to collect logs from
three sources, you would have to create three `sources` components and ensure
that each one has a unique id.

To visualize how Vector works, consider a scenario where it is employed to
process an [Nginx access.log
file](https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/), transforming it
into JSON format and subsequently transmitting it to a cloud-based log
management service like [Better Stack](https://betterstack.com/logs).

First, create the `sources` component and provide the path to the file:

```text
[label /etc/vector/vector.toml]
sources:
  access_nginx:
    type: "file"
    include:
      - "/var/log/nginx/access.log"
    read_from: "end"
```

In the `sources` component, you define a `access_nginx` source that uses the
[file](https://vector.dev/docs/reference/configuration/sources/file/) source
to collects logs from files. The `include` option accepts the file path, and
`read_from` specifies reading from the bottom of the file.

Once you've specified a data source, you can optionally use a `transforms`
component to manipulate it:

```text
[label /etc/vector/vector.toml]
...
transforms:
  nginx_parser:
    inputs:
      - "access_nginx"
    type: "remap"
    source: |
      . |= parse_regex!(.message, r'^(?<remote_addr>\S+) \S+ \S+ \[(?<timestamp>[^\]]+)\] "(?<method>[A-Z]+) (?<path>[^" ]+)[^"]*" (?<status_code>\d+) (?<response_size>\d+) "(?<referrer>[^"]*)" "(?<user_agent>[^"]*)"$')
```

The `inputs` option specifies the data source which can be the source ID, or a
wildcard to transform data from all sources. The `type` property instructs
Vector to use its
[remap transform](https://vector.dev/docs/reference/configuration/transforms/remap/),
which modifies each log line using the Vector Remap Language (VRL), a Domain-
specific language used for parsing and transforming observability data. The
`source` encapsulates VRL code, executing regex-based parsing on the log message
to extract the fields like `remote_addr`, `timestamp`, and others.

Once you've defined the transforms, you must specify the destination for the
logs using the `sinks` component. In this example, they will be forwarded to
Better Stack:

```toml
[label /etc/vector/vector.toml]
...
sinks:
  better_stack:
    type: "http"
    method: "post"
    inputs:
      - "nginx_parser"
    uri: "https://in.logs.betterstack.com/"
    encoding:
      codec: "json"
    auth:
      strategy: "bearer"
      token: "<your_betterstack_source_token>"
```

The `sinks` component specifies the
[http](https://vector.dev/docs/reference/configuration/sinks/http/) sink which
can be used to send data to any HTTP endpoint. Be sure to replace the token with
your own.

Once you've completed your Vector configuration, you'll need to restart the
service, and you should start observing the Nginx logs on the live tail page:

![betterstack.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/43c4d04b-79e9-42b6-60d9-c24150794e00/lg1x =3024x1758)

### Supported sources, transforms, and sinks in Vector

Let's review some of the useful sources, transforms, and outputs that Vector
supports. Here are some of the
[sources](https://vector.dev/docs/reference/configuration/sources/) you can use:

- [Docker Logs](https://vector.dev/docs/reference/configuration/sources/docker_logs/):
  collect logs from Docker containers.
- [File](https://vector.dev/docs/reference/configuration/sources/file/): collect
  logs from files.
- [OpenTelemetry](https://vector.dev/docs/reference/configuration/sources/opentelemetry/):
  use gRPC or HTTP to receive data from [OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).
- [Socket](https://vector.dev/docs/reference/configuration/sources/socket/):
  collect logs sent via the socket client.
- [Syslog](https://vector.dev/docs/reference/configuration/sources/syslog/):
  fetches logs from Syslog.

When it comes to processing data, here are some of the
[transforms](https://vector.dev/docs/reference/configuration/transforms/) to be
aware of:

- [Remap with VRL](https://vector.dev/docs/reference/configuration/transforms/remap/):
  a language designed to parse, shape and transform your data.
- [Filter](https://vector.dev/docs/reference/configuration/transforms/filter/):
  allows the specification of conditions for filtering events.
- [Throttle](https://vector.dev/docs/reference/configuration/transforms/throttle/):
  rate limit log streams.
- [Lua](https://vector.dev/docs/reference/configuration/transforms/lua/): use
  the Lua programming language to transform log events.

For more transforms, review
[the relevant documentation page](https://vector.dev/docs/reference/configuration/transforms).

Finally, let's look at some of the
[sinks](https://vector.dev/docs/reference/configuration/sinks) available for
Vector:

- [HTTP](https://vector.dev/docs/reference/configuration/sinks/http/): forward
  logs to an HTTP endpoint.
- [WebSocket](https://vector.dev/docs/reference/configuration/sinks/websocket/):
  deliver observability data to a WebSocket endpoint.
- [Loki](https://vector.dev/docs/reference/configuration/sinks/loki/): forward
  logs to Grafana Loki.
- [Elasticsearch](https://vector.dev/docs/reference/configuration/sinks/elasticsearch/):
  deliver logs to Elasticsearch.

### Vector advantages

- **Resource efficiency**: Capitalizing on its Rust foundation, Vector gains two
  distinct advantages: remarkable speed and efficient memory utilization. Rust's
  inherent speed, coupled with its robust memory management capabilities,
  empowers Vector to manage high workloads while consuming minimal system
  resources.

- **Powerful language for manipulating logs**: The
  [Vector Remap Language(VRL))](https://vector.dev/docs/reference/configuration/transforms/remap/)
  is powerful and allows you to perform complex manipulations once you learn it.

- **Community**: Thanks to its excellent documentation, getting started with
  Vector is easy. It also has a strong community of contributors thanks to
  heightened interest in the Rust language.

- **Emphasis on security:**: Vector puts security at the forefront and has
  [several defenses](https://vector.dev/docs/setup/going-to-prod/hardening/) in
  place to protect your data.

- **Vendor-neutral**: Although Timber Technologies (the company behind Vector)
  was acquired by Datadog, it remains vendor-agnostic.

- **Single binary**: It offers a single static binary, depending only on
  [libc](https://man7.org/linux/man-pages/man7/libc.7.html), which already
  exists in most operating systems.

### Vector disadvantages

- **Fewer plugins**: Vector is less than five years old at the time of writing
  and has fewer than 100 plugins, less than most of its competitors.

- **VRL learning curve**: Vector Remap Language is powerful, but it takes a
  while to get to learn it and understand how to use it effectively.

**Learn more**: [How to Collect, Process, and Ship Log Data with Vector
](https://betterstack.com/community/guides/logging/vector-explained/)

## 3. Fluentd

[Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/) is another popular open-source log shipper
that collects logs from multiple sources and provides a unified logging bridge
between the sources and the destination. It was released in 2011 and is being
used by many top companies in the industry, including Microsoft, Atlassian,
Twilio, and others.

Both the C and Ruby programming languages underpin Fluentd's architecture.
Although the incorporation of Ruby scarifies processing speed, this choice
grants Fluentd access to the extensive Ruby ecosystem and reduces the barrier to
entry for plugin development.

### How Fluentd works

![fluentd-architecture.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ddb73a26-24f4-4213-bc79-533bcbee7000/md2x =892x560)

Understanding how Fluentd works is relatively straightforward. You create a
configuration file and specify the log sources, transforms, and destinations to
deliver the logs. Depending on how you install Fluentd, this file will be at
either `/etc/td-agent/td-agent.conf` or `/etc/fluent/fluent.conf`. Regardless,
its contents can be broken into the following directives:

```text
[label /etc/td-agent/td-agent.conf]
<source>
  ....
</source>

<filter unique.id>
   ...
 </filter>
<match unique.id>
   ...
</match>
```

The following is what the directives do:

- `<source>...</source`: specifies the data source.
- `<filter>...</filter>`: applies modifications to the logs.
- `<match>...</match>`: defines the destination for the log data.

You can create as many directives as your project requires.

The **source** directive fetches logs from the given sources:

```text
[label /etc/td-agent/td-agent.conf]
<source>
  @type tail
  path /var/log/nginx/access.log
  pos_file /var/run/td-agent/nginx.log.pos
  format nginx
  tag access.nginx
</source>
```

The `@type` parameter above instructs Fluentd to employ the
[tail](https://docs.fluentd.org/input/tail) plugin to read a file, akin to the
`tail -F` command in Unix systems. The `path` parameter specifies the file to be
read, and `pos_file` designates a file for Fluentd to track its position. To
specify a unique identifier for this source, the `tag` parameter is used so that
other directives can access the source data through this source.

Next, you can optionally define a `filter` to transform the data. This directive
accepts a tag name and matches all incoming events generated from the source
directive with the specified name:

```text
[label /etc/td-agent/td-agent.conf]
. . .
<filter access.nginx>
  @type record_transformer
  <record>
    hostname "#{Socket.gethostname}"
  </record>
</filter>
```

The `record_transformer` plugin is used here to enrich the log with a hostname
property.

Following this, the `match` directive can be used to forward messages to a
specific destination as shown below:

```text
[label /etc/td-agent/td-agent.conf]
. . .
<match *>
  @type logtail
  @id output_logtail
  source_token <your_betterstack_source_token>
  flush_interval 2 # in seconds
</match>
```

This directive matches any incoming tags since it uses a wildcard (`*`). The
`type` parameters specify the `logtail` plugin to forward the logs to Better
Stack for centralized log management.

### Supported inputs, filters, and outputs in Fluentd

Let's review some of the core input, filter, and output plugins that are
available for Fluentd, starting with the
[input plugins](https://docs.fluentd.org/input):

- [in_tail](https://docs.fluentd.org/input/tail/): read logs from the end of a
  file.
- [in_http](https://docs.fluentd.org/input/http): provide input data through a
  REST endpoint.
- [in_syslog](https://docs.fluentd.org/input/syslog): gather logs from the
  Syslog protocol through UDP or TCP.
- [in_exec](https://docs.fluentd.org/input/exec): runs an external program to
  pull event logs.

To filter or process your data, you can
[filter plugins](https://docs.fluentd.org/filter/) such as those listed below:

- [record_transformer](https://docs.fluentd.org/filter/record_transformer):
  used to add/modify/delete events.
- [grep](https://docs.fluentd.org/filter/grep): filters logs that match a given
  pattern. It works the same way as the `grep` command.
- [parser](https://docs.fluentd.org/filter/parser): parses a string and modifies
  the event record with the value that was parsed.
- [geoip](https://docs.fluentd.org/filter/geoip): adds geographic information to
  log entries.

To send logs to diverse destinations, you can use any of the available
[output plugins](https://docs.fluentd.org/output#list-of-output-plugins):

- [out_file](https://docs.fluentd.org/output/file): writes log entries to files.
- [out_opensearch](https://docs.fluentd.org/output/opensearch): deliver log
  records to Opensearch.
- [out_http](https://docs.fluentd.org/output/http): uses HTTP/HTTPS to write
  records.
- [roundrobin](https://docs.fluentd.org/output/roundrobin): distribute logs to
  multiple outputs in round-robin fashion.

There are several other types of plugins available, including
[Parsers](https://docs.fluentd.org/parser#list-of-built-in-parsers),
[Formatter](https://docs.fluentd.org/formatter#list-of-built-in-formatters),
[Metrics](https://docs.fluentd.org/metrics),
[Storage](https://docs.fluentd.org/storage), and more. A host of third-party
plugins are also available and can be browsed
[here](https://www.fluentd.org/plugins).

### Fluentd advantages

- **Pluggable architecture**: Fluentd was designed to be extensible with
  plugins. It currently has over [1000 plugins](https://www.fluentd.org/plugins)
  available, which provides flexibility for gathering, processing, and storing
  your log data.

- **Popularity**: It is a popular and battle-tested technology that is relied on
  by many big players in the industry. A host of resources are also available
  for learning how to use it effectively.

- **Low memory footprint**: Fluentd doesn't use a lot of memory, with its
  documentation indicating that a single instance typically occupies around
  30-40MB of memory. If you require even less resource consumption, you can use
  [Fluent Bit](https://docs.fluentbit.io/), a lightweight alternative with a
  memory footprint of less than 1MB and zero dependencies but has less than 100
  plugins.

- **High availability support**: It is well suited for highly available and
  high-traffic websites.

### Fluentd disadvantages

- **Performance**: While much of Fluentd is written in C, its plugin framework
  is written in Ruby which provides flexibility at the cost of performance. A
  Fluentd instance can only handle
  [about 18,000 messages per second](https://www.fluentd.org/faqs) on standard
  hardware.

If you're interested in Fluentd, be sure to explore [our comprehensive guide](https://betterstack.com/community/guides/logging/fluentd-explained/) for more details.

**Learn more**: [How to Collect, Process, and Ship Log Data with Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/)

## 4. Fluent Bit

[Fluent Bit](https://fluentbit.io/) is a lightweight, high-performance log shipper, serving as an alternative to Fluentd. Both tools were created by the same company, [Treasure Data](https://www.treasuredata.com/). Fluent Bit emerged in response to the growing need for an optimal solution capable of collecting logs from numerous sources while efficiently processing and filtering them. Notably, Fluent Bit excels in resource-constrained environments such as containers or embedded systems, with a small memory footprint of around 1MB.

In addition to its efficiency, Fluent Bit boasts powerful features like backpressure handling and SQL Stream Processing. Its pluggable architecture allows access to over 100 plugins, extending its capabilities in inputs, filters, and destinations. One of Fluent Bit's significant advantages is its vendor-neutral approach, making it a popular choice among major cloud companies such as AWS Cloud, Google Cloud, and DigitalOcean. Fluent Bit is licensed under Apache 2, enhancing its accessibility and usability in various applications.

### How Fluent Bit works

![Diagram illustrating the Fluentd observability pipeline](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa0869a0-de54-4ccf-2432-1546560e1700/public =1054x263)

To use Fluent Bit, you define inputs, filters, outputs, and global configurations in a configuration file located at `/etc/fluent-bit/fluent-bit.conf`.

```text
[SERVICE]
    ...

[INPUT]
    ...

[FILTER]
    ...

[OUTPUT]
    ...
```

Let's examine these components in detail:

- `[SERVICE]`: contains global settings for the running service.

- `[INPUT]`: specifies sources of log records for Fluent Bit to collect.

- `[FILTER]`: applies transformations to log records.

- `[OUTPUT]`: determines the destination where Fluent Bit sends the processed logs.

In the configuration, you can have as many components as your project requires.

Let's now explore a practical example. To read Nginx log files and forward them to the console, here's how you should do it:

```text
[label /etc/fluent-bit/fluent-bit.conf]
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    debug

[INPUT]
    Name         tail
    Path         /var/log/nginx/access.log
    Tag          filelogs

[OUTPUT]
    Name         stdout
    Match        filelogs
```

The `[SERVICE]` section contains global settings. The `Flush` parameter specifies Fluent Bit's flush intervals. When `Daemon` is set to `off`, Fluent Bit runs in the foreground. `Log_Level` configures the severity levels Fluent Bit uses for writing diagnostics.

In the `[INPUT]` section, the `tail` plugin reads the Nginx `access.log` file. The `Tag` option allows you to tag log events for Fluent Bit components such as `[FILTER]` and `[OUTPUT]`, enabling precise filtering of the logs.

For the `[OUTPUT]` section, the `stdout` plugin is employed to forward all logs to the standard output with the `filelogs` tag.

### Supported inputs, filters, and outputs in Fluent Bit

Fluent Bit offers a diverse range of [input plugins](https://docs.fluentbit.io/manual/pipeline/inputs) tailored to different log sources:

- [`http`](https://docs.fluentbit.io/manual/pipeline/inputs/http): captures logs via a REST endpoint.
- [`syslog`](https://docs.fluentbit.io/manual/pipeline/inputs/syslog): gathers Syslog logs from a Unix socket server.
- [`opentelemetry`](https://docs.fluentbit.io/manual/pipeline/inputs/opentelemetry): fetches telemetry data from OpenTelemetry sources.
- [`tail`](https://docs.fluentbit.io/manual/pipeline/inputs/tail/): monitors and collects logs from the end of a file, similar to the `tail -f` command.

When it comes to transforming logs, Fluent Bit offers various [filter plugins](https://docs.fluentbit.io/manual/pipeline/filters/):

- [`grep`](https://docs.fluentbit.io/manual/pipeline/filters/grep): matches or excludes log records, akin to the `grep` command.

- [`record_modifier`](https://docs.fluentbit.io/manual/pipeline/filters/record-modifier): modifies specific fields or attributes within your logs.

- [`modify`](https://docs.fluentbit.io/manual/pipeline/filters/modify): changes log records based on specified conditions or rules.

- [`lua`](https://docs.fluentbit.io/manual/pipeline/filters/lua): alters log records using [Lua](https://www.lua.org/) scripts.

To efficiently dispatch logs to different destinations, Fluent Bit provides a versatile array of [output plugins](https://docs.fluentbit.io/manual/pipeline/outputs)

- [`http`](https://docs.fluentbit.io/manual/pipeline/outputs/http): pushes records to an HTTP endpoint.
- [`file`](https://docs.fluentbit.io/manual/pipeline/outputs/file): writes logs to a specified file.
- [`websocket`](https://docs.fluentbit.io/manual/pipeline/outputs/websocket): forwards log records to a WebSocket endpoint.
- [`amazon_s3`](https://docs.fluentbit.io/manual/pipeline/outputs/s3): sends metrics logs directly to Amazon S3.

### Fluent Bit Advantages

- **Resource Efficiency**: Fluent Bit is engineered for optimal performance in resource-constrained environments like containers and embedded systems, using a mere 1MB of memory per instance.
- **Rich Community and Documentation**: Fluent Bit benefits from many resources, including tutorials and guides. Its vibrant community actively contributes to the software, providing valuable insights and support.
- **Powerful Features**: Fluent Bit boasts robust capabilities, including the Fluent Bit stream processor, enabling real-time data analysis using SQL queries. This allows users to perform record queries while logs are in transit.
- **Pluggable Architecture**: Fluent Bit's flexible architecture can be extended using plugins. These plugins support additional inputs, filters, and outputs, enabling tailored configurations and integrations.

### Fluent Bit Disadvantages

- **Limited Plugin Ecosystem**: Unlike FluentD, which offers over 1000 plugins, Fluent Bit currently provides around 100 plugins. This limitation affects its support for various inputs, filters, or outputs, potentially restricting its applicability to specific use cases.t
- **Challenging Plugin Development**: Creating plugins for Fluent Bit can be daunting due to the requirement of writing them in C, a language known for its complexity. Writing efficient code in C poses challenges, making plugin development a task requiring significant expertise and effort.

To delve deeper into Fluent Bit, explore [our comprehensive guide](https://betterstack.com/community/guides/logging/fluent-bit-explained/).

**Learn more**: [How to Collect, Process, and Ship Log Data with Fluent Bit
](https://betterstack.com/community/guides/logging/fluent-bit-explained/)

## 5. Filebeat

[Filebeat](https://www.elastic.co/beats/filebeat) is a log shipper that gathers
logs from servers, containers and delivers them to diverse destinations. It's
designed to be an integral part of the
[Elastic Stack](https://www.elastic.co/what-is/elk-stack) (formerly ELK Stack),
which comprises Elasticsearch, Kibana, Beats, and Logstash. Filebeat is part of
the Beats family, including Metricbeat, Packetbeat, and Journalbeat to mention a
few. Each beat was created to ship different types of information, and
Filebeat's primary goal is to collect logs and forward them to Logstash or
directly to Elasticsearch for indexing.

Filebeat is highly extensible through the use of modules, which allow it to
collect logs from many sources and destinations, such as MySQL, Kafka, AWS,
NATS, Apache, and more. It is also written in Go and offers a single binary file
for straightforward deployment. Notably, Filebeat excels in handling substantial
data volumes while using minimal resources.

### How Filebeat works

![filebeat.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/72b3b602-cfb6-4b36-7a99-0eddc405cd00/orig =940x735)

Understanding how Filebeat works boils down to the following components:

- **Harvesters**: a harvester reads the contents of a file line by line. It is
  also responsible for opening and closing a file.

- **Inputs**: are responsible for managing the harvesters and finding all
  sources to read from.

The information for the inputs resides in the `/etc/filebeat/filebeat.yml`
config file and can be broken down into the following components:

```yaml
[label /etc/filebeat/filebeat.yml]
filebeat.inputs:
  . . .
  processors:
    . . .
output.plugin_name:
   . . .
```

The `inputs` section contains the path to the file sources, `processors` mutates
the log entry, and `output` specifies the target destination for the log
records.

For example, here's how to define an input with a path to the Nginx `access.log`
file:

```yaml
[label /etc/filebeat/filebeat.yml]
filebeat.inputs:
- type: filestream
  enabled: true
  paths:
    - /var/log/nginx/access.log
```

Next, use `processors` to add a custom field to the log message:

```yaml
[label /etc/filebeat/filebeat.yml]
. . .
  processors:
    - add_fields:
        target: ""
        fields:
          mutated: "true"
. . .
```

Finally, send the logs to your preferred destination, such as an [auto rotating
file](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) like this:

```yaml
[label /etc/filebeat/filebeat.yml]
output.file:
  path: "/tmp/filebeat"
  filename: filebeat
  rotate_every_kb: 10000
  number_of_files: 7
  permissions: 0600
  rotate_on_startup: true
```

For a detailed guide check our [Filebeat article](https://betterstack.com/community/guides/logging/filebeat-explained/).

### Supported inputs, outputs, and modules in Filebeat

Let's explore some of the inputs, processors, and outputs that are available in
Filebeat. The following are some of the
[inputs](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-options.html#filebeat-input-types):

- [Filestream](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-filestream.html#filebeat-input-filestream):
  actively read lines from log files.
- [HTTP JSON](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-httpjson.html):
  fetches log messages from an HTTP API with JSON payloads.
- [Syslog](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-syslog.html):
  pulls log entries from Syslog.
- [Container](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-container.html):
  collect [container logs](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

To forward the logs to one or more destinations, some of these
[outputs](https://www.elastic.co/guide/en/beats/filebeat/current/configuring-output.html)
can be valuable:

- [Elasticsearch](https://www.elastic.co/guide/en/beats/filebeat/current/elasticsearch-output.html):
  forward logs to Elasticsearch via its HTTP API.
- [Logstash](https://www.elastic.co/guide/en/beats/filebeat/current/logstash-output.html):
  deliver logs directly to Logstash.
- [Kafka](https://www.elastic.co/guide/en/beats/filebeat/current/kafka-output.html):
  sends log entries to Apache Kafka.
- [File](https://www.elastic.co/guide/en/beats/filebeat/current/file-output.html):
  writes log events to files.

Filebeat also supports
[modules](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-modules.html)
which provide a quick way to process common log formats without writing huge
configuration files. A few of the
[available modules](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html)
are listed below:

- [AWS](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-aws.html).
- [Nginx](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-nginx.html).
- [PostgreSQL](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-postgresql.html).
- [HAproxy](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-haproxy.html).
- [Logstash](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-logstash.html).
- [RabbitMQ](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-rabbitmq.html#filebeat-module-rabbitmq).

### Filebeat advantages

- **Resource efficient**: Filebeat is lightweight and capable of handling
  substantial data loads without using up too many resources, such as memory and
  CPU.

- **Simplified deployment**: It offers a single binary that supports both server
  and container deployments, and it does not require external dependencies.

- **Extensible**: Filebeat functionality can be extended using modules that
  simplify gathering, parsing, and forwarding logs.

### Filebeat disadvantages

- **Limited data processing**: While Filebeat possesses processing capabilities,
  they are comparatively basic when contrasted with more powerful log shippers
  that offer sophisticated languages for intricate log entry transformation.

- **Vendor-lockin**: With the release 7.13, Elastic modified Filebeat to stop
  sending logs to non-Elastic versions of Elasticsearch like
  OpenSearch. To avoid this issue, you need to use Filebeat
  7.12 or lower, a decision that will have you miss out on enhancements,
  security fixes, or bug fixes in newer versions.

- **Lack of monitoring features**: Filebeat lacks built-in monitoring features
  that can provide health insights on Filebeat instances. However, you can use
  the Elastic Stack monitoring features, which collect observability data from
  Filebeat. Unfortunately, this means that it would be difficult to monitor
  Filebeat's health if you are not using the Elastic Stack.

**Learn more**: [How to Collect, Process, and Ship Log Data with Filebeat
](https://betterstack.com/community/guides/logging/filebeat-explained/)

## 6. Logstash

[Logstash](https://www.elastic.co/logstash) is a free data processing pipeline
used to gather logs from multiple sources, transform and enrich the data, and
then forward them to any destination. Like Filebeat, it was created by Elastic
and seamlessly integrates with the Elastic Stack. Often, you will find Filebeat
being used to collect logs and forward them to Logstash for processing. From
there, Logstash can send logs to Elasticsearch for indexing and be analyzed with
Kibana.

Logstash is widely used and has a wealth of plugins that extend its
functionality, allowing it to support many other data sources and destinations.
Apart from logs, Logstash can also work with other observability data, such as
metrics and traces.

### How Logstash works

![logstash.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6d93bb9a-a646-411b-ce7f-269d00b9d100/md2x =1089x243)

The Logstash pipeline consists of the following:

- `input`: retrieves data from sources and creates an event.
- `filter`: optionally used to transform, mutate or enrich data.
- `output`: sends data to the specified destinations.

The configurations for Logstash reside in the `/etc/logstash/conf.d` directory.
And a typical configuration file has the following structure:

```text
input {
      plugin_name{...}
 }

filter {
     plugin_name{...}
}

output {
     plugin_name{...}
}
```

Here's an example that reads Nginx's `access.log` file and forwards it to a log
management service:

```text
[label /etc/logstash/conf/01-read-nginx-logs.conf]
input {
    file {
        'path' => '/var/logs/nginx/access.log'
        'type' => 'nginx'
        'start_position' => 'beginning'
    }
}

filter {
    grok {
        match => { "message" => "%{IPORHOST:remote_ip} - %{DATA:user_name} \[%{HTTPDATE:access_time}\] \"%{WORD:http_method} %{DATA:url} HTTP/%{NUMBER:http_version}\" %{NUMBER:response_code} %{NUMBER:body_sent_bytes} \"%{DATA:referrer}\" \"%{DATA:agent}\"" }
   }

    mutate {
        add_field => {
            "mutate"=> "true"
        }
    }
}

output {
    http {
        url => "https://in.logs.betterstack.com/"
        http_method => "post"
        headers => {
          "Authorization" => "Bearer <your_betterstack_source_token>"
        }
        format => "json"
    }
}
```

The `input` section uses the
[`file`](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-file.html)
plugin to read logs from an Nginx `access.log` file and constructs a log event.
It then sends it to specified `filter` plugins to process the data. The
[`grok`](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html)
plugin parses and structures the data, while `mutate` also adds a new property
to the log. Finally, the `output` section uses the
[http](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-http.html)
plugin to forward the logs in a JSON format to Better Stack for centralization.

### Supported inputs, outputs, and filters in Logstash

Logstash has a massive ecosystem of input, output, and filter plugins. The
following are some of the
[input plugins](https://www.elastic.co/guide/en/logstash/current/input-plugins.html)
you can use:

- [Beats](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-beats.html):
  collect logs from the Beats framework.
- [HTTP](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-http.html):
  receives log events over HTTP.
- [Unix](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-unix.html):
  read log entries via a Unix socket.
- [Redis](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-redis.html):
  read log events from a Redis instance.

When it comes to
[outputs](https://www.elastic.co/guide/en/logstash/current/output-plugins.html),
some of the packages here may come in handy:

- [Elasticsearch](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html):
  sends log entries to Elasticsearch.
- [S3](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-s3.html):
  sends log entries to Amazon Simple Storage Service (Amazon S3).
- [WebSocket](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-websocket.html):
  delivers logs to a WebSocket endpoint.
- [Syslog](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-syslog.html):
  forward logs to a Syslog server.

To transform data, you can use some of the
[filter plugins](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-http.html)
listed below:

- [Grok](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html):
  used to parse and structure data.
- [Geoip](https://www.elastic.co/guide/en/logstash/current/plugins-filters-geoip.html):
  adds geographical information.
- [I18n](https://www.elastic.co/guide/en/logstash/current/plugins-filters-i18n.html):
  removes special characters.
- [JSON](https://www.elastic.co/guide/en/logstash/current/plugins-filters-json.html):
  parses JSON logs.

### Logstash advantages

- **Highly customizable with a large community**: It has abundant educational
  resources that lessen the learning curve. It also has plenty of plugins you
  can use in your projects and you can create your plugins as needed.

- **Scalability**: Logstash can be configured for high availability through load
  balancing and has failovers in place to prevent data loss.

- **Exposes monitoring APIs**: Logstash provides an API that exposes pipeline
  metrics, node information like process stats, JVM stats, and plugin
  information.

- **Advanced transforms**: Logstash filters can quickly perform robust data
  transformation, largely due to its powerful plugins that can parse and modify
  logs.

### Logstash disadvantages

- **Resource intensive**: Logstash uses much more memory than the lightweight
  log shippers we've examined in this article. It recommends a
  [JVM heap size](https://www.elastic.co/guide/en/logstash/8.9/jvm-settings.html#heap-size)
  between 4GB and 8GB, which is a lot for most servers or containers.
- **Vendor-lockin**: when Logstash 7.13 was released, it came with a breaking
  change that prevents Logstash from sending logs to non-Elastic versions of
  Elasticsearch, such as [OpenSearch](https://opensearch.org/). However, there
  are workarounds available through the use of plugins.

**Learn more**: [How to Collect, Process, and Ship Log Data with Logstash
](https://betterstack.com/community/guides/logging/logstash-explained/)

## 7. Rsyslog

[Rsyslog](https://www.rsyslog.com/) is one of the oldest open-source log
shippers known for its high performance, modular design, and security features.
Rsyslog implements the [Syslog](https://en.wikipedia.org/wiki/Syslog) protocol
and extends it to support a wide range of inputs, outputs, and filters.

It can forward log messages to local destinations or over the network through
TCP, TLS, or RELP (Reliable Event Logging Protocol). It also supports
multithreading and can be load balanced to handle high data volumes. According
to its documentation, it is capable of delivering more than one million messages
per second to local destinations when limited processing is applied.

### How Rsyslog works

![rsyslog.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e1059300-eedd-4b6d-0238-e29e17fdd000/orig =780x587)

The Rsyslog pipeline is made up of the following directives:

- `input`: collect logs from specified sources.
- `template`: modifies the log message.
- `action`: forward logs to destination.

You can define your configuration file in the `etc/rsyslog.d` directory, and the
most typical outlines look like this:

```text
module(load="<module_name>")

# collect logs
input(...)

# Modifies log
template(name="<template_name>") {}

# redirect logs to the destination
action(type="<module_name>")
```

Here is a sample configuration that converts Nginx access logs to JSON and
stores the result in a separate file:

```text
[label /etc/rsyslog.d/02-nginx-logs.conf]
module(load="imfile" PollingInterval="10" statefile.directory="/var/spool/rsyslog")

input(type="imfile"
      File="'/var/logs/nginx/access.log"
      Tag="nginx_access")

template(name="nginx-json-template"
  type="list") {
    constant(value="{")
      constant(value="\"@timestamp\":\"")     property(name="timereported" dateFormat="rfc3339")
      constant(value="\",\"@version\":\"1")
      constant(value="\",\"message\":\"")     property(name="msg" format="json")
      constant(value="\",\"sysloghost\":\"")  property(name="hostname")
      constant(value="\",\"severity\":\"")    property(name="syslogseverity-text")
      constant(value="\",\"facility\":\"")    property(name="syslogfacility-text")
      constant(value="\",\"programname\":\"") property(name="programname")
      constant(value="\",\"procid\":\"")      property(name="procid")
    constant(value="\"}\n")
}

if $syslogtag == 'nginx_access' then {
    action(type="omfile" file="/var/log/nginx-json.log" template="nginx-json-template")
}
```

In the first line, the `imfile` module is loaded and used to read logs in the
`var/logs/nginx/access.log` file. Next, a template that converts the records to
the JSON format is defined, and finally, the `omfile` plugin forwards the
processed logs to the `/var/log/nginx-json.log` file.

### Supported inputs, outputs, and modification modules in Rsyslog

Rsyslog supports a wide range of modules, which can be categorized into inputs,
message modifications, and output.

The following are some of the
[inputs](https://www.rsyslog.com/doc/master/configuration/modules/idx_input.html)
you should be familiar with:

- [imfile](https://www.rsyslog.com/doc/master/configuration/modules/imfile.html):
  reads standard text files and converts them into a Syslog message.
- [imdocker](https://www.rsyslog.com/doc/master/configuration/modules/imdocker.html):
  collect logs from Docker containers using the Docker Rest API.

- [imjournal](https://www.rsyslog.com/doc/master/configuration/modules/imjournal.html):
  import system journal messages into Syslog.
- [imhttp](https://www.rsyslog.com/doc/master/configuration/modules/imhttp.html):
  receives plaintext messages via HTTP.

You can modify log messages with
[message modification modules](https://www.rsyslog.com/doc/master/configuration/modules/idx_messagemod.html)
such as the following:

- [mmanon](https://www.rsyslog.com/doc/master/configuration/modules/mmanon.html):
  anonymizes IP addresses.
- [mmfields](https://www.rsyslog.com/doc/master/configuration/modules/mmfields.html):
  extracts fields from log entries.
- [mmkubernetes](https://www.rsyslog.com/doc/master/configuration/modules/mmkubernetes.html):
  adds Kubernetes metadata to each log entry.
- [mmjsonparse](https://www.rsyslog.com/doc/master/configuration/modules/mmjsonparse.html):
  provides support for parsing structured logs.

Rsyslog also has
[output modules](https://www.rsyslog.com/doc/master/configuration/modules/idx_output.html)
for forwarding log messages:

- [omelasticsearch](https://www.rsyslog.com/doc/master/configuration/modules/omelasticsearch.html):
  forwards log output to Elasticsearch.
- [omfile](https://www.rsyslog.com/doc/master/configuration/modules/omfile.html):
  writes log entries to a file.
- [ommysql](https://www.rsyslog.com/doc/master/configuration/modules/ommysql.html):
  sends log data to MySQL.
- [omrabbitmq](https://www.rsyslog.com/doc/master/configuration/modules/ommysql.html):
  delivers log data to RabbitMQ.

### Rsyslog advantages

- **Documentation and community**: Rsyslog has a plethora of resources, such as
  documentation, tutorials, and active communities on platforms such as
  StackExchange, which comes in handy if you're just learning how to use it.

- **Modules**: It supports a wide variety of
  [modules](https://www.rsyslog.com/doc/master/configuration/modules/index.html)
  for extending its functionality.

- **Installation and deployment**: In most cases, you won't have to install
  Rsyslog since it is included in most modern Linux distributions. Installing
  Rsyslog is also straightforward if needed.

- **Performance**: Rsyslog is capable of handling an high volume of log data per
  second in a high-traffic environment.

### Rsyslog disadvantages

- **Complex configuration**: Its configuration is more difficult to understand
  when compared to other log shippers.

- **Documentation**: The documentation is hard to navigate especially if you're
  new to the tool.

**Learn more**: [How to Collect, Process, and Ship Log Data with Rsyslog](https://betterstack.com/community/guides/logging/rsyslog-explained/)

## Final thoughts

In this tutorial, we discussed six log shippers: OpenTelemetry, Vector, Fluentd, Filebeat, Logstash, and Rsyslog. Each tool possesses unique advantages and constraints, and our exploration reviewed several key considerations pivotal in the selection process. You should now be fully equipped to choose the right log shipper for your project.

As a recommendation, [OpenTelemetry](https://opentelemetry.io/) stands out as a strong contender for most use cases with its vendor-neutral approach, extensive feature set, and active community support. Its flexibility and extensibility make it suitable for various observability needs.

[Vector](https://vector.dev/), with its performance and efficient resource utilization, is also a compelling option, provided the available plugins suffice for your needs. [Fluentd](https://www.fluentd.org/), renowned for its extensive plugin library, offers great flexibility, although its performance is less impressive. Rsyslog is another excellent alternative to provide [centralized log management](https://betterstack.com/community/guides/logging/how-to-configure-centralised-rsyslog-server/).

Thanks for reading, and happy logging!
