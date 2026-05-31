# A Beginner's Guide to JSON Logging

Software logs used to be written for humans using APIs like the classic
`printf()`. However, with automated log analysis on the rise, those unstructured
messages have become a real headache. They lack consistency, change often, and
may be missing important data.

That's why developers are turning to JSON for logging. It's a familiar and
widely supported structured format that plays nicely with modern log analysis tools,
facilitating a much deeper level of insight than was possible in the past.

In this article, we'll dive into JSON logging: the benefits, how to do it, and
best practices to make your logs truly powerful. Let's jump right in!


## What is JSON?

[JSON](https://en.wikipedia.org/wiki/JSON) (JavaScript Object Notation) is a
versatile data format derived from a subset of the JavaScript programming
language.

While inspired by JavaScript syntax, JSON's usefulness extends far beyond its
namesake language. It's unique blend of human readability, machine parsability,
and language-agnosticism have made it the go-to format for data exchange across
web applications, servers, and diverse systems.

## What is JSON logging?

JSON logging is the recording of log entries as structured JSON objects. This
approach makes log data easy to parse and analyze with various log management
systems, analytics tools, and other software applications.

Consider a traditional log entry from an [Apache
server](https://betterstack.com/community/guides/logging/how-to-view-and-configure-apache-access-and-error-logs/), which typically
follows the
[Common Log Format](https://en.wikipedia.org/wiki/Common_Log_Format):

```text
127.0.0.1 alice Alice [06/May/2021:11:26:42 +0200] "GET / HTTP/1.1" 200 3477
```

While decipherable, its format doesn't lend itself to easy correlation with
other log data. The same entry in JSON would look like this:

```json
{
  "ip_address": "127.0.0.1",
  "user_id": "alice",
  "username": "Alice",
  "timestamp": "06/May/2021:11:26:42 +0200",
  "request_method": "GET",
  "request_url": "/",
  "protocol": "HTTP/1.1",
  "status_code": 200,
  "response_size_bytes": 3477
}
```

The JSON version is a bit more verbose, but the key/value pairs make pinpointing
specific information (like the IP address or status code) quick and intuitive.

[summary]

## Better Stack Live Tail: Filter by patterns and services

Want to troubleshoot in real time? This short Better Stack video shows how Live Tail helps you find logs faster with pattern filtering and service discovery. 

<iframe width="100%" height="315" src="https://www.youtube.com/embed/eIDUt0osO14" title="Better Stack Live Tail: Filter by patterns and services" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Benefits of logging in JSON

Choosing JSON for your logging offers several significant advantages, especially
when it comes to the analysis and management of log data in today's complex
systems. Here's why:

### 1. It is easy for humans and machines to understand

JSON's structure is simple and familiar to most developers. By presenting log
data in key/value pairs, each log entry remains grokkable by humans, and
parsable by log analysis tooling just like any other JSON data.

### 2. It is resilient to changes in log schema

Changes to log data, such as adding or modifying fields, can often complicate
unstructured or semi-structured logging formats. This is because these formats
aren't very adaptable, typically requiring updates to the parsing scripts or
regular expressions used for log analysis.

JSON shines because its flexibility lets you add or remove fields without
causing headaches. This adaptability makes it perfect for applications whose log
data might evolve.

### 3. It facilitates true observability

Having [observability](https://betterstack.com/community/guides/observability/what-is-observability/) means that you can drill down into
your data from any angle to find the root cause of issues.

Structured JSON logs play a key role in achieving true observability by
providing the rich, contextual data needed to understand the complete system
state at the time of any event (for optimal results, see
[best practices](#best-practices-for-json-logging)).

## Drawbacks to logging in JSON

While JSON offers many benefits, there are some trade-offs to consider:

### 1. Readability in development environments

Raw JSON logs, with their curly braces and punctuation, can be visually dense
which might hinder quick at-a-glance insights during development.

![Screenshot of a JSON log](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3259fddd-7cc0-4712-35e9-792e9751e100/lg1x
=2078x640)

This readability issue can be effectively addressed using tools like
[jq](https://jqlang.github.io/jq/), which formats the output by placing each
property on its own line and adding color coding for keys and values.

![Screenshot of a formatted JSON log](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0ea1f102-01ed-4df0-e16c-7760d1477400/lg1x
=2092x916)

An alternative approach is using a more human-readable format like
[Logfmt](https://betterstack.com/community/guides/logging/logfmt/) in development environments, while keeping JSON logs in
production. This can often be managed through environment variables, allowing
for easy switching between formats.

![Screenshot of Logfmt](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ce4a4bce-51cc-4478-27f3-84a48575ba00/md1x
=2092x916)

### 2. Increased storage requirements

JSON logs can be slightly larger in file size compared to some more compact
formats, but this is a minor concern with modern storage and compression
algorithms.

### 3. Processing overhead

There is a slight performance impact when generating and parsing JSON. However,
for most applications, this overhead is negligible compared to the analysis
benefits.

## How to log in JSON

Now that you're aware of the benefits and potential drawbacks of JSON logging,
let's explore the main approaches for generating JSON logs in production
systems:

### 1. Using a structured logging framework

For applications, the easiest way to generate JSON logs is by using a logging
framework that supports JSON output natively. Many programming languages offer
excellent third-party libraries; some are even starting to include structured
JSON logging in their standard libraries.

Here's a Python example that uses the [Structlog package](https://betterstack.com/community/guides/logging/structlog/) to produce
structured JSON logs:

```go
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.EventRenamer("msg"),
        structlog.processors.JSONRenderer(),
    ]
)

logger = structlog.get_logger()
logger.info("image uploaded", name="image.jpg", size_bytes=2382)
```

This produces clear, parsable JSON output:

```json
[output]
{
  "name": "image.jpg",
  "size_bytes": 2382,
  "timestamp": "2023-11-30T04:07:41.746806Z",
  "level": "info",
  "msg": "image uploaded"
}
```

To find the right logging framework for your programming language of choice,
refer to our comparison articles below:

- [Node.js](https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/)
- [Go](https://betterstack.com/community/guides/logging/best-golang-logging-libraries/)
- [Java](https://betterstack.com/community/guides/logging/best-java-logging-libraries/)
- [Python](https://betterstack.com/community/guides/logging/best-python-logging-libraries/)
- [PHP](https://betterstack.com/community/guides/logging/best-php-logging-libraries/)
- [Ruby](https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/)
- [.NET](https://betterstack.com/community/guides/logging/best-dotnet-logging-libraries/)

**Learn more**: [8 Factors for Choosing a Logging Framework](https://betterstack.com/community/guides/logging/logging-framework/)

### 2. Configuring your dependencies

It's worth exploring the documentation for the other dependencies you use. You
might be surprised to find they can also generate JSON logs!

A classic example is PostgreSQL, which [generates
logs](https://betterstack.com/community/guides/logging/how-to-start-logging-with-postgresql/) in a traditional textual format by
default:

```text
2023-07-30 08:31:50.628 UTC [2176] postgres@chinook LOG:  statement: select albumid, title from album where artistid = 2;
```

However, from version 15 onwards, PostgreSQL offers a built-in option for
structured JSON logging. A simple change in `postgresql.conf` does the trick:

```text
[label /etc/postgresql/15/main/postgresql.conf]
log_destination = 'jsonlog'
```

Now your PostgreSQL logs will look like this:

```json
{
  "timestamp": "2023-07-30 22:48:01.817 UTC",
  "user": "postgres",
  "dbname": "chinook",
  "pid": 18254,
  "remote_host": "[local]",
  "session_id": "64c6e836.474e",
  "line_num": 1,
  "ps": "idle",
  "session_start": "2023-07-30 22:46:14 UTC",
  "vxid": "4/3",
  "txid": 0,
  "error_severity": "LOG",
  "message": "statement: SHOW data_directory;",
  "application_name": "psql",
  "backend_type": "client backend",
  "query_id": 0
}
```

This structured format makes parsing and analyzing your database logs
significantly easier, especially when paired with [log management
tools](https://betterstack.com/community/comparisons/log-management-and-aggregation-tools/).

### 3. Parsing unstructured logs to JSON

If you can't generate JSON logs directly from the source, don't worry! [Log
aggregation tools](https://betterstack.com/community/guides/logging/log-shippers-explained/) can help with parsing such
unstructured or semi-structured data and convert them into JSON.

This conversion process typically involves identifying individual elements
within each log message (often using regular expressions) and then mapping these
elements to specific JSON keys.

Let's say you have [Nginx error
logs](https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/) in their default
format:

```text
2021/04/01 13:02:31 [error] 31#31: *1 open() "/usr/share/nginx/html/not-found" failed (2: No such file or directory), client: 172.17.0.1, server: localhost, request: "POST /not-found HTTP/1.1", host: "localhost:8081"
```

Using a tool like [Vector](https://betterstack.com/community/guides/logging/vector-explained/), you can transform this into JSON:

```json
{
  "cid": 1,
  "client": "172.17.0.1",
  "host": "localhost:8081",
  "message": "open() \"/usr/share/nginx/html/not-found\" failed (2: No such file or directory)",
  "pid": 31,
  "request": "POST /not-found HTTP/1.1",
  "server": "localhost",
  "severity": "error",
  "tid": 31,
  "timestamp": "2021-04-01T13:02:31Z"
}
```

This can be achieved using the configuration below. The basic idea is that it
uses Vector's `parse_nginx_log()` function to parse the error logs and turn them
into structured JSON. For further details, please refer to
[Vector's documentation](https://vector.dev/docs/reference/vrl/functions/#parse_nginx_log)

```toml
[label /etc/vector/vector.toml]
[sources.nginx_error]
type = "file"
include = ["/var/log/nginx/error.log"]
read_from = "end"

[transforms.nginx_error_to_json]
type = "remap"
inputs = [ "nginx_error" ]
[highlight]
source = """
structured, err = parse_nginx_log(.message, "error")
if err != null {
        log("Unable to parse Nginx log: " + err, level: "error")
} else {
        . = merge(., structured)
}
"""
[/highlight]

[sinks.print]
type = "console"
inputs = ["nginx_error_to_json"]
encoding.codec = "json"
```

Once all your logs are in JSON, correlating and analyzing them with other
structured data becomes much easier!

[summary]

### Better Stack: Parse logs into structured JSON with Vector

If you plan to convert Nginx or other text logs into JSON, this Better Stack video is a solid primer on using Vector as an agent and aggregator.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/8NMpHrVnJes" title="Better Stack video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Best practices for JSON logging

To get the most out of your JSON logs, keep these best practices in mind:

### 1. Maintain a uniform logging schema

A consistent schema is essential for making the most of your JSON logs. By
ensuring that field names remain the same across all your services, you'll
streamline data querying and analysis. For example, you can choose a standard
field name for logging user IDs such as `user_id` or `userID` and stick to it
throughout your production environment.

If you're using logs from third-party applications where you can't control the
field names, a log shipper can help you transform and standardize the names to
match your schema before the logs reach your management system. This keeps the
data consistent, even when it comes from diverse sources.

**Learn more**: [What is Log Aggregation? Getting Started and Best
Practices](https://betterstack.com/community/guides/logging/log-aggregation/)

### 2. Specify units in numerical field names

Make your numerical data instantly understandable by including units directly in
the field names. Instead of using a generic field like `duration`, use
`duration_secs` or `duration_msecs`. This removes any chance of
misinterpretation and makes your logs clear for both humans and analysis tools.

### 3. Format exception stack traces as JSON

When errors occur, their stack traces (which show the chain of functions that
led to the problem) are often logged as plain text. This can be hard to read and
analyze. Here's an example:

```json
{
  "message": "Application failed to execute database query",
  "timestamp": "2022-03-31T13:32:33.928188+00:00",
  "logger": "__main__",
  "level": "error",
[highlight]
  "exception": "Traceback (most recent call last):\n  File \"app.py\", line 50, in execute_query\n    results = database.query(sql_query)\n  File \"database.py\", line 34, in query\n    raise DatabaseException(\"Failed to execute query\")\nDatabaseException: Failed to execute query"
[/highlight]
}
```

If possible, parse the entire stack trace into an hierarchy of attributes like
file names, line numbers, methods, and error messages:

```json
{
  "message": "Application failed to execute database query",
  "timestamp": "2022-03-31T13:32:33.928188+00:00",
  "logger": "__main__",
  "level": "error",
[highlight]
  "exception": {
    "type": "DatabaseException",
    "message": "Failed to execute query",
    "trace": [
      {
        "file": "app.py",
        "line": 50,
        "method": "execute_query"
      },
      {
        "file": "database.py",
        "line": 34,
        "method": "query"
      }
    ]
  }
[/highlight]
}
```

With this structure, log analysis tools can easily pull out the error type,
message, or specific lines in the code.

Python's [Structlog](https://betterstack.com/community/guides/logging/structlog/) and Go's [Zerolog](https://betterstack.com/community/guides/logging/zerolog/) are two notable
logging frameworks that provide the ability to output a structured error stack
trace out of the box.

### 4. Enrich logs with contextual information

One of the key advantages of JSON logging is the ability to enrich log entries
with extensive contextual information about what is being logged. This provides
clarity about the immediate context of a log event and supports much deeper
analysis when correlating data across different logs.

Go beyond just recording _what happened_ – log the context that will you answer
the _why_. Include user and session identifiers, error messages, and other
details that will shed light on the root cause of problems.

```json
{
  "timestamp": "2023-11-30T15:45:12.123Z",
  "level": "info",
  "message": "User login failed",
  "user_id": "123456",
  "username": "johndoe",
  "session": {
    "id": "abc123xyz",
    "ip": "192.168.1.10",
    "device": "iPhone 13, iOS 15.4",
    "location": "New York, USA"
  },
  "service": {
    "name": "UserAuthenticationService",
    "version": "1.2.0",
    "host": "auth-server-01"
  },
  "request": {
    "path": "/login",
    "status": 401,
    "duration_ms": 200
  }
}
```

### 5. Centralize and monitor your JSON logs

In today's complex systems, keeping JSON logs scattered is a recipe for
troubleshooting chaos. A centralized log management system transforms this chaos
into order, offering several powerful benefits:

- **Single source of truth**: Manually sifting through mountains of log files is
  neither efficient nor scalable. A central repository means no more hunting for
  log files across servers or applications.

- **Unlocking "unknown unknowns"**: The structured nature of JSON, paired with a
  powerful analysis tool, allows you to find patterns, correlations, and
  anomalies you might never have noticed in raw text logs.

- **Targeted alerting**: You can set up alerts based on specific JSON fields,
  values, and even a combination of events across multiple entries ensuring
  you're promptly notified of critical events when they occur.

![level-error-message-request-url-search-Better-Stack.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0b2fb4b2-4cf0-4d74-6de5-5d39ccc70800/public=1533x1016)

[Better Stack](https://betterstack.com/logs) provides a user-friendly log
analysis and observability platform specifically designed to make managing JSON
logs effortless.

It automatically understands the structure of your logs, making it simple to
search, sort, and filter log entries. Need to dive deeper? Advanced querying
with SQL lets you pinpoint the exact data you're looking for, and collaborative
features

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


You can also visualize your log data with customizable dashboards, and generate
tailored reports to track the events that matter most, while setting up alerting
so you can take immediate action when issues arise.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


[Start for free today](https://telemetry.betterstack.com/users/sign-up) and use
Better Stack to uncover the hidden insights in your JSON logs!

## Final thoughts

You've seen how JSON logging can streamline analysis and troubleshooting. If
you're ready to take the plunge, the resources we discussed will help you
implement it seamlessly.

Want to go even further? Check out our other [logging guides](https://betterstack.com/community/guides/logging/) for more
strategies to get the most from your logs.

Thanks for reading, and happy logging!