# Why Your Observability Strategy Needs High Cardinality Data

Traditional monitoring methods, with their reliance on predefined metrics and
dashboards, often fail to cope with the dynamic and unpredictable nature of
modern systems.

To truly understand and troubleshoot such applications effectively, you need a
new approach—one that embraces high cardinality and high dimensionality data.

In this article, we'll examine the concepts of cardinality and dimensionality,
how they impact the way you collect, store, and analyze telemetry data to
troubleshoot issues faster.

We'll also discuss the associated challenges and how innovative solutions like
columnar databases can help you overcome them on your way to achieving true
observability.

Let's get started!

[ad-logs]

## What is cardinality?

Cardinality is a mathematical term that deals with the size of sets. It's a way
to measure how many elements are in a given set. For example, a set of four
numbers (`A = {1, 2, 3, 4}`) has a cardinality of four.

In the context of databases, cardinality refers to the uniqueness of values
contained in a particular column. High cardinality means a column has a high
percentage of unique values, while low cardinality means that a high percentage
of column values are repeated.

## High cardinality vs low cardinality

High cardinality signifies a large number of unique values within a field.
Examples of high-cardinality data include user IDs, email addresses, and
passport numbers, which are expected to be unique for each individual. Though
not entirely unique, fields like first or last names still exhibit high
cardinality due to the wide range of possible values.

Conversely, low cardinality indicates a limited number of unique values within a
field. Fields such as HTTP methods (GET, POST, etc.), operating systems, or
marital status fall into this category. Boolean fields, like `email_verified`
have a very low cardinality, as they can only have two possible values (`true`
or `false`).

## What is dimensionality?

Dimensionality refers to the number of attributes or characteristics that define
a data point or event. Each attribute serves as a dimension, offering valuable
context and enabling you to dissect and analyze your data from different angles.

Let's consider the following example of a structured log event:

```json
{
  "host": "SRV001",
  "timestamp": "2024-05-19T14:45:30Z",
  "event": "order",
  "order_id": "987654321",
  "user_id": "123456789",
  "error": {
    "error_code": "E408",
    "error_message": "timedout after 2 minutes",
    "failed_at": "processing_payment",
  },
  "product": {
    "product_id": "D4E5F6",
    "name": "Bluetooth Speaker",
    "quantity": 1,
    "price_per_unit": 45.00
  },
  "payment": {
    "method": "credit_card",
    "transaction_id": "TX987654321DEF"
  },
  "total_cost": 45.00,
  "status": "failed"
}
```

In this record, each key/value pair represents a unique dimension. The `host`
dimension tells us where the event occurred, `timestamp` pinpoints when it
happened, `event` describes the type of event, and so on. With 15 unique
attributes, this log has 15 dimensions.

A dimension provides a different lens through which you can examine your data.
For instance, you can filter events by the `host` attribute to see those that
occurred on a specific server, or you can correlate errors with specific product
IDs using the `product_id` attribute.

## High dimensionality vs low dimensionality

A high-dimensional event has a wealth of attributes or dimensions attached to
it. Consider the earlier log record example with its 15 dimensions. It allows
for queries like:

- Finding all failed orders for a specific product and grouping by failure
  stage,
- Retrieving recent timeout errors,
- Listing a specific user's orders within a date range,
- Grouping failed orders by the host they originated from,
- And many more.

The more dimensions available, the more versatile and targeted your queries can
be. This is crucial when investigating unexpected issues, as it allows for
flexible exploration and correlation of data across multiple axes.

In contrast, low dimensionality refers to data with a limited number of
attributes. For example, a typical [server health check](https://betterstack.com/community/guides/monitoring/health-checks/), might
only include a timestamp, server ID, and status. While this simplified view
provides a general overview of system health, it lacks the depth needed for
in-depth troubleshooting.

Essentially, high dimensionality empowers you to slice and dice your data in
countless ways, uncovering hidden patterns and relationships. It's a key enabler
for quickly identifying and understanding changes in application behavior, even
when you don't know exactly what you're looking for.

## The relationship between cardinality and dimensionality

Cardinality and dimensionality are complementary concepts that work together to
describe the richness and complexity of your data.

A dataset can have high dimensionality (many attributes) and high cardinality
within some or all of those dimensions. This means there are many different ways
to slice and dice your data, and each slice can contain many unique values.

## The role of cardinality and dimensionality in observability

Typical cloud-native deployments consist of hundreds or thousands of components
that are loosely coupled, ephemeral, and difficult to reason about.

This has led to an explosion in "unknown unknowns" – unpredictable issues that
can be challenging to detect and even harder to diagnose with traditional
monitoring.

Without the ability to drill down into individual requests, transactions, or
events, find the root cause of issues can become a time-consuming and
frustrating process.

Observability offers a solution by allowing ad-hoc exploration of centralized
telemetry data to effectively identify and address issues arising from obscure
or unexpected combinations of factors without having to ship new code.

But to be truly effective, observability requires highly cardinal and
dimensional data. High cardinality provides extensive filtering capabilities to
isolate specific events or requests from a sea of data, while high
dimensionality helps uncover hidden correlations that would otherwise go
unnoticed.

An observability tool must be able to use such data to surface anomalies within
the system that could have contributed to something to go wrong and allow you to
drill down as needed.

For instance, a handful of users might trigger an error threshold due to a few
unusual requests among thousands, such as particularly high-stakes transactions.

Aggregated metrics might mask these individual experiences, but high-cardinality
attributes like user or transaction IDs allow for precise identification and
investigation of such outlier behavior.

## Why high-cardinality metrics don't work

Metrics have inherent limitations when dealing with high cardinality data as
most metrics-based monitoring systems are simply not designed to handle the vast
number of unique time series generated by high cardinality metrics.

For example, Prometheus
[recommends](https://prometheus.io/docs/practices/instrumentation/#do-not-overuse-labels)
keeping the cardinality of the majority of your metrics below 10, and only have
a handful that exceed that number due to the increased computational resources
required for processing which can add up quickly and escalate costs.

Many systems impose limits on unique labels per metric, and even where there are
no strict limits, the cost of adding even one additional metric can be
prohibitive.

This often forces organizations to aggregate metrics at higher levels, filter or
sample data, or implement retention policies – all of which can compromise the
granularity and accuracy of the data, making it harder to pinpoint the root
cause of issues.

In essence, metrics lack the granularity and flexibility required for true
observability. They are too rigid to present system states in alternate views,
hindering the ability to gain a deep understanding of complex systems.

While they remain valuable for tracking overall trends, they fall short when it
comes to the detailed, nuanced analysis needed for effective troubleshooting and
optimization in high-cardinality environments.

## Effective observability with structured logs in columnar databases

We've established that telemetry data that is highly cardinal and dimensional
makes it easy to find hidden or elusive patterns in application behavior, which
is especially important for cloud-native systems where novel and
never-seen-before issues are the norm.

While metrics can be valuable, their limitations become apparent when dealing
with high cardinality. To overcome these challenges, shifting from a
metrics-based approach to structured logging is essential. [Structured
logs](https://betterstack.com/community/guides/logging/json-logging/) are designed for machine parsing, and inherently support
unlimited cardinality and dimensionality.

But it's not enough to structure your logs. You also need to ensure that they're
being sent to an observability platform that uses a database capable of handling
the demands of high-cardinality queries and storage.

Since highly dimensional structured logs will have many fields, but queries
typically focus on a few specific ones,
[columnar storage](https://en.wikipedia.org/wiki/List_of_column-oriented_DBMSes)
is ideal because it allows having many columns in a table, without paying the
cost for unused columns during read query execution time. This makes queries
exceptionally fast even when huge volumes of data are involved.

Unlike traditional databases, columnar databases store data by columns rather
than rows. They also allow for schema flexibility so you can easily add new
fields or modify existing ones without disruptions, allowing the captured data
to evolve over time.

At Better Stack, we utilize
[ClickHouse's columnar database technology](https://clickhouse.com/) technology
to store logs in their original format, preserving their diverse data types and
structures. You are not constrained by rigid schemas, indexes, or attribute
limits, allowing logged data to be as contextually rich as needed.

This approach enables fast and flexible querying without requiring prior
knowledge of the log structure. As a result, you can quickly and effortlessly
analyze unlimited unique values across various dimensions, even with
highly-cardinal data points like IDs.

## Debugging with high cardinality data

Imagine being in charge of an e-commerce platform facing a sudden surge in
failed payments. While your monitoring dashboard alerts you to this trend, it
doesn't reveal the underlying cause. To unravel this mystery, you delve into the
captured telemetry data.

By filtering through the traces of failed payments, you discover a concentration
of errors originating from the payment gateway service, all linked to a specific
"payment declined" error code.

Correlating these traces with relevant logs and comparing them against
successful transactions reveal a startling pattern: users from a particular
country are disproportionately affected.

Further investigation uncovers that the payment gateway is rejecting these
transactions due to a recent policy change in that region.

Armed with this knowledge, you can take decisive action, whether by contacting
the payment processor, switching to an alternative, or proactively informing
impacted users.

This process highlights the power of high cardinality and dimensionality data in
facilitating detective-like investigations into problems, even if they've never
been encountered before.

Without capturing fields that revealed the region of users, the errors might
appear to be random, and identifying the affected user segment would be
considerably more challenging and time-consuming.

## Final thoughts

Observability is far more than just a new buzzword for monitoring. It empowers
you to dissect your data from any angle to uncover hidden issues and answer
questions that couldn't have been anticipated beforehand.

This enhanced capability arises from the use of structured logs in columnar
databases instead of relying on metrics, allowing for the removal of predefined
schemas and rapid data iteration.

This comprehensive approach is what distinctly differentiates observability from
conventional methods.

Are you ready to experience a new approach to observability? Try it out by
[signing up for a free account](https://telemetry.betterstack.com/users/sign-up)
today and see the difference firsthand.

Thanks for reading!
