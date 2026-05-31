# Observability vs. Monitoring: The Key Differences to Know

Monitoring tells you if something is wrong. Observability helps you figure out
why. In this article, we'll explain the key differences between these practices,
discuss their strengths, and how they work together to maintain healthy,
performant software systems.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ytx6jr2TyxI?si=VrTmwO3qQX2Mrz_F" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## What is monitoring?

[Monitoring](https://betterstack.com/community/guides/monitoring/) is the practice of continuously tracking system health
by comparing key metrics against predefined thresholds so that potential issues
are caught before they turn into major outages or user-facing problems.

Monitoring systems collect, aggregate, and analyze metrics to sift through known
patterns that indicate whether troubling trends are occurring.

This monitoring data has two main consumers: machines and humans. Humans use
metric data to decide what conditions are considered "good" or "bad", while
machines constantly watch the metrics so that if the thresholds are reached,
alerts are triggered to the right channel to prompt further investigation and
action.

### The key elements of monitoring

The fundamental unit of monitoring is the metric which is a numerical
representation of system state over the particular interval of time when it was
recorded.

Similar to looking at a physical or digital gauge in a car, you can use metrics
to determine how aspects of your application are behaving at that particular
moment in time and how it has been trending over time.

Metrics are from various sources depending on what's being monitored. This data
can include system or application logs, performance counters, network data,
application health checks, and more.

The collected data is analyzed using thresholds and alerts. Thresholds define
acceptable operating ranges for metrics, and if a metric falls outside that
range, an alert is triggered.

Alerts help notify the relevant personnel via email, SMS, or other channels,
prompting them to investigate and take corrective action.

Since metrics data is often stored in time-series databases which are designed
specifically for tracking how data changes over time, they are often used to
build informative dashboards that allow you to view historical data trends,
identify patterns, and track the overall health of your systems over time.

### Types of monitoring

Monitoring can be categorized in various ways depending on what's being
monitored. Here are some of the most popular types of monitoring

- **Infrastructure monitoring**: Focuses on tracking the health and performance
  of underlying infrastructure like servers, containers, and virtual machines,
  through metrics like uptime, CPU utilization, memory utilization, disk I/O,
  and more.
- **Application monitoring (APM)**: Monitors specific software applications,
  tracking metrics like response times, resource usage, error rate, and various
  business-specific metrics.
- **Database monitoring**: Focuses on query performance, cache hit ratios,
  number of connections, storage utilization, and more.
- **Network monitoring**: Tracks network health, including bandwidth
  utilization, packet loss, latency, roundtrip time, and potential security
  threats.

## What is observability?

Monitoring has long been essential for keeping IT systems healthy. However, with
the rise of complex microservices architectures and cloud environments,
monitoring alone isn't enough. [That's where observability comes
in](https://betterstack.com/community/guides/observability/what-is-observability/) to help you gain a deeper understanding of how your
systems truly operate.

Think of it this way: monitoring tells you what is happening on the surface
(metrics, alerts). Observability helps you answer the why – revealing the
internal workings that led to that issue.

### Why observability matters now

Unlike monitoring, observability is harder to pin down. Its goal is to help you
understand unexpected system behavior no matter how novel or bizarre.

For decades, logs were the primary tool for this. Monitoring would alert us to a
problem, and we'd dig into logs to find the reason. But over the last 15 years,
system complexity exploded, and manually combing through logs became less
practical.

At the same time, businesses embraced the digital age, and downtime became
increasingly costly. We couldn't afford to spend hours figuring out issues. To
understand any state a system can get into, we needed more data. This sparked
the rise of observability solutions.

### The key elements of observability

Starting with the addition of traces to metrics and logs (the "[three
pillars](https://betterstack.com/community/guides/observability/logging-metrics-tracing/)"), observability has continuously expanded.
New data types are constantly being added to give us a clearer picture of why
systems misbehave.

Currently, the most common telemetry data collected for observability include:

#### 1. Structured logs

[Structured logs](https://betterstack.com/community/guides/logging/json-logging/) are records of events, errors, and system state
changes, designed to be easily processed and analyzed by machines. They contain
timestamps, severity levels, and additional contextual data in a standardized
format. This detailed timeline of events helps reveal revealing the sequence of
actions that led to an issue, as well as pinpointing specific error messages or
clues.

#### 2. Metrics

Metrics are the vital signs of your system. They provide numerical snapshots of
key health indicators like CPU usage, memory consumption, request response
times, and error rates. By tracking how metrics change over time, you can spot
emerging problems, identify potential performance bottlenecks, and set
thresholds that trigger alerts when things go outside of acceptable operating
ranges.

#### 3. Distributed tracing

Imagine traces as breadcrumbs that follow a single request as it travels through
your system. In complex microservice environments, this request might hop
between multiple services to complete an action. Traces connect the dots across
all these services, showing you the complete path of, for example, a user's
login request. This helps you to:

- Understand how different parts of your system interact, and where potential
  bottlenecks might lie.
- Determine the specific point and cause of failure if a specific request does
  not succeed.
- Identify which parts of the process are taking the most time, guiding
  optimization efforts.

#### 4. Continuous profiling

Think of continuous profiling as a microscope for your code's resource usage.
While metrics might identify a slowdown, continuous profiling can pinpoint the
exact function within your application that's causing the issue. This is crucial
because it focuses optimization efforts on the areas with the biggest potential
impact.

Unlike traditional profiling, which is a snapshot in time, continuous profiling
is always on in production environments. It captures fine-grained details about
how CPU, memory, and other resources are used at the function level. This
constant monitoring is designed to have minimal impact, making it safe for use
in live systems.

## How monitoring and observability work in practice

To understand how monitoring and observability work in practice, let's use a car
analogy.

Your car's dashboard provides essential information like speed, engine
temperature, fuel level, and warning lights. These let you know if basic
functions are running smoothly.

Now, imagine your car feels sluggish or starts losing power unexpectedly. Your
first step is to check the dashboard for clues. A flashing check engine light
indicates a problem – your engine isn't operating as it should.

This tells you to pull over safely. However, even if you know a bit about cars,
you can't easily diagnose the specific issue without the right tools.

A check engine light could mean anything from a loose gas cap to major engine
trouble. Trying to fix it without precise information would be a shot in the
dark, and could lead to a significant waste of time, money, and effort.

That's where a diagnostic tool comes in, offering a deeper level of insight. It
plugs into your car's computer (the OBD2 port) and reads specific error codes.

This helps you pinpoint the exact problem, so you can focus on implementing the
correct solution to get your vehicle back on the road.

In software, monitoring works like your car's dashboard. It alerts you to trends
you've previously identified as important like high memory usage (say, over 90%
for more than five minutes). This could signal a problem, but your dashboard
won't tell you the root cause.

To uncover the reason for the memory spike, you turn to other data like
application logs. Often, you rely on intuition and past experience to piece
together clues. Sometimes you're able to solve the problem, but other times you
get stuck and need help from a more seasoned team member who's seen similar
issues before.

This kind of debugging workflow is common, but it's becoming less effective as
software systems grow increasingly complex.

This has fuelled the need for observability in modern systems. It aims to
provide richer data in a format that makes it easier to follow the system's
"clues" to help simplifying the troubleshooting process regardless of your
experience level.

The goal is to centralize telemetry data, allowing you to correlate information,
drill down into details, and follow a clear path to answers without relying on
past experience or intuition.

Essentially, observability aims to make the data reveal the root cause of
problems so that you can accurately troubleshoot anomalies in your application,
even if they're caused by the interactions between hundreds of service
components.

## The challenges of monitoring and observability

Monitoring's core limitation is that it can only alert you to problems you've
anticipated in advance. You need to define metrics, set thresholds, and
essentially predict what might go wrong. When something entirely unexpected
occurs, monitoring leaves you in the dark. You might stumble upon the issue
eventually, but there's no proactive warning.

Even if you later add monitoring for the issue, it's impossible to anticipate
every potential problem. This is especially true as systems become more complex,
abstract, and distributed. Modern technologies like containers and SaaS
dependencies add even more layers where things can break in surprising ways.

Observability aims to provide insights through high cardinality, high
dimensionality data to debug any type of behaviour, even
"[unknown unknowns](https://en.wikipedia.org/wiki/There_are_unknown_unknowns)".

But its fundamental problem is that we can't predict the specific information
we'll need. Production errors surprise us – if we knew they were coming, we
could address them in advance!

This unpredictability makes observability a complex task. Since any data point
could potentially be the missing clue, we default to thinking "we need
everything!". But a system that recorded absolutely everything about its
operation would be impractical and absurdly expensive (see
[Coinbase's $65M Datadog bill](https://newsletter.pragmaticengineer.com/p/datadogs-65myear-customer-mystery?utm_source=post-email-title&publication_id=458709&post_id=120778088&isFreemail=true&utm_medium=email)
for a case study)

In reality, you must constantly strike a balance on what data to collect and how
much detail to capture. Each business approaches this trade-off differently,
leading to slightly varied understandings of what observability means in
practice.

## Better Stack's approach to monitoring and observability

Better Stack gives you a centralized view of your entire IT landscape – cloud,
hybrid, or on-premises by collecting, analyzing, and correlating data across
your network, infrastructure, and applications to quickly answer the toughest
questions about your system's behavior.

Better Stack's approach combines the strengths of monitoring and observability,
allowing you to gain deep insights into application performance while also
exploring the broader context of your IT environment.

Get started with monitoring and observability on Better Stack by
[creating an account today](https://uptime.betterstack.com/users/sign-up).

Thanks for reading!
