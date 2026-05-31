# Log Formatting in Production: 9 Best Practices

Log formatting plays an important role in capturing and organizing various
application event details. It encompasses concerns such as:

- Structuring each log entry for clarity and consistency,
- Choosing the encoding method for logs,
- Strategically including and organizing contextual fields within logs,
- Defining how individual log records are separated or delimited.

Sifting through poorly formatted logs will only lead to frustration akin to
finding a needle in a haystack. Therefore, prioritizing proper log formatting is
essential to enhance the effectiveness of your logging strategy, and it paves
the way for more efficient log analysis and management.

Before discussing specific
[formatting guidelines](#log-formatting-best-practices-impact-vs-difficulty),
let's take a brief look at the three main categories of log formats.


[summary]
## Side note: See your structured logs in action

Head over to [Better Stack](https://betterstack.com/logs) and watch your JSON logs transform into filterable, searchable data in real-time with our live tail feature.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Types of log formats

![log-formats-explained.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7884e45c-fdbe-4444-2ed8-491d37999b00/lg1x
=1700x1000)

When it comes to formatting application logs, there are three primary
approaches:

### 1. Unstructured logging

Unstructured logs are the freeform artists of the logging world. They defy
predefined formats to offer flexibility and ease of reading in development.

Consider these examples:

```text
1687927940843: Starting application on port 3000
Encountered an unexpected error while backing up the database
[2023-06-28T04:49:48.113Z]: Device XYZ123 went offline
```

Each entry tells a story, but without a consistent structure or sufficient
context. The lack of a uniform format means that as your application scales,
troubleshooting specific issues using these logs becomes an Herculean task.

Command-line tools like `sed`, `awk`, and `grep` can help filter messages or
extract key information, but this is more of a makeshift solution than a
sustainable one.

### 2. Semi-structured logging

Semi-structured logs are a step up from unstructured logs. They maintain some
semblance of structure, but they often lack a recognizable format. For instance,
consider the following records:

```text
[output]
2023-06-28 19:09:48.801818 I [969609:60] MyApp -- Starting application on port 3000
2023-06-28 19:09:48.801844 I [969609:60] MyApp -- Device XYZ123 went offline
2023-06-28 19:09:48.801851 E [969609:60 main.rb:13] MyApp -- Service "ABCDE" stopped unexpectedly. Restarting the service
```

In each entry, elements like the timestamp, log level, process and thread IDs,
and application name are standardized, but the log message retains a flexible,
narrative style that embeds all other contextual details.

### 3. Structured logging

Structured logging is a contemporary and highly effective approach to logging.
Each log entry adheres to a recognizable and consistent format that facilitates
automated searching, analysis, and monitoring using log management tools.

The most widely embraced structured format is JSON:

```json
{
  "host": "fedora",
  "application": "Semantic Logger",
  "timestamp": "2023-06-28T17:20:19.409882Z",
  "level": "info",
  "level_index": 2,
  "pid": 982617,
  "thread": "60",
  "name": "MyApp",
  "message": "Starting application on port 3000"
}
```

Structured log entries present well-defined fields and values that capture
precise information about the logged event or message.

The main downside to structured logging is reduced human-readability, which is
essential in development environments.

This can usually be resolved by configuring your framework to output a
semi-structured and colorized format in development, while defaulting to JSON
output in production.

![Screenshot from 2023-07-23 15-48-51.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb795c37-5b36-4e1f-55e5-dad292972700/public
=2702x1758)

## Log formatting best practices: impact vs. difficulty

To enhance the utility of your logs, begin by adjusting the format of the data
included in each log entry. Below are nine practices to follow for more
effective logging:

|                                            | Impact     | Difficulty |
| ------------------------------------------ | ---------- | ---------- |
| Use structured JSON logging                | ⭐⭐⭐⭐⭐ | ⭐⭐       |
| Standardize on string-based log levels     | ⭐⭐⭐     | ⭐         |
| Log timestamps as ISO-8601                 | ⭐⭐⭐⭐   | ⭐⭐       |
| Include log source information             | ⭐⭐⭐     | ⭐         |
| Add the build version or Git commit hash   | ⭐⭐⭐     | ⭐         |
| Capture a stack trace when logging errors  | ⭐⭐⭐⭐⭐ | ⭐         |
| Standardize your contextual fields         | ⭐⭐⭐     | ⭐⭐⭐     |
| Use a correlation ID to group related logs | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Selectively log object fields              | ⭐⭐⭐     | ⭐⭐⭐     |

## 1. Use structured JSON logging

The easiest way to generate structured logs is to [adopt a
framework](https://betterstack.com/community/guides/logging/logging-framework/) that provides this ability natively or through a
plugin. Most frameworks support this requirement, and many modern libraries even
default to it. Here's an example of [structured logging in Go](https://betterstack.com/community/guides/logging/logging-in-go/):

```go
package main

import (
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	logger.Info("an info message")
}
```

```json
[output]
{"time":"2023-09-14T11:49:17.671587229+02:00","level":"INFO","msg":"an info message"}
```

Your application dependencies can also usually be configured to produce
structured logs. For instance, both
[PostgreSQL](https://betterstack.com/community/guides/logging/how-to-start-logging-with-postgresql/) and
[Nginx](https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/) support logging
in JSON format:

```text
[label /etc/nginx/nginx.conf]
. . .

http {
  log_format custom_json escape=json
  '{'
    '"timestamp":"$time_iso8601",'
    '"pid":"$pid",'
    '"remote_addr":"$remote_addr",'
    '"remote_user":"$remote_user",'
    '"request":"$request",'
    '"status": "$status",'
    '"body_bytes_sent":"$body_bytes_sent",'
    '"request_time_ms":"$request_time",'
    '"http_referrer":"$http_referer",'
    '"http_user_agent":"$http_user_agent"'
  '}';

  access_log /var/log/nginx/access.json custom_json;
}
```

With the above Nginx access log configuration, you'll go from the archaic
Combined Log Format representation:

```text
127.0.0.1 alice Alice [07/May/2021:10:44:53 +0200] "GET / HTTP/1.1" 200 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4531.93 Safari/537.36"
```

To one with clearly defined fields:

```json
{
  "timestamp": "2023-09-06T15:13:11+00:00",
  "pid":"8",
  "remote_addr": "217.138.222.109",
  "remote_user": "",
  "request": "GET /icons/ubuntu-logo.png HTTP/1.1",
  "status": "404",
  "body_bytes_sent": "197",
  "request_time_ms": "0.000",
  "http_referrer": "http://192.168.100.1/",
  "http_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36"
}
```

## 2. Standardize on string-based log levels

[Log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) signify the recorded event's severity, and
logging frameworks usually represent these levels internally with integers. For
instance, here are Go's default levels and their integer representations:

```json
{
  debug: -4,
  info: 0,
  warn: 4,
  error: 8,
}
```

Usually, the level is emitted as strings for clarity regardless of their
internal representations:

```json
{"level":"INFO","time":"2023-03-15T13:07:39.105777557+01:00","msg":"Info message"}
```

However, some frameworks like Node.js's
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) use their
integer representations directly:

```json
{"level":60,"time":1643664517737,"msg":"Fatal message"}
```

In Pino, `60` corresponds to the `FATAL` level, per this schema:

```json
{
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}
```

To minimize confusion and ensure log uniformity across all the applications in
your environment, it's better to normalize log formatting to always use string
levels.

This approach mitigates ambiguity arising from differing interpretations of
integer levels in various languages.

**Learn more**: [Log Levels Explained and How to Use Them](https://betterstack.com/community/guides/logging/log-levels-explained/)

## 3. Record timestamps as ISO-8601

When formatting timestamps, I recommend using the
[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format (or its stricter
counterpart, [RFC 3339](https://tools.ietf.org/html/rfc3339)) as it provides a
human-readable and unambiguous representation of the date and time (up to
nanosecond precision) with optional timezone information.

Some examples:

```text
2023-09-10T12:34:56.123456789Z
2023-09-10T12:34:56+02:00
2023-11-17T12:34:56.123456789+01:00
```

Ensure your timestamps are normalized to location-independent universal time
(UTC) to establish a standard reference across all your services. If the
location is relevant, offset the time zone accordingly.

## 4. Include detailed log source information

Every log entry should contain information about its source or origin to help
identify where it was generated. Typically, logging frameworks can automatically
include the source file, line number, and function in the log with minimal
setup:

```json
{
  "time": "2023-05-24T19:39:27.005Z",
  "level": "DEBUG",
[highlight]
  "source": {
    "function": "main.main",
    "file": "app/main.go",
    "line": 30
  },
[/highlight]
  "msg": "Debug message"
}
```

In general, include whatever information helps you quickly pinpoint where the
log message originated. In distributed systems, the hostname, container ID, and
other relevant identifiers can also be immensely valuable for identifying issues
on specific nodes.

[ad-logs]

## 5. Include the build version or commit hash

Incorporating the build version number or commit hash into your log entries
associates logs with a specific version of your application. This connection is
crucial for reproducing and troubleshooting issues, as it allows you to identify
the exact state of your project when the log was generated.

As codebases evolve, source information like function names and line numbers may
change, making correlating logs with the updated code challenging. Including
version information resolves this by providing a clear reference point.

Consider this log entry example:

```json
{
  "time": "2023-05-24T19:39:27.005Z",
  "level": "ERROR",
  "source": {
    "function": "main.main",
    "file": "app/main.go",
    "line": 30
  },
  "msg": "Something unexpected happened"
}

```

If the associated code is refactored or relocated, matching this log with the
current codebase could be confusing. However, with the application version or
commit hash included, you can quickly revert to the specific state of the
project (using commands like git checkout) for a more accurate investigation.

Another relevant detail is the compiler or runtime version used to compile or
execute the program. This can also help ensure perfect reproducibility when
investigating problems in the code.

```json
[output]
{
  "time": "2023-06-29T06:37:38.429463999+02:00",
  "level": "ERROR",
  "source": {
    "function": "main.main",
    "file": "app/main.go",
    "line": 38
  },
  "msg": "an unexpected error",
[highlight]
  "build_info": {
    "go_version": "go1.20.2",
    "commit_hash": "9b0695e1c4732a2ea2c8ac678472c4c3c235101b"
  }
[/highlight]
}
```

## 6. Ensure stack traces are included in error logs

Including stack traces in your error logs is necessary for swiftly pinpointing
the problem's source. Most well-designed frameworks will automatically capture
stack trace details for exceptions, but some may need extra configuration or
additional packages.

Here's an example of a stack trace produced by [Python's standard logging
module](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/) coupled with
[python-json-logger](https://github.com/madzak/python-json-logger):

```json
{
  "name": "__main__",
  "timestamp": "2023-02-06T09:28:54Z",
  "severity": "ERROR",
  "filename": "example.py",
  "lineno": 26,
  "process": 913135,
  "message": "division by zero",
  "exc_info": "Traceback (most recent call last):\n  File \"/home/betterstack/community/python-logging/example.py\", line 24, in <module>\n    1 / 0\n    ~~^~~\nZeroDivisionError: division by zero"
}
```

The entire stack trace is included as a string property in this instance. Some
frameworks such as [Structlog](https://betterstack.com/community/guides/logging/structlog/), support structured stack traces in
JSON format, which is highly preferable:

```json
{
  "event": "Cannot divide one by zero!",
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

Where possible, prefer a structured stack trace as above but a large string
block is better than nothing.

## 7. Standardize your contextual fields

To make your log messages more informative and actionable, you need to add
contextual fields to your log messages. These fields should help answer key
questions about each logged event such as what happened, when, where, why, and
the responsible entity.

In the past, logging APIs typically required embedding contextual details
directly into the log message string:

```go
log.Println("User '" + user.id + "' logged in")
```

This approach has a few downsides:

- Inefficient string formatting could occur even if the log is ultimately
  ignored.
- Extracting the data from the formatted message is often challenging.
- You have to manually add contextual details to each log message.

Instead, log contextual information as key/value pairs:

```go
slog.Info("User logged in", slog.Int("user_id", 42))
```

This results in logs that look like this:

```json
[output]
{
  "time": "2023-11-16T08:58:20.474534594+02:00",
  "level": "INFO",
  "msg": "User logged in",
  "user_id": 42
}
```

This approach also makes it easy to bind data attributes to your loggers to
ensure they are present in subsequent logging calls:

```go
l := slog.With(slog.Int("user_id", 42))

l.Info("user logged in")
l.Info("user deleted doc", slog.String("doc_id", "DOC-123"))
l.Info("user logged out")
```

This way, the `user_id` will be included in all subsequent log records:

```json
[output]
{
  "time": "2023-11-16T09:03:04.631228502+02:00",
  "level": "INFO",
  "msg": "user logged in",
  "user_id": 42
}
{
  "time": "2023-11-16T09:03:04.631353885+02:00",
  "level": "INFO",
  "msg": "user deleted doc",
  "user_id": 42,
  "doc_id": "DOC-123"
}
{
  "time": "2023-11-16T09:03:04.6313599+02:00",
  "level": "INFO",
  "msg": "user logged out",
  "user_id": 42
}
```

To maintain log consistency, establish standards for field names and content
types to help prevent situations where user IDs are logged as `user`, `user_id`,
or `userID` in various places.

Additionally, consider including units in field names for integer values (e.g.
`execution_time_ms` or `response_size_bytes`) to eliminate ambiguity.

## 8. Correlate your request logs with an ID

![Screenshot from 2023-09-14 22-41-18.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1d4040d8-bef1-44e3-99b7-4bbfe70bf200/md1x
=2172x1415)

A single log entry often represents just one event within a larger operation or
workflow. For instance, when handling an HTTP request, numerous log entries may
be generated at various stages of the request's lifecycle.

To better understand and collectively analyze these logs, including a
correlation ID that ties together all the log entries related to a specific
request is crucial.

Such IDs can be generated at the edge of your infrastructure and propagated
throughout the entire request lifecycle. This ensures each related log message
carries this identifier, enabling you to easily group and analyze logs from a
single request.

```json
{
  "timestamp": "2023-09-10T15:30:45.123456Z",
[highlight]
  "correlation_id": "9ea8f2b4-639e-4de7-b406-f6cd3a155e9f",
[/highlight]
  "level": "INFO",
  "message": "Received incoming HTTP request",
  "request": {
    "method": "GET",
    "path": "/api/resource",
    "remote_address": "192.168.1.100"
  }
}
```

## 9. Implement selective logging for your objects

To reduce the verbosity of your logs and safeguard against accidentally exposing
sensitive data, it's necessary to control which aspects of your custom
objects/structs are logged.

This is often achievable by implementing a method (usually `toString()`,
`String()`, or similar) in your objects that specifies which fields are safe to
log. By doing so, you can ensure that only necessary object fields are included
in your logs.

Here's an example using [Go's Slog package](https://pkg.go.dev/log/slog):

```go
type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
}

func (u *User) LogValue() slog.Value {
	return slog.StringValue(u.ID)
}
```

By implementing the `LogValuer` interface, you effectively control the logging
output of the `User` struct. Here, only the `ID` field will be included in the
log record whenever a `User` instance is logged.

This approach not only reduces log clutter but also prevents inadvertent logging
of sensitive fields (including those added in the future).

**Learn more**: [Best Logging Practices for Safeguarding Sensitive
Data](https://betterstack.com/community/guides/logging/sensitive-data/)

[summary]
## Side note: Visualize your structured logs in real-time

Stop using grep and regex. [Better Stack](https://betterstack.com/logs) transforms your structured JSON logs into interactive dashboards—filter by any field instantly, spot patterns at a glance, and track metrics that matter.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Final thoughts

Once you've started generating structured and well-formatted logs, the next step
is to [aggregate](https://betterstack.com/community/guides/logging/log-aggregation/) and centralize them in a log management
service that provides an easy way to filter, visualize, and set up alert rules
to promptly notify you about specific events or patterns that warrant attention.

For further reading on log management, read our [newest article](https://betterstack.com/community/guides/logging/log-management/). 

Sounds interesting? Spin up a free trial of
[Better Stack](https://betterstack.com/logs) to see how easy log analytics can
be.

Thanks for reading, and happy logging!
