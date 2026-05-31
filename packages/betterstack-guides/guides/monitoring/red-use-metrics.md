# RED and USE Metrics for Monitoring and Observability

In the world of modern infrastructure and application monitoring, two frameworks
have emerged as powerful tools for understanding system behavior: RED and USE
metrics. 

Together, these complementary approaches provide a comprehensive view
of your systems, enabling  you to
effectively monitor, troubleshoot, and optimize your services and
infrastructure.

This article explores both frameworks in detail, showing how they work together
and providing practical guidance on implementing them with Prometheus, one of
the most popular open-source monitoring solutions.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/QWmU9Y_zKsw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Introduction to RED and USE metrics

Modern systems are complex, with numerous components interacting in sometimes
unpredictable ways. To effectively monitor these systems, you need structured
approaches that help you focus on the most important signals.

RED and USE metrics represent two different but complementary perspectives on
system monitoring. **The RED method (Rate, Errors, Duration) focuses on measuring
the experience of your users and service consumers**.

It provides visibility into how often your service is being used, how often
those uses fail, and how long successful operations take. This service-centric
approach gives you direct insight into what your users are experiencing.

**The USE method (Utilization, Saturation, Errors), on the other hand, focuses on
your underlying infrastructure resources**. It measures how busy your resources
are, whether they're overloaded, and if they're experiencing failures. This
resource-centric approach helps you understand the health and capacity of the
systems supporting your services.

When used together, these frameworks provide a powerful monitoring strategy. RED
metrics tell you when something is wrong from a user perspective, while USE
metrics help you understand why it's happening at the infrastructure level.

For example, if your RED metrics show increasing response times, your USE
metrics might reveal that a database server is experiencing high CPU saturation,
pointing you directly to the root cause.

[ad-logs]

## Understanding RED metrics

The RED methodology, popularized by Tom Wilkie of Grafana Labs, focuses on three
key metrics for every service. Let's explore each component in depth.

### 1. Rate

**Rate metrics track how often your service is being used**. In practice, this
means counting the number of requests or operations your service handles over
time.

For a web service, this would be HTTP requests per second. For a database, it
might be queries per second. For a message queue, it could be messages processed
per second.

![The rate of the HTTP metric](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3b453872-daa2-4a83-e610-9baf09dcb500/md2x
=3260x2034)

Rate metrics serve as the foundation of your monitoring strategy. They tell you
the baseline activity level of your system and help you detect anomalies.

A sudden drop in request rate might indicate that upstream services are failing
to send requests, while a sudden spike might warn you of an impending capacity
problem.

Rate metrics also provide crucial context for other measurements. For example,
an increase in error percentage is much more concerning during high-traffic
periods than during low-traffic periods, as it affects more users. Similarly,
performance degradations during peak traffic hours have a larger business impact
than those during quiet periods.

When implementing rate metrics, you'll typically use a counter that increases
monotonically over time. Monitoring tools like [Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) then
calculate the rate of increase over specific time intervals to give you requests
per second or similar measurements.

```javascript
[label metrics.js]
import { Counter } from 'prom-client';

const requestCounter = new Counter({
 name: 'app_request_count_total',
 help: 'Total number of requests received',
 labelNames: ['method', 'route']
});

requestCounter.inc({
 method: req.method,
 route: req.route?.path || req.path,
});
```

### 2. Errors

**Error metrics measure how many requests are failing**. This encompasses any
request that doesn't complete as expected, whether due to explicit errors,
timeouts, or incorrect results.

While it's common to track error metrics as a percentage of total requests, it's
also valuable to track the absolute error rate (errors per second). This gives
you additional context - a 1% error rate during peak traffic can affect far more
users than a 10% error rate during low traffic periods.

Different services may have different definitions of what constitutes an error.
For web services, HTTP status codes in the 5xx ranges typically count towards
the error rate, while message queues may include failed processing attempts or
dead-letter messages.

Error metrics should be detailed enough to help with troubleshooting. This means
including information about the error type, the affected endpoint or operation,
and potentially the error source.

However, be careful about adding too many dimensions to your metrics, as this
can lead to [cardinality problems](https://betterstack.com/community/guides/observability/high-cardinality-observability/) in your
monitoring system.

```javascript
[label metrics.js]
import { Counter } from 'prom-client';

const errorCounter = new Counter({
 name: 'app_error_count_total',
 help: 'Total number of request errors',
 labelNames: ['method', 'route', 'error_type']
});

function errorHandler(err, req, res, next) {
 // Count the error
 errorCounter.inc({
   method: req.method,
   route: req.route?.path || req.path,
   error_type: err.name || 'UnknownError'
 });

 res.status(500).send('Something went wrong');
}
```

### 3. Duration

**Duration metrics track how long successful requests take to process**. This is
typically measured in milliseconds or seconds and provides insight into the
performance of your service from a user perspective.

When measuring duration, it's crucial to capture the distribution of response
times rather than just the average. This is because performance issues often
affect only a subset of requests, which can be masked by an average.

For example, if 99% of your requests complete in 100ms but 1% take 10 seconds,
your average might still look acceptable at 200ms, while some users are
experiencing terrible performance.

To address this, duration metrics should be implemented as histograms that
capture percentiles. Common percentiles to track include:

- The median (50th percentile or `p50`), which tells you what the typical user
  experiences.
- The 90th percentile (`p90`), which represents the experience of your slower
  10% of requests.
- The 99th percentile (`p99`), which shows how your slowest 1% of requests
  perform.

```javascript
[label metrics.js]
import { Histogram } from 'prom-client';

// Create a histogram for tracking request duration
export const requestDuration = new Histogram({
 name: 'http_request_duration_seconds',
 help: 'Request duration in seconds',
 labelNames: ['method', 'route'],
 buckets: [0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10]
});

function durationMiddleware(req, res, next) {
 const start = Date.now();

 // Add a hook to measure duration when the response is sent
 res.on('finish', () => {
   const duration = (Date.now() - start) / 1000; // Convert to seconds
   requestDuration.observe(
     {
       method: req.method,
       route: req.route?.path || req.path
     },
     duration
   );
 });

 next();
}
```

These percentiles help you set realistic [Service Level Objectives
(SLOs)](https://betterstack.com/community/guides/incident-management/sla-vs-slo-vs-sli/) and understand the full range of user experiences.
They also make performance degradations more visible since slowdowns often
appear first in the higher percentiles before affecting the median.

When analyzing duration metrics, it's important to segment by endpoint or
operation type, as different operations naturally have different performance
characteristics. A complex database query should have different performance
expectations than a simple status check.

Duration metrics can also help you identify optimization opportunities.
Operations with consistently high durations or large variances in performance
might benefit from caching, query optimization, or code improvements.

![Using histogram_quantile to inspect buckets](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e55ec47e-9681-4c8e-030c-31680b11e500/public
=2069x1147)

## Understanding USE metrics

The USE methodology, developed by Brendan Gregg, provides a systematic approach
to analyzing system performance and identifying bottlenecks. Let's explore each
component of the USE framework in this section.

### 1. Utilization

**Utilization measures how busy your resources are, typically expressed as a
percentage of total capacity**. Utilization metrics answer questions like "How
much of our available CPU time is being used?" or "What percentage of our memory
is in use?"

For each resource in your system, you should track its utilization over time.
Key resources to monitor include:

- CPU
- Memory
- Disk space
- Network
- Disk I/O

When analyzing utilization metrics, it's important to understand the capacity
limits of each resource and how utilization affects performance. Some resources,
like CPUs, can safely run at high utilization for extended periods, while
others, like disks, may experience degradation at much lower utilization levels.

### 2. Saturation

**Saturation measures the degree to which a resource has more work than it can
process immediately**. It tells you about the "backlog" of work waiting for a
resource and is often expressed as queue length or wait time.

While utilization tells you how busy a resource is, saturation tells you when
that busyness is causing problems. For example, a CPU might be 100% utilized but
still processing work efficiently. However, if there's a long queue of processes
waiting for CPU time (high saturation), that indicates a performance problem.

Key saturation metrics include:

- CPU load average
- Memory swap usage
- Disk I/O queue length
- Thread pool queue length

Saturation metrics are particularly valuable because they often provide early
warning of performance problems. Resources can sometimes operate at high
utilization without issues, but any non-zero saturation typically indicates that
the resource is becoming a bottleneck.

### Errors

**Error metrics in the USE context measure how often resource-level failures
occur**. These are distinct from service-level errors in the RED framework, as
they focus on infrastructure components rather than application outcomes.

Resource errors can be subtle and don't always result in immediate service
failures. However, they often indicate developing problems that will eventually
impact users. Tracking these metrics allows you to address issues proactively
before they cause noticeable service degradation.

Important resource error metrics include:

- Network errors
- Filesystem errors
- Disk I/O errors

When analyzing resource errors, look for patterns and correlations with other
metrics. For example, network errors might increase during periods of high
network utilization, indicating that you're reaching capacity limits.

Regular monitoring of resource errors can also help identify hardware that needs
replacement before it fails completely. For instance, increasing disk errors
often precede total drive failure.

---

USE metrics are typically collected using exporters that gather data from the
system. The [Node Exporter](https://betterstack.com/community/guides/monitoring/monitor-linux-prometheus-node-exporter/) is the most
common for system-level USE metrics. Once running, the Node Exporter will expose
system metrics at `http://localhost:9100/metrics`.

![Node Exporter metrics page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/439d90ea-d1f7-4c89-a138-91e38bc5d000/orig
=1424x654)

## Creating effective dashboards

Once you have your RED and USE metrics being collected by Prometheus, you'll
want to create dashboards to visualize them.
[Better Stack](https://betterstack.com/) can ingest Prometheus data and create
dashboards for your consumption.

### RED metrics dashboard

An effective RED dashboard should provide at-a-glance visibility into your
service's health while also enabling deeper investigation when needed. Here's
how to structure your RED dashboard:

The request rate section should show the volume of traffic over time, with
breakdowns by endpoint, method, or other relevant dimensions. This helps you
understand your traffic patterns and identify unusual spikes or drops.

The error section should display both the absolute error rate and the error
percentage. Include breakdowns by error type and affected endpoints to help with
troubleshooting. Consider adding alerts for error rates that exceed your service
level objectives.

The duration section should show response time percentiles (p50, p90, p99) over
time. This gives you visibility into both the typical user experience and the
experience of your slowest requests. Include breakdowns by endpoint to identify
which parts of your service might need optimization.

### USE metrics dashboard

A comprehensive USE dashboard provides visibility into the health and capacity
of your infrastructure resources. Here's how to structure your USE dashboard:

The utilization section should show the percentage of each resource being used
over time. Include panels for CPU, memory, disk space, and network bandwidth
utilization. This helps you understand your capacity usage and identify
potential bottlenecks.

The saturation section should display metrics that indicate when resources are
overloaded. Include panels for CPU load average, memory swap usage, disk I/O
queue length, and network interface queue length. These metrics help you
identify resources that are struggling to keep up with demand.

The errors section should show resource-level errors over time. Include panels
for memory allocation failures, network errors, disk I/O errors, and other
resource-specific failures. These metrics help you identify hardware or
infrastructure issues before they cause service outages.

![Better Stack Node Exporter Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/03f39ea9-5a00-4e86-afea-5144f5b10900/md1x
=6143x3226)

## Final thoughts

RED and USE metrics provide a powerful framework for monitoring and
observability in modern infrastructure. By implementing these complementary
approaches, you gain visibility into both the user experience (RED) and the
underlying resource health (USE), enabling you to quickly identify, diagnose,
and resolve issues in your systems.

Thanks for reading!
