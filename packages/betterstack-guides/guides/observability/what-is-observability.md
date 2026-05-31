# What is Observability?

The term "observability" comes from
[Rudolf E. Kálmán's famous 1960 paper](https://www.cs.unc.edu/~welch/kalman/kalmanPaper.html)
where he applied it to describe mathematical control systems.
[Simply put](https://en.wikipedia.org/wiki/Observability): "Observability is a
measure of how well internal states of a system can be inferred from knowledge
of its external outputs".

In software systems, observability is the capacity to deduce the internal state
of an application from its external outputs (telemetry) alone. Essentially, this
means that the behavior of the entire system can be understood and predicted by
examining the data it generates no matter how novel the behavior is.

If a software system is fully observable, it means you can understand the
complete behavior of the system by analyzing the data it generates. Conversely,
a lack of observability means there are certain states or behaviors that cannot
be discerned or predicted just by looking at its outputs.

[ad-logs]

## Why observability is important

Software professionals have long relied on a patchwork of tools to grasp the
inner workings of their systems. Dashboards, thresholds, and automated alerts
have been their eyes and ears.

But as software becomes more intricate and interconnected, this approach is
failing. The metrics and monitoring approach which were once dependable, now
leave many teams in the dark.

The issue lies in outdated assumptions about how systems function. Your
application is no longer a single entity residing within your control but a
vast, ever-changing ecosystem of services, often dependent on elements you don't
own.

Observability offers a fundamental paradigm shift. Instead of educated guesses
based on limited data, it grants true insight into the inner workings of your
system. Think of the difference between a dim flashlight and a powerful
searchlight!

Developers can pinpoint the root of errors and understand how code changes
cascade. SREs gain the ability to proactively prevent outages, not just react to
them. DevOps teams collaborate more effectively using a shared language built on
data. And businesses benefit from higher customer satisfaction, reduced costs
through prevented downtime, and increased agility.

Ultimately, observability represents a transformation from reactive
troubleshooting to exploring the unknown, uncovering hidden relationships, and
revealing insights that lead to optimization and continuous improvement. The era
of relying on alerts and guesswork is over – observability provides the tools
for a brighter, more resilient future.

## Observability vs monitoring

![Screenshot from 2024-04-19 18-20-37.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4350c55-560f-413a-1025-77661b6cea00/lg2x =2760x2396)

[Traditional monitoring](https://betterstack.com/community/guides/monitoring/) relies on metrics and dashboards to track
known patterns and trigger alerts. This reactive approach is well-suited for
identifying pre-defined issues. However, it leaves teams dependent on the past
experience and intuition of their most seasoned engineers in order to debug
novel problems in complex systems.

Observability offers a fundamentally different approach. Instead of requiring
the foresight to predict potential issues, it provides tools that empower
engineers to ask open-ended questions of their systems. This allows them to:

- **Discover hidden issues**: Observability uncovers problems that dashboards
  and alerts might obscure, preventing engineers from treating symptoms rather
  than root causes.

- **Investigate without bias**: By providing granular data, observability
  enables engineers to follow a trail of evidence directly to the issue's
  source, reducing reliance on gut feelings or preconceived notions.

- **Democratize debugging**: Observability tools make system insights accessible
  to all engineers, not just the most experienced. Curiosity and investigative
  skills replace a reliance on institutional knowledge.

- **Increase confidence**: The ability to definitively pinpoint problems,
  regardless of system complexity or an engineer's prior familiarity, enhances
  the team's confidence in their diagnoses and solutions.

To summarize, while monitoring excels at detecting known problems, observability
facilitates the methodical investigation essential for diagnosing the
unanticipated issues inherent in today's complex software systems.

## How do you make a system observable?

Observability represents a fundamental shift from reactive monitoring to truly
understanding how your system operates. In this section, I'll break down the
elements needed to illuminate your system and transform it into one that reveals
its inner workings.

### 1. Logs

Traditional, unstructured logs are designed for human readability. A system
administrator might look at the provided log snippet and understand the basic
flow of events: an order process was initiated, a payment gateway connection was
made, but ultimately, the order failed due to invalid card details.

```text
2023-04-17 14:35:20 Order processing started for order ID: 12345
2023-04-17 14:35:23 Payment gateway connection established
2023-04-17 14:35:25 Payment authorization failed: Invalid card details XXXX XXXX XXXX 3456
2023-04-17 14:35:26 Customer notification email sent to: user@example.com
2023-04-17 14:35:26 Order processing failed for order ID: 12345
```

However, at the scale of modern systems, where numerous processes happen
concurrently and leave vast trails of logs, it's almost impossible to piece
together these interconnected events and why the order failed, or efficiently
search across numerous orders to identify similar patterns of failure.

This is where structured logging comes in to provide machine parseability.
Unlike multi-line entries of traditional logs, structured logs represent events
as machine-readable data. For example, the previous logs can be represented as
JSON objects:

```json
{"time":"2023-04-17T14:35:20", "msg":"Order processing started", "order_id":"12345", "request_id":"550e8400-e29b-41d4-a716-446655440000"}
{"time":"2023-04-17T14:35:23", "msg":"Payment gateway connection established", "order_id":"12345", "request_id":"550e8400-e29b-41d4-a716-446655440000"}
{"time":"2023-04-17T14:35:25", "msg":"Payment authorization failed", "error":"Invalid card details", "card_number": "XXXX XXXX XXXX 3456", "order_id":"12345", "request_id":"550e8400-e29b-41d4-a716-446655440000"}
{"time":"2023-04-17T14:35:26", "msg":"Customer notification email sent", "user_email": "user@example.com", "order_id":"12345", "request_id":"550e8400-e29b-41d4-a716-446655440000"}
{"time":"2023-04-17T14:35:26", "msg":"Order processing failed", "order_id":"12345", "request_id":"550e8400-e29b-41d4-a716-446655440004"}
```

This structured approach transforms logs from simple textual records into
actionable, data-rich events that are easily parsed, analyzed, and correlated,
enhancing your observability efforts.

Instead of having several log lines for a single request which are correlated by
a request ID, you can output a
[canonical log line](https://stripe.com/blog/canonical-log-lines) that contains
every relevant contextual request. Doing so would make the above log lines look
like this:

```json
{
  "time": "2023-04-17T14:35:20",
  "msg": "Customer order failed",
  "order_id": "12345",
  "error": "Invalid card details",
  "response_status": 400,
  "user_email": "user@example.com",
  "card_number": "XXXX XXXX XXXX 3456",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

After emitting logs, the next step is to put them in a [log management
system](https://betterstack.com/community/guides/logging/log-management/) where it can be made available for filtering,
grouping, searching and more.

### 2. Metrics

Metrics are scalar values that represent the state of a system at a given time,
often enhanced with tags for easier grouping and analysis. They form the
backbone of traditional monitoring systems, providing a snapshot of system
health through predefined numerical values over set intervals.

By tracking things like CPU usage, error rates, and queue lengths, they can be a
useful component of your observability strategy. However, their use comes with
significant limitations, primarily due to their aggregated nature. By
compressing all underlying data into a single figure, the nuances and anomalies
of individual events that contributed to the metric are completely obfuscated.

For example, a healthy average database query time might mask a subset of
extremely slow queries impacting a subset of users. Furthermore, metrics lack
the connective tissue to easily follow an individual's journey through the
system. The volume of metrics needed to achieve this level of detail quickly
becomes impractical and overwhelming for traditional monitoring systems.

To truly observe your system, you need to combine metrics with richer data that
captures the specifics of each interaction. Think of it like a blockbuster
novel: you can't understand the plot just by reading the summary.

Metrics remain a valuable tool, but they offer only a limited window into the
complex workings of modern software.

### 3. Distributed tracing

Distributed tracing provides a way to trace the journey of a request across
various services and system boundaries, offering clarity on how different
components interact and where potential issues might arise.

In essence, distributed tracing collects detailed data about each segment of a
request's path through a system. These segments are known as "spans", and each
span captures essential information such as start time, duration, and
operational context.

This data is organized hierarchically, with spans nested within one another to
reflect the flow of the request through the system. For example, if a user's
request first hits a web service, which then queries a database before calling
an authentication service, each of these steps would be represented by separate
spans within a single trace.

Spans have the following key components:

- **Trace ID**: A unique identifier that connects all spans within a single
  request.
- **Span ID**: A unique identifier for each individual span.
- **Parent ID**: Defines the parent-child relationships between spans (absent
  for the root span).
- **Timestamp**: When the span began.
- **Duration**: How long the work represented by the span took.

By instrumenting your code to capture and propagate this data, you can visualize
the complete journey of a request. This helps identify performance bottlenecks,
pinpoint errors, and uncover hidden dependencies within your system.

### 4. Continuous profiling

Continuous profiling is a modern approach to understanding the resource
consumption of software applications, specifically focusing on memory and CPU
usage, down to the individual line of code.

This technique differs from traditional profiling, which is generally more
resource-intensive and conducted intermittently. Continuous profiling employs
statistical profiling with time-based sampling, a method pioneered by Google
in 2010.

This approach involves capturing data at a set frequency, such as 100 times per
second, and aggregating this information over time to provide a detailed yet
efficient analysis with minimal overhead.

In the context of observability, continuous profiling gives you the ability to
understand resource usage down to individual lines of code. This allows you to
compare profiles to pinpoint code changes that degrade performance, augment your
existing metrics by instantly revealing the root cause of performance spikes,
and enhance traces of slow transactions by providing detailed profiles of the
problematic functions.

Imagine you notice a sudden surge in request latency. Continuous profiling would
immediately show you which functions are consuming the most CPU cycles. Or, when
examining a trace of delayed database interactions, profiling could reveal
inefficient code within the database query function.

## Challenges of observability

Observability promises the ability to understand the inner workings of complex
software systems. However, achieving this state of true insight is far from
simple.

The very characteristics of modern applications – distributed, ephemeral, and
built from countless interacting components – create a range of hurdles teams
must overcome to reap the benefits of true observability.

Here's a few of the most common roadblocks on the path to achieving
observability:

### 1. Data volume and high costs

![Screenshot-2023-05-11-at-12.38.28.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7c6b1c9c-9896-495f-f264-303ade961b00/md2x =1182x1114)

Modern systems generate massive amounts of telemetry data, which can be
overwhelming. Storing, processing, and extracting meaningful insights from this
massive dataset becomes costly and difficult.

**Solution**: Implement data management strategies such as sampling and tiered
retention policies to reduce the data volume without sacrificing insights. Using
observability solutions with transparent cost management.

### 2. Complexity and change

Modern systems are built with microservices, cloud infrastructure, and
constantly evolving technologies, creating intricate interdependencies that are
difficult to untangle. Maintaining the mappings needed for observability in
rapidly changing environments is a constant battle, impacting how well your
observability setup keeps pace with system changes.

**Solution**: Utilize automation wherever possible to maintain instrumentation
and mappings in dynamic environments. Invest in tooling that supports
auto-discovery and flexible visualization capabilities.

### 3. Signal overload and false positives

With so much data available, it's easy to overload on-call engineers with
alerts, making it challenging to identify the truly important signals from the
noise. This leads to alert fatigue, where critical issues are missed and teams
drown in low-priority notifications, undermining trust in the system.

**Solution**: Employ AI/ML techniques to help surface relevant patterns and
anomalies. Implement correlation capabilities to reduce noise and provide
greater context for alerts.

### 4. Steep learning curve

Implementing and operating an effective observability solution requires diverse
skills across data engineering, software development, and system reliability.
Many organizations lack the in-house expertise, making it either expensive to
acquire talent or leading to suboptimal implementations that don't deliver full
value.

**Solution**: Invest in training and upskilling your existing teams. Consider
strategic hires, partnerships, or managed observability services to supplement
your capabilities.

### 5. Tooling and integration

The observability tooling landscape is fragmented and many solutions are still
evolving. Integrating various tools to work seamlessly can be time-consuming,
creating friction for teams and limiting their ability to achieve comprehensive
observability.

**Solution**: Prioritize tools with open standards and robust integrations. When
possible, consider platforms that consolidate multiple observability functions
to reduce overall tool sprawl.

## Final thoughts

The reactive monitoring practices of the past are insufficient for the complex,
distributed systems of today.

If you're struggling with blind spots, endless troubleshooting sessions, and a
reliance on tribal knowledge, it's time to explore the transformative power of
observability.

Embrace this new approach and empower your team to truly understand the inner
workings of your software.

Thanks for reading!