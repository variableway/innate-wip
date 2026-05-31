# Introduction to Logfmt

In recent years, [structured logging](https://betterstack.com/community/guides/logging/log-formatting/) has established itself as
the predominant method for recording and organizing log data, a trend
underscored by the widespread adoption of JSON logging.

While JSON remains the most popular choice due to its versatility and
compatibility, Logfmt has emerged as a strong contender due to its simplicity
and easier readability for humans.

This article delves into the nuances of Logfmt, examining its structure and
syntax, and offering a comparative analysis with other structured formats,
particularly JSON.

Let's get started!

[ad-logs-small]

## What is Logfmt?

Logfmt is a logging format that first emerged at Heroku. It is notable for its
compact structure of `key=value` pairs and its popularity stems from being both
easily readable for humans and effortlessly parseable by machines.

In this format, each key/value pair is distinctly separated by a space, with an
equal sign (`=`) marking the division between a key and its associated value:

```text
level=INFO host=Ubuntu msg="Connected to PostgreSQL database"
```

Take the `level=INFO` pair in the example above: `level` is the key, and `INFO`
is its value, indicating the log entry's severity level.

[ad-logs]

## Handling nested data in Logfmt

To accommodate nested data within Logfmt, a dot notation can be utilized. This
approach simulates nested structures within the flat format of Logfmt. An
example of this notation is shown below:

```text
level=INFO host=Ubuntu msg="Application running smoothly" properties.status=OK
properties.details="No errors detected" properties.performance=Optimal
```

In this example, fields such as `status`, `details`, and `performance` are
conceptually nested under the `properties` prefix. This technique implies a
hierarchical relationship similar to nested objects in JSON:

```json
{
 "info": "INFO",
 "msg": "Application running smoothly",
[highlight]
  "properties": {
    "status": "OK",
    "details": "No errors detected",
    "performance": "Optimal"
  }
[/highlight]
}
```

It's important to note that most Logfmt implementations treat each key/value
pair independently, without recognizing any nested structure suggested by the
dot notation.

Take, for instance, the behavior of the well-known
[Logfmt JavaScript library](https://www.npmjs.com/package/logfmt) when parsing
our earlier example:

```javascript
import logfmt from 'logfmt';

console.log(
  logfmt.parse(
    'level=INFO host=Ubuntu msg="Application running smoothly" properties.status=OK properties.details="No errors detected" properties.performance=Optimal'
  )
);
```

```javascript
[output]
{
  level: 'INFO',
  host: 'Ubuntu',
  msg: 'Application running smoothly',
  'properties.status': 'OK',
  'properties.details': 'No errors detected',
  'properties.performance': 'Optimal'
}
```

This result demonstrates that while the dot notation can help in organizing and
conceptually grouping related data, Logfmt inherently treats such structures as
flat.

Therefore, Logfmt should not be used if your logging requirements heavily lean
towards representing and manipulating hierarchical data.

## Logfmt best practices

When implementing Logfmt in your applications, follow these guidelines for
optimal results:

- To avoid parsing ambiguity, don't use spaces in keys and opt for recognized
  naming conventions like [Snake Case](https://en.wikipedia.org/wiki/Snake_case)
  or [Camel Case](https://en.wikipedia.org/wiki/CamelCase).

- Your keys should only contain alphanumeric characters.

- Avoid using nested properties in Logfmt as it is designed to be a flat
  structure format.

- Terminate distinct log lines with a newline character (`\n`). Your [logging
  framework](https://betterstack.com/community/guides/logging/logging-framework/) should do this automatically.

- In development environments, colorize the keys to make the log lines easy to
  scan for humans.

![Screenshot from 2023-11-23 12-18-36.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dd6230a3-8965-4bb7-056b-805241738300/public =2380x844)

## Logfmt vs JSON

|                | JSON                                                                                        | Logfmt                                                         |
| -------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Format**     | Comprises key-value pairs within a map-like structure.                                      | Structured as key-value pairs within a map-like format.        |
| **Keys**       | Always enclosed within double quotes.                                                       | Displayed without quotes.                                      |
| **Parsing**    | Generally parsed using standard libraries available in most programming languages.          | Typically requires third-party libraries or tools for parsing. |
| **Separation** | Separates key-value pairs with commas.                                                      | Uses spaces to separate key-value pairs.                       |
| **Purpose**    | Highly versatile, used in various contexts like configuration files, web APIs, and logging. | Mainly employed for logging purposes.                          |
| **Nesting**    | Supports complex, hierarchical nesting of data.                                             | Does not inherently support nested data structures.            |

JSON is currently the most widely-used structured format for logs, offering a
high degree of flexibility and compatibility with various logging tools and
systems.

It is natively supported by most programming languages, and many logging tools
are designed to effortlessly ingest and process JSON log data out-of-the-box. It
also allows for nested data structures, making it ideal for complex or
hierarchical data.

However, JSON's verbosity can be a drawback compared to the more concise Logfmt.
The extensive use of braces, quotation marks around keys, and commas for
key-value pair separation results in visual clutter making JSON logs less
readable by humans, especially when dealing with large volumes of data.

Despite these challenges, its comprehensive structure and wide tooling support
often outweigh its verbosity, making it the preferred choice to satisfy most
[production logging requirements](https://betterstack.com/community/guides/logging/logging-best-practices/).

To get the best of both worlds, consider configuring your logging framework to
produce Logfmt output in development and JSON in production. Here's an example
using [Go's Slog package](https://betterstack.com/community/guides/logging/logging-in-go/):

```go
func main() {
    opts := &slog.HandlerOptions{
        Level: slog.LevelDebug,
    }

    var appEnv = os.Getenv("GO_ENV")

    [highlight]
    var handler slog.Handler = slog.NewTextHandler(os.Stdout, opts)
    if appEnv == "production" {
        handler = slog.NewJSONHandler(os.Stdout, opts)
    }
    [/highlight]

    logger := slog.New(handler)

	logger.Warn(
		"storage is 90% full",
		slog.String("available_space", "900.1 MB"),
	)
}
```

In development environments, you'll observe the following output:

```text
[output]
time=2023-11-23T13:00:04.365+02:00 level=WARN msg="storage is 90% full" available_space="900.1 MB"
```

When `GO_ENV` is set to `production`, then a JSON output will be produced
instead:

```json
[output]
{
  "time": "2023-11-23T13:01:12.745540888+02:00",
  "level": "WARN",
  "msg": "storage is 90% full",
  "available_space": "900.1 MB"
}
```

## Logfmt implementations

A variety of modules or libraries are available in most programming languages to
facilitate reading, parsing, and generating Logfmt entries. Some prominent
examples are:

- [Node.js](https://www.npmjs.com/package/logfmt)
- [Java](https://github.com/computablefacts/logfmt)
- [Python](https://github.com/jteppinette/python-logfmter)
- [Go](https://pkg.go.dev/log/slog)
- [Elixir](https://github.com/jclem/logfmt-elixir)
- [Ruby](https://github.com/cyberdelia/logfmt-ruby)
- [Rust](https://github.com/brandur/logfmt)
- [Clojure](https://github.com/yeller/logfmt)
- [Erlang](https://github.com/tsloughter/logfmt-erlang)
- [Haskell](https://github.com/aymanosman/logfmt)
- [Dart](https://github.com/jclem/logfmt-dart)
- [PHP](https://github.com/petert82/monolog-logfmt)
- [Swift](https://github.com/mjm/LogfmtEncoder)
- [.NET](https://github.com/khaines/logfmt.net)

## Final thoughts

In this piece, we've explored the Logfmt format, delving into its strengths and
drawbacks when compared to JSON, the leading structured logging format.

To begin implementing Logfmt in your application, refer to the library resources
mentioned earlier.

For further exploration, consider browsing our extensive [logging
guides](https://betterstack.com/community/guides/logging/) to learn more techniques for effective logging in production.

Thanks for reading, and happy logging!