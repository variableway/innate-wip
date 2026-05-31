# OTTL Recipes for Transforming OpenTelemetry Data

[The OpenTelemetry Transformation Language (OTTL)](https://betterstack.com/community/guides/observability/ottl/) is a powerful domain-specific
language designed for transforming telemetry data within OpenTelemetry
pipelines. While collecting telemetry data is essential for monitoring and
observability, the ability to modify and structure this data effectively is key
to extracting meaningful insights.

OTTL addresses several common challenges in telemetry data processing,
including:

- Standardizing data formats across diverse services
- Enriching telemetry with additional context
- Filtering out unnecessary or sensitive information
- Converting between different data representations
- Correlating data across traces, metrics, and logs

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ckcbPgZb3TU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

With its declarative syntax, OTTL enables complex transformations in a
straightforward and efficient manner. Whether the goal is cleaning up
inconsistent data, augmenting telemetry with business context, or preparing data
for downstream analysis, OTTL allows modifications at any stage of the
collection pipeline.

The following examples showcase practical applications of OTTL for solving
real-world telemetry transformation challenges. Each example provides a detailed
breakdown of the transformation logic, along with before-and-after data
snapshots to illustrate its impact. These patterns serve as adaptable building
blocks for addressing specific your telemetry needs.

[ad-logs]

## 1. Masking sensitive data in telemetry

```yaml
processors:
  transform/redact:
    trace_statements:
      - context: span
        statements:
          - replace_pattern(attributes["http.url"], "client_id=[^&]+", "client_id=[REDACTED]")
          - replace_pattern(attributes["http.url"], "client_secret=[^&]+", "client_secret=[REDACTED]")
```

Sensitive credentials, such as `client_id` and `client_secret`, are often
exposed in HTTP request URLs. To comply with security best practices, this
transformation replaces these values with `[REDACTED]`.

**Before OTTL processing:**

```json
{
  "span": {
      "attributes": {
        "http.url": "https://example.com?client_id=test-id&client_secret=cd76c726-cdbd-4951-8d60-f67770236661",
      }
  }
}
```

**After OTTL processing:**

```command
{
  "span": {
      "attributes": {
        "http.url": "https://example.com?client_id=[REDACTED]&client_secret=[REDACTED]",
      }
  }
}

```

You can apply the same technique to remove sensitive data from any telemetry
attributed.

## 2. Dropping irrelevant log entries

Unnecessary log entries can increase storage costs and making it harder to find
meaningful insights. The rule below filters out log messages containing "Failed
password", which may be repetitive failed login attempts that are already
handled elsewhere.

```yaml
processors:
  filter/ottl:
    error_mode: ignore
    logs:
      log_record:
        - not IsMatch(body, "Failed password")
```

The `IsMatch(body, "Failed password")` function checks if the body of the log
message contains "Failed password". If `true`, the log is considered a match.
The `not` operator ensures that only logs without the "Failed password" text are
kept, effectively dropping irrelevant entries.

## 3. Log parsing with OTTL

Traditional log parsing often requires complex regex in multiple stages, but
OTTL enables single-step structured data extraction:

```yaml
processors:
  transform/parse_failed_pw:
    log_statements:
      - context: log
        statements:
          - merge_maps(attributes, ExtractPatterns(body, "^(?P<timestamp>\\w+ \\w+ [0-9]+:[0-9]+:[0-9]+) (?P<hostname>\\S+) (?P<appname>\\S+)(\\[(?P<pid>\\d+)\\]). (?P<event>Failed password) for (invalid user )?(?P<username>\\w+) from (?P<ip_address>[\\d.]+) port (?P<port>\\d+) (?P<protocol>\\w+)$"), "upsert")
```

This transformation extracts structured fields from system authentication logs
into discrete attributes. The pattern matching captures timestamps, hostnames,
usernames, IP addresses, and other security-relevant information in a single
operation.

**Before OTTL processing:**

```text
Apr 15 12:34:56 server1 sshd[12345]: Failed password for invalid user admin from 192.168.1.100 port 22 ssh2
```

**After OTTL processing:**

```json
{
  "timestamp": "Apr 15 12:34:56",
  "hostname": "server1",
  "appname": "sshd",
  "pid": "12345",
  "event": "Failed password",
  "username": "admin",
  "ip_address": "192.168.1.100",
  "port": "22",
  "protocol": "ssh2"
}
```

## 4. Normalizing attribute keys

When receiving telemetry from legacy systems with inconsistent naming
conventions, standardizing attribute keys becomes essential. While string
manipulation in traditional data pipelines requires knowing all possible key
names beforehand, OTTL provides an elegant solution:

```yaml
transform:
  error_mode: ignore
  trace_statements:
    - context: span
      statements:
        - replace_all_patterns(attributes, "key", "-", "_")
        - replace_all_patterns(attributes, "key", "\\s", "_")
```

This transformation automatically converts any attribute key containing spaces
or hyphens to use underscores instead. The pattern matching works across all
attributes, making it an efficient way to standardize naming conventions without
needing to specify each attribute individually.

**Before OTTL processing**:

```json
{
  "user id": "12345",
  "service-version": "1.2.3"
}
```

**After OTTL processing**:

```json
{
  "user_id": "12345",
  "service_version": "1.2.3"
}
```

## 5. Filtering high cardinality metrics

Filtering out unnecessary metrics helps reduce noise and optimize telemetry
storage. In cases where certain metrics should be dropped based on specific
conditions, OTTL provides an efficient way to define filtering logic
dynamically.

```yaml
filter:
  error_mode: ignore
  metrics:
    metric:
      - 'name == "cpu.usage" and HasAttrOnDatapoint("region", "test")'
```

This configuration ensures that any metric with the name `cpu.usage` is removed
if it contains a datapoint with the attribute `region` set to `test`. This is
particularly useful for discarding non-production data or test environment
metrics before they reach downstream analysis systems.

**Before OTTL processing:**

```json
[
  {
    "name": "cpu.usage",
    "datapoints": [
      { "value": 75, "attributes": { "region": "test" } },
      { "value": 80, "attributes": { "region": "us-east" } }
    ]
  },
  {
    "name": "memory.usage",
    "datapoints": [
      { "value": 60, "attributes": { "region": "test" } }
    ]
  }
]
```

**After OTTL processing:**

```json
[
  {
    "name": "memory.usage",
    "datapoints": [
      { "value": 60, "attributes": { "region": "test" } }
    ]
  }
]
```

## 6. Parsing JSON body into attributes

Logs often contain structured data encoded as JSON within the log body.
Extracting these fields into attributes allows for better indexing, filtering,
and querying. Instead of manually parsing JSON in downstream systems, OTTL
enables automatic transformation at the telemetry pipeline level.

```yaml
transform:
  error_mode: ignore
  log_statements:
    - context: log
      statements:
        - merge_maps(attributes, ParseJSON(body), "upsert") where IsMatch(body, "^\\{")
        - flatten(cache)
        - merge_maps(attributes, cache, "upsert")
```

This transformation checks if the log body contains a JSON object, then extracts
its fields into log attributes while preserving nested structures. The
flatten(cache) step ensures that deeply nested JSON fields can be accessed as
top-level attributes.

**Before OTTL processing:**

```json
{
  "body": "{\"user\": \"alice\", \"status\": \"active\", \"details\": { \"role\": \"admin\" }}"
}
```

**After OTTL processing:**

```json
{
  "attributes": {
    "user": "alice",
    "status": "active",
    "details.role": "admin"
  }
}
```

## 7. Reusing conditions for server spans

Span kinds in OpenTelemetry define the relationship between spans in a trace.
Leveraging these structural elements enables efficient attribute management
through shared conditions:

```yaml
transform:
  error_mode: ignore
  trace_statements:
    - context: span
      conditions:
        - kind == SPAN_KIND_SERVER
      statements:
        - set(attributes["http.route.server"], attributes["http.route"])
        - delete_key(attributes, "http.route")
```

This transformation applies multiple attribute modifications specifically to
server spans. The shared condition eliminates redundancy and ensures consistent
processing of server-side telemetry data.

**Before OTTL processing:**

```json
{
  "kind": "SPAN_KIND_SERVER",
  "attributes": {
    "http.route": "/api/v1/users"
  }
}
```

**After OTTL processing:**

```json
{
  "kind": "SPAN_KIND_SERVER",
  "attributes": {
    "http.route.server": "/api/v1/users"
  }
}
```

## 8. Elevating Kubernetes metadata to resource Level

In Kubernetes environments, pod metadata often needs to be promoted from metric
datapoints to resource attributes for proper service discovery and attribute
enrichment:

```yaml
transform:
  metric_statements:
    - context: datapoint
      statements:
        - set(resource.attributes["k8s.pod.ip"], attributes["k8s_pod_ip"])
```

This transformation moves pod IP information from datapoint attributes to
resource attributes, enabling proper integration with Kubernetes metadata
processors while maintaining the original telemetry structure.

**Before OTTL processing:**

```json
{
  "resource": { },
  "metric": {
    "datapoints": [{
      "attributes": {
        "k8s_pod_ip": "10.0.23.45"
      }
    }]
  }
}
```

**After OTTL processing:**

```json
{
  "resource": {
    "attributes": {
      "k8s.pod.ip": "10.0.23.45"
    }
  },
  "metric": {
    "datapoints": [{
      "attributes": {
        "k8s_pod_ip": "10.0.23.45"
      }
    }]
  }
}
```

## 9. Classifying response performance tiers

In service monitoring, categorizing response times into performance tiers
enables quick identification of latency patterns and service level compliance:

```yaml
transform:
  error_mode: ignore
  trace_statements:
    - context: span
      statements:
        - set(attributes["service.performance.tier"], "Slow") where duration_ms > 1000
        - set(attributes["service.performance.tier"], "Medium") where duration_ms > 500 && duration_ms <= 1000
        - set(attributes["service.performance.tier"], "Fast") where duration_ms <= 500
```

This transformation automatically classifies spans based on their duration,
creating standardized performance tiers for consistent monitoring and alerting
across services.

**Before OTTL processing:**

```json
{
  "name": "process_payment",
  "duration_ms": 750,
  "attributes": {}
}
```

**After OTTL processing:**

```json
{
  "name": "process_payment",
  "duration_ms": 750,
  "attributes": {
    "service.performance.tier": "Medium"
  }
}
```

## 10. Filtering logs by environment

When managing logs across multiple microservices environments, filtering
debug-level logs from specific environments helps maintain focused logging. The
Filter processor enables precise log filtering based on both log content and
resource attributes:

```yaml
filter:
  error_mode: ignore
    logs:
      log_record:
        - IsMatch(body, ".*DEBUG.*") and resource.attributes["environment"] == "production" and resource.attributes["cluster"] == "primary"
```

This transformation filters out debug logs specifically from the production
primary cluster. The filter combines log content analysis with resource
attribute matching to provide granular control over log retention.

**Before OTTL processing**:

```json
{
  "body": "DEBUG: Connection pool initialized",
  "resource": {
    "environment": "production",
    "cluster": "primary"
  }
}
{
  "body": "ERROR: Connection failed",
  "resource": {
    "environment": "production",
    "cluster": "primary"
  }
}
```

**After OTTL processing:**

```json
{
  "body": "ERROR: Connection failed",
  "resource": {
    "environment": "production",
    "cluster": "primary"
  }
}
```

## Final thoughts

The examples presented demonstrate how OTTL can solve common telemetry
challenges like data standardization, sensitive data handling, error tracking,
and performance monitoring. These patterns can be adapted and combined to
address a wide range of real-world observability needs.

By leveraging OTTL's capabilities, organizations can better manage their
telemetry data, improve monitoring effectiveness, and gain deeper insights into
their systems' behavior and performance.

Thanks for reading!
