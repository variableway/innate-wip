# Understanding the OpenTelemetry Transform Language

In the ever-expanding world of [observability](https://betterstack.com/community/guides/observability/what-is-observability/), where
tools and data formats are constantly evolving, it's not uncommon to find
yourself grappling with telemetry data that doesn't quite align with your needs.
The vast amounts of data generated only adds to the complexity, making it harder
to manage and extract actionable insights.

This is where the OpenTelemetry Collector comes in to provide a powerful
observability pipeline middleware that can receive, process and export data at
scale. At the heart of its processing capabilities is the
[OpenTelemetry Transform Language](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/README.md)
(OTTL), a purpose-built language designed to transform telemetry data,
regardless of its structure or content.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ckcbPgZb3TU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

In this guide, we'll begin with an in-depth overview of OTTL, exploring its
syntax, key features, unique aspects, and common use cases. We'll then walk
through a real-world example that shows how OTTL can address practical telemetry
challenges.

By the end of this exploration, you'll possess the skills and knowledge to
confidently transform, filter, sample, and route your observability data with
OTTL statements.

Let's dive in!

## Prerequisites

Before proceeding with this article, ensure that you're familiar with the basics
of [OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) and key concepts related to the
[OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/). These foundational topics
will help you better understand the application of OTTL as covered in this
guide.

[ad-logs]

## What is the OpenTelemetry Transform Language?

OTTL is a domain-specific language (DSL) used within the OpenTelemetry Collector
for applying mutations, filtering, and enrichments to telemetry signals—such as
traces, metrics, and logs—before they are sent to various observability
backends.

You might wonder why a new language like OTTL is introduced instead of relying
on YAML, which is the configuration language of the Collector. In a nutshell,
it's because OTTL offers far greater flexibility and performance.

![YAML vs OTTL for transforming telemetry data](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/75e63c42-2f7b-4f38-44cf-e69241f25900/public
=3112x1143)

Traditional configuration languages like YAML are often limited to static
transformations, which means they can only perform simple tasks without much
room for customization. Additionally, YAML configurations can become cumbersome
and verbose, even for relatively simple pipelines, due to their inherent
limitations.

In contrast, OTTL operates directly within the Collector process, giving it
immediate access to telemetry data. This reduces the overhead associated with
separate execution environments or language runtimes and mitigates potential
risks such as memory safety issues, dynamic code execution vulnerabilities, and
security concerns stemming from unaudited dependencies.

Although OTTL is not a full-fledged programming language, it incorporates many
familiar idioms from general-purpose languages that make it possible to add,
remove, or modify attributes, perform calculations, and implement conditional
logic based on specific criteria within your telemetry data.

## What is pipeline data?

![Pdata representation of a Log entry](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bfeaa8bd-b13e-4c6c-1197-27628f448f00/md1x
=2604x2452)

[Pipeline data](https://github.com/open-telemetry/opentelemetry-collector/tree/main/pdata)
(pdata) is the in-memory representation of telemetry data as it flows through
the OpenTelemetry Collector pipeline.

All incoming data is transformed into this format, processed within the pipeline
using this format, and finally converted from pdata to the export format when
it's time for exporters to send the data out.

Before OTTL was introduced, components like the
[File Log Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/filelogreceiver)
used
[stanza](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/stanza)
for log transformation. However, this adds significant overhead due to the
conversion of pdata into stanza's internal format for processing, and then back
into pdata.

OTTL addresses this by executing directly on the pdata representation,
eliminating the need for additional conversion steps. This reduces overhead and
improves performance while ensuring full compatibility with pdata's hierarchical
structure.

This structure not only holds the telemetry signal itself but also provides
context about the entity generating the data and the logical unit within the
application associated with the emitted telemetry.

## A brief overview of the OTTL grammar

Before discussing the practical applications of OTTL, let's take a moment to
familiarize ourselves with its underlying structure – the OTTL grammar.
Understanding the grammar will provide you with the foundation to construct
effective OTTL statements for transforming your telemetry data.

### Statements

Statements are the fundamental units of transformation in OTTL as each one
defines a specific modification to be applied to your telemetry data.

While a statement operates on a single signal type (traces, metrics, or logs),
you can declare similar or related statements across multiple signal types as
needed.

Here are a few examples that demonstrate how OTTL statements work to alter
telemetry data:

```text
replace_all_matches(attributes, "/user/*/list/*", "/user/{userId}/list/{listId}")
```

```text
delete_key(attributes, attributes["http.request.header.authorization"])
```

```text
set(attributes["environment"], "production") where attributes["service.name"] == "my_service"
```

### Expressions

Expressions are evaluated within OTTL statements to determine the specific
action to be undertaken. This can involve accessing attributes of the telemetry
data for transformation, performing calculations, or making logical comparisons.

The most common expressions are math, boolean, path, and function call
expressions such as:

```text
metric.sum / metric.count
```

```text
"error" where attributes["http.status_code"] >= 400
```

```text
Concat("Log message: ", body)
```

### Literals

Literals are the fixed values you directly embed within your expressions. They
represent specific values that do not change during execution. OTTL supports
several types of literals:

- **Strings**: Enclosed in double quotes, such as `"a name"`.
- **Integers**: Whole numbers like `123` or `-456`. They are encoded as `int64`
  for a wide numeric range.
- **Floating-point numbers**: Numbers with decimal points, such as `3.14` or
  `-0.01`. They are encoded as `float64` to support precise calculations.
- **Booleans**: `true` or `false`.
- **Nil**: Represents the absence of a defined value.
- **Byte slices**: Represented as hexadecimal strings and prefixed with `0x`.

### Maps

Maps in OTTL allow you to organize data into key-value pairs, similar to JSON
objects:

```text
{"some_key": "some_value"}
```

```text
"field1": { "a_key": 10 }
```

### Lists

Lists in OTTL serve as a way to group multiple values, similar to arrays in
general-purpose languages:

```text
["first", "second", "third"]
```

```text
["a", attributes["some_key"], Concat(["a", "b"], "c")]
```

### Paths

Path expressions are used to reference the value of a telemetry field. They are
constructed using a combination of lowercase identifiers, dots (`.`), and square
brackets enclosing either string keys (`["key"]`) or integer keys (`[0]`).

For example, you can access span data using path expressions like these:

```text
attributes["http.url"]
```

```text
trace_state["my_custom_tag"]
```

```text
trace_id.string
```

### Enums

Enums are predefined constants for OTLP values written in uppercase letters.
During the parsing process, they are recognized and transformed into 64-bit
integer values (`int64`) which allow them to be used in OTTL expressions that
accept `int64` inputs.

The available enums are context-dependent, varying based on where you're
applying OTTL. For example, in the context of a span, you might use enums like:

- `STATUS_CODE_UNSET`
- `STAUS_CODE_OK`
- `STATUS_CODE_ERROR`

These enums correspond to the standard OTLP status codes, providing a clear and
readable way to handle specific status values in telemetry data transformations.

### Operators

OTTL supports various operators for performing calculations, comparisons, and
logical operations on your telemetry data. These include:

- Arithmetic operators like `+,` `-,` `*`, `/`, and `()`,
- Comparison operators like `==`, `!=`, `>`, `<`, `<=`, and `>=`,
- And logical operators like `and`, `or`, and `not`.

Here are some examples of their use in OTTL expressions:

```text
variable == "a string"
```

```text
3 > 1
```

```text
attributes["some-attr"] != nil
```

```text
not false
```

### Conditional logic

The ability to selectively apply transformations based on specific criteria or
attribute values is often necessary when working with telemetry data. OTTL
addresses this need by allowing you to incorporate conditional logic directly
into your statements using the `where` clause:

```text
set(attributes["environment"], "production") where attributes["host.name"] == "my_host"
```

### Context

In OTTL, context refers to the specific type of telemetry data your statements
operate on. The context defines the scope of the transformations, ensuring that
changes are applied to the correct elements within your observability pipeline.
Each context gives access to fields and attributes relevant to that particular
type of telemetry.

Here's a breakdown of the available contexts:

- [Resource](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottlresource/README.md):
  Transformations applied here affect the resource attributes, which provide
  metadata about the entity producing the telemetry.
- [Span](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottlspan/README.md):
  This context focuses on individual spans within a trace. You can manipulate
  span attributes, filter spans, or add events.
- [Span event](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottlspanevent/README.md):
  Operations in this context target the events within a span, which capture
  specific occurrences or log messages during a span's execution.
- [Metric](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottlmetric/README.md):
  Transformations in this context modify metrics. You can aggregate, calculate,
  or adjust metric values and labels.
- [Log](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottllog/README.md):
  This context focuses on log entries, allowing you to extract information,
  filter logs based on content, or add additional context.
- [Datapoint](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottldatapoint/README.md):
  Operations here impact individual data points within metrics, offering
  fine-grained control over metric data.
- [Instrumentation scope](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/contexts/ottlscope/README.md):
  This scope applies transformations to OTLP instrumentation scope, which
  provides information about the library or component responsible for generating
  the telemetry.

### Functions

OTTL functions are predefined operations that perform specific transformations
or modifications to telemetry data. These functions fall into two main
categories:

#### 1. Editors

They mutate the underlying telemetry payload directly. Examples include:

- `delete_key()`: Removes a specific key from a map.
- `replace_pattern()`: Replaces a substring matching a pattern with another
  value.
- `append()`: Adds new values to a target array.

#### 2 Converters

They are pure functions that operate on one or more values to produce a single
output that may be used in OTTL expressions. Examples include:

- `Concat()`: Concatenates multiple strings into a single result.
- `IsBool()`: Checks whether a value is a boolean.
- `Len()`: Returns the length of a list or string.
- `ParseJSON()`: Parses a JSON string and returns a structured object.

## The OTTL standard library

![OTTL standard library functions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9673edb1-948b-4cfc-2450-99f4426d1c00/lg2x
=3619x1545)

The OTTL standard library is a collection of built-in functions and operators
that provide essential capabilities for data processing and transformation
within OTTL expressions.

It provides a wide range of tools to manipulate strings, handle timestamps,
perform mathematical calculations, and more, ensuring a standardized way to work
with telemetry data.

Here are some of the key components of the standard library you'll commonly use
when working with OTTL:

- **Data operations**: OTTL provides several editor functions for manipulating
  telemetry data such as `set()`, `delete_key()`, `keep_keys()`, and others.

- **Text processing**: These functions handle operations on string values and
  they include `Concat()`, `ConvertCase()`, `Substring()`, `Format()` and
  others.

- **Type conversion**: These facilitate converting data between different types,
  such as `Int()`, `String()`, or `Double()`.

- **Timestamp functions**: OTTL provides powerful utilities for handling and
  manipulating timestamps including `Time()`, `Now()`, `Unix()`, and more.

- **Hashing**: You can hash attribute values using your preferred cryptographic
  algorithm such as `SHA1()`, `MD5()`, `SHA256()`, or `SHA512()`.

- **Parsing functions**: These functions enable parsing of different data
  formats including `URL()`, `ParseJSON()`, `ParseXML()`, and others.

- **Pattern extraction**: OTTL allows for extracting patterns from unstructured
  data through regular expressions (`ExtractPatterns()`) or grok patterns
  (`ExtractGrokPatterns()`).

For a complete list of available functions and their signatures, be sure to
refer to the
[OTTL Function documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl/ottlfuncs).

## Error handling

Telemetry data is notoriously unpredictable, so its essential to account for
error handling when working with OTTL.

There are two categories of errors to take note of:

### 1. Startup errors

These errors arise when the OpenTelemetry Collector starts up, stemming from
problems like incorrect syntax in your configuration file, invalid arguments
passed to functions, or other configuration mishaps.

The Collector will log these errors to help you pinpoint and rectify the source
of the problem. A typical error message might look like this:

```text
Error: invalid configuration: processors::transform/redact: unable to parse OTTL statement "set(\"\")": error while parsing arguments for call to "set": incorrect number of arguments. Expected: 2 Received: 1
```

### 2. Function errors

Function errors occur during the actual execution of OTTL statements. Two common
scenarios trigger these errors:

- **Type mismatch**: When a function expects a specific type from a path
  expression, but receives a different type or `nil`, the function will generate
  an error.

- **Failed type conversions**: Some OTTL functions try to convert input values
  to a specific type. An error is generated if they encounter a type they can't
  handle.

By default, function errors cause the current telemetry data to be dropped.
However, you have the power to control this behavior using the `error_mode`
setting within your processor configuration:

```yaml
[label config.yaml]
processors:
  transform/redact:
[highlight]
    error_mode: ignore
[/highlight]
```

You can opt for one of three possible values:

- `propagate` (default): The error is propagated up the pipeline, discarding the
  current telemetry data.
- `silent`: Errors are silently ignored, and processing continues to the
  following statement.
- `ignore`: Errors are ignored but logged, and processing continues
  uninterrupted.

While the `ignore` setting can help prevent data loss, it's crucial to actively
[monitor your logs](https://betterstack.com/community/guides/logging/log-monitoring/) for any errors. This allows you to promptly
identify and address issues in your OTTL logic to ensure the accuracy and
completeness of your telemetry data.

## Where can you use OTTL?

There are several places where you can use OTTL to transform or manipulate
telemetry data within your OpenTelemetry Collector pipeline:

### 1. Processors

![Using OTTL in the transform processor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f5a53b23-29a6-496a-ac65-cf028b2a7500/md1x
=2220x610)

The most common place to employ OTTL is when you need to filter, enrich, or
refine telemetry data through processors. Here are a few notable processors that
support OTTL:

- [Transform processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor):
  This processor is entirely driven by OTTL, allowing you to perform extensive
  modifications on incoming traces, metrics, and logs. You can add, remove, or
  change attributes, calculate new metrics, and even restructure log messages.
- [Filter processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor):
  OTTL is used here to define conditions that determine whether specific
  telemetry data should be dropped or kept.
- [Routing processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/routingprocessor#tech-preview-opentelemetry-transformation-language-statements-as-routing-conditions):
  OTTL statements act as routing conditions for directing telemetry data to
  specific exporters based on its content or attributes.
- [Tail sampling processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor):
  OTTL conditions are used to determine when to sample a trace.

### 2. Connectors

The
[routing](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/routingconnector)
and
[count](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/connector/countconnector)
connectors can also use OTTL conditions for decision-making. These connectors
highlight the growing adoption of OTTL as a standardized way to define
configuration and processing logic in other Collector components besides
processors.

### 3. Custom components

You can integrate OTTL into your custom components to leverage its flexibility
for data transformation and decision-making. By using the
[ottl package](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/pkg/ottl),
you can build custom processors or connectors that support OTTL functionality,
allowing you to implement specific transformations or filtering logic within
your component.

## Debugging OTTL statements

When your OTTL statements aren't behaving as anticipated, it's time to roll up
your sleeves and troubleshoot. The first step is enabling `debug` logging within
the Collector.

This instructs the Collector to reveal the structure of your telemetry data both
before and after each transformation, which should provide clues for pinpointing
the issue.

```yaml
[label config.yaml]
service:
  telemetry:
    logs:
      level: debug
```

Depending on the processor you're using, you'll start seeing logs that look like
this:

```text
2024-09-18T17:21:29.159Z      debug   ottl@v0.108.0/parser.go:281     initial TransformContext        <initial telemetry payload>
2024-09-18T17:21:29.159Z      debug   ottl@v0.108.0/parser.go:302     TransformContext after statement execution      <telemetry payload after transformation>
```

The `<telemetry payload>` placeholders within these messages are JSON objects
that depict how the Collector perceives your data before and after each OTTL
statement is applied.

To quickly identify the changes made by your OTTL statements, you can feed these
JSON objects into a diffing tool. This will highlight the exact modifications,
helping you understand whether your statements produce the intended results.

![Screenshot of Diff command](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb39fd76-5a59-4bf0-6c48-ddf838ede000/lg1x
=2874x1094)

By closely monitoring these logs and comparing the data at each step, you can
fine-tune your OTTL statements and ensure that they behave as expected.

## A practical example: parsing Linux authentication logs

Let's explore how OTTL can help extract key attributes from unstructured log
records, specifically focusing on [Linux authentication
logs](https://betterstack.com/community/guides/logging/monitoring-linux-auth-logs/).

### The scenario

Assuming you've configured the OpenTelemetry Collector to read from the system
authentication log (`/var/log/auth.log`), which contains entries like these:

```text
[label /var/log/auth.log]
Feb 10 15:45:09 ubuntu-lts sshd[47341]: Failed password for root from 103.106.189.143 port 60824 ssh2
Feb 10 15:45:11 ubuntu-lts sshd[47341]: Connection closed by authenticating user root 103.106.189.143 port 60824 [preauth]
Feb 10 15:45:16 ubuntu-lts sshd[47339]: Received disconnect from 180.101.88.228 port 11349:11:  [preauth]
Feb 10 15:45:16 ubuntu-lts sshd[47339]: Disconnected from authenticating user root 180.101.88.228 port 11349 [preauth]
```

You might have a `receivers` configuration that looks like this:

```yaml
[label config.yaml]
receivers:
  filelog:
    include: [/var/log/auth.log]
```

In this scenario, we aim to identify and extract meaningful information from
failed authentication attempts.

### Filtering with OTTL

To focus on failed password attempts, you can use the filter processor with an
OTTL condition to retain only relevant log entries:

```yaml
[label config.yaml]
processors:
  filter/ottl:
    error_mode: ignore
    logs:
      log_record:
        - not IsMatch(body, "Failed password")
```

The `IsMatch()` converter function checks if the body of the log record contains
the "Failed password" phrase, while `not` negates the result, leading to all
records without the phrase being dropped.

If you have `debug` logging enabled for the Collector, you will see the
underlying objects produced for each piece of telemetry data in the pipeline.
The entries containing `Failed password` have a `match` property set to `false`:

```json
[output]
2024-09-19T10:20:57.119Z      debug   ottl@v0.108.0/parser.go:394     condition evaluation result {
[highlight]
  "match": false,
[/highlight]
  "TransformContext": {
    . . .
    "log_record": {
      . . .
[highlight]
      "body": "Feb 10 15:45:09 ubuntu-lts sshd[47341]: Failed password for root from 103.106.189.143 port 60824 ssh2",
[/highlight]
      . . .
    },
    "cache": {}
  }
}
```

Those without such a phrase will have `match: true` instead leading to them
being dropped:

```json
[output]
2024-09-19T10:20:57.119Z      debug   ottl@v0.108.0/parser.go:394     condition evaluation result {
[highlight]
  "match": true,
[/highlight]
  "TransformContext": {
    . . .
    "log_record": {
      . . .
[highlight]
      "body": "Feb 10 15:45:16 ubuntu-lts sshd[47339]: Received disconnect from 180.101.88.228 port 11349:11:  [preauth]",
[/highlight]
      . . .
    },
    "cache": {}
  }
}
```

Now that we've filtered out the irrelevant data, let's focus on transforming the
data we actually want to keep.

### Log parsing with OTTL

Let's go ahead and extract meaningful attributes from the "Failed password"
events using the `transform` processor:

```yaml
[label config.yaml]
processors:
  transform/parse_failed_pw:
    log_statements:
      - context: log
        statements:
```

If you intend to modify the `body` of a log entry in the pipeline, the
[OpenTelemetry Semantic Conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/)
recommend storing the complete original log record under a `log.record.original`
attribute:

```yaml
[label config.yaml]
processors:
  transform/parse_failed_pw:
    log_statements:
      - context: log
        statements:
[highlight]
          - set(attributes["log.record.original"], body)
[/highlight]
```

The `attributes` property provided in the `log` context refers to the attributes
of the log being processed. When the highlighted statement is executed, a new
`log.record.original` property is added to the `log_record.attributes` object,
and its value is the `log_record.body` as shown below:

```json
[output]
{
  "log_record": {
    "attributes": {
      "log.record.original": "Feb 10 15:45:09 ubuntu-lts sshd[47341]: Failed password for root from 103.106.189.143 port 60824 ssh2"
    }
  }
}
```

Next, use the `ExtractPatterns()` function to pull out important details, such
as the timestamp, hostname, username, and IP address:

```yaml
[label config.yaml]
processors:
  transform/parse_failed_pw:
    log_statements:
      - context: log
        statements:
          - set(attributes["log.record.original"], body)
[highlight]
          - merge_maps(attributes, ExtractPatterns(body, "^(?P<timestamp>\\w+ \\w+ [0-9]+:[0-9]+:[0-9]+) (?P<hostname>\\S+) (?P<appname>\\S+)(\\[(?P<pid>\\d+)\\]). (?P<event>Failed password) for (invalid user )?(?P<username>\\w+) from (?P<ip_address>[\\d.]+) port (?P<port>\\d+) (?P<protocol>\\w+)$"), "upsert")
[/highlight]
```

The `ExtractPatterns()` function uses regular expressions with named capture
groups to extract key details from the log message and store them as attributes.
The output now includes attributes like `timestamp`, `hostname`, `pid`,
`username`, and `ip_address`:

```json
[output]
{
    "attributes": {
  "log_record": {
      "timestamp": "Feb 10 15:45:09",
      "hostname": "ubuntu-lts",
      "pid": "47341",
      "username": "root",
      "ip_address": "103.106.189.143",
      "port": "60824",
      "log.record.original": "Feb 10 15:45:09 ubuntu-lts sshd[47341]: Failed password for root from 103.106.189.143 port 60824 ssh2"
    }
  }
}
```

Some of the extracted attributes need further refinement. For example, `pid` and
`port` should be converted to integers, and `timestamp` should be transformed
into Unix time. It's also a good idea to update the `time`, `severity_number`
and `severity_info` properties accordingly:

```yaml
[label config.yaml]
processors:
  transform/parse_failed_pw:
    log_statements:
      - context: log
        statements:
          - set(attributes["log.record.original"], body)
          - merge_maps(attributes, ExtractPatterns(body, "^(?P<timestamp>\\w+ \\w+ [0-9]+:[0-9]+:[0-9]+) (?P<hostname>\\S+) (?P<appname>\\S+)(\\[(?P<pid>\\d+)\\]). (?P<event>Failed password) for (invalid user )?(?P<username>\\w+) from (?P<ip_address>[\\d.]+) port (?P<port>\\d+) (?P<protocol>\\w+)$"), "upsert")
[highlight]
          - set(severity_number, SEVERITY_NUMBER_INFO)
          - set(severity_text, "info")
          - set(time, Time(attributes["timestamp"], "%b %d %H:%M:%S"))
          - set(attributes["timestamp"], UnixNano(time))
          - set(attributes["pid"], Int(attributes["pid"]))
          - set(attributes["port"], Int(attributes["port"]))
[/highlight]
```

The final statement will produce the following `debug` log, where you'll see the
cumulative effect of all your transformations:

```json
[output]
2024-09-19T11:26:07.663Z      debug   ottl@v0.108.0/parser.go:302     TransformContext after statement execution {
  "kind": "processor",
  "name": "transform/parse_failed_pw",
  "pipeline": "logs",
  "statement": "set(attributes[\"port\"], Int(attributes[\"port\"]))",
  "condition matched": true,
  "TransformContext": {
    "resource": {
      "attributes": {},
      "dropped_attribute_count": 0
    },
    "scope": {
      "attributes": {},
      "dropped_attribute_count": 0,
      "name": "",
      "version": ""
    },
    "log_record": {
      "attributes": {
        "log.file.name": "/var/log/auth.log",
[highlight]
        "log.record.original": "Feb 10 15:45:09 ubuntu-lts sshd[47341]: Failed password for root from 103.106.189.143 port 60824 ssh2",
        "timestamp": 1707579909000000000,
        "hostname": "ubuntu-lts",
        "appname": "sshd",
        "pid": 47341,
        "event": "Failed password",
        "username": "root",
        "ip_address": "103.106.189.143",
        "port": 60824,
        "protocol": "ssh2"
[/highlight]
      },
      "body": "Feb 10 15:45:09 ubuntu-lts sshd[47341]: Failed password for root from 103.106.189.143 port 60824 ssh2",
      "dropped_attribute_count": 0,
      "flags": 0,
      "observed_time_unix_nano": 1726745167562902040,
[highlight]
      "severity_number": 9,
      "severity_text": "info",
[/highlight]
      "span_id": "0000000000000000",
[highlight]
      "time_unix_nano": 1707579909000000000,
[/highlight]
      "trace_id": "00000000000000000000000000000000"
    },
    "cache": {}
  },
  "trace_id": "0d96a4b9a90d524ef822fe548ad7a933",
  "span_id": "29af57a2ba4b6c49"
}
```

This example merely scratches the surface of OTTL's potential, but it should
provide a solid grasp of how it functions and its capacity to transform diverse
telemetry data—be it logs, metrics, or traces.

## Final thoughts

In this article, we've explored the intricacies of the OpenTelemetry Transform
Language, giving you the foundational knowledge to leverage its power for
telemetry transformations.

While this overview should be enough to get you started, I encourage you to
consult the
[official OTTL documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/README.md)
for more detailed and up-to-date information.

If you'd like to follow the development of the language, ensure to check out the
[OpenTelemetry Contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib)
GitHub repository.

Thanks for reading, and until next time!