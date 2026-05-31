# Logging in Go with Slog: The Ultimate Guide


In this article, we'll explore [structured logging](https://betterstack.com/community/guides/logging/structured-logging/) in Go with a specific focus on
the recently introduced [log/slog package](https://pkg.go.dev/log/slog) which
aims to bring high-performance, structured, and leveled logging to the Go
standard library.

The package has its origins in
[this GitHub discussion opened by Jonathan Amsterdam](https://github.com/golang/go/discussions/54763),
which later led to the [proposal](https://github.com/golang/go/issues/56345)
describing the exact design of the package. Once finalized, it was released in
[Go v1.21](https://tip.golang.org/doc/go1.21) and now resides at `log/slog`.

In the following sections, I will present a comprehensive examination what Slog
has to offer with accompanying examples. For a performance comparison with other
Go logging frameworks, refer to
[this GitHub repo](https://github.com/betterstack-community/go-logging-benchmarks).

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_mqB7LLgwgs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



## Getting started with Slog

Let's begin our exploration of the `log/slog` package by walking through its
design and architecture. It provides three main types that you should be
familiar with:

- `Logger`: the logging "frontend" which provides level methods such as
  (`Info()` and `Error()`) for recording events of interest.
- `Record`: a representation of each self-contained log object created by a
  `Logger`.
- `Handler`: an interface that, once implemented, determines the formatting and
  destination of each `Record`. Two built-in handlers are included in the
  `log/slog` package: `TextHandler` and `JSONHandler` for `key=value` and JSON
  output respectively.

Like most [Go logging libraries](https://betterstack.com/community/guides/logging/best-golang-logging-libraries/), the `slog`
package exposes a default `Logger` that is accessible through top-level
functions. This logger produces an almost identical output as the older
`log.Printf()` method, except for the inclusion of log levels:

```go
package main

import (
	"log"
	"log/slog"
)

func main() {
	log.Print("Info message")
	slog.Info("Info message")
}
```

```text
[output]
2024/01/03 10:24:22 Info message
2024/01/03 10:24:22 INFO Info message
```

This is a somewhat bizarre default since Slog's main purpose is to bring
structured logging to the standard library.

It's easy enough to correct this by creating a custom `Logger` instance through
the `slog.New()` method. It accepts an implementation of `Handler` interface,
which determines how the logs are formatted and where they are written to.

Here's an example that uses the built-in `JSONHandler` type to output JSON logs
to the `stdout`:

```go
func main() {
    [highlight]
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    [/highlight]
	logger.Debug("Debug message")
	logger.Info("Info message")
	logger.Warn("Warning message")
	logger.Error("Error message")
}
```

```json
[output]
{"time":"2023-03-15T12:59:22.227408691+01:00","level":"INFO","msg":"Info message"}
{"time":"2023-03-15T12:59:22.227468972+01:00","level":"WARN","msg":"Warning message"}
{"time":"2023-03-15T12:59:22.227472149+01:00","level":"ERROR","msg":"Error message"}
```

When the `TextHandler` type is used instead, each log record will be formatted
according to the [Logfmt standard](https://betterstack.com/community/guides/logging/logfmt/):

```go
logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
```

```text
[output]
time=2023-03-15T13:00:11.333+01:00 level=INFO msg="Info message"
time=2023-03-15T13:00:11.333+01:00 level=WARN msg="Warning message"
time=2023-03-15T13:00:11.333+01:00 level=ERROR msg="Error message"
```

All `Logger` instances default to logging at the `INFO` level, which leads to
the suppression of the `DEBUG` entry, but you can
[easily update this](https://betterstack.com/community/guides/logging/logging-in-go/#customizing-slog-log-levels)
as you see fit.

## Customizing the default logger

The most straightforward way to customize the default `Logger` is to utilize the
`slog.SetDefault()` method, allowing you to replace the default logger with a
custom one.

```go
func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

  [highlight]
	slog.SetDefault(logger)
  [/highlight]

	slog.Info("Info message")
}
```

You'll now observe that the package's top-level logging methods now produce JSON
output as seen below:

```json
[output]
{"time":"2023-03-15T13:07:39.105777557+01:00","level":"INFO","msg":"Info message"}
```

Using the `SetDefault()` method also alters the default `log.Logger` employed by
the `log` package. This behavior allows existing applications that utilize the
older `log` package to transition to [structured logging](https://betterstack.com/community/guides/logging/log-formatting/)
seamlessly :

```go
func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	slog.SetDefault(logger)

	// elsewhere in the application
[highlight]
	log.Println("Hello from old logger")
[/highlight]
}
```

```json
[output]
{"time":"2023-03-16T15:20:33.783681176+01:00","level":"INFO","msg":"Hello from old logger"}
```

The `slog.NewLogLogger()` method is also available for converting an
`slog.Logger` to a `log.Logger` when you need to utilize APIs that require the
latter (such as `http.Server.ErrorLog`):

```go
func main() {
	handler := slog.NewJSONHandler(os.Stdout, nil)

	logger := slog.NewLogLogger(handler, slog.LevelError)

	_ = http.Server{
		// this API only accepts `log.Logger`
		ErrorLog: logger,
	}
}
```

## Adding contextual attributes to log records

A significant advantage of [structured logging](https://betterstack.com/community/guides/logging/json-logging/) over unstructured
formats is the ability to add arbitrary attributes as key/value pairs in log
records.

These attributes provide additional context about the logged event, which can be
valuable for tasks such as troubleshooting, generating metrics, auditing, and
various other purposes.

Here's an example illustrating how it works in Slog:

```go
logger.Info(
  "incoming request",
  "method", "GET",
  "time_taken_ms", 158,
  "path", "/hello/world?q=search",
  "status", 200,
  "user_agent", "Googlebot/2.1 (+http://www.google.com/bot.html)",
)
```

```json
[output]
{
  "time":"2023-02-24T11:52:49.554074496+01:00",
  "level":"INFO",
  "msg":"incoming request",
  "method":"GET",
  "time_taken_ms":158,
  "path":"/hello/world?q=search",
  "status":200,
  "user_agent":"Googlebot/2.1 (+http://www.google.com/bot.html)"
}
```

All the level methods (`Info()`, `Debug()`, etc.) accept a log message as their
first argument, and an unlimited number of loosely typed key/value pairs
thereafter.

This API is similar to
[the SugaredLogger API in Zap](https://betterstack.com/community/guides/logging/go/zap#examining-zap-s-logging-api)
(specifically its level methods ending in `w`) as it prioritizes brevity at the
cost of additional memory allocations.

But be cautious, as this approach can cause unexpected issues. Specifically,
unbalanced key/value pairs can result in problematic output:

```go
logger.Info(
  "incoming request",
  "method", "GET",
  "time_taken_ms", // the value for this key is missing
)
```

Since the `time_taken_ms` key does not have a corresponding value, it will be
treated as a value with key `!BADKEY`. This isn't great because a property
misalignment could create bad entries, and you may not know about it until you
need to use the logs.

```json
[output]
{
  "time": "2023-03-15T13:15:29.956566795+01:00",
  "level": "INFO",
  "msg": "incoming request",
  "method": "GET",
  [highlight]
  "!BADKEY": "time_taken_ms"
  [/highlight]
}
```

To prevent such problems, you can run the [vet](https://pkg.go.dev/cmd/vet)
command or use a [linter](https://github.com/go-simpler/sloglint) to
automatically report such issues.

![Screenshot from 2024-01-01 15-17-49.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/db000eeb-f685-49ce-1541-92458f238100/orig
=1884x708)

Another way to prevent such mistakes is by using
[strongly-typed contextual attributes](https://pkg.go.dev/log/slog#Attr) as
shown below:

```go
logger.Info(
  "incoming request",
  slog.String("method", "GET"),
  slog.Int("time_taken_ms", 158),
  slog.String("path", "/hello/world?q=search"),
  slog.Int("status", 200),
  slog.String(
    "user_agent",
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
  ),
)
```

While this is a much better approach to contextual logging, it's not fool-proof
as nothing is stopping you from mixing strongly-typed and loosely-typed
key/value pairs like this:

```go
logger.Info(
  "incoming request",
  "method", "GET",
  slog.Int("time_taken_ms", 158),
  slog.String("path", "/hello/world?q=search"),
  "status", 200,
  slog.String(
    "user_agent",
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
  ),
)
```

To guarantee type safety when adding contextual attributes to your records, you
must use the `LogAttrs()` method like this:

```go
logger.LogAttrs(
  context.Background(),
  slog.LevelInfo,
  "incoming request",
  slog.String("method", "GET"),
  slog.Int("time_taken_ms", 158),
  slog.String("path", "/hello/world?q=search"),
  slog.Int("status", 200),
  slog.String(
    "user_agent",
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
  ),
)
```

This method only accepts the `slog.Attr` type for custom attributes, so it's
impossible to have an unbalanced key/value pair. However, its API is more
convoluted as you always need to pass a context (or `nil`) and the log level to
the method in addition to the log message and custom attributes.

### Grouping contextual attributes

Slog also allows grouping multiple attributes under a single name, but the
output depends on the `Handler` in use. For example, with `JSONHandler`, each
group is nested within the JSON object:

```go
logger.LogAttrs(
  context.Background(),
  slog.LevelInfo,
  "image uploaded",
  slog.Int("id", 23123),
[highlight]
  slog.Group("properties",
    slog.Int("width", 4000),
    slog.Int("height", 3000),
    slog.String("format", "jpeg"),
  ),
[/highlight]
)
```

```json
[output]
{
  "time":"2023-02-24T12:03:12.175582603+01:00",
  "level":"INFO",
  "msg":"image uploaded",
  "id":23123,
[highlight]
  "properties":{
    "width":4000,
    "height":3000,
    "format":"jpeg"
  }
[/highlight]
}
```

When using the `TextHandler`, each key in the group will be prefixed by the
group name like this:

```text
[output]
time=2023-02-24T12:06:20.249+01:00 level=INFO msg="image uploaded" id=23123
[highlight]
  properties.width=4000 properties.height=3000 properties.format=jpeg
[/highlight]
```

## Creating and using child loggers

Including the same attributes in all records within a specific scope can be
beneficial to ensure their presence without repetitive logging statements.

This is where child loggers can prove helpful, as they create a new logging
context that inherits from their parent while allowing the inclusion of
additional fields.

In Slog, creating child loggers is accomplished using the `Logger.With()`
method. It accepts one or more key/value pairs and returns a new `Logger` that
includes the specified attributes.

Consider the following code snippet that adds the program's process ID and the
Go version used for compilation to each log record, storing them in a
`program_info` property:

```go
func main() {
	handler := slog.NewJSONHandler(os.Stdout, nil)
	buildInfo, _ := debug.ReadBuildInfo()

	logger := slog.New(handler)

    [highlight]
	child := logger.With(
		slog.Group("program_info",
			slog.Int("pid", os.Getpid()),
			slog.String("go_version", buildInfo.GoVersion),
		),
	)
    [/highlight]

	. . .
}
```

With this configuration in place, all records created by the `child` logger will
contain the specified attributes under the `program_info` property as long as it
is not overridden at log point:

```go
func main() {
	. . .

	child.Info("image upload successful", slog.String("image_id", "39ud88"))
	child.Warn(
		"storage is 90% full",
		slog.String("available_space", "900.1 mb"),
	)
}
```

```json
[output]
{
  "time": "2023-02-26T19:26:46.046793623+01:00",
  "level": "INFO",
  "msg": "image upload successful",
  "program_info": {
    "pid": 229108,
    "go_version": "go1.20"
  },
  "image_id": "39ud88"
}
{
  "time": "2023-02-26T19:26:46.046847902+01:00",
  "level": "WARN",
  "msg": "storage is 90% full",
  "program_info": {
    "pid": 229108,
    "go_version": "go1.20"
  },
  "available_space": "900.1 MB"
}
```

You can also use the `WithGroup()` method to create a child logger that starts a
group such that all attributes added to the logger (including those added at log
point) are nested under the group name:

```go
handler := slog.NewJSONHandler(os.Stdout, nil)
[highlight]
buildInfo, _ := debug.ReadBuildInfo()
logger := slog.New(handler).WithGroup("program_info")
[/highlight]

child := logger.With(
  slog.Int("pid", os.Getpid()),
  slog.String("go_version", buildInfo.GoVersion),
)

child.Warn(
  "storage is 90% full",
  slog.String("available_space", "900.1 MB"),
)
```

```json
[output]
{
  "time": "2023-05-24T19:00:18.384136084+01:00",
  "level": "WARN",
  "msg": "storage is 90% full",
  "program_info": {
    "pid": 1971993,
    "go_version": "go1.20.2",
    "available_space": "900.1 mb"
  }
}
```

## Customizing Slog levels

The `log/slog` package provides four log levels by default, with each one
associated with an integer value: `DEBUG` (-4), `INFO` (0), `WARN` (4), and
`ERROR` (8).

The gap of four between each level is a deliberate design decision made to
accommodate logging schemes with custom levels between the default ones. For
example, you can create a custom level between `INFO` and `WARN` with a value of
1, 2, or 3.

We previously observed that all loggers are configured to log at the `INFO`
level by default, which causes events logged at a lower severity (such as
`DEBUG`) to be suppressed. You can customize this behavior through the
[HandlerOptions](https://pkg.go.dev/log/slog#HandlerOptions) type as shown
below:

```go
func main() {
    [highlight]
	opts := &slog.HandlerOptions{
		Level: slog.LevelDebug,
	}

	handler := slog.NewJSONHandler(os.Stdout, opts)
    [/highlight]

	logger := slog.New(handler)
	logger.Debug("Debug message")
	logger.Info("Info message")
	logger.Warn("Warning message")
	logger.Error("Error message")
}
```

```json
[output]
{"time":"2023-05-24T19:03:10.70311982+01:00","level":"DEBUG","msg":"Debug message"}
{"time":"2023-05-24T19:03:10.703187713+01:00","level":"INFO","msg":"Info message"}
{"time":"2023-05-24T19:03:10.703190419+01:00","level":"WARN","msg":"Warning message"}
{"time":"2023-05-24T19:03:10.703192892+01:00","level":"ERROR","msg":"Error message"}
```

This approach to setting the level fixes the level of the `handler` throughout
its lifetime. If you need the minimum level to be [dynamically
varied](https://betterstack.com/community/guides/logging/change-log-levels-dynamically/), you must use the `LevelVar` type as
illustrated below:

```go
func main() {
	[highlight]
	logLevel := &slog.LevelVar{} // INFO

	opts := &slog.HandlerOptions{
		Level: logLevel,
	}
	[/highlight]

	handler := slog.NewJSONHandler(os.Stdout, opts)

	. . .
}
```

You can subsequently update the log level anytime using the following:

```go
logLevel.Set(slog.LevelDebug)
```

### Creating custom log levels

If you need custom levels beyond what Slog provides by default, you can create
them by implementing the
[Leveler interface](https://pkg.go.dev/log/slog#Leveler) whose signature is as
follows:

```go
type Leveler interface {
	Level() Level
}
```

It's easy to implement this interface through the `Level` type shown below
(since `Level` itself implements `Leveler`):

```go
const (
	LevelTrace  = slog.Level(-8)
	LevelFatal  = slog.Level(12)
)
```

Once you've defined custom levels as above, you can only use them through the
`Log()` or `LogAttrs()` method:

```go
opts := &slog.HandlerOptions{
    Level: LevelTrace,
}

logger := slog.New(slog.NewJSONHandler(os.Stdout, opts))

ctx := context.Background()
logger.Log(ctx, LevelTrace, "Trace message")
logger.Log(ctx, LevelFatal, "Fatal level")
```

```json
[output]
{"time":"2023-02-24T09:26:41.666493901+01:00","level":"DEBUG-4","msg":"Trace level"}
{"time":"2023-02-24T09:26:41.666602404+01:00","level":"ERROR+4","msg":"Fatal level"}
```

Notice how the custom levels are labeled in terms of the defaults. This is
definitely not what you want, so you should customize the level names through
the `HandlerOptions` type like this:

```go
. . .

var LevelNames = map[slog.Leveler]string{
	LevelTrace:      "TRACE",
	LevelFatal:      "FATAL",
}

func main() {
	opts := slog.HandlerOptions{
		Level: LevelTrace,
    [highlight]
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.LevelKey {
				level := a.Value.Any().(slog.Level)
				levelLabel, exists := LevelNames[level]
				if !exists {
					levelLabel = level.String()
				}

				a.Value = slog.StringValue(levelLabel)
			}

			return a
		},
    [/highlight]
	}

	. . .
}
```

The `ReplaceAttr()` function is used to customize how each key/value pair in a
`Record` is handled by a `Handler`. It can be used to customize key names, or
process the values in some way.

In the above example, it maps the custom log levels to their respective labels
producing `TRACE` and `FATAL` respectively.

```json
[output]
{"time":"2023-02-24T09:27:51.747625912+01:00","level":"TRACE","msg":"Trace level"}
{"time":"2023-02-24T09:27:51.747737319+01:00","level":"FATAL","msg":"Fatal level"}
```

## Customizing Slog Handlers

As mentioned earlier, both `TextHandler` and `JSONHandler` can be customized
using the `HandlerOptions` type. You've already seen how to adjust the minimum
level and modify attributes before logging them.

Another customization that can be accomplished through `HandlerOptions`
including the log source if required:

```go
opts := &slog.HandlerOptions{
[highlight]
    AddSource: true,
[/highlight]
    Level:     slog.LevelDebug,
}
```

```json
[output]
{
  "time": "2024-01-03T11:06:50.971029852+01:00",
  "level": "DEBUG",
[highlight]
  "source": {
    "function": "main.main",
    "file": "/home/ayo/dev/betterstack/demo/slog/main.go",
    "line": 17
  },
[/highlight]
  "msg": "Debug message"
}
```

It's also easy to switch enough handlers based on the application environment.
For example, you might prefer to use the `TextHandler` for your development logs
since it's a little easier to read, then switch to `JSONHandler` in production
for more flexibility and compatibility with various logging tools.

This behavior is easily implemented through environmental variables:

```go
var appEnv = os.Getenv("APP_ENV")

func main() {
	opts := &slog.HandlerOptions{
		Level: slog.LevelDebug,
	}

	var handler slog.Handler = slog.NewTextHandler(os.Stdout, opts)
	if appEnv == "production" {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	}

	logger := slog.New(handler)

	logger.Info("Info message")
}
```

```command
go run main.go
```

```text
[output]
time=2023-02-24T10:36:39.697+01:00 level=INFO msg="Info message"
```

```command
APP_ENV=production go run main.go
```

```json
[output]
{"time":"2023-02-24T10:35:16.964821548+01:00","level":"INFO","msg":"Info message"}
```


[summary]
### Centralize your Go logs with Better Stack

While Slog handles structured logging in your application, [Better Stack](https://betterstack.com/log-management) provides centralized log management with live tailing, SQL and PromQL queries, automated anomaly detection, and incident management. Collect logs from all your Go services in one place with integrations for Docker, Kubernetes, and more.

**Predictable pricing starting at $0.25/GB.** Start free in minutes.
[/summary]

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


### Creating custom Handlers

Since `Handler` is an interface, it's possible to create custom handlers for
formatting the logs differently or writing them to other destinations.

Its signature is as follows:

```go
type Handler interface {
	Enabled(context.Context, Level) bool
	Handle(context.Context, r Record) error
	WithAttrs(attrs []Attr) Handler
	WithGroup(name string) Handler
}
```

Here's what each of the methods do:

- `Enabled()` determines if a log record should be handled or discarded based on
  its level. The `context` can also used to make a decision.
- `Handle()` processes each log record sent to the handler. It is called only if
  `Enabled()` returns `true`.
- `WithAttrs()` creates a new handler from an existing one and adds the
  specified attributes it.
- `WithGroup()` creates a new handler from an existing one and adds the
  specified group name to it such that the name qualifies subsequent
  attributes..

Here's an example that uses the `log`, `json`, and
[color](https://github.com/fatih/color) packages to implement a prettified
development output for log records:

```go
[label handler.go]
// NOTE: Not well tested, just an illustration of what's possible
package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"log/slog"

	"github.com/fatih/color"
)

type PrettyHandlerOptions struct {
	SlogOpts slog.HandlerOptions
}

type PrettyHandler struct {
	slog.Handler
	l *log.Logger
}

func (h *PrettyHandler) Handle(ctx context.Context, r slog.Record) error {
	level := r.Level.String() + ":"

	switch r.Level {
	case slog.LevelDebug:
		level = color.MagentaString(level)
	case slog.LevelInfo:
		level = color.BlueString(level)
	case slog.LevelWarn:
		level = color.YellowString(level)
	case slog.LevelError:
		level = color.RedString(level)
	}

	fields := make(map[string]interface{}, r.NumAttrs())
	r.Attrs(func(a slog.Attr) bool {
		fields[a.Key] = a.Value.Any()

		return true
	})

	b, err := json.MarshalIndent(fields, "", "  ")
	if err != nil {
		return err
	}

	timeStr := r.Time.Format("[15:05:05.000]")
	msg := color.CyanString(r.Message)

	h.l.Println(timeStr, level, msg, color.WhiteString(string(b)))

	return nil
}

func NewPrettyHandler(
	out io.Writer,
	opts PrettyHandlerOptions,
) *PrettyHandler {
	h := &PrettyHandler{
		Handler: slog.NewJSONHandler(out, &opts.SlogOpts),
		l:       log.New(out, "", 0),
	}

	return h
}
```

When you use the `PrettyHandler` in your code like this:

```go
func main() {
	opts := PrettyHandlerOptions{
		SlogOpts: slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}
	handler := NewPrettyHandler(os.Stdout, opts)
	logger := slog.New(handler)
	logger.Debug(
		"executing database query",
		slog.String("query", "SELECT * FROM users"),
	)
	logger.Info("image upload successful", slog.String("image_id", "39ud88"))
	logger.Warn(
		"storage is 90% full",
		slog.String("available_space", "900.1 MB"),
	)
	logger.Error(
		"An error occurred while processing the request",
		slog.String("url", "https://example.com"),
	)
}
```

You will observe the following colorized output when you execute the program:

![Screenshot from 2023-05-24 19-53-04.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c62a13a4-afea-4e53-2ac3-c5c8c790b200/lg2x=1806x1276)

You can find several custom handlers created by the community on
[GitHub](https://github.com/search?q=slog-+language%3AGo&type=repositories&l=Go)
and this [Go Wiki page](https://tip.golang.org/wiki/Resources-for-slog). Some
notable examples include:

- [tint](https://github.com/lmittmann/tint) - writes tinted (colorized) logs.
- [slog-sampling](https://github.com/samber/slog-sampling) - improves logging
  throughput by dropping repetitive log records.
- [slog-multi](https://github.com/samber/slog-multi) - implements workflows such
  as middleware, fanout, routing, failover, load balancing.
- [slog-formatter](https://github.com/samber/slog-formatter) - provides more
  flexible attribute formatting.

## Using the context package with Slog

So far, we've primarily utilized the standard variants of the level methods such
as `Info()`, `Debug()`, and others, but Slog also provides context-aware
variants that accepts a `context.Context` value as their first argument. Here's
the signature for each one:

```go
func (ctx context.Context, msg string, args ...any)
```

With such methods, you can propagate contextual attributes across functions by
storing them in the `Context` so that when these values are found, they are
added to any resulting records.

Consider the following program:

```go
package main

import (
	"context"
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	ctx := context.WithValue(context.Background(), "request_id", "req-123")

	logger.InfoContext(ctx, "image uploaded", slog.String("image_id", "img-998"))
}
```

A `request_id` is added to the `ctx` variable and passed to the `InfoContext`
method. However, when the program is run, the `request_id` field does not appear
in the log:

```json
[output]
{
  "time": "2024-01-02T11:04:28.590527494+01:00",
  "level": "INFO",
  "msg": "image uploaded",
  "image_id": "img-998"
}
```

To get this working, you need to create a custom handler and re-implement the
`Handle` method as shown below:

```go
type ctxKey string

const (
	slogFields ctxKey = "slog_fields"
)

type ContextHandler struct {
	slog.Handler
}

// Handle adds contextual attributes to the Record before calling the underlying
// handler
func (h ContextHandler) Handle(ctx context.Context, r slog.Record) error {
	if attrs, ok := ctx.Value(slogFields).([]slog.Attr); ok {
		for _, v := range attrs {
			r.AddAttrs(v)
		}
	}

	return h.Handler.Handle(ctx, r)
}

// AppendCtx adds an slog attribute to the provided context so that it will be
// included in any Record created with such context
func AppendCtx(parent context.Context, attr slog.Attr) context.Context {
	if parent == nil {
		parent = context.Background()
	}

	if v, ok := parent.Value(slogFields).([]slog.Attr); ok {
		v = append(v, attr)
		return context.WithValue(parent, slogFields, v)
	}

	v := []slog.Attr{}
	v = append(v, attr)
	return context.WithValue(parent, slogFields, v)
}
```

The `ContextHandler` struct embeds the `slog.Handler` interface and implements
the `Handle` method to extract Slog attributes stored within the provided
context. If found, they are added to the `Record` before the underlying
`Handler` is called to format and output the record.

On the other hand, the `AppendCtx` function adds Slog attributes to a
`context.Context` using the `slogFields` key so that it is accessible to the
`ContextHandler`.

Here's how to use them both:

```go
func main() {
    [highlight]
	h := &ContextHandler{slog.NewJSONHandler(os.Stdout, nil)}
    [/highlight]

	logger := slog.New(h)

    [highlight]
	ctx := AppendCtx(context.Background(), slog.String("request_id", "req-123"))
    [/highlight]

	logger.InfoContext(ctx, "image uploaded", slog.String("image_id", "img-998"))
}
```

You will now observe that the `request_id` is included in any records created
with the `ctx` argument:

```json
[output]
{
  "time": "2024-01-02T11:29:15.229984723+01:00",
  "level": "INFO",
  "msg": "image uploaded",
  "image_id": "img-998",
  "request_id": "req-123"
}
```

## Error logging with Slog

When it comes to logging errors, a helper is not provided for the `error` type
like in most frameworks, so you must use `slog.Any()` like this:

```go
err := errors.New("something happened")

logger.ErrorContext(ctx, "upload failed", slog.Any("error", err))
```

```json
[output]
{
  "time": "2024-01-02T14:13:44.41886393+01:00",
  "level": "ERROR",
  "msg": "upload failed",
  "error": "something happened"
}
```

To obtain and log error stack traces, you can use a library like
[xerrors](https://github.com/MDobak/go-xerrors) to create errors with stack
traces:

```go
[highlight]
err := xerrors.New("something happened")
[/highlight]

logger.ErrorContext(ctx, "upload failed", slog.Any("error", err))
```

Before you can observe the stack trace in the error log, you also need to
extract, format, and add it to the corresponding `Record` through the
`ReplaceAttr()` function demonstrated earlier.

Here's an example:

```go
package main

import (
	"context"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/mdobak/go-xerrors"
)

type stackFrame struct {
	Func   string `json:"func"`
	Source string `json:"source"`
	Line   int    `json:"line"`
}

func replaceAttr(_ []string, a slog.Attr) slog.Attr {
	switch a.Value.Kind() {
	case slog.KindAny:
		switch v := a.Value.Any().(type) {
		case error:
			a.Value = fmtErr(v)
		}
	}

	return a
}

// marshalStack extracts stack frames from the error
func marshalStack(err error) []stackFrame {
	trace := xerrors.StackTrace(err)

	if len(trace) == 0 {
		return nil
	}

	frames := trace.Frames()

	s := make([]stackFrame, len(frames))

	for i, v := range frames {
		f := stackFrame{
			Source: filepath.Join(
				filepath.Base(filepath.Dir(v.File)),
				filepath.Base(v.File),
			),
			Func: filepath.Base(v.Function),
			Line: v.Line,
		}

		s[i] = f
	}

	return s
}

// fmtErr returns a slog.Value with keys `msg` and `trace`. If the error
// does not implement interface { StackTrace() errors.StackTrace }, the `trace`
// key is omitted.
func fmtErr(err error) slog.Value {
	var groupValues []slog.Attr

	groupValues = append(groupValues, slog.String("msg", err.Error()))

	frames := marshalStack(err)

	if frames != nil {
		groupValues = append(groupValues,
			slog.Any("trace", frames),
		)
	}

	return slog.GroupValue(groupValues...)
}

func main() {
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
[highlight]
		ReplaceAttr: replaceAttr,
	})
[/highlight]

	logger := slog.New(h)

	ctx := context.Background()

	err := xerrors.New("something happened")

	logger.ErrorContext(ctx, "image uploaded", slog.Any("error", err))
}
```

With this in place, any errors created using `xerrors.New()` will be logged with
a well-formatted stack trace as follows:

```json
[output]
{
  "time": "2024-01-03T07:09:31.013954119+01:00",
  "level": "ERROR",
  "msg": "image uploaded",
[highlight]
  "error": {
    "msg": "something happened",
    "trace": [
      {
        "func": "main.main",
        "source": "slog/main.go",
        "line": 82
      },
      {
        "func": "runtime.main",
        "source": "runtime/proc.go",
        "line": 267
      },
      {
        "func": "runtime.goexit",
        "source": "runtime/asm_amd64.s",
        "line": 1650
      }
    ]
  }
}
[/highlight]
```

Now you can easily trace the path of execution leading to any unexpected errors
in your application.

## Hiding sensitive fields with the LogValuer interface

The `LogValuer` interface allows you to standardize your logging output by
specifying how your custom types should be logged. Here's its signature:

```go
type LogValuer interface {
	LogValue() Value
}
```

A prime use case for implementing this interface is for [hiding sensitive
fields](https://betterstack.com/community/guides/logging/sensitive-data/) in your custom types. For example, here's a `User` type
that does not implement the `LogValuer` interface. Notice how sensitive details
are exposed when an instance is logged:

```go
// User does not implement `LogValuer` here
type User struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func main() {
	handler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(handler)

	u := &User{
		ID:        "user-12234",
		FirstName: "Jan",
		LastName:  "Doe",
		Email:     "jan@example.com",
		Password:  "pass-12334",
	}

	logger.Info("info", "user", u)
}
```

```json
[output]
{
  "time": "2023-02-26T22:11:30.080656774+01:00",
  "level": "INFO",
  "msg": "info",
  "user": {
    "id": "user-12234",
    "first_name": "Jan",
    "last_name": "Doe",
    "email": "jan@example.com",
    "password": "pass-12334"
  }
}
```

This is problematic since the type contains secret fields that should not be
present in the logs (such as emails and passwords), and it can also make your
logs unnecessarily verbose.

You can solve this issue by specifying how you'd like the type represented in
the logs. For example, you may specify that only the `ID` field should be logged
as follows:

```go
// implement the `LogValuer` interface on the User struct
func (u User) LogValue() slog.Value {
	return slog.StringValue(u.ID)
}
```

You will now observe the following output:

```json
[output]
{
  "time": "2023-02-26T22:43:28.184363059+01:00",
  "level": "INFO",
  "msg": "info",
  "user": "user-12234"
}
```

You can also group multiple attributes like this:

```go
func (u User) LogValue() slog.Value {
	return slog.GroupValue(
		slog.String("id", u.ID),
		slog.String("name", u.FirstName+" "+u.LastName),
	)
}
```

```json
[output]
{
  "time": "2023-03-15T14:44:24.223381036+01:00",
  "level": "INFO",
  "msg": "info",
  "user": {
    "id": "user-12234",
    "name": "Jan Doe"
  }
}
```

## Using third-party logging backends with Slog

One of Slog's major design goals is to provide a unified logging frontend
(`slog.Logger`) for Go applications while the backend (`slog.Handler`) remains
customizable from program to program.

This way, the logging API is consistent across all dependencies, even if the
backends differ. It also avoids coupling the logging implementation to a
specific package by making it trivial to switch a different backend if
requirements change in your project.

Here's an example that uses the Slog frontend with a [Zap backend](https://betterstack.com/community/guides/logging/go/zap/),
potentially providing the best of both worlds:

```command
go get go.uber.org/zap
```

```command
go get go.uber.org/zap/exp/zapslog
```

```go
package main

import (
	"log/slog"

	"go.uber.org/zap"
	"go.uber.org/zap/exp/zapslog"
)

func main() {
	zapL := zap.Must(zap.NewProduction())

	defer zapL.Sync()

	logger := slog.New(zapslog.NewHandler(zapL.Core(), nil))

	logger.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}
```

This snippet creates a new Zap production logger that is subsequently used as a
handler for the Slog package through `zapslog.NewHandler()`. With this in place,
you only need to write your logs using methods provided on `slog.Logger` but the
resulting records will be processed according to the provided `zapL`
configuration.

```json
[output]
{"level":"info","ts":1697453912.4535635,"msg":"incoming request","method":"GET","path":"/api/user","status":200}
```

Switching to a different logging is really straightforward since logging is done
in terms of `slog.Logger`. For example, you can switch from Zap to
[Zerolog](https://betterstack.com/community/guides/logging/zerolog/) like this:

```command
go get github.com/rs/zerolog
```

```command
go get github.com/samber/slog-zerolog
```

```go
package main

import (
	"log/slog"
	"os"

    [highlight]
	"github.com/rs/zerolog"
	slogzerolog "github.com/samber/slog-zerolog"
    [/highlight]
)

func main() {
    [highlight]
	zerologL := zerolog.New(os.Stdout).Level(zerolog.InfoLevel)

	logger := slog.New(
		slogzerolog.Option{Logger: &zerologL}.NewZerologHandler(),
	)
    [/highlight]

	logger.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}
```

```json
[output]
{"level":"info","time":"2023-10-16T13:22:33+02:00","method":"GET","path":"/api/user","status":200,"message":"incoming request"}
```

In the above snippet, the Zap handler has been replaced with a
[custom Zerolog one](https://github.com/samber/slog-zerolog). Since logging
isn't done using either library's custom APIs, the migration process only takes
a couple of minutes compared to a situation where you have to switch out one
logging API for another across your entire application.

## Best practices for writing and storing Go logs

Once you've configured Slog or your preferred third-party [Go logging
framework](https://betterstack.com/community/guides/logging/best-golang-logging-libraries/), it's necessary to adopt the following
best practices to ensure that you get the most out of your application logs:

### 1. Standardize your logging interfaces

Implementing the `LogValuer` interface allows you to standardize how the various
types in your application are logged to ensure that their representation in the
logs is consistent throughout your application. It's also an effective strategy
for ensuring that sensitive fields are omitted from your application logs, as we
explored earlier in this article.

### 2. Add a stack trace to your error logs

To improve your ability to debug unexpected issues in production, you should add
a stack trace to your error logs. That way, it'll be much easier to pinpoint
where the error originated within the codebase and the program flow that led to
the problem.

Slog does not currently provide a built-in way to add stack traces to errors,
but as we demonstrated earlier, this functionality can be implemented using
packages like [pkgerrors](https://github.com/pkg/errors) or
[go-xerrors](https://github.com/MDobak/go-xerrors) with a couple of helper
functions.

### 3. Lint your Slog statements to enforce consistency

One of the main drawbacks of the Slog API is that it allows for two different
types of arguments, which could lead to inconsistency in a code base. Aside from
that you also want to enforce consistent key name conventions (snake_case,
camelCase, etc.), or if logging calls should always include a context argument.

A linter like [sloglint](https://github.com/go-simpler/sloglint/releases) can
help you enforce various rules for Slog based on your preferred code style.
Here's an example configuration when used through
[golangci-lint](https://freshman.tech/linting-golang/):

```yaml
[label .golangci.yml]
linters-settings:
  sloglint:
    # Enforce not mixing key-value pairs and attributes.
    # Default: true
    no-mixed-args: false
    # Enforce using key-value pairs only (overrides no-mixed-args, incompatible with attr-only).
    # Default: false
    kv-only: true
    # Enforce using attributes only (overrides no-mixed-args, incompatible with kv-only).
    # Default: false
    attr-only: true
    # Enforce using methods that accept a context.
    # Default: false
    context-only: true
    # Enforce using static values for log messages.
    # Default: false
    static-msg: true
    # Enforce using constants instead of raw keys.
    # Default: false
    no-raw-keys: true
    # Enforce a single key naming convention.
    # Values: snake, kebab, camel, pascal
    # Default: ""
    key-naming-case: snake
    # Enforce putting arguments on separate lines.
    # Default: false
    args-on-sep-lines: true
```

### 4. Centralize your logs, but persist them to local files first

It's generally better to decouple the task of writing logs from shipping them to
a centralized log management system. Writing logs to local files first ensures a
backup in case the log management system or network faces issues, preventing
potential loss of crucial data.

Additionally, storing logs locally before sending them off helps buffer the
logs, allowing for batch transmissions to help optimize network bandwidth usage
and minimize impact on application performance.

Local log storage also affords greater flexibility so that if there's a need to
transition to a different log management system, modifications are required only
in the shipping method rather than the entire application logging mechanism. See
our articles on using [specialized log shippers](https://betterstack.com/community/guides/logging/log-shippers-explained/) like
[Vector](https://betterstack.com/community/guides/logging/vector-explained/) or [Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/) for more details.

Logging to files does not necessarily require you to configure your chosen
framework to write directly to a file as
[Systemd](https://betterstack.com/community/guides/logging/how-to-control-systemd-with-systemctl/) can easily redirect the
application's standard output and error streams to a file.
[Docker](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/) also defaults to collecting all data
sent to both streams and routing them to local files on the host machine.

### 5. Sample your logs

Log sampling is the practice of recording only a representative subset of log
entries instead every single log event. This technique is beneficial in
high-traffic environments where systems generate vast amounts of log data, and
processing every entry could be quite costly since centralized logging solutions
often charge based on data ingestion rates or storage.

```go
package main

import (
	"fmt"
	"log/slog"
	"os"

	slogmulti "github.com/samber/slog-multi"
	slogsampling "github.com/samber/slog-sampling"
)

func main() {
	// Will print 20% of entries.
	option := slogsampling.UniformSamplingOption{
		Rate: 0.2,
	}

	logger := slog.New(
		slogmulti.
			Pipe(option.NewMiddleware()).
			Handler(slog.NewJSONHandler(os.Stdout, nil)),
	)

	for i := 1; i <= 10; i++ {
		logger.Info(fmt.Sprintf("a message from the gods: %d", i))
	}
}
```

```json
[output]
{"time":"2023-10-18T19:14:09.820090798+02:00","level":"INFO","msg":"a message from the gods: 4"}
{"time":"2023-10-18T19:14:09.820117844+02:00","level":"INFO","msg":"a message from the gods: 5"}
```

Third-party frameworks such as [Zerolog](https://betterstack.com/community/guides/logging/zerolog/#log-sampling-with-zerolog) and
[Zap](https://betterstack.com/community/guides/logging/go/zap/#log-sampling-with-zap) provide built-in log sampling features. With
Slog, you'd have to integrate a third-party handler such as
[slog-sampling](https://github.com/samber/slog-sampling) or develop a custom
solution. You can also choose to sample logs through a dedicated log shipper
such as
[Vector](https://vector.dev/docs/reference/configuration/transforms/sample/).

### 6. Use a log management service

Centralizing your logs in a log management system makes it easy to search,
analyze, and monitor your application's behavior across multiple servers and
environments. With all the logs in one place, your ability to identify and
diagnose issues is sped up significantly as you'd no longer need to jump between
different servers to gather information about your service.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

While there are several log management solutions out there,
[Better Stack](https://betterstack.com/log-management) provides an easy way to set up
centralized log management in a few minutes, with live tailing, alerting,
dashboards, and uptime monitoring, and incident management features built into a
modern and intuitive interface. Give it a try with a completely free plan
[here](https://betterstack.com/log-management).

## Final thoughts

I hope this post has provided you with an understanding of the new structured
logging package in Go, and how you can start using it in your projects. If you'd
like to explore this topic further, I recommend checking out the
[full proposal](https://go.googlesource.com/proposal/+/master/design/56345-structured-logging.md)
and [package documentation](https://pkg.go.dev/log/slog).

Thanks for reading, and happy logging!