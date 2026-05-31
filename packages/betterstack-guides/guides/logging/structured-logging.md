# Why Structured Logging is Fundamental to Observability

Logging is an age-old practice in software development that dates back to the
early days of computing. It is the process of recording events, errors, and
other noteworthy occurrences within a software system.

Traditionally, these records have been unstructured blobs of text primarily
intended for human consumption. But as software systems grew in complexity and
scale, the limitations of using unstructured text data for automated analysis
became increasingly apparent.

If you aim to [achieve observability](https://betterstack.com/community/guides/observability/what-is-observability/) with unstructured
logs, you're in for a rough ride. But such logs can be immensely valuable when
redesigned as machine-parsable structured data.

The rest of this article will help you learn how to effectively transition your
logging strategy to structured logs, paving the way to meeting your
observability targets.

[ad-logs]

## A brief history of logging

Logging originated as a basic debugging tool, with programmers embedding print
statements within their code to track program execution and identify errors. As
operating systems matured, built-in logging mechanisms like
[Syslog](https://en.wikipedia.org/wiki/Syslog) emerged to establish a standard
for system message logging.

With the rise of personal computers and complex software, application logging
frameworks emerged as languages like C and Java integrated standard logging
facilities to ensure consistent and portable logging practices.

The advent of the internet and web services brought a new wave of challenges,
necessitating advanced logging techniques that led to the emergence of popular
frameworks like [Log4j](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/) and the [Python logging
module](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/) in this era.

As server numbers grew, so did the volume of log data and the complexity of
understanding system-wide events. Companies like Splunk and LogRhythm (both
formed in 2003) pioneered solutions to manage and analyze this sprawling data,
and their tooling was unmatched at the time.

The rise of cloud computing in the late 2000s to the present day intensified the
data deluge, demanding even more robust logging tools. The industry is also
shifting towards observability, a holistic approach that encompasses not just
logs, but also metrics, distributed traces, and other signals to untangle
complex service interactions.

## Why traditional logs hinder observability

![log-formats-explained.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7884e45c-fdbe-4444-2ed8-491d37999b00/lg1x
=1700x1000)

Traditional logs are often [unstructured or semi-structured](https://betterstack.com/community/guides/logging/log-formatting/),
consisting of plain text messages with limited consistency in format or content.
This is because they were designed to be read by humans, not machines.

```text
2024-06-17T08:55:00Z [INFO]  User 'user123' logged in from 192.168.0.1
2024-06-17T08:55:01Z [ERROR] Database connection failed: Connection refused
```

While this approach might have been adequate for simpler systems, where a
handful of services logged to local files and manual inspection via SSH was
feasible, it crumbles under the weight of modern, cloud-based architectures
where log data volume is no longer human scale.

Searching and analyzing millions of unstructured logs typically requires manual
effort or complex parsing scripts, which are time-consuming, error-prone, and
not scalable. It's also a misuse of your analytical skills which could be better
spent understanding system behavior through the logs.

Your first step toward achieving observability is making your logs easy to
query, filter, and visualize, and the solution lies in generating structured log
data that's designed for computers first rather than for humans.

Let's explore how this works next.

## What is structured logging?

Structured logging involves recording log events in a well-defined,
machine-readable format such as [JSON](https://betterstack.com/community/guides/logging/json-logging/). Instead of writing log
messages as plain text, log data is organized into key-value pairs, making it
easier to search, filter, and analyze.

From the preceding section, the structured versions might instead look like
this:

```json
{
  "timestamp": "2024-06-17T08:55:00Z",
  "level": "INFO",
  "message": "User 'user123' logged in",
  "user": "user123",
  "ip_address": "192.168.0.1"
},
{
  "timestamp": "2024-06-17T08:55:01Z",
  "level": "ERROR",
  "message": "Database connection failed",
  "error": {
    "code": "DB_CONNECT_ERROR",
    "message": "Connection refused"
   }
}
```

From the examples above, you can see some of the key characteristics of
structured logs which include the following:

1. **A machine-readable format**: Structured logs utilize standard data formats
   like JSON, which is easily parsed and interpreted by machines to facilitate
   automated processing and analysis.

2. **Key-value pairs**: The log data is organized into key-value pairs, where
   each key represents a specific attribute (e.g., `timestamp`, `level`,
   `message`), and the value represents the corresponding data.

3. **Contextual information**: Structured logs often include additional context
   about the event being captured or work being performed to help correlate logs
   across different services.

4. **Hierarchical structure**: Nested key/value pairs can represent complex data
   structures or relationships, allowing for more detailed and informative
   logging.

## Why structured logging is required for observability

Imagine wandering into a public library with millions of books with no
discernible order to the shelves, no
[Dewey Decimal system](https://en.wikipedia.org/wiki/Dewey_Decimal_Classification),
no alphabetization, and no helpful librarian. Finding a specific title would be
an extremely time-consuming process that would be prohibitive for most people.
Libraries have developed systems of organization precisely because chaos hinders
discovery.

The same principle applies to log data. Modern software systems have grown to a
complexity far beyond what the human mind can quickly grasp. With countless
interacting components and a deluge of events happening every second, a massive
volume of logs is being produced and streamed to centralized data stores.

While modern log management systems can easily aggregate millions of log entries
from diverse sources, the challenge lies in extracting meaningful information
from this unstructured mass of data.

![Log parsing](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0efbbea3-70b8-44bc-5813-cc483fada600/lg2x
=2752x596)

Traditional approaches often involve complex parsing algorithms that attempt to
split and categorize log data into meaningful chunks. However, the lack of
standardization across different sources and the sheer variety of potential log
formats make this a cumbersome and error-prone process.

Consider a scenario where your application is experiencing a sudden surge in
failed login attempts. To understand the issue, you'd need to craft a query that
isolates the relevant log records so that you can examine them more closely.

For instance, you might want to search for records where the error message
contains "invalid username or password", and quickly group them by IP address to
identify potential brute-force attacks, or by the username to see if a specific
account is being targeted.

Structured logging allows you to construct such targeted queries easily since
each log entry is consistently formatted with clearly defined fields. If your
logs include fields like `event`, `ip_address`, `username`, and `timestamp`, you
can quickly filter the data to identify patterns and correlations that would
otherwise be difficult to uncover when relevant information is buried in an
unorganized mass of text.

![Linux Authentication Logs in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/13d3c94f-0c9b-4002-db8d-0ea8abd16b00/orig
=2116x1188)

Just as a well-organized library facilitates learning and discovery, structured
logging unlocks the potential of log data by allowing you to dissect it from
numerous angles to isolate relevant events, and ultimately uncover the root
cause of issues with surgical precision.

## How to structure your logs

Getting started with structured logging can seem daunting if you've never done
it before, but breaking it down into clear steps makes the process more
manageable.

In summary, here's what you need to do:

1. Choose a machine-parsable log format.
2. Adopt a structured logging framework.
3. Configure your log sources.
4. Transform unstructured logs into structured data.
5. Define a log schema.
6. Normalize your log data.

Let's dig deeper into some of the finer details of each step so that you'll be
well-equipped to structure your logs effectively and unlock their full
potential.

### 1. Choose a machine-parsable log format

The first step is to choose a standard machine-parsable format for your logs. We
recommend JSON due to its widespread adoption and ease of use, but
[Logfmt](https://betterstack.com/community/guides/logging/logfmt/) is another viable alternative.

It may be necessary to adapt your logging strategy depending on the environment.
During development, you can optimize for readability with colorful,
human-friendly formatting, while switching to a structured output in production.
Most logging frameworks offer configuration options to automate this transition.

### 2. Adopt a structured logging framework

The next step is to [incorporate a logging framework](https://betterstack.com/community/guides/logging/logging-framework/) that
supports outputting application log data in your preferred structured format.
Popular options include [Log4j](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/) for Java,
[Serilog](https://betterstack.com/community/guides/logging/how-to-start-logging-with-serilog/) for .NET,
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) for
Node.js, and [Slog](https://betterstack.com/community/guides/logging/logging-in-go/) for Go.

Afterward, set up the framework to produce logs in the chosen structured format.
Configure log levels, output destinations, and any additional settings required.
If you have existing unstructured instrumentation, you'll need to transition to
the new instrumentation over time.

It's often as simple as changing something like this:

```go
log.Printf("Error processing request ID %s: %v\n", r.ID, err)
```

To this:

```go
slog.Error("Error processing request", slog.String("request_id", r.ID),
    slog.Any("err_msg", err))
```

When converting unstructured entries into structured ones, ensure to include
each contextual property in its own attribute.

### 3. Configure your log sources

Once you've instrumented your applications to emit structured logs, you'll need
to configure the other components and services that generate logs in your
infrastructure as well.

This can range from dependencies like [Nginx](https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/) or [PostgreSQL](https://betterstack.com/community/guides/logging/how-to-start-logging-with-postgresql/) to cloud services like
[AWS Lambda](https://betterstack.com/community/guides/logging/aws-lambda-logging/). Ensure to look for the instrumentation they provide, and configure
them to output structured data if possible.

![Configure JSON logging in AWS Lambda](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f9aa5232-0b51-4ad9-a375-d1c5f6891d00/md1x
=1678x682)

### 4. Convert unstructured logs to structured data

When dealing with dependencies that do not offer a way to output structured
data, you can utilize log parsing tools or write custom scripts to transform
unstructured log entries into your chosen structured format.

This involves identifying relevant patterns and extracting key information from
the unstructured text, such as timestamps, log levels, messages, and contextual
data, then mapping them to the corresponding fields in your structured log
schema.

This technique also helps with converting log records from other structured or
semi-structured formats to your preferred one. For example,
[Vector](https://betterstack.com/community/guides/logging/vector-explained/) provides a `parse_logfmt()` function that can
transform [Logfmt](https://betterstack.com/community/guides/logging/logfmt/) entries to JSON:

```text
parse_logfmt!(
 "timestamp=2024-06-16T17:39:00+01:00 level=info log_type=application http_method=POST http_path=/api/orders duration=0.235 db_duration=0.120 db_num_queries=5 user=usr_456 status=201"
)
```

```json
[output]
{
  "timestamp": "2024-06-16T17:39:00+01:00",
  "level": "info",
  "log_type": "application",
  "http_method": "POST",
  "http_path": "/api/orders",
  "duration": 0.235,
  "db_duration": 0.120,
  "db_num_queries": 5,
  "user": "usr_456",
  "status": 201
}
```

While this step requires some initial effort, it allows you to leverage the
benefits of structured logging even when dealing with legacy systems or
components that lack native support.

### 5. Establish an attribute schema

Imagine a scenario where two services generate structured logs with varied
attribute names. Service A might log timestamps as `time` in UNIX format, while
Service B uses `timestamp` in ISO-8601 format. Similarly, Service A might log
error codes as `error_code` while Service B uses a nested attribute like
`error.code`.

When troubleshooting an issue spanning both services, you'd have to write
queries that account for these discrepancies, potentially leading to missed data
or incorrect correlations. For instance, searching for errors might require a
query like:

```text
(service_name = "Service A" AND error_code = "TimeoutError") OR (service_name = "Service B" AND error.code = "TimeoutError")
```

By establishing a unified schema, you could standardize attribute names and
values across all your log sources so that the timestamps are always recorded as
ISO-8601 in the `timestamp` field and error codes are placed in the `error_code`
field. This harmonization of data attributes facilitates seamless correlation
and cross-analysis of log data, regardless of its origin.

Now, a single query like this would suffice to find all errors of a given type:

```text
error_code = TimeoutError
```

It's important not to get bogged down in perfecting your schema from the start.
Focus on converting a few services to structured logging, then refine your
schema based on practical experience.

### 6. Normalize your log data

Log data normalization is standardizing log messages from different sources into
a consistent format. It involves mapping various field names and structures into
a unified schema to ensure that similar data points are uniformly represented
across all logs.

It is a crucial step when processing log data from sources you do not control so
that inconsistencies in their attribute representations are consolidated into a
single data model according to your defined schema.

This is usually done by employing log normalization tools or middleware that map
fields and values from different log sources to a unified schema before they are
sent to the centralized data store. Examples of such tools include
[Logstash](https://betterstack.com/community/guides/logging/logstash-explained/), [Vector](https://vector.dev/), and
[Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/).

## Best practices for structured logging

Structured logging is about making everyone's life easier when things go wrong
(and let's face it, they sometimes do). We've already discussed the benefits, so
let's dive into some concrete recommendations to guide your instrumentation
efforts next:

1. Ensure to tag each incoming request with a unique ID and propagate it across
   all log records generated from that request. This makes it easy to isolate
   all the logs pertaining to each request made to your services.

2. Enrich each log event with sufficient contextual attributes to facilitate
   analysis and correlation. Remember that [observability requires high
   cardinality data](https://betterstack.com/community/guides/observability/high-cardinality-observability/) so each additional
   attribute you include provides a different way to slice and dice your data
   during analysis.

3. Ensure you enforce a standard log schema for all your log sources as soon as
   possible.
   [OpenTelemetry's Semantic Conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/)
   is some notable work in this area.

4. Specify units directly within attribute names (e.g., `response_time_ms`,
   `memory_usage_kb`) to prevent ambiguity.

5. Include descriptive log messages in each log record so that it is easily
   interpreted by humans who are perusing the logs.

6. When logging error details, structure the included stack trace if possible.

   ```json
   {
     "msg": "Cannot divide one by zero!",
     "level": "error",
     "timestamp": "2023-07-31T07:00:31.526266Z",
     "exception": [
       {
         "exc_type": "ZeroDivisionError",
         "exc_value": "division by zero",
         "syntax_error": null,
         "is_cause": false,
         "frames": [
           {
             "filename": "/home/betterstack/structlog_demo/app.py",
             "lineno": 16,
             "name": "<module>",
             "line": "",
             "locals": {
               "__name__": "__main__",
               "__doc__": "None",
               "__package__": "None",
               "__loader__": "<_frozen_importlib_external.SourceFileLoader object at 0xffffaa2f3410>",
               "__spec__": "None",
               "__annotations__": "{}",
               "__builtins__": "<module 'builtins' (built-in)>",
               "__file__": "/home/betterstack/structlog_demo/app.py",
               "__cached__": "None",
               "structlog": "\"<module 'structlog' from '/home/betterstack/structlog_demo/venv/lib/python3.11/site-\"+32",
               "logger": "'<BoundLoggerLazyProxy(logger=None, wrapper_class=None, processors=None, context_'+55"
             }
           }
         ]
       }
     ]
   }
   ```

**Learn more**: [Logging Best Practices: 12 Dos and
Don'ts](https://betterstack.com/community/guides/logging/logging-best-practices/)

## You've structured your logs. Now do something useful with them

Once you're generating a steady stream of structured log data, you must not let
them gather dust in a log file but unlock their full potential by feeding them
into a log management tool that allows you to query, correlate, and visualize
your data across all dimensions.

In particular, use a tool like [Better Stack](https://betterstack.com/logs) that
is equipped with columnar storage technology to effortlessly handle the
high-cardinality queries required for achieving observability.

![Better Stack Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5a4ed280-77cd-408e-b36e-0df91bd4a200/public
=2376x1504)

## Final thoughts

To achieve true observability, you need the ability to analyze your data across
various dimensions, allowing you to address any questions that arise during the
debugging process.

Unstructured logs are inadequate as a foundation for observability. However,
when transformed into structured data with high cardinality and dimensionality,
they become immensely valuable for understanding the different (and often novel)
states your application can reach.

I hope this article has demonstrated the importance of structured logging and
provided a guide on implementing it. For more information on [logging](https://betterstack.com/community/guides/logging/)
and [observability](https://betterstack.com/community/guides/observability/), refer to our linked guides.

Thanks for reading, and happy logging!