# Redacting Sensitive Data with the OpenTelemetry Collector

As your business scales, the surge in [telemetry data](https://betterstack.com/community/guides/observability/logging-metrics-tracing/)
often brings with it a trove of sensitive information such as credit card
numbers, personal identifiers, or application secrets. This presents a growing
challenge: how do you process this data while ensuring compliance with privacy
regulations like GDPR, HIPAA, or PCI DSS?

This where the OpenTelemetry Collector can play a vital role. By seamlessly
integrating into your [observability pipelines](https://betterstack.com/community/guides/observability/what-is-observability/), the
Collector ensures that sensitive data is scrubbed from your logs, traces, and
metrics _before_ they leave your environment.

This article will discuss the specific capabilities of the Collector for
sensitive data redaction and teach you how to leverage them to craft rules that
preserve the confidentiality of your application data without compromising your
observability goals.

Let's get started!

[ad-logs]

## Prerequisites

- Basic understanding of [OpenTelemetry concepts](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).
- Prior experience with [configuring the OpenTelemetry
  Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/).

## How to redact sensitive data with OpenTelemetry

The OpenTelemetry Collector offers three processors that enable real-time
detection and redaction of sensitive data as it processes your telemetry,
ensuring you can securely transmit the redacted data to external platforms.

The processors in question are:

1. [Attributes](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/attributesprocessor):
   For accessing and modifying individual attributes within a signal.
2. [Redaction](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/redactionprocessor):
   Specifically made to filter out sensitive attributes or mask their values.
3. [Transform](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor):
   It uses the OpenTelemetry Transform Language to perform large scale
   transformations to telemetry data.

Let's take a look at each processor in turn.

## Attributes processor

The attributes processor is designed to modify the attributes of spans, logs, or
metrics. It supports various actions, such as inserting, updating, or removing
attributes, to tailor telemetry data before exporting.

The `update`, `delete`, and `hash` actions are especially useful for redacting
sensitive data. Here's an example of how to configure it:

```yaml
processors:
  attributes/update:
    actions:
      - key: payment.card_number
        action: delete
      - key: user.email
        action: delete
      - key: app_secret
        value: [REDACTED]
        action: update
      - key: client.ip_address
        action: hash
```

This setup bolsters data security by deleting sensitive attributes like credit
card numbers and emails while redacting the `app_secret` field and hashing
client IP addresses (using SHA256) to allow for anonymized tracking.

If you only need to delete, redact, or hash specific sensitive fields in your
signals, then `attributes` may well be all you need. But for implementing an
allowlist of fields or detecting and redacting standard patterns (like email
addresses), you'll need the `redaction` processor.

Let's take a look at it next.

## Redaction processor

The redaction processor is specifically designed to prevent sensitive fields
from leaking into your telemetry data. It offers powerful tools to:

- Remove any attributes not included in a predefined list of permitted
  attributes.
- Strip confidential information from telemetry to prevent accidental data
  exposure.
- Mask or obfuscate sensitive attribute values that match standard patterns.

Here are a couple of ways you can use the redaction processor:

### 1. Implementing an allowlist of attributes

```yaml
processors:
  redaction/allowlist:
    allow_all_keys: false
    allowed_keys:
      - http.method
      - http.url
      - http.status_code
```

This configuration ensures that only the attributes explicitly included in the
allowlist will be retained. By setting `allow_all_keys: false`, the processor
will block all attributes by default, except those specified in `allowed_keys`.
This helps limit telemetry data to pre-approved attributes, minimizing the risk
of leaking sensitive or unnecessary information.

### 2. Masking sensitive values in allowed attributes

For situations where you cannot predict the specific attributes that may contain
sensitive data, you can use the `blocked_values` property to define regular
expressions that match and mask those values:

```yaml
processors:
  redaction/mask:
    allow_all_keys: true
    blocked_values:
      - 4[0-9]{12}(?:[0-9]{3})? # VISA
      - 5[1-5][0-9]{14} # Mastercard
      - 3[47][0-9]{13} # Amex
```

This approach lets you retain useful context from attributes while masking
standard patterns like credit card numbers. When a match is found, the sensitive
value is replaced with a placeholder such as `****`, ensuring that confidential
data is protected while keeping the attribute intact for analysis.

## Transform processor

The transform processor uses the [OpenTelemetry Transformation Language
(OTTL)](https://betterstack.com/community/guides/observability/ottl/) to enable a wide range of transformations, from simple attribute
changes to complex conditional logic and metric aggregations.

With the transform processor, you can:

- Modify attribute values
- Add or remove attributes
- Filter or drop entire spans, metrics, or logs
- Convert metric types
- Aggregate metrics
- Apply conditional logic
- And more!

In this section, we'll focus on its capabilities for redacting sensitive data
from telemetry. First, let's review how to configure the transform processor, as
it requires more setup than the other processors.

Here's an example configuration for the transform processor:

```yaml
transform:
  error_mode: <ignore|silent|propagate>
  <trace|metric|log>_statements:
    - context: string
      conditions:
        - string
        - string
      statements:
        - string
        - string
        - string
```

The `error_mode` property determines how the processor will react to errors when
processing a statement, while the transformation logic for each telemetry type
is placed in `trace_statements`, `metric_statements`, and `log_statements`
respectively.

For each telemetry type, you must specify a `context` for applying
transformations. Valid contexts include:

- For trace statements: `resource`, `scope`, `span`, and `spanevent`.
- For metric statements: `resource`, `scope`, `metric`, and `datapoint`.
- For log statements: `resource`, `scope`, and `log`.

The optional `conditions` property allows you to apply logic only if specific
criteria are met, while the `statements` section defines the actual
transformation operations.

Now, let's look at an example to demonstrate how to redact sensitive data from a
trace span using the transform processor.

### Redacting sensitive data from trace spans

A typical scenario requiring sensitive data redaction is when traces for client
requests to external services include an `http.url` attribute that exposes
confidential information such as `client_id` and `client_secret`.

Here's an example of the pipeline data representation containing this sensitive
information:

```json
{
  "span": {
      "attributes": {
        "http.method": "GET",
        [highlight]
        "http.url": "https://example.com/posts/1?client_id=test-id&client_secret=cd76c726-cdbd-4951-8d60-f67770236661",
        [/highlight]
        "net.peer.name": "example.com",
        "user_agent.original": "go-resty/2.14.0 (https://github.com/go-resty/resty)",
        "http.status_code": 200
      }
  }
}
```

You can use the `transform` processor to redact sensitive fields like
`client_id` and `client_secret` by applying OTTL statements, as shown in the
following configuration:

```yaml
processors:
  transform/redact:
    trace_statements:
      - context: span
        statements:
          - replace_pattern(attributes["http.url"], "client_id=[^&]+", "client_id=[REDACTED]")
          - replace_pattern(attributes["http.url"], "client_secret=[^&]+", "client_secret=[REDACTED]")
```

In this setup, the `replace_pattern()` function identifies and replaces
sensitive data in the `http.url` attribute by matching regex patterns and
replacing them with `[REDACTED]`. After these transformations, the `http.url`
attribute will appear as follows:

```json
{
  "span": {
      "attributes": {
        "http.method": "GET",
        [highlight]
        "http.url": "https://example.com/posts/1?client_id=[REDACTED]&client_secret=[REDACTED]",
        [/highlight]
        "net.peer.name": "example.com",
        "user_agent.original": "go-resty/2.14.0 (https://github.com/go-resty/resty)",
        "http.status_code": 200
      }
  }
}
```

Some other useful
[OTTL functions](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl/ottlfuncs)
for redaction include:

### Deleting sensitive attributes

```text
delete_key(attributes, "http.request.header.authorization")
```

```text
delete_matching_keys(attributes, "http.request.header.*")
```

### Implementing an allowlist

Similar to the `redaction` processor's `allowed_keys` property:

```text
keep_keys(attributes, ["http.method", "http.route", "http.url"])
```

```text
keep_matching_keys(attributes, "http.*")
```

### Hashing attribute values

Unlike the `attributes` processor, you can specify a preferred hashing
algorithm:

```text
set(attributes["user.email"], SHA256(attributes["user.email"]))
```

With OTTL's powerful transformation capabilities, the transform processor should
be your go-to solution for handling complex redaction and transformation
requirements as it far surpasses the capabilities of both the `attributes` and
`redaction` processors.

For more details, be sure to [check out our comprehensive OTTL guide](https://betterstack.com/community/guides/observability/ottl/) or
explore the
[language documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/README.md).

## Final thoughts

While the OpenTelemetry Collector provides powerful tools for redacting
sensitive information, the best practice is to filter out such data as early as
possible in the observability pipeline—ideally at the instrumentation layer.
Doing so minimizes the risk of accidental exposure and improves resource
efficiency within the Collector.

That said, in situations where capturing sensitive data is unavoidable, the
OpenTelemetry Collector provides an added layer of protection. By utilizing its
built-in processors and the flexibility of OTTL transformations, you can ensure
that your telemetry data remains secure and compliant.

Ultimately, observability and data privacy can work hand in hand. With
thoughtful planning and the right tools, like the OpenTelemetry Collector, you
can achieve both and gain valuable insights while upholding the highest
standards of data protection.

Thanks for reading!