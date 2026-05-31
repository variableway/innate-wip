# Prometheus Best Practices: 8 Dos and Don'ts

[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) has become a cornerstone of modern monitoring systems,
providing powerful insights into the health and performance of applications and
infrastructure.

However, effectively harnessing its capabilities requires more than just
deploying the tool or instrumenting metrics in your application.

You also need
to implement some best practices to ensure ensure accurate data collection,
efficient querying, and meaningful alerting.

In this article, we'll explore a few of the best practices to make your life
easier when monitoring with Prometheus.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/jN9YpPOom3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## 1. Follow metric and label naming conventions

While Prometheus does not enforce any strict rules for metric and label names,
adhering to established conventions significantly enhances the usability,
clarity, and maintainability of your metrics.

Consistent naming practices ensure that metrics are intuitive to work with and
reduce confusion when querying or visualizing data. These conventions are
outlined in the
[Prometheus documentation](https://prometheus.io/docs/practices/naming/), with
key recommendations including:

- Using lowercase characters for both metric names and labels and using
  underscores to separate whole words (`http_requests_total`).

- Including
  [base units](https://prometheus.io/docs/practices/naming/#base-units) in the
  metric name where applicable such as `_seconds`, `_bytes`, or `_total` to make
  the metric's purpose clear.

- Metric names should include a single-word prefix that reflects the domain they
  belong to, often the application name itself.

- Applying functions like `sum()` or `avg()` across all dimensions of a metric
  should produce results that are logical.

## 2. Don't use high cardinality labels

One common mistake when using Prometheus is overloading metrics with too many
unique label combinations, which leads to an issue known as "cardinality
explosion."

This occurs when an excessive number of time series is created due to high
variation in label values, making it difficult for Prometheus to efficiently
process or store the data.

In extreme cases, this can exhaust memory, causing the server to crash and
leaving you without crucial monitoring data.

Suppose you are monitoring an e-commerce application and tracking order status
with a metric like:

```promql
order_status_total{status="completed"}
order_status_total{status="pending"}
order_status_total{status="canceled"}
```

This is reasonable because the `status` label has a small, fixed set of values.
However, if you decide to add a `product_id` label to monitor metrics for each
individual product, the situation changes:

```promql
order_status_total{status="completed",product_id="1"}
order_status_total{status="completed",product_id="2"}
order_status_total{status="completed",product_id="3"}
. . .
order_status_total{status="completed",product_id="999999"}
```

In this scenario, every unique combination of `product_id` and `status`
generates a new time series. With thousands or millions of products, the total
number of time series can grow exponentially, overwhelming Prometheus's storage
and computational limits.

This can result in an out-of-memory (OOM) crash, leaving your monitoring system
non-functional.

Now, for every possible `product_id` and `status` combination, a new time series
will be created.

To avoid such problems, using labels only when necessary and keep their values
within a manageable range. For example, you can replace values like like
`/product/1234/details/5678` with a general pattern such as
`/product/{product_id}/details/{detail_id}` before using it in a metric label.

## 3. Track totals and failures instead of successes and failures

When instrumenting applications, it's common to track successes and failures as
separate metrics, like:

```promql
api_failures_total
api_successes_total
```

While this seems logical, it complicates the calculation of derived metrics such
as error rates. For example, calculating the error rate requires an expression
like:

```promql
rate(api_failures_total[5m]) / (rate(api_successes_total[5m]) + rate(api_failures_total[5m]))
```

This query combines both counters to determine the total number of requests,
which adds unnecessary complexity and increases the likelihood of mistakes in
query construction.

A better approach is to track the total number of requests and the number of
failures:

```promql
api_requests_total
api_failures_total
```

With this setup, calculating the error rate becomes straightforward:

```command
rate(api_failures_total[5m]) / rate(api_requests_total[5m])
```

This structure is not only simpler but also provides flexibility. Derived
metrics like success rates can be easily computed from these two counters:

```promql
# success rate
1 - (rate(http_requests_failures_total[5m]) / rate(http_requests_total[5m]))
```

By using `api_requests_total` to track the total number of operations, you avoid
duplication and reduce the cognitive load required to query your data.

This approach also makes your metrics more extensible, as additional labels or
dimensions (e.g., `status="200"`, `status="500"`) can be added to
`api_requests_total` without changing the underlying logic.

## 4. Always scope your PromQL queries

In Prometheus setups, especially those monitoring multiple microservices, it's
crucial to scope your PromQL queries to avoid unintended metric collisions.

For instance, imagine your primary application database (`db-service`) tracks
queries using a metric called `db_queries_total`.

Later, another service, such as `cache-service`, is introduced and also uses the
metric name `db_queries_total`, but this time to track queries to a caching
layer.

If your PromQL queries are not scoped, dashboards and alerts designed for the
database might inadvertently include metrics from the caching layer. This leads
to misleading graphs, false alerts, and confusion, as identical metric names now
represent entirely different concepts.

This type of issue, known as a **metric collision**, arises when identical
metric names across different services result in data being conflated or
misinterpreted.

To prevent this, always use **label matchers** to scope your PromQL queries.
Instead of using an unscoped query like:

```promql
rate(db_queries_total[5m]) > 10
```

Scope your query to the relevant service:

```promql
rate(db_queries_total{service="my_database_service"}[5m]) > 10
```

This ensures the query pulls data only from the intended source. Using labels
such as `service`, `job`, or other identifiers specific to your setup not only
reduces the risk of conflicts but also improves query accuracy and
maintainability.

[ad-logs]

## 5. Add time tolerance to your alerts

[Prometheus alerting rules](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) support a `for` clause that
defines how long a condition must persist before an alert is triggered.

While it might seem convenient to skip this delay, doing so can result in overly
sensitive alerts that react to transient issues, causing unnecessary noise and
potentially leading to alert fatigue.

Responders might become desensitized to alerts, making them less responsive to
genuine problems.

For instance, even if you use expressions like `rate(errors_total[5m])` in your
alerting rules, a newly started Prometheus instance may not yet have enough data
to calculate accurate averages leading alerts to fire based on incomplete or
misleading information.

For example, consider this rule that triggers on high API latency:

```promql
alert: HighAPILatency
expr:  histogram_quantile(0.95, sum by (le) (rate(api_request_duration_seconds_bucket[5m]))) > 0.5
```

Without a `for` clause, even a brief spike in latency could trigger this alert,
creating noise and causing unnecessary disruption. Instead, you can refine the
rule by adding a time tolerance:

```promql
alert: HighAPILatency
expr:  histogram_quantile(0.95, sum by (le) (rate(api_request_duration_seconds_bucket[5m]))) > 0.5
[highlight]
for: 10m
[/highlight]
```

This modification ensures that the alert only fires if the high latency persists
for at least 10 minutes, reflecting sustained performance degradation rather
than a momentary blip.

## 6. Handle missing metrics for consistent monitoring

Prometheus excels at tracking metrics over time, but it can stumble when metrics
with labels appear and disappear unexpectedly. This can lead to empty query
results, broken dashboards, and misfiring alerts.

For instance, if you're tracking specific error events through an `errors_total`
metric, you may have `type` label to allow filtering by error type such as:

```promql
errors_total{type="rate_limit_exceeded"}
errors_total{type="timeout"}
errors_total{type="internal_server_error"}
```

If you query a specific error type, such as:

```promql
sum(rate(errors_total{type="host_unreachable"}[5m]))
```

This query will only return results if that specific error type has occurred in
the last five minutes. If no such error has occurred, the query will return an
empty result.

This "missing metric" problem can disrupt your monitoring in several ways:

- Dashboards might show empty graphs or "No data" messages.
- Alerts based on these metrics might not fire, even if the issue exists but
  hasn't occurred recently enough to register in the time window.

To prevent missing metrics, initialize all possible labeled metrics to zero at
application startup when the set of label values is known in advance. For
example, in Go:

```go
for _, val := range errorLabelValues {
	errorsCounter.WithLabelValues(val) // Don't use Inc()
}
```

This ensures that Prometheus always has a baseline metric to query, even if no
events have occurred yet.

In situations where metrics have dynamically generated labels, it may not be
feasible to initialize them at startup. In such cases, adjust your PromQL
queries to account for missing metrics using the `or` operator.

For example, if you're calculating the ratio of specific errors, you could
write:

```promql
(rate(errors_total{type="timeout"}[10m]) or up * 0) / (rate(errors_total[10m]) or up * 0)
```

This approach replaces missing metrics with a default value of zero, ensuring
that your query remains functional and provides accurate results even when
specific error types are absent.

## 7. Preserve important labels in alerting rules

While simplifying Prometheus alerting rules by aggregating away labels might
seem convenient, it can strip away essential context that is crucial for
diagnosing and resolving issues.

Take, for example, a rule that triggers an alert for high memory usage across a
cluster of servers:

```promql
alert: HighCPUUsage
expr: avg(node_cpu_seconds_total{mode="idle"}) by (instance) < 0.1
```

This rule calculates average memory usage for each job and alerts if usage
exceeds 90%. However, by aggregating data to the job level, it obscures which
specific instance is causing the high memory usage.

This lack of detail forces you to investigate dashboards or logs to identify the
problematic instance, adding delays to your response time.

To address this, avoid aggregating away critical labels and include them in your
alerting rules and notifications. For instance:

```promql
alert: HighCPUUsage
expr: node_cpu_seconds_total{mode="idle"} < 0.1
labels:
  severity: warning
annotations:
  summary: "High CPU usage on {{ $labels.instance }}"
  description: "Instance {{ $labels.instance }} has high CPU usage (idle: {{ $value }})"
```

This updated rule keeps the `instance` label to ensure the alert provides
immediate context about which server is experiencing high memory usage.

Including this label in the alert message also means responders can quickly
identify and address the issue without additional investigation.

## 8. Have a plan for scaling

Prometheus is a powerful tool for monitoring, but as your infrastructure and
application complexity grow, you'll need to address the challenges of scale.

Increased services, larger data volumes, and longer retention periods can push
Prometheus to its limits. Anticipating and planning for these challenges ensures
that your monitoring remains effective and reliable as your environment evolves.

Prometheus, by design, is not horizontally scalable. It is limited to a
single-node architecture, meaning you can only increase capacity through
vertical scaling (e.g., adding more CPU, memory, or storage to the server).
However, vertical scaling has its limits. Once you approach those limits,
alternative strategies are necessary.

A common approach is **federated Prometheus setups**, where a "global"
Prometheus server aggregates data from regional instances.

If you have several Prometheus servers with each one scraping metrics from a
subset of your services, you would then set up a single Prometheus server that
scrapes data from each of the shards and aggregates it in one place.

Alternatively, open-source projects like
[Thanos](https://github.com/thanos-io/thanos) and
[Cortex](https://github.com/cortexproject/cortex) allow you to implement
scalable, long-term storage and query aggregation for Prometheus metrics. These
solutions go beyond basic federation by enabling global querying, deduplication
of metrics, and cross-cluster metric aggregation while offering support for
high-availability setups.

![Better Stack Node Exporter Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/03f39ea9-5a00-4e86-afea-5144f5b10900/md1x
=6143x3226)

If you don't want to do all the work of scaling Prometheus yourself, consider
using a fully-managed Prometheus service like
[Better Stack](https://betterstack.com/telemetry) which provides a hands-off
solution for long-term metric storage and querying.

## Final thoughts

Starting with these Prometheus best practices is a strong foundation for
building a reliable and scalable monitoring setup. However, regular reviews and
ongoing improvements are essential to ensure your monitoring adapts to the
growing complexity of your infrastructure and evolving business requirements.

Thanks for reading, and happy monitoring!
