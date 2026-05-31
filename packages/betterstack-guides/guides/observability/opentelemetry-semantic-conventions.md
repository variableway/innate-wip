# The Missing Guide to OpenTelemetry Semantic Conventions

Imagine a bustling city with various districts, each speaking its unique
language. Communication is difficult, misunderstandings are frequent, and
progress is slow. This is often the reality of modern software systems, where
different components generate telemetry data labeled in inconsistent and
confusing ways.

For instance, one component might record the user's location as `user.country`,
while another uses `customer_location` or simply `geo`. This lack of
standardization creates a significant burden for engineers who need to analyze
this data, forcing them to spend valuable time deciphering meanings and manually
correlating information.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ckcbPgZb3TU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[OpenTelemetry's Semantic Conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/)
offer a solution: a universal language for telemetry data. By adhering to these
conventions, you can ensure that your data is consistently labeled and easily
understood by everyone, regardless of the instrumentation used.

Think of it as a common set of road signs and traffic signals for your software
city. With clear and standardized communication, traffic flows smoothly, and
everyone can easily navigate and understand the system.

This allows observability tools to automatically analyze data, identify issues,
and provide insights, freeing you to focus on building and improving your
applications instead of getting lost in translation.

In this article, you will learn the importance of using the OpenTelemetry
semantic conventions to create standardized and interoperable telemetry data.

[ad-logs]

## What are semantic conventions?

![OpenTelemetry Semantic conventions GitHub](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/acbdc485-2232-471e-8a22-9d141cbae500/md1x =1200x600)

Semantic conventions are standardized guidelines for naming and structuring your
telemetry data. They ensure that data collected from different systems and
services is consistently structured, making it easier to correlate, compare, and
analyze across various tools.

These conventions build on past efforts, such as the
[Elastic Common Schema (ECS)](https://www.elastic.co/elasticsearch/common-schema),
which aimed to standardize log data fields. In 2023, the ECS project was
[merged](https://opentelemetry.io/blog/2023/ecs-otel-semconv-convergence/) with
OpenTelemetry's semantic conventions, making it the canonical way to structure
telemetry attributes. Unlike ECS, OpenTelemetry's conventions are
vendor-agnostic and apply to logs, metrics, and traces to enable seamless
cross-signal analysis.

To manage the evolution of these conventions without disrupting existing tools,
OpenTelemetry employs telemetry schemas. These schemas ensure that changes to
the conventions maintain compatibility with analysis tools, and provide
stability and consistency across different observability signals.

## Semantic conventions stability explained

![Some examples of stable semantic conventions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a8e6767e-e57a-4f2e-5d7e-87b2f2533f00/lg2x
=3246x1038)

When a semantic convention is marked as `stable`, the names and structures of
attributes and resources are production-ready and unlikely to change in future
releases.

Before reaching stability, semantic conventions may be marked as `experimental`.
These are conventions that are still under evaluation and may change based on
feedback, usage, or evolving needs.

![Some examples of experimental semantic conventions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/afb53366-ef9f-49b3-48d7-270752df9500/orig
=3246x968)

Conventions can also become `deprecated` when a newer standard replaces them.
During the deprecation phase, the older convention remains available but may be
removed in future updates.

![Deprecated semantic conventions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/87881066-2736-4aa1-4518-939da6993600/md2x =2962x514)

Usually, there is a transition period where both the old and new conventions
coexist to allow for a smoother migration.

For instance, in late 2023,
[OpenTelemetry stabilized the HTTP Semantic Conventions](https://opentelemetry.io/blog/2023/http-conventions-declared-stable/)
by merging existing conventions with Elastic Common Schema attributes, dropping
less useful ones, and standardizing units.

This update resulted in breaking changes for some attributes, such as renaming
`http.method` to `http.request.method`, `http.client_id` to `client.address`,
[and so on](https://opentelemetry.io/blog/2023/http-conventions-declared-stable/#common-attributes-across-http-client-and-server-spans).

Currently, most OpenTelemetry SDKs continue to output the old attributes by
default, so you'll need to opt into the stable version with the
`OTEL_SEMCONV_STABILITY_OPT_IN` environmental variable, which can be set to
either:

- `http`: emit the stable HTTP semantic conventions only.
- `http/dup`: emit both the old and the stable conventions to enable a gradual
  migration.

In multi-language environments, you must ensure that all OpenTelemetry SDKs are
aligned to avoid inconsistencies in telemetry output.

## Resource semantic conventions

In OpenTelemetry, a `Resource` represents the entity that generates telemetry
data, which could be a service, process, container, host, or any other system
component.

The purpose of this entity is to describe what the resource is and how to
identify it. For example, a web service running on a virtual machine in a cloud
environment may have a unique instance ID, be deployed in a specific region, and
belong to a particular service group or environment.

[The semantic conventions for resources](https://opentelemetry.io/docs/specs/semconv/resource/)
determines how these details are structured consistently across various resource
types. The only required attribute for a `Resource` is `service.name`, which
identifies the entity producing the telemetry. This is often set using the
`OTEL_SERVICE_NAME` environment variable:

```text
OTEL_SERVICE_NAME=adservice
```

Other notable attributes under the `service` namespace include:

- `service.version`: a version number like `1.2.0` or a git hash like
  `4dc21822d08f4a504b6dd4790e23dcf343777c17`.
- `service.instance.id`: helps distinguish instances of the same service that
  exist at the same time.
- `service.namespace`: provides a way to group a collection of related services.

![Otel semantic conventions resource service](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e7a07e7d-c28f-49b1-50f8-a21f7ea2e000/md1x
=3246x766)

There are several other attribute groups such as `telemetry.*` which describes
the instrumentation responsible for generating the telemetry data, `process.*`
which documents the process responsible for the telemetry, `host.*` for
providing context about the host environment, and even `cloud.*` for describing
cloud resources.

Here's an example of a `Resource` object in the [OTLP data model](https://betterstack.com/community/guides/observability/otlp/) which
provides a structured representation of metadata about the environment where the
telemetry data is being generated (a Node.js process in this case):

```javascript
{
  resource: {
    attributes: {
      'service.name': 'adservice',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0',
      'process.pid': 60,
      'process.executable.name': '/usr/local/bin/node',
      'process.executable.path': '/usr/local/bin/node',
      'process.command_args': ['/usr/local/bin/node', '/node/app/server.js'],
      'process.runtime.version': '20.17.0',
      'process.runtime.name': 'nodejs',
      'process.runtime.description': 'Node.js',
      'process.command': '/node/app/server.js',
      'process.owner': 'root',
      'host.name': 'a4e67b9cd391',
      'host.arch': 'amd64'
    }
  }
}
```

The `Resouce` entity is typically auto-populated by the OpenTelemetry SDK in
use, but you can also use the
[resource processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md)
to add or modify resource attributes as needed.

## Trace semantic conventions

![Trace semantic conventions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/09f033be-ec35-4e67-3df7-cc293f1e9900/lg2x =3200x474)

Spans in OpenTelemetry track operations within your application and offer deep
visibility into their execution. They are particularly valuable in distributed
systems, where they can propagate across services to provide a complete view of
how requests flow through different distributed components.

Each span can be annotated with attributes specific to the operation it
represents, such as the method invoked, operation status, or metadata like user
ID or request payload. Some attributes are general and applicable across many
operations, while others are context-specific.

The purpose of
[trace semantic conventions](https://opentelemetry.io/docs/specs/semconv/general/trace/)
is to standardize span names, kinds (such as client or server), and attribute
keys. Some attributes must be added at the start of the span due to sampling
concerns, and others have their values governed using a list of well-known
values.

These conventions ensure consistency when describing operations like HTTP
requests, database queries, and messaging interactions, allowing services to
produce uniform telemetry data that simplifies comparison, aggregation, and
troubleshooting across distributed systems.

For example, tracing an HTTP request involves capturing attributes like
`http.request.method`, `user_agent.original`, and `http.request.status_code` to
ensure consistent key details across all HTTP-based spans. Similarly, for
database queries, attributes such as `db.system`, `db.query.text`, and `db.user`
standardize the emitted telemetry regardless of the database driver.

For example, a span describing a database query could contain attributes that
look like this:

```javascript
{
  attributes: {
    'db.system': 'postgresql',
    'db.name': 'ads',
    'db.connection_string': 'postgresql://adservice:5432/ads',
    'net.peer.name': 'adservice-db',
    'net.peer.port': 5432,
    'db.user': 'postgres',
    'db.statement': "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'"
  }
}
```

## Metric semantic conventions

![Metric semantic conventions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a75f0d2e-d305-41ab-3b25-fa4869bdd700/lg2x =3206x548)

[Metric semantic conventions](https://opentelemetry.io/docs/specs/semconv/general/metrics/)
provide guidelines for naming and structuring metric data emitted by programs.
These conventions ensure consistency and clarity in how metrics are captured and
interpreted.

### 1. Naming rules

Metric names should follow a clear convention to indicate the type of data being
measured. For example, `<entity>.limit` refers to a metric representing a
constant total, while `<entity>.utilization` tracks the fraction of usage from
that total. These guidelines also cover pluralization and using qualifiers like
`count` or `total` in names.

### 2. Instrument units

Metrics often include a unit of measurement to specify what is being measured
(e.g., seconds, bytes, requests) to ensure that they are meaningful and
comparable across systems. In OpenTelemetry, metric units must adhere to the
[Unified Code for Units of Measure](https://unitsofmeasure.org/ucum.html). There
are also other rules for dimensionless measurements, annotations for integer
counts (like `{request}`), durations, and more.

### 3. Instrument types

Metrics are categorized into different types based on what they represent, such
as `Counter`, `Histogram`, `UpDownCounter`, `CounterObserver`, and others.

### 4. Metric attributes

Metric attributes follow the same naming conventions as spans. If attributes are
specific to a metric, they should be namespaced under the metric. However, more
general attributes can be used across multiple metrics.

### 5. Requirement levels

Metric semantic conventions also define different
[requirement levels](https://opentelemetry.io/docs/specs/semconv/general/metric-requirement-level/)
to guide how instrumentation libraries should implement and emit metrics. These
levels help ensure that essential metrics are always available while allowing
for optional metrics based on specific needs.

The three requirement levels are: `Required`, `Recommended`, and `Opt-In`. For
example, metric attributes that may have [high
cardinality](https://betterstack.com/community/guides/observability/high-cardinality-observability/) can only be defined at the `Opt-In`
level.

## Log semantic conventions

![Log semantic conventions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d87a0fb8-0450-49a4-34f5-a2da3982a800/orig
=3246x482)

Unlike traces and metrics, OpenTelemetry provides no API or SDK for creating log
data. Instead, it focuses on collecting logs from existing logging frameworks
and infrastructure, enriching them with additional context (such as trace and
span IDs), and formatting them in a way that allows correlation across various
sources.

[The semantic conventions for logs](https://opentelemetry.io/docs/specs/semconv/general/logs/)
are still evolving and currently focus on specifying attributes that can be used
for log identification (such as `log.record.uid`), preserving the original log
content before processing (`log.record.original`), and specifying the media to
which the log was emitted (`log.file.*` for files and `log.iostream` for the
`stdout` or `stderr` streams).

Additionally, they also specify how exceptions and feature flag evaluations
should be represented in a log record to ensure compatibility with their span
counterparts.

## Event semantic conventions

![Event semantic convention](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/efe664d3-e597-4d7b-8fd3-9dc089e16000/orig
=2882x266)

In OpenTelemetry, events are time-stamped annotations attached to spans that
provide additional context or detail about notable moments during the span's
lifecycle. They are used to capture key actions or state changes, such as
errors, milestones, or other significant occurrences within an operation being
traced.

Currently,
[the semantic conventions for events](https://opentelemetry.io/docs/specs/semconv/general/events/)
specify that each event must have a required name (`event.name`), an optional
payload (body) of any type, and relevant attributes for additional context. The
conventions also guide when to use attributes versus body fields for storing
data.

In the future, specific event types may be standardized with well-defined
payload structures and field semantics, while others may retain user-defined
formats.

## Naming custom attributes

Attributes provide [extra dimensions and
context](https://betterstack.com/community/guides/observability/high-cardinality-observability/) to your telemetry data, be it logs,
traces, metrics, or events. While OpenTelemetry's semantic conventions define
many standard attributes, you may need to create custom attributes for specific
business needs.

Before creating a custom attribute, consult the
[attributes registry](https://opentelemetry.io/docs/specs/semconv/attributes-registry/)
to ensure that a standard attribute doesn't already exist. If you do need to
create a new one, ensure to follow the
[attribute naming guidelines](https://opentelemetry.io/docs/specs/otel/common/attribute-naming/)
which are summarized below:

- Attribute names should be lowercase and use dots for namespaces to avoid
  clashes (e.g. `service.version`).
- Names should not overlap with namespaces. For example, having
  `service.instance.id` precludes `service.instance` from being an attribute.
- Common and well-known abbreviations are allowed but avoid ambiguous ones.
- Attribute names should not be reused even after renaming.
- Attribute names should have the same semantics across spans, logs, metrics,
  and resources.
- Use singular names for single entities (like `process.executable.name`) and
  plural entities with array values (like `process.command_args`).
- For company-specific attributes, prefix with the reverse domain name (such as
  `com.example.<attribute>`)
- Avoid using existing namespaces for custom attributes, as this may result in
  future conflicts.
- For widely applicable attributes, consider submitting a proposal to
  OpenTelemetry for standardization.

## Final thoughts

[Achieving observability](https://betterstack.com/community/guides/observability/what-is-observability/) means being able to seamlessly
query and understand your system's behavior using the combined strengths of
logs, metrics, and traces, enriched with meaningful metadata.

OpenTelemetry's semantic conventions play a key role by providing
industry-standard guidelines for describing common components and scenarios to
ensure that telemetry data is always structured and labeled consistently across
domains.

As you familiarize yourself with these conventions and learn how to create
custom attributes, you'll see the benefits extend beyond just your own
work—impacting teams and systems across your organization.

For the most up-to-date information on all things OpenTelemetry, always consult
the [official documentation](https://opentelemetry.io/docs/).

Thanks for reading!
