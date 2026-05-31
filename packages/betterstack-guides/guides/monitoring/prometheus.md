#  What is Prometheus Monitoring? A Beginner's Guide

Effective monitoring is crucial for any business as
[downtime can be incredibly costly](https://www.forbes.com/councils/forbestechcouncil/2024/04/10/the-true-cost-of-downtime-and-how-to-avoid-it/).

Real-time monitoring is thus essential to maintain performance, reliability, and
ensure rapid issue resolution, and
[Prometheus](https://www.cloudraft.io/prometheus-consulting) has long been a key
player in this space.

In this blog post, you'll gain a comprehensive understanding of Prometheus and
its powerful capabilities for monitoring your applications and infrastructure.

Let's get started!

[ad-logs]

## What is Prometheus?

Prometheus is a leading open-source monitoring and alerting toolkit that was
originally developed at SoundCloud in 2012.

It quickly rose to prominence due to its powerful and efficient approach to
metric collection and analysis, and is now the de facto standard for monitoring
in the cloud-native world.

In 2016, Prometheus became the second project hosted by the Cloud Native
Computing Foundation (CNCF), following Kubernetes, and this cemented its role as
a cornerstone of the cloud-native ecosystem.

Today, Prometheus remains one of the CNCF's most active projects, and recently
celebrated the release of
[version 3.0](https://prometheus.io/blog/2024/11/14/prometheus-3-0/).

<iframe width="100%" height="315" src="https://www.youtube.com/embed/jN9YpPOom3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How does Prometheus work?

![Architecture of Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d00afbb6-c9fe-4b47-c04e-8987dc656f00/lg2x =1351x811)

Prometheus operates by scraping metrics from monitored targets at regular
intervals. These targets expose metrics over HTTP endpoints, typically at
`/metrics`, in a human-readable format that Prometheus can process.

The metrics format looks like this:

![Prometheus metrics format](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/419b0e93-f365-426e-9e82-7fef1eb6ec00/lg1x =2146x1011)

To expose metrics from your application, you'll need to instrument your code
with the
[client libraries](https://prometheus.io/docs/instrumenting/clientlibs/)
provided for your programming language or framework.

Since Prometheus' metrics format is the de facto standard in the monitoring
ecosystem, many systems, including Kubernetes, natively support it.

If a target doesn't natively expose Prometheus-compatible metrics,
[exporters](https://prometheus.io/docs/instrumenting/exporters/) can bridge the
gap. Exporters collect metrics from systems that don't directly support
Prometheus metrics, making them accessible in the expected format.

For dynamic environments like container orchestration platforms, Prometheus
supports
[service discovery mechanisms](https://prometheus.io/docs/prometheus/latest/http_sd/)
to dynamically locate targets as they are created or terminated.

Prometheus also supports short-lived targets, such as serverless functions,
through the [Pushgateway](https://github.com/prometheus/pushgateway).

Instead of Prometheus scraping these ephemeral targets directly, the metrics are
pushed to the Pushgateway. It acts as a temporary store, allowing Prometheus to
scrape the metrics from it at regular intervals.

Once metrics are collected from configured or discovered targets, they are
stored in a local time-series database where you can configure retention periods
to manage storage usage so that older data can be offloaded if necessary.

Each metric is identified by a unique name, a timestamp, and optional key-value
pairs:

```text
http_requests_total{method="GET", status="200"}
```

Metrics stored in Prometheus can be queried using [PromQL](https://betterstack.com/community/guides/monitoring/promql/), a powerful
query language designed for time-series data. You can use the built-in
**expression browser** for ad hoc querying and data exploration.

When it comes to visualizing your metrics, Prometheus includes a basic web UI,
but it is often integrated with visualization tools like Grafana for advanced,
customizable dashboards.

![Diagram of Grafana Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e491b264-051b-485c-b652-bcc0c4df9e00/md2x =5956x1906)

Another important aspect of monitoring is alerting when notable events occur or
things go wrong. Prometheus handles this by allowing you to define alert rules
based on PromQL expressions, which trigger an alert once the conditions are met.

The alerting process is managed through the [Alertmanager
component](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/), which handles the grouping, deduplication,
and routing to the appropriate receivers such as email, Slack, Discord, or a
custom webhook.

With this overview of Prometheus' architecture and workflow, let's delve deeper
into the metrics it collects.

## A brief tour of Prometheus metrics

Metrics are simply numerical measurements tracked over time. These measurements
can be anything relevant to your application, like web server request latency or
the number of concurrent users.

Analyzing these metrics helps you understand your application's behavior,
health, and performance. For instance, monitoring CPU usage can help identify if
performance bottlenecks are due to resource constraints so that you can
implement optimizations or increase your server capacity as needed.

![Diagram of a Prometheus metric](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/87b34bb8-4abb-4e76-3198-8c4697252600/md2x =2254x594)

In Prometheus, each metric has a name, optional labels, and a value that changes
over time. There are four core metric types:

1. **Counter**: Counts things that go up but never down, like the number of
   requests served or errors encountered.
2. **Gauge**: Measures values that can go up or down, such as CPU usage, memory
   available, etc.
3. **Histogram**: Tracks the distribution of values over time to help you
   understand the typical, average, and outlier values.
4. **Summary**: Similar to histograms, but focuses on precomputed percentiles
   for a single instance of an application.

Just like a car's dashboard, each instrumented target must provide a `/metrics`
endpoint (or similar) where you can see all the collected metrics and their
current values.

For example:

```text
# HELP http_requests_total Total number of HTTP requests made.
# TYPE http_requests_total counter
http_requests_total{method="GET", code="200"} 1234
http_requests_total{method="POST", code="201"} 345
http_requests_total{method="GET", code="404"} 12
```

Here, `http_requests_total` is the metric name, and it's a **counter** tracking
the number of HTTP requests. The labels `{method="GET", code="200"}` provide
context, such as the HTTP method and response code.

In this case:

- 1,234 successful GET requests (`code="200"`) were made.
- 345 successful POST requests (`code="201"`) were made.
- 12 GET requests resulted in a 404 error.

For a deeper dive into metric types, check out [A Practical Guide to Prometheus
Metric Types](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/).

## Getting started with Prometheus

The simplest way to start using Prometheus and its components and exporters is
through the [official Docker images](https://hub.docker.com/u/prom).
Alternatively, you can explore other installation options on the
[Prometheus download page](https://prometheus.io/download/).

Here's an example Docker Compose configuration for running the
[Prometheus Server](https://hub.docker.com/r/prom/prometheus). This setup
enables metric scraping, querying, and basic visualizations:

```yaml
[label docker-compose.yml]
services:
[highlight]
  prometheus:
[/highlight]
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alerts.yml:/etc/prometheus/alerts.yml
      - prometheus_data:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --web.console.libraries=/etc/prometheus/console_libraries
      - --web.console.templates=/etc/prometheus/consoles
      - --web.enable-lifecycle
    expose:
      - 9090
    ports:
      - 9090:9090
    networks:
      - monitoring

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus_data:
```

Prometheus uses a configuration file (`prometheus.yml`) to define scrape
settings and specify monitoring targets. Below is a basic configuration:

```yaml
[label prometheus.yml]
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: prometheus
    scrape_interval: 10s
    static_configs:
      - targets:
          - 'localhost:9090'
```

This configuration file specifies a global scrape interval of 10 seconds, and
instructs Prometheus to scrap metrics a single target: the Prometheus server
itself. You can explore additional options in the
[configuration docs](https://prometheus.io/docs/operating/configuration).

Once your configuration files are ready, launch the Prometheus server using
Docker Compose:

```command
docker compose up -d
```

```text
[output]
. . .
[+] Running 2/2
 ✔ Network prometheus_monitoring               Created           0.2s
 ✔ Container prometheus                        Started           0.7s
```

The server will initialize and expose the Prometheus interface at
`http://localhost:9090`:

![Prometheus interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/24a1b1c7-9a56-4111-b132-2a33ba9cac00/public =1564x680)

Navigate to `http://localhost:9090/targets` to see what targets Prometheus is
configured to scrape:

![Prometheus targets interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/742f41d2-1f01-4ea2-924c-e8c0bdb81a00/lg1x =1564x482)

As you can see, only the Prometheus server itself is currently being scraped.

Prometheus exposes a variety of default metrics at
`http://localhost:9090/metrics`. These include details about the Go runtime,
scraping performance, HTTP server activity, and the health of the time-series
database.

Here's an example of the exposed metrics:

```text
. . .
process_virtual_memory_bytes 1.44852992e+09
# HELP process_virtual_memory_max_bytes Maximum amount of virtual memory available in bytes.
# TYPE process_virtual_memory_max_bytes gauge
process_virtual_memory_max_bytes 1.8446744073709552e+19
# HELP prometheus_api_notification_active_subscribers The current number of active notification subscribers.
# TYPE prometheus_api_notification_active_subscribers gauge
prometheus_api_notification_active_subscribers 1
# HELP prometheus_api_notification_updates_dropped_total Total number of notification updates dropped.
# TYPE prometheus_api_notification_updates_dropped_total counter
prometheus_api_notification_updates_dropped_total 0
# HELP prometheus_api_notification_updates_sent_total Total number of notification updates sent.
# TYPE prometheus_api_notification_updates_sent_total counter
prometheus_api_notification_updates_sent_total 0
# HELP prometheus_api_remote_read_queries The current number of remote read queries being executed or waiting.
# TYPE prometheus_api_remote_read_queries gauge
prometheus_api_remote_read_queries 0
. . .
```

You can then use PromQL to query and visualize the metrics. A simple query could
be displaying the resident memory used by the Prometheus process with:

```text
process_resident_memory_bytes
```

Switching to the **Graph** tab will display the Prometheus server memory usage
over time:

![Prometheus memory usage graph](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aff7fd3a-cee7-4512-33f0-3d531e9a7f00/md1x =2146x1337)

While collecting default metrics from Prometheus is a good start, it doesn't
fully demonstrate its potential.

To gain a deeper understanding of what Prometheus can do, we recommend reading
our guide on [monitoring host metrics using the Node
Exporter](https://betterstack.com/community/guides/monitoring/monitor-linux-prometheus-node-exporter/) and [visualizing Prometheus metrics in Grafana](https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/).

You can also explore our dedicated guides on [PromQL](https://betterstack.com/community/guides/monitoring/promql/) and
[Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) to learn all about querying your
metrics, and setting up a robust alerting system.

## When Prometheus works best

Prometheus excels at monitoring cloud-native infrastructure components either
natively or through exporters, letting you track metrics such as CPU utilization
or memory usage across servers.

It is particularly effective in dynamic environments with rapidly changing
services, like monitoring the performance of containerized applications in
Kubernetes.

Its independent server design ensures high reliability, allowing you to continue
monitoring critical metrics during system outages.

This resilience makes it an invaluable tool for diagnosing issues in real time,
even under failure conditions.

**Learn more**: [8 Prometheus Best Practices](https://betterstack.com/community/guides/monitoring/prometheus-best-practices/)

## When Prometheus may fall short

Despite its strengths, Prometheus isn't a universal solution for all
observability needs.

For use cases that demand precise, granular data—such as tracking financial
transactions, auditing user activity, or billing—Prometheus may fall short.

Its emphasis on reliability over precision means it may not capture the level of
detail required for such tasks.

In these cases, it's best to complement Prometheus with a dedicated system
designed for tasks

Prometheus is not ill-suited for long-term data retention or high-durability
storage.

For extended retention needs, explore its
[remote storage integrations](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage)
or consider an observability platform like
[Better Stack](https://betterstack.com/telemetry) for comprehensive solutions
that include long-term metric storage.

## Final thoughts

Now that you're familiar with how Prometheus works, you should be all set to
start monitoring your applications and infrastructure!

You can then take your Prometheus monitoring to the next level by integrating it
with Better Stack. Use either the
[scrape](https://betterstack.com/docs/logs/prometheus-scrape/) or
[remote-write](https://betterstack.com/docs/logs/prometheus/) method to
seamlessly send your metrics to Better Stack, where you can build dashboards and
configure alerts.

![Screenshot of a Better Stack Node Exporter Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90019f35-5c3f-443a-b760-1885c598f200/md1x
=3200x1471)

If you don't yet have a Better Stack account,
[sign up for the free tier](https://betterstack.com/users/sign-up) to start
exploring these capabilities.

Thanks for reading, and happy monitoring!