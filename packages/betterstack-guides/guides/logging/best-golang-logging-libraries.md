# Logging in Go: A Comparison of the Top 9 Libraries

There's probably a 99% chance that if you're logging in Go, you're using a
third-party logging framework since the built-in `log` package lacks even the
most basic [features required for production logging](https://betterstack.com/community/guides/logging/logging-framework/).

This recently changed with the
[release of Go 1.21](https://tip.golang.org/doc/go1.21) where the new
[log/slog](https://betterstack.com/community/guides/logging/logging-in-go/) package for structured, leveled, and context-aware
logging was one of the major highlights.

Since the Go ecosystem has already spawned many several comprehensive logging
solutions, you might be wondering whether the Slog package is the harbinger of
obsolescence for its predecessors, or merely another versatile tool in your
logging arsenal.

This article aims to uncover some insights that should help you clarify that
question by comparing nine prominent Go logging packages.

[summary]

## Side note: Centralize your Go logs with Better Stack

Head over to [Better Stack](https://betterstack.com/docs/logs/go/) and start shipping logs from any Go logging framework—Slog, Zerolog, Zap, or others.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Benchmarking Go logging packages

The following benchmark results were observed by running a subset of
[our custom benchmarking suite](https://github.com/betterstack-community/go-logging-benchmarks)
on my local machine:

| Package                 | Iterations |    Time     | Objects Allocated |
| :---------------------- | :--------: | :---------: | :---------------: |
| Phuslu/log              |  44559532  |  27 ns/op   |    0 allocs/op    |
| Zerolog                 |  42537776  |  30 ns/op   |    0 allocs/op    |
| Zap                     |  17901230  |  71 ns/op   |    0 allocs/op    |
| Zap (sugared)           |  14898670  |  87 ns/op   |    1 allocs/op    |
| Slog (with Zap Backend) |  1005426   | 121.9 ns/op |    0 allocs/op    |
| Logf                    |  6770377   | 163.5 ns/op |    0 allocs/op    |
| Slog                    |  7105790   |  174 ns/op  |    0 allocs/op    |
| Apex/log                |   138122   |  870 ns/op  |    5 allocs/op    |
| Logrus                  |   658953   | 2231 ns/op  |   23 allocs/op    |
| Log15                   |   505850   | 21997 ns/op |   20 allocs/op    |

See the
[full results here](https://betterstack-community.github.io/go-logging-benchmarks/).

![Screenshot 2023-11-10 at 17-39-11 Benchmarking Go Logging Frameworks.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e92b423b-fdb1-4827-7d61-827974bffe00/md1x
=2200x1190)

## 1. Zerolog

![zerolog.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eb3c2548-7c2f-4c40-e7ac-2db449f20a00/public
=1200x600)

[Zerolog](https://betterstack.com/community/guides/logging/zerolog/) is currently the
[fastest](https://betterstack-community.github.io/go-logging-benchmarks/)
structured logging framework for Go programs. It offers excellent performance
for high-load systems with minimal to zero heap allocations.

Here's the simplest example of using Zerolog to log a message:

```go
package main

import (
	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog logger")
}
```

The resulting log record will be in JSON format:

```json
[output]
{"level":"info","time":"2023-07-12T11:57:28+02:00","message":"Hello from Zerolog global logger"}
```

Zerolog can also be configured to produce binary logs in the
[CBOR format](https://cbor.io/) (for reducing log storage requirements) but it
does not support any other [log format](https://betterstack.com/community/guides/logging/log-formatting/). In development
environments where log readability is essential, you can use the `ConsoleWriter`
type to log in a human-friendly, colorized output:

```go
package main

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

func main() {
	logger := zerolog.New(
		zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339},
	).Level(zerolog.TraceLevel).With().Timestamp().Caller().Logger()

	logger.Info().Msg("Hello from Zerolog logger")
}
```

![Screenshot from 2023-07-14 05-01-09.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a8fcd686-f177-48c6-92e0-037043f58000/orig
=1626x704)

The ability to add contextual properties to your log records in the form of
key/value pairs is fully supported. It also provides helpers for saving and
retrieving a logger from a `context.Context` instance making it easy to
contextualize your logging in the application.

Here's a basic example demonstrating this feature:

```go
func SomeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		l := zerolog.New(os.Stdout)

		l.UpdateContext(func(c zerolog.Context) zerolog.Context {
			// add contextual properties to the logger's context like this
			return c.Str("user_id", "usr-1234")
		})

		// store the logger in the request's context
		r = r.WithContext(l.WithContext(ctx))

		next.ServeHTTP(w, r)
	})
}

// your HTTP handler
func handler(w http.ResponseWriter, r *http.Request) {
	// retrieve the logger from the request context
	l := zerolog.Ctx(r.Context())

	// all subsequent logs will contain the contextual properties previously attached
	// to the logger along with any additional context added at log point
	l.Info().Str("doc_id", "doc-xyz").Msg("doc-xyz deleted")
}
```

Zerolog offers other notable features, including log volume reduction through
sampling, the ability to execute code before logging for transformation,
transportation or filtration purposes, logging to multiple destinations, and
automatic collection and formatting of stack traces when used with libraries
like [pkgerrors](https://github.com/pkg/errors) or
[xerrors](https://github.com/mdobak/go-xerrors).

See our [complete guide to Zerolog](https://betterstack.com/community/guides/logging/zerolog/) to learn more and view more complex
usage examples.

## 2. Zap

![zap.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0e34b564-ca62-4ba1-3c0d-4ff8454e7000/public
=1200x600)

[Zap](https://betterstack.com/community/guides/logging/go/zap/) grew out of Uber's frustration with the slow logging times recorded
on their high-performance servers. It pioneered the minimal allocations approach
that was eventually adopted and improved on by Zerolog, although the latter gave
up some flexibility to achieve the performance gains.

Zap closely follows Zerolog in terms of performance and memory allocations, but
outshines it when it comes to customization capabilities, allowing you to
closely tailor the framework to your specific needs.

This high level of customization is achieved through the
[Zapcore](https://pkg.go.dev/go.uber.org/zap/zapcore) package, which defines and
implements the low-level interfaces on which Zap is built. By creating alternate
implementations for these interfaces, you have the power to customize and extend
Zap's behavior in any way you desire.

Getting started with logging in Zap is made easier with the availability of
development and production presets. The former logs at the `DEBUG` level using a
human-friendly format, while the production preset logs in JSON format at the
`INFO` level. Unlike most logging frameworks, a pre-configured global logger is
not automatically available. It needs to be explicitly initialized before use.

```go
package main

import (
	"os"

	"go.uber.org/zap"
)

func init() {
	logger := zap.Must(zap.NewProduction())
	if os.Getenv("APP_ENV") == "development" {
		logger = zap.Must(zap.NewDevelopment())
	}

	zap.ReplaceGlobals(logger)
}

func main() {
	zap.L().Info("Hello from Zap!")
}
```

```text
[output]
{"level":"info","ts":1689166454.9876506,"caller":"slog/main.go:12","msg":"Hello from Zap!"}
```

Zap also has a unique approach to its logging APIs. It provides a base `Logger`
type which provides type-safety and the best possible performance at the cost of
verbosity, and the `SugaredLogger` type which wraps the `Logger` functionality
in a slower but less verbose API. You can use both APIs in the same codebase and
convert between them freely as you wish.

```go
func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	// only strongly typed fields can be used with a `Logger`
	logger.Info("user signed in",
		zap.Int("userid", 123456),
		zap.String("provider", "facebook"),
	)

	sugar := logger.Sugar()

	// `SugaredLogger` supports weakly typed contextual fields
	sugar.Infow("user signed in", "userid", 123456, "provider", "facebook")
}
```

Ensure to check out our [comprehensive guide to Zap](https://betterstack.com/community/guides/logging/go/zap/) for more details.

## 3. Slog

![slog.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b13d0f26-ba05-488f-764b-b68ecd976700/lg2x
=1200x600)

[Slog](https://betterstack.com/community/guides/logging/logging-in-go/) is the new built-in logging framework that
[just landed in Go 1.21](https://tip.golang.org/doc/go1.21), residing at
`log/slog`. It aims to address the need for a high-performance, structured, and
leveled logging solution in the Go standard library. While it provides a
pre-configured global logger like the `log` package, the default output format
is not structured. However, creating a custom `Logger` instance allows you to
change this behavior easily.

```go
package main

import (
    "log/slog"
)

func main() {
    slog.Debug("Debug message")

    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    logger.Debug("Debug message")
}
```

```text
[output]
2023/07/12 15:29:22 INFO Info message
{"time":"2023-07-12T15:29:22.89164153+02:00","level":"INFO","msg":"Info message"}
```

To understand how Slog works, there are three key aspects:

1. Slog offers a `Logger` frontend that provides level methods such as `Info()`,
   `Warn()`, and `Error()` for recording various events in the program.
2. Each log record created by the `Logger` is represented by the `Record` type.
3. The `Handler` type serves as the backend aspect of Slog. It determines how
   the log records are formatted and processed.

Slog provides two built-in handlers by default: `TextHandler` and `JSONHandler`.
The former produces [Logfmt output](https://betterstack.com/community/guides/logging/logfmt/), while the latter produces line-delimited
JSON. You can also use any alternative backends produced by the community or
create your own from scratch as you see fit.

```go
func main() {
	a := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	b := slog.New(slog.NewTextHandler(os.Stdout, nil))

	a.Info("Info message")
	b.Info("Info message")
}
```

```text
[output]
{"time":"2023-07-12T15:33:28.941701701+02:00","level":"INFO","msg":"Info message"}
time=2023-07-12T15:33:28.941+02:00 level=INFO msg="Info message"
```

You even also use existing third-party logging frameworks as backends for Slog
as long as they implement the `Handler` interface. Here's an example that uses
[Zap's official slog.Handler implementation](https://github.com/uber-go/zap/tree/master/exp/zapslog):

```go
package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/exp/zapslog"
	"golang.org/x/exp/slog"
)

func main() {
	zapLogger := zap.Must(zap.NewProduction())

	defer zapLogger.Sync()

	logger := slog.New(zapslog.NewHandler(zapLogger.Core()))

	logger.Info(
		"Using Slog frontend with Zap backend!",
		slog.Int("process_id", os.Getpid()),
	)
}
```

```json
[output]
{"level":"info","ts":1689301952.7301471,"msg":"Using Slog frontend with Zap backend!","process_id":1662258}
```

When it comes to logging APIs, Slog draws some inspiration from Zap. First, it
allows you to provide alternating key/value pairs for contextual logging.
Alternatively, you can opt for strongly typed attributes, which minimize
allocations and locking but increase verbosity. You can see a comparison of the
two approaches below:

```go
logger.Info(
	"incoming request",
	"method", "GET",
	"time_taken_ms", 158,
	"path", "/hello/world?q=search",
	"status", 200,
)

logger.LogAttrs(
	context.Background(),
	slog.LevelInfo,
	"incoming request",
	slog.String("method", "GET"),
	slog.Int("time_taken_ms", 158),
	slog.String("path", "/hello/world?q=search"),
	slog.Int("status", 200),
)
```

**Learn more**: [Logging in Go with Slog](https://betterstack.com/community/guides/logging/logging-in-go/)

## 4. Phuslu/log

![log-contrib.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d0456f02-d977-4a15-0403-ee8a84eb6900/public =1200x600)

[Phuslu/log](https://github.com/phuslu/log) (hereafter referred to as Phuslog)
is a high-performance logging framework that is highly inspired by Zerolog, even
sharing a largely similar API:

```go
package main

import (
	"os"
	"time"

	"github.com/phuslu/log"
)

func main() {
	log.Info().Msg("Hello from Phuslu logger")
}
```

```json
[output]
{"time":"2023-11-16T16:05:54.953+02:00","level":"info","message":"Hello from Phuslu logger"}
```

However, it aims to improve logging flexibility in log formatting and output
without compromising on performance. While Zerolog only offers JSON and CBOR
output, Phuslog supports Logfmt and TSV (Tab-Separated Values) in addition to
JSON:

```go
package main

import (
	"os"

	"github.com/phuslu/log"
)

func main() {
	l := log.Logger{
		Writer: &log.ConsoleWriter{
			Writer:    os.Stdout,
            [highlight]
			Formatter: log.LogfmtFormatter{"ts"}.Formatter,
            [/highlight]
		},
	}

	l.Info().Msg("Hello from Phuslu logger")
}
```

```json
[output]
ts=2023-11-16T16:15:59.264556037+02:00 level=info "Hello from Phuslu logger"
```

The following writers are provided to help you easily transmit your logs
wherever you want:

- `ConsoleWriter`: Logs a colorized, semi-structured, and human-friendly format
  to the underlying `io.Writer`.
- `FileWriter`: Logs to an auto-rotating file (by time or size).
- `MultiLevelWriter`: Dispatch logs to a multiple writers
- `SyslogWriter`: Writes logs to Syslog.
- `JournalWriter`: Logs to the Linux [Systemd
  journal](https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/).
- `EventlogWriter`: Logs to the Windows event log.
- `AsyncWriter`: Buffers logs to a data channel, and writes them asynchronously.

It also includes helper functions for accessing the currently executing
Goroutine ID, creating tracing IDs, and more. Learn more about Phuslog by
checking out it's [GitHub repo](https://github.com/phuslu/log)


## 5. Logrus

![logrus.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95b8be39-714d-4494-9945-6596d830cf00/md2x
=1200x600)

[Logrus](https://github.com/sirupsen/logrus) is one of the early pioneers of
structured logging in Go, but it's now no longer being actively developed. It
preserved compatibility with the built-in `log` package but added [log
levels](https://betterstack.com/community/guides/logging/log-levels-explained/), contextual logging, customizable output formats
and integration with popular logging tools.

By default, Logrus utilizes the `TextFormatter` type to generate semi-structured
and colorized output when logging to the terminal. However, it can be configured
to produce fully structured output in [JSON](https://betterstack.com/community/guides/logging/json-logging/) or [Logfmt](https://betterstack.com/community/guides/logging/logfmt/).

```go
package main

import (
	log "github.com/sirupsen/logrus"
)

func main() {
	log.SetFormatter(&log.JSONFormatter{})

	log.Info("Hello from Logrus!")
}
```

```json
[output]
{"level":"info","msg":"Hello from Logrus!","time":"2023-07-12T15:53:30+02:00"}
```

Context-aware logging is possible by using the `Fields` type which is an alias
for `map[string]interface{}`. However, there is no type-safe option for
contextual logging and its usage of maps is
[relatively inefficient](https://web.archive.org/web/20230201003600/http://hackemist.com/logbench/).

```go
func main() {
	log.SetFormatter(&log.JSONFormatter{})

	log.WithFields(log.Fields{
		"file":       "image.jpg",
		"size_bytes": 132932,
	}).Info("upload successful!")
}
```

```json
[output]
{"file":"image.jpg","level":"info","msg":"upload successful!","size_bytes":132932,"time":"2023-07-12T16:03:42+02:00"}
```

Logrus also supports hooks, allowing customization of the logging process. These
hooks enable actions such as sending logs to a
[log management service](https://betterstack.com/logs) or transforming and
filtering logs before they reach their final destination. With over
[80 hooks available](https://github.com/sirupsen/logrus/wiki/Hooks), you have a
wide range of options but if none of them suit your needs, you can always
implement the `Hook` interface to address specific use cases.

[ad-logs]

## 6. Log15

![log15.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8fcf7f37-0ec3-441c-7971-266b82ae0e00/lg2x
=1200x600)

[Log15](https://github.com/inconshreveable/log15) is a logging framework that
aims to produce logs that are both human-readable and machine-readable while
providing a logging API that is easy to understand and use. Getting started with
the framework is straightforward as it provides a pre-configured logger that is
ready for use.

```go
package main

import (
	log "github.com/inconshreveable/log15"
)

func main() {
	log.Info("Hello from Log15", "name", "John", "age", 20)
}
```

```text
[output]
INFO[07-12|16:15:06] Hello from Log15                         name=John age=20
```

The log message is the first argument to the level methods, followed by
alternating key/value pairs for additional context. You can also create a new
logger with some pre-defined fields by using the `New()` method. An alternative
to variadic arguments for specifying contextual data is the `Ctx` type which,
like Logrus' `Fields` type, is an alias for `map[string]inteface{}`.

```go
func main() {
	logger := log.New("env", "prod", "go_version", "1.20")

	logger.Info("Hello from Log15", "name", "John", "age", 20)
	logger.Error("Something unexpected happened", log.Ctx{
		"error": errors.New("an error"),
	})
}
```

```text
[output]
INFO[07-12|16:18:44] Hello from Log15                         env=prod go_version=1.20 name=John age=20
EROR[07-12|16:18:44] Something unexpected happened            env=prod go_version=1.20 error="an error"
```

When it comes to log formatting, the `Format` interface is provided along with a
few implementations such as `JsonFormat`, `LogFmtFormat`, and `TerminalFormat`.
The job of determining how and where log records are stored is left to the
`Handler` interface, which provides a composable way to achieve a logging setup
that suits your application.

```go
func main() {
	handler := log.StreamHandler(os.Stdout, log.JsonFormat())
	logger := log.New()
	logger.SetHandler(handler)

 	. . .
}
```

Some of the notable built-in `Handler` implementations include `StreamHandler`
which writes to any `io.Writer`, `FilterHandler` for filtering records,
`ChannelHandler` for writing logs to a channel, and `MultiHandler` for logging
to multiple destinations simultaneously.

## 7. Logf

![logf.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bbb5c1d8-2d54-4ec4-b42e-1fcc17125500/md2x
=1200x600)

[Logf](https://github.com/zerodha/logf) is a logging framework that's dedicated
to producing structured logs in the Logfmt format. It differentiates itself by
offering a minimal API, making it a suitable choice for those seeking simplicity
and a lightweight solution.

Logf provides five level methods: `Debug()`, `Info()`, `Warn()`, `Error()`, and
`Fatal()`. Each one accepts the log message as the first argument, followed by
alternating key/value pairs for contextual logging. It also supports adding
default fields to all logs produced by a `Logger` instance.

```go
package main

import (
	"time"

	"github.com/zerodha/logf"
)

func main() {
	logger := logf.New(logf.Opts{
		EnableColor:          true,
		Level:                logf.DebugLevel,
		EnableCaller:         true,
		TimestampFormat:      time.RFC3339Nano,
		DefaultFields:        []any{"go_version", "1.20"},
	})

	logger.Info("Hello from Logf!")
}
```

```text
[output]
timestamp=2023-07-12T16:40:08.086175967+02:00 level=info message="Hello from Logf!" caller=/home/ayo/dev/betterstack/demo/slog/main.go:19 go_version=1.20
```

The customization options are pretty minimal here. You can enable a colorized
output, set any `io.Writer` to be the destination of the logs, change the
timestamp format, set the default level, and enable the inclusion of the caller
in the output. If your requirements extend beyond these options, you may need to
explore other logging frameworks.

## 8. Apex/log

![apexlog.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cd6cc325-915a-4540-5338-65d38ce7bb00/md1x
=1200x600)

[Apex](https://github.com/apex/log) is another well-regarded structured logging
solution for Go. Although it has not seen recent updates, it remains a popular
choice for logging in Go. Inspired by Logrus, Apex enhances the logging API in
several ways:

- It provides a `WithField()` method for attaching single key/value pairs to a
  record, while `WithFields()` for adding multiple contextual pairs.
- Instead of Logrus' `Formatter` and `Hook` interfaces, Apex introduces a
  simpler `Handler` interface.
- [Several built-in handlers](https://github.com/apex/log/tree/master/handlers)
  are available customize the log format and transport the generated logs to
  centralized log management systems.
- Unique to Apex is its tracing support, which allows tracking operations, their
  durations, and any resulting errors with a single line of code.

Here's a basic example using Apex for logging:

```go
package main

import (
	"github.com/apex/log"
)

func main() {
	logger := log.WithFields(log.Fields{
		"app": "myapp",
		"env": "prod",
	})

	logger.Info("Hello from Apex logger")
}
```

```text
[output]
2023/07/12 11:46:34  info Hello from Apex logger    app=myapp env=prod
```

Without configuration, Apex produces a semi-structured log output where
contextual fields are outputted in the Logfmt format, while the standard fields
are presented as is without a corresponding key. However, it's easy to switch to
fully structured format by importing either the `json` or `logfmt` handlers and
using them as follows:

```go
package main

import (
	"os"

	"github.com/apex/log"
	"github.com/apex/log/handlers/logfmt"
)

func main() {
	stdout := logfmt.New(os.Stdout)

	log.SetHandler(stdout)
	logger := log.WithFields(log.Fields{
		"app": "myapp",
		"env": "prod",
	})

	logger.Info("Hello from Apex logger")
}
```

```json
[output]
timestamp=2023-07-12T11:47:18.796211807+02:00 level=info message="Hello from Apex logger" app=myapp env=prod
```

The `multi` handler allows logging using multiple formats or sending logs to
different destinations simultaneously:

```go
stdout := logfmt.New(os.Stdout)
stderr := json.New(os.Stderr)

[highlight]
log.SetHandler(multi.New(stdout, stderr))
[highlight]
```

Apex places contextual fields in a fields object when serializing log entries to
the JSON format. This approach ensures consistent schema, facilitating further
processing of log entries.

```text
[output]
timestamp=2023-07-12T11:50:22.470598627+02:00 level=info message="Hello from Apex logger" app=myapp env=prod
{"fields":{"app":"myapp","env":"prod"},"level":"info","timestamp":"2023-07-12T11:50:22.470598627+02:00","message":"Hello from Apex logger"}
```

You'll notice that Apex places contextual fields in a `fields` object when
serializing log entries to the JSON format. This approach ensures consistent
schema, facilitating further processing of log entries.

One notable feature of Apex is its tracing support, which allows for tracking
operations, their durations, and resulting errors without writing multiple
logging statements. By using the `Trace()` method with a deferred call, you can
conveniently generate logs that indicate the start and duration of an operation:

```go
package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/apex/log"
	"github.com/apex/log/handlers/logfmt"
)

func fetchRandomQuote(l log.Interface) (err error) {
	url := "https://api.quotable.io/random"

    [highlight]
	defer l.Trace("fetching random quote").Stop(&err)
    [/highlight]

	_, err = http.Get(url)

    return
}

func main() {
	stdout := logfmt.New(os.Stdout)

	log.SetHandler(stdout)
	logger := log.WithFields(log.Fields{
		"app": "myapp",
		"env": "prod",
	})

	fetchRandomQuote(logger)
}
```

The above is a minimal example that makes an HTTP GET request to an API
endpoint. The deferred `Trace()` call in the example above generates two logs:
one indicates the start of an HTTP request and the other displays the duration
and any errors encountered.

Here's the output if the HTTP request succeeds:

```text
[output]
timestamp=2023-07-12T11:34:53.007127029+02:00 level=info message="fetching random quote" app=myapp env=prod
timestamp=2023-07-12T11:34:54.013085863+02:00 level=info message="fetching random quote" app=myapp duration=1005 env=prod
```

If it fails, you will notice an `error` property in the second log entry:

```text
[output]
timestamp=2023-07-12T11:40:40.283743165+02:00 level=info message="fetching random quote" app=myapp env=prod
timestamp=2023-07-12T11:40:40.284696226+02:00 level=error message="fetching random quote" app=myapp duration=0 env=prod error="Get \"https://api.quotable.i/random\": dial tcp: lookup api.quotable.i: no such host"
```

## 9 Logr

![logr.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/11bdc567-9da7-4467-e689-bb70a3438000/lg1x
=1200x600)

[Logr](https://github.com/go-logr/logr) is an abstraction for Go programs that
offers a way to implement logging without being tied to a particular
implementation. It offers a `Logger` type that provides a simple API for
emitting logs, but the actual formatting and writing of the records is left to
types that implement `LogSink` interface.

The general idea is that application and library authors use methods on the
`Logger` type to write logging statements, but the actual logging functionality
is provided by any logging framework that implements the `LogSink` interface.
This makes the logging interface remains the same no matter what underlying
framework you choose.

Here's a simple example using a Zerolog implementation via
[go-logr/zerologr](https://github.com/go-logr/zerologr):

```go
package main

import (
	"errors"
	"os"

	"github.com/go-logr/logr"
	"github.com/go-logr/zerologr"
	"github.com/rs/zerolog"
)

func main() {
	zl := zerolog.New(os.Stderr)
	zl = zl.With().Caller().Timestamp().Logger()

	var log logr.Logger = zerologr.New(&zl)

	log.Info("hello from Logr and Zerolog!")
	log.Error(
		errors.New("file not found"),
		"file open failed",
		"file_path",
		"/home/john/abc.txt",
	)
}
```

```json
[output]
{"level":"info","v":0,"caller":"/home/ayo/dev/betterstack/demo/slog/main.go:18","time":"2023-07-13T07:56:45+02:00","message":"hello from Logr and Zerolog!"}
{"level":"error","error":"file not found","file_path":"/home/john/abc.txt","caller":"/home/ayo/dev/betterstack/demo/slog/main.go:19","time":"2023-07-13T07:56:45+02:00","message":"file open failed"}
```

The `Logger` API provides only two methods for creating logs:

```go
Info(Info(msg string, keysAndValues ...interface{})
Error(err error, msg string, keysAndValues ...interface{})
```

With the `zerologr` implementation, these methods map to Zerolog's `info` and
`error` levels directly. To log at other levels, you need to set the verbosity
level using the `V()` method and chain the `Info()` method to the resulting
logger:

```go
log.V(0).Info("level 0") // the default, mappped to zerolog.InfoLevel
log.V(1).Info("level 1") // mapped to zerolog.DebugLevel
log.V(2).Info("level 2") // mapped to zerolog.TraceLevel
```

The idea here is that the higher the number, the less severe the log entry.
Since `zerolog.TraceLevel` is the lowest severity in Zerolog, using a number
higher than 2 will not produce any output.

It may take a little experimenting to fully understand the ideas espoused by
Logr, and with the release of Slog, it makes more sense to use its abstraction
for new projects as it is sure to be more widely adopted.

[summary]

## Side note: Visualize your Go logs in real-time

Stop grepping through log files. [Better Stack](https://betterstack.com/logs) transforms your structured logs from Slog, Zerolog, or Zap into queryable dashboards—filter by any field, track error rates, and spot performance bottlenecks instantly.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]

## Final thoughts

The introduction of the `log/slog` package changes the game when it comes to
logging solutions in Go. By leaning on many of the prior innovations, it
succeeds in bringing a high-performance logging framework to the standard
library that should cover most needs. It is safe to say that it has now made
using libraries using older techniques like Apex, Log15, Logurs, and Logr mostly
obsolete.

However, libraries like Zerolog, Phuslu/log and Zap will definitely remain
relevant for the foreseeable future due to their performance and unique
features. As demonstrated above, you can even use them as alternate backends for
Slog if its built-in handlers don't quite meet up to your expectations.

One knock against Slog is its overly convoluted logging API for guaranteeing
strongly-typed fields. However, the ability to switch out the underlying
framework without affecting the API is a massive plus that should make logging
in the Go ecosystem more seamless and consistent.

Thanks for reading, and happy logging!