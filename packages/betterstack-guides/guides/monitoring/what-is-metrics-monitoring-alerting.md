# SRE Fundamentals: Metrics, Monitoring, and Alerting

Understanding the intricate workings of your infrastructure and applications is
crucial for maintaining stability, optimizing performance, and ensuring the
reliability of your services. A robust monitoring system is an indispensable
tool in achieving these goals.

Think of a monitoring system as your eyes and ears in the complex landscape of
your IT environment. It provides a continuous stream of insights into the health
and performance of your systems, empowering you to quickly identify and resolve
problems, assess the impact of updates or modifications, and make informed,
data-driven decisions.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/pouVbehfnqQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This guide delves into the core components of a monitoring system:

- **Metrics**: The fundamental building blocks of monitoring, representing
  quantifiable measurements of system performance.
- **Monitoring**: The continuous process of collecting, analyzing, and
  visualizing metrics to understand system behavior.
- **Alerting**: The proactive mechanism that notifies you of critical events or
  deviations from expected behavior.

We'll explore the importance of these concepts, the types of data you should
track, and the benefits they offer. Along the way, we'll introduce key
terminology and provide a glossary of common terms to help you navigate the
world of monitoring.

By the end of this guide, you'll have a solid understanding of how to leverage
metrics, monitoring, and alerting to gain valuable insights into your systems,
ensure their reliability, and optimize their performance.

[ad-logs]

## What are metrics?

**A metric is a single number that represents the state of a system at a specific
point in time**, offering a snapshot of its performance, behavior, or health. It
simplifies complex underlying activities into an interpretable value to enable
monitoring, issue diagnosis, and decision-making.

Metrics are typically collected continuously over time, forming time-series data
that reveal patterns, detect anomalies, and highlight long-term performance
trends. Rather than being static, a metric is best understood as part of an
ongoing stream of data points that are recorded as long as the system is active.

However, **a number alone has limited value without context**. A metric becomes
meaningful when compared to historical data, predefined baselines, or
performance targets.

For instance, a CPU usage of 80% might indicate normal operation in one scenario
but signal a potential issue in another, depending on the system's expected
workload.

**In essence, a metric is a dynamic, contextualized, and actionable data point**
that inform decisions, trigger automated or manual actions, and ultimately drive
system improvements.

## What metrics should you collect?

As your systems grow and evolve, so too will your monitoring needs. What you
track today might be different from what you track tomorrow.

Think of your infrastructure as a building. You have the foundation, the core
structure, the various floors with different functions, and finally, the roof.
Each layer relies on the ones beneath it, and monitoring each layer provides a
different perspective on the building's overall health.

Similarly, IT systems often function in a hierarchy, with more complex layers
built upon foundational components. When planning your monitoring strategy, it's
crucial to consider the different levels of your infrastructure and the unique
metrics each offers.

Let's look at a few of these below:

### 1. Host-level metrics

These metrics focus on the health and performance of individual machines to help
evaluate the operating system and hardware. Some common metrics collected at
this level include CPU usage and memory usage, disk space, processes, network
statistics, and more.

A common way to collect such metrics is by using the [Prometheus Node
Exporter](https://betterstack.com/community/guides/monitoring/monitor-linux-prometheus-node-exporter/) which collects and exposes a
wide array of host-level metrics from \*nix kernels and presents them in the
Prometheus format.

### 2. Application metrics

While host-level metrics provide a foundational understanding of your servers,
application metrics are explicitly created by you to measure the behavior,
performance, and health of your software.

The specific metrics you choose will depend on the nature of your application,
its dependencies, and its interactions with other components. However, some
common categories include:

- Request rates and errors
- Response times and latency
- Resource consumption
- Uptime and downtime
- Queue lengths and processing times

To get metrics from your application, you'll need to instrument it using
telemetry libraries or frameworks. These tools provide the means to capture and
expose relevant data points from within your application code.

[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/) and
[OpenTelemetry](https://betterstack.com/community/guides/observability/opentelemetry-metrics/) are two projects backed by the
[Cloud Native Computing Foundation](https://www.cncf.io/) that can instrument
your applications.

### Infrastructure metrics

While host-level metrics provide a granular view of individual machines, and
application metrics focus on the performance of your software, infrastructure
metrics provide a broader perspective on the health and performance of your
overall IT infrastructure.

These metrics encompass various components that support your applications and
services, including:

- Network infrastructure
- Containers
- Databases
- Cloud services
- Load balancers

### External dependency metrics

In addition to tracking metrics within your own systems, it's essential to
monitor those related to external dependencies. Many third-party services
provide status pages or APIs to report outages and performance issues.

However, incorporating these insights into your monitoring framework—along with
data on your interactions with these services—can provide a clearer picture of
how external dependencies impact your operations.

Some metrics to track in this area include:

- Service availability
- Error rates
- API latency
- Resource exhaustion such as request quotas

External dependencies are often integral to your system's functionality. Any
issues with these services—whether outages, degraded performance, or resource
limitations—can cascade into problems for your own infrastructure.

By proactively monitoring these metrics, you can quickly detect and respond to
provider issues, minimizing their impact on your operations.

## What is monitoring?

Monitoring is often misunderstood. People might think it's about watching
security cameras or tracking employee productivity, but in the world of
software, it has a much more focused purpose.

Imagine you're a pilot flying a plane. Monitoring is like having a dashboard
full of instruments that tell you everything you need to know about the flight:
altitude, speed, fuel levels, engine performance, and even weather conditions.
Without these instruments, you'd be flying blind.

Similarly, software monitoring provides a comprehensive view of your systems,
applications, and infrastructure. It's about collecting and analyzing data to
ensure everything is running smoothly, identify potential problems, and make
informed decisions.

There are three main aspects to monitoring:

### 1. Alerting

The heart of monitoring is knowing when something goes wrong or is reaching a
critical state. An alert can be simply information such as a notification of a
system update, or it draw attention to an spike in errors. It could also be a
major emergency like a complete server outage that demands immediate attention.

### 2. Debugging

Once alerted, you need to understand the "why" behind the problem. In most
cases, metrics alone cannot give you this information. This a broader focus on
[observability](https://betterstack.com/community/guides/observability/what-is-observability/) with telemetry signals like [logs and
traces](https://betterstack.com/community/guides/observability/logging-metrics-tracing/) come into play to help diagnose the root cause
of the issue.

### 3. Historical analysis

Beyond immediate firefighting, monitoring also helps you understand long-term
patterns. Analyzing trends in resource usage, performance, and user behavior
allows for better system design and optimization.

Essentially, monitoring provides the data and tools to investigate, diagnose,
and ultimately resolve the root cause of incidents. It's not just about
collecting metrics and displaying them on a dashboard, but also debugging
problems and

## What's involved in monitoring?

Monitoring starts with defining the goals for the systems you're interested in.
In most case, you're interested in tracking the performance, health and behavior
of your system. But you may have other monitoring goals.

The next step is collecting the raw metric data needed to achieve your
monitoring goals. This includes collecting metrics from your infrastructure
through native mechanisms, exporters, and other agents, and instrumenting your
services to emit relevant metrics.

It could also mean collecting logs and deriving metrics from them for systems
where native metrics aren't available, or [monitoring the logs](https://betterstack.com/community/guides/logging/log-monitoring/)
for significant events.

Once you have your metrics data, you need to send it to a monitoring system
where it can be used to plot dashboards and configure alerting. A popular
open-source combination is Prometheus and Grafana where you can use the
Prometheus format or even OTLP.

With your metrics data being ingested, you'll need to plot a dashboard that
interpret the raw data into meaningful visualizations. These dashboards
providing an at-a-glance overview of your systems' health and performance in a
way that let's you quickly spot anomalies in application behavior.

Most monitoring systems provide a set of default dashboards for popular software
systems so you can quickly get started, but you'll definitely need to customize
them depending on your monitoring goals.

It's not enough to simply collect and visualize data; you need to be proactively
notified when critical situations arise. Any monitoring system needs to be
accompanied with a robust alerting system to be truly effective.

You'll need to define clear thresholds that trigger alerts based on your
metrics. This might involve setting limits for CPU usage, error rates, response
times, or any other metric.

For example, an alert could trigger if a server's CPU usage consistently exceeds
90% or if an application's error rate surpasses a predefined threshold.

When an alert is triggered, you'll need to ensure that they reach the right
people in the right channel. Monitoring systems are often complemented with
incident response to ensure the entire swift reactions to critical situations.

## What's involved in alerting?

Alerting is a simple concept: when something important happens, send a
notification.

However, effective alerting requires careful planning and implementation to
ensure that alerts are meaningful, actionable, and not overwhelming. Here's a
breakdown of what's involved:

### 1. Defining what's important

Not every anomaly or metric change warrants an alert. Identifying what
constitutes "important" requires selecting relevant metrics and categorizing
their impact based on urgency.

For example, a metric that tracks if the service is up or not is clearly much
more impactful than one that monitors minor fluctuations in resource usage.

### 2. Setting up alert triggers

The next step is specifying the conditions under which alerts are generated.
This could involved static thresholds such as memory usage above 80%, or dynamic
thresholds like error rate increasing by 20% above average.

For more complex scenarios, you can combine multiple conditions using logical
operators so that alerts are triggered only when specific combinations of events
occur.

### 3. Routing alerts effectively

Once an alert is triggered, it needs to reach the right people through the
appropriate channels. This involves determining who should be notified for
different types of alerts, customizing what information should be included in
the alert, and routing them to the correct channel (such as phone calls for
urgent issues, or email for less urgent alerts).

### 4. Preventing alert fatigue

A common challenge with alerting is alert fatigue – when excessive or irrelevant
notifications desensitize recipients and lead to important alerts being ignored.

To combat this, ensure to add a time threshold to your alerts to ensure they are
appropriately sensitive and avoid false positives. You can also implement
mechanisms to filter out irrelevant alerts or group similar notifications to
reduce clutter.

### 5. Escalation procedures

For critical alerts, it's essential to have escalation procedures in place to
ensure a timely response, even if the initial recipient is unavailable.

This involves establishing a clear chain of command for escalating alerts to
different individuals or teams and determining how long an alert should remain
unacknowledged before escalating to the next level.

## The limits of monitoring in modern systems

Traditional monitoring which is built on the concept of metrics, has served us
well for decades. However, the increasing complexity of modern systems is
pushing its boundaries.

Modern systems are characterized by:

- **Distributed architectures**: Applications are now composed of numerous
  interconnected services, often running across diverse platforms and
  environments, making it difficult to pinpoint the root cause of problems.
- **Dynamic infrastructure**: Cloud-native systems utilize elastic
  infrastructure, with components constantly changing and scaling based on
  demand, challenging the assumptions of static environments.
- **Complex dependencies**: Modern applications rely on a web of interconnected
  services, many of which are external and beyond direct control, making it
  harder to isolate issues.

These characteristics create a level of complexity that traditional monitoring,
with its focus on predefined metrics and dashboards, struggles to handle. This
is where observability steps in.

[Observability](https://betterstack.com/community/guides/observability/what-is-observability/) acknowledges the inherent complexity of
modern systems and provides a more comprehensive approach to understanding their
behavior. It goes beyond basic metrics to incorporate rich data sources like
[logs, traces, and events](https://betterstack.com/community/guides/observability/logging-metrics-tracing/), providing a
multi-dimensional view of system dynamics.

## Monitoring with Better Stack

[Better Stack](https://betterstack.com/telemetry)'s observability platform
offers first-class monitoring features that help you transform your metrics data
into actionable insights without breaking the bank.

Beyond basic monitoring features like dashboards and alerting, you can derive
metrics directly from logs to enable anomaly monitoring even in scenarios with
[high cardinality](https://betterstack.com/community/guides/observability/high-cardinality-observability/) or where direct metrics
instrumentation is not feasible.

You'll also get comprehensive incident and on-call management tools to help you
detect issues immediately they occur, route alerts to the right channels, and
AI-based incident silencing that prevents alert fatigue.

To see all this and more in action,
[sign up for a free account here](https://betterstack.com/users/sign-up).

## Final thoughts

In the ever-evolving world of IT, monitoring is no longer a luxury, but a
necessity. It's the key to unlocking insights, ensuring stability, and
optimizing performance. By investing in a robust monitoring system, you empower
your team to navigate complexities, make informed decisions, and drive success.

Embrace the power of metrics, monitoring, and alerting, and transform your IT
infrastructure from a source of uncertainty to a foundation for innovation and
growth.

Thanks for reading!
