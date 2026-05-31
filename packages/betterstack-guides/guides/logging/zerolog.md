# A Complete Guide to Logging in Go with Zerolog

[Zerolog](https://github.com/rs/zerolog) is a high-performance, zero-allocation
Go [logging library](https://betterstack.com/community/guides/logging/zerolog/). It provides structured logging
capabilities for latency-sensitive applications where garbage collection is
undesirable. You can use in a completely zero-allocation manner such that after
the logger object is initialized, no further objects will be allocated on the
heap, thus preventing the garbage collector from being triggered.

This tutorial will explain how to install, set up, and use the Zerolog logger in
a Go application. We'll start by going through its API and all the options it
provides, and show how to customize them in various ways. Finally, we'll
describe how to use it in a typical web application so you can get a good idea
of how to adopt it in your projects.

## Prerequisites

Before following through with this tutorial, ensure that you have the
[latest version of Go](https://go.dev/dl/) installed on your computer. If you're
just getting started with logging in Go, you may want to check out [our guide on
the standard library log package](https://betterstack.com/community/guides/logging/logging-in-go/) to get an idea of what you can
do with it before moving on to this one.

[summary]
### Centralize your logs with Better Stack

While Zerolog handles structured logging in your application, [Better Stack](https://betterstack.com/log-management) provides centralized log management with live tailing, SQL and PromQL queries, automated anomaly detection, and incident management.


[Start free in minutes](https://betterstack.com/log-management)

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]
## Getting started with Zerolog

Zerolog may be installed in any Go project through the command below:

```command
go get -u github.com/rs/zerolog/log
```

The library provides a preconfigured and globally available logger that you can
import and use in any file via the `zerolog/log` package:

```go
package main

import (
	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog global logger")
}
```

The above program outputs a [JSON formatted log entry](https://betterstack.com/community/guides/logging/json-logging/) to the console:

```json
[output]
{"level":"info","time":"2022-08-18T13:45:51+01:00","message":"Hello from global logger"}
```

The global logger prints to the standard error by default, and it is also
configured to log at the `TRACE` level though you can set a different
[minimum level](https://pkg.go.dev/github.com/rs/zerolog?utm_source=godoc#Level)
by calling the `SetGlobalLevel()` function provided by the primary `zerolog`
package:

```go
package main

import (
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	zerolog.SetGlobalLevel(zerolog.ErrorLevel)
	log.Info().Msg("Info message")
	log.Error().Msg("Error message")
}
```

```json
[output]
{"level":"error","time":"2022-08-18T13:51:44+01:00","message":"Error message"}
```

Aside from logging in JSON, you can also configure Zerolog to output binary logs
encoded in [CBOR](https://cbor.io/) format. You can enable it by using the
`binary_log` build tag while compiling your application:

```command
go build -tags binary_log .
```

When executing the resulting binary, you will observe an output that looks like
this:

```text
[output]
eleveleerrordtimeAAPwgmessagemError message⏎
```

You can decode this binary log entry to JSON with any CBOR decoder, such as
[csd](https://github.com/toravir/csd/)

```command
./main 2> >(csd)
```

```json
[output]
{"level":"error","time":"2022-08-31T11:57:18.764748096-07:00","message":"Error message"}
```

You may find outputting your logs in CBOR format useful if your log entries are
large and you want to compact them for long-term storage, and it's effortless to
convert back to JSON when needed.

## Exploring the Zerolog API

Zerolog offers a simple structured logging API that is easy to understand and
use. Its `Logger` type represents any active logger that writes to some
`io.Writer` interface, which, for the global logger (`zerolog/log`), is
`os.Stderr`. You can create a new custom `Logger` using the `zerolog.New()`
method:

```go
package main

import (
	"os"

	"github.com/rs/zerolog"
)

func main() {
	logger := zerolog.New(os.Stdout)
	logger.Trace().Msg("Trace message")
}
```

```json
[output]
{"level":"trace","message":"Trace message"}
```

### Log levels

Each logger provides a method that corresponds to the seven [log
levels](https://betterstack.com/community/guides/logging/log-levels-explained/) offered by Zerolog, which are listed below along
with their integer priority values:

- `TRACE` (-1): for tracing the code execution path.
- `DEBUG` (0): messages useful for troubleshooting the program.
- `INFO` (1): messages describing the normal operation of an application.
- `WARNING` (2): for logging events that need may need to be checked later.
- `ERROR` (3): error messages for a specific operation.
- `FATAL` (4): severe errors where the application cannot recover. `os.Exit(1)`
  is called after the message is logged.
- `PANIC` (5): similar to `FATAL`, but `panic()` is called instead.

You can set any of the above levels as the minimum level for a custom `Logger`
through the `Level()` method. You can pass the integer priority number shown
above or use the
[level constants](https://pkg.go.dev/github.com/rs/zerolog?utm_source=godoc#Level)
provided on the `zerolog` package (`TraceLevel`, `DebugLevel`, etc):

```go
logger := zerolog.New(os.Stdout).Level(zerolog.InfoLevel)
```

The above snippet configures the `logger` to only output logs with `INFO`
severity or greater. You can also set the minimum level through an environmental
variable (demonstrated later in this tutorial).

### Adding contextual data to your logs

When you call the leveled method corresponding to the log level of choice
(`Info()`, `Debug()`, etc), a
[zerolog.Event](https://pkg.go.dev/github.com/rs/zerolog?utm_source=godoc#Event)
type is returned which represents a log event. This `Event` type provides
several methods that allow you to add properties to its context (in the form of
key-value pairs) so that the log entry contains enough contextual data that aids
your understanding of the event. For example, you may include the user ID or
client information (like IP address) when logging the creation of a resource on
your server which makes it easy to filter your logs later through such
properties.

Most methods on the `Event` type return a pointer to the `Event` so you can
chain them as needed at log point. Once you've added all the necessary context
to the `Event`, you must call one of the `Msg()` `Msgf()`, `MsgFunc()` or
`Send()` methods to finalize the `Event`. Usually, the `Msg()` method will be
used for closing the `Event` by adding a `message` field to the log entry.

```go
logger.Info().
  Str("name", "john").
  Int("age", 22).
  Bool("registered", true).
  Msg("new signup!")
```

```json
[output]
{"level":"info","name":"john","age":22,"registered":true,"message":"new signup!"}
```

If you desire to omit the `message` field, you can call pass an empty string to
`Msg()` or use `Send()` instead:

```go
logger.Info().
  Str("name", "john").
  Int("age", 22).
  Bool("registered", true).
  Send()
```

```json
[output]
{"level":"info","name":"john","age":22,"registered":true}
```

Note that one event closing method must always be called last on a
`zerolog.Event` so that the corresponding entry is logged. If none of those
methods are used, the log entry will not be recorded.

```go
logger.Info().
  Str("name", "john").
  Int("age", 22).
  Bool("registered", true)
```

```text
[output]
```

Also, take care to finalize an `Event` just once with `Msg()` or `Send()` o prevent unexpected behaviour:

```go
// The zerolog.Event is finalized twice here. Don't do this
event := logger.Info()
event.Msg("Info message")
event.Msg("Info message")
```

This should never happen in practice if you stick to zerolog's chained API and never store `Event`s in variables.

### Adding global context to a Logger

In the previous section, you discovered how to use methods on the
`zerolog.Event` type to add relevant context to a log entry. This section will
go one step further and show you how to add contextual data to the `Logger`
itself to ensure that such data is included in all subsequent records produced
by the logger.

There are two main ways to add context to a Zerolog `Logger`. The first involves
using the `With()` method which returns a
[zerolog.Context](https://pkg.go.dev/github.com/rs/zerolog?utm_source=godoc#Context)
instance that allows you to add additional properties to the logger in key-value
pairs through field methods similar to those on the `zerolog.Event` type. Then,
after adding the necessary data to the context, you must call the `Logger()`
method to return a new `Logger` object with the updated context.

```go
package main

import (
	"os"

	"github.com/rs/zerolog"
)

func main() {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

	logger.Info().Msg("info message")
	logger.Debug().Str("username", "joshua").Send()
}
```

```json
[output]
{"level":"info","time":"2022-08-31T21:00:29+01:00","message":"info message"}
{"level":"debug","username":"joshua","time":"2022-08-31T21:00:29+01:00"}
```

The snippet above adds the `time` field to all records produced by the `logger`
which makes sense since all log records are expected to include a timestamp. You
can also add the file and line number to all log entries as follows:

```go
func main() {
	logger := zerolog.New(os.Stdout).With().Timestamp().Caller().Logger()

	logger.Info().Msg("info message")
	logger.Debug().Str("username", "joshua").Send()
}
```

```json
[output]
{"level":"info","time":"2022-08-31T21:20:04+01:00","caller":"/home/user/dev/main.go:12","message":"info message"}
{"level":"debug","username":"joshua","time":"2022-08-31T21:20:04+01:00","caller":"/home/user/dev/main.go:13"}
```

Since the `Logger()` method returns a brand new `Logger`, you can use the
`With()` method to implement child loggers that annotate all logs in a certain
scope with relevant metadata that differentiates them from other records. Here's
a contrived example that demonstrates how this could work:

```go
package main

import (
	"os"

	"github.com/rs/zerolog"
)

var logger = zerolog.New(os.Stdout).With().Timestamp().Logger()

func main() {
	mainLogger := logger.With().Str("service", "main").Logger()
	mainLogger.Info().Msg("main logger message")

	auth()
	admin()
}

func auth() {
	authLogger := logger.With().Str("service", "auth").Logger()
	authLogger.Info().Msg("auth logger message")
}

func admin() {
	adminLogger := logger.With().Str("service", "admin").Logger()
	adminLogger.Info().Msg("admin logger message")
}
```

```json
[output]
{"level":"info","service":"main","time":"2022-08-31T21:13:51+01:00","message":"main logger message"}
{"level":"info","service":"auth","time":"2022-08-31T21:13:51+01:00","message":"auth logger message"}
{"level":"info","service":"admin","time":"2022-08-31T21:13:51+01:00","message":"admin logger message"}
```

The second way to global metadata to a `Logger` is through the use of the
`UpdateContext()` method. This method updates the `Logger`'s internal context in
place (without creating a copy), and you can use it like this:

```go
func main() {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

  [highlight]
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("name", "john")
	})
  [/highlight]

	logger.Info().Msg("info message")
}
```

```json
[output]
{"level":"info","name":"john","time":"2022-09-01T09:25:20+01:00","message":"info message"}
```

### Prettifying your logs in development

In development environments, you might find it helpful to output the log entries
from your application in a more human-readable format so that it's easy to spot
the various events without being distracted by irrelevant symbols and fields.
Zerolog provides a
[ConsoleWriter](https://pkg.go.dev/github.com/rs/zerolog?utm_source=godoc#ConsoleWriter)
type that parses the original JSON entry and writes it in a colorized format to
your preferred destination.

```go
package main

import (
	"os"
	"runtime/debug"
	"time"

	"github.com/rs/zerolog"
)

func main() {
	buildInfo, _ := debug.ReadBuildInfo()

	logger := zerolog.New(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339}).
		Level(zerolog.TraceLevel).
		With().
		Timestamp().
		Caller().
		Int("pid", os.Getpid()).
		Str("go_version", buildInfo.GoVersion).
		Logger()

	logger.Trace().Msg("trace message")
	logger.Debug().Msg("debug message")
	logger.Info().Msg("info message")
	logger.Warn().Msg("warn message")
	logger.Error().Msg("error message")
	logger.WithLevel(zerolog.FatalLevel).Msg("fatal message")
	logger.WithLevel(zerolog.PanicLevel).Msg("panic message")
}
```

```text
[output]
2022-09-01T10:03:06+01:00 TRC main.go:23 > trace message go_version=go1.19 pid=2616969
2022-09-01T10:03:06+01:00 DBG main.go:24 > debug message go_version=go1.19 pid=2616969
2022-09-01T10:03:06+01:00 INF main.go:25 > info message go_version=go1.19 pid=2616969
2022-09-01T10:03:06+01:00 WRN main.go:26 > warn message go_version=go1.19 pid=2616969
2022-09-01T10:03:06+01:00 ERR main.go:27 > error message go_version=go1.19 pid=2616969
2022-09-01T10:03:06+01:00 FTL main.go:28 > fatal message go_version=go1.19 pid=2616969
2022-09-01T10:03:06+01:00 PNC main.go:29 > panic message go_version=go1.19 pid=2616969
```

![Zerolog Console Writer Showing prettified logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/de1a5be5-3b0b-456c-ab4c-b16dc7a13f00/public =844x390)

You can use the options provided on the `ConsoleWriter` type to customize the
appearance and formatting of the output:

```go
zerolog.ConsoleWriter{
	Out:        os.Stderr,
	TimeFormat: time.RFC3339,
	FormatLevel: func(i interface{}) string {
		return strings.ToUpper(fmt.Sprintf("[%s]", i))
	},
	FormatMessage: func(i interface{}) string {
		return fmt.Sprintf("| %s |", i)
	},
	FormatCaller: func(i interface{}) string {
		return filepath.Base(fmt.Sprintf("%s", i))
	},
	PartsExclude: []string{
		zerolog.TimestampFieldName,
	},
}
```

```text
[output]
[TRACE] main.go:41 | trace message | go_version=go1.19 pid=2632311
[DEBUG] main.go:42 | debug message | go_version=go1.19 pid=2632311
[INFO] main.go:43 | info message | go_version=go1.19 pid=2632311
[WARN] main.go:44 | warn message | go_version=go1.19 pid=2632311
[ERROR] main.go:45 | error message | go_version=go1.19 pid=2632311
[FATAL] main.go:46 | fatal message | go_version=go1.19 pid=2632311
[PANIC] main.go:47 | panic message | go_version=go1.19 pid=2632311
```

![Zerolog ConsoleWriter customization output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/061da108-9472-4e46-f3bc-6d7a9ca8a700/public =844x390)

Notice how the timestamp is now excluded from the output and how the formatting
of the log levels, caller information, and log message are different. The
formatted fields are also no longer colorized, but you can use a library like
[pterm](https://github.com/pterm/pterm) or
[gookit/color](https://github.com/gookit/color) to colorize the output.

Take care not to use the `ConsoleWriter` in production, as it will slow down
your logging significantly. It is only provided to help make your logs easier to
read when developing your application. You can use an environmental variable to
enable the `ConsoleWriter` output in development only:

```go
var output io.Writer = zerolog.ConsoleWriter{...}
if os.Getenv("GO_ENV") != "development" {
  output = os.Stderr
}
```

### Log sampling with Zerolog

Sampling is a technique used to intentionally drop repetitive log entries so
that only a proportion of them are kept and processed without sacrificing the
insights derived from the logs. This is helpful when your highly trafficked
application is producing a massive amount of records, and storing every single
one will lead to excessive storage and processing costs which may not be
desirable. Sampling fixes this problem by preventing the same logs from being
recorded hundreds or thousands of times per second which prevents resources from
being used up unnecessarily.

Here's the most basic way to sample logs with Zerolog:

```go
func main() {
	log := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
		Sample(&zerolog.BasicSampler{N: 5})

	for i := 1; i <= 10; i++ {
		log.Info().Msgf("a message from the gods: %d", i)
	}
}
```

In this example, the `BasicSampler` configures the `Logger` such that each log
is only recorded once out of five times. This is demonstrated in the `for` loop
where the `INFO` message would normally be logged ten times, but due to
sampling, it is logged only twice:

```json
[output]
{"level":"info","time":"2022-09-02T08:05:48+01:00","message":"a message from the gods: 1"}
{"level":"info","time":"2022-09-02T08:05:48+01:00","message":"a message from the gods: 6"}
```

Zerolog provides other more sophisticated samplers that may be more appropriate
for your application. For example, the `BurstSampler` can be used to restrict
the number of logs that are recorded in an amount of time:

```go
func main() {
	l := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
		Sample(&zerolog.BurstSampler{
			Burst:  3,
			Period: 1 * time.Second,
		})

	for i := 1; i <= 10; i++ {
		l.Info().Msgf("a message from the gods: %d", i)
		l.Warn().Msgf("warn message: %d", i)
		l.Error().Msgf("error message: %d", i)
	}
}
```

Here, the `BurstSampler` configuration restricts the `Logger` from producing
more than three log entries every second. Every other record that would have
otherwise been logged within the specified will be discarded. The `for` loop
above should log 30 messages without sampling, but due to the configuration
above, it logs only three:

```json
[output]
{"level":"info","time":"2022-09-02T08:20:47+01:00","message":"a message from the gods: 1"}
{"level":"warn","time":"2022-09-02T08:20:47+01:00","message":"warn message: 1"}
{"level":"error","time":"2022-09-02T08:20:47+01:00","message":"error message: 1"}
```

You may only apply sampling to a specific level as shown below:

```go
burstSampler := &zerolog.BurstSampler{
	Burst:       3,
	Period:      1 * time.Second,
	NextSampler: &zerolog.BasicSampler{N: 5},
}

l := zerolog.New(os.Stdout).
	With().
	Timestamp().
	Logger().
	Sample(zerolog.LevelSampler{
		WarnSampler: burstSampler,
		InfoSampler: burstSampler,
	})
```

Here, only the `INFO` and `WARN` logs will be sampled, while the others are
logged as usual, thus producing the following output:

```json
{"level":"info","time":"2022-09-02T08:26:42+01:00","message":"a message from the gods: 1"}
{"level":"warn","time":"2022-09-02T08:26:42+01:00","message":"warn message: 1"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 1"}
{"level":"info","time":"2022-09-02T08:26:42+01:00","message":"a message from the gods: 2"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 2"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 3"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 4"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 5"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 6"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 7"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 8"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 9"}
{"level":"error","time":"2022-09-02T08:26:42+01:00","message":"error message: 10"}
```

As you can see, the `INFO` message is logged twice and `WARN` is logged once
(totalling three logs), while all 10 `ERROR` logs are recorded since its not
being sampled. If you want each level to be sampled differently, you must create
a different sampling strategy for each one such as `infoSampler`, `warnSampler`
etc.

```go
func main() {
	infoSampler := &zerolog.BurstSampler{
		Burst:  3,
		Period: 1 * time.Second,
	}

	warnSampler := &zerolog.BurstSampler{
		Burst:  3,
		Period: 1 * time.Second,
		// Log every 5th message after exceeding the burst rate of 3 messages per
		// second
		NextSampler: &zerolog.BasicSampler{N: 5},
	}

	errorSampler := &zerolog.BasicSampler{N: 2}

	l := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
		Sample(zerolog.LevelSampler{
			WarnSampler:  warnSampler,
			InfoSampler:  infoSampler,
			ErrorSampler: errorSampler,
		})

	for i := 1; i <= 10; i++ {
		l.Info().Msgf("a message from the gods: %d", i)
		l.Warn().Msgf("warn message: %d", i)
		l.Error().Msgf("error message: %d", i)
	}
}
```

In this scenario, a different sampling strategy is defined for the `INFO`,
`WARN`, and `ERROR` levels while other levels are logged normally. The
`infoSampler` is the sample configuration we used in the previous snippet (log 3
messages per second and discard all others), while the `warnSampler` uses the
`NextSampler` property to log each 5th message after the burst rate is exceeded.
The `errorSampler` uses the `BasicSampler` strategy alone and logs every second
log message. This configuration produces the following results:

```json
[output]
{"level":"info","time":"2022-09-02T08:40:58+01:00","message":"a message from the gods: 1"}
{"level":"warn","time":"2022-09-02T08:40:58+01:00","message":"warn message: 1"}
{"level":"error","time":"2022-09-02T08:40:58+01:00","message":"error message: 1"}
{"level":"info","time":"2022-09-02T08:40:58+01:00","message":"a message from the gods: 2"}
{"level":"warn","time":"2022-09-02T08:40:58+01:00","message":"warn message: 2"}
{"level":"info","time":"2022-09-02T08:40:58+01:00","message":"a message from the gods: 3"}
{"level":"warn","time":"2022-09-02T08:40:58+01:00","message":"warn message: 3"}
{"level":"error","time":"2022-09-02T08:40:58+01:00","message":"error message: 3"}
{"level":"warn","time":"2022-09-02T08:40:58+01:00","message":"warn message: 4"}
{"level":"error","time":"2022-09-02T08:40:58+01:00","message":"error message: 5"}
{"level":"error","time":"2022-09-02T08:40:58+01:00","message":"error message: 7"}
{"level":"warn","time":"2022-09-02T08:40:58+01:00","message":"warn message: 9"}
{"level":"error","time":"2022-09-02T08:40:58+01:00","message":"error message: 9"}
```

Notice how the `INFO` message is logged thrice (all others produced within the
second are discarded), the `WARN` message is logged thrice following the burst
rate, and two additional times according to the strategy defined in the
`NextSampler` property. Finally, the `ERROR` message is logged five times
instead of ten (1 in 2).

Zerolog also provides the global `DisableSampling()` method for enabling or
disabling all forms of sampling in all `Logger`s. It takes a boolean argument
that controls whether to enable or disable log sampling, which may be helpful
when you need to update your configuration on the fly in response to certain
events.

### Hooks in Zerolog

Zerolog provides a way to hook into the logging process through the
[Hook](https://pkg.go.dev/github.com/rs/zerolog?utm_source=godoc#Hook) interface
which is defined as follows:

```go
type Hook interface {
	// Run runs the hook with the event.
	Run(e *zerolog.Event, level zerolog.Level, message string)
}
```

When you implement the `Hook` interface on a concrete type, you can use the
`Logger.Hook()` method to apply it to a `Logger` such that its `Run()` method is
executed each time a log is recorded. You can then run different actions based
on the log level of the event or some other criteria.

Here's an example that sends messages logged at the `ERROR` level or higher to a
Telegram channel:

```go
package main

import (
	"context"
	"os"
	"time"

	"github.com/nikoksr/notify"
	"github.com/nikoksr/notify/service/telegram"
	"github.com/rs/zerolog"
)

var wg sync.WaitGroup

type TelegramHook struct{}

func (t *TelegramHook) Run(
	e *zerolog.Event,
	level zerolog.Level,
	message string,
) {
	if level > zerolog.WarnLevel {
		wg.Add(1)
		go func() {
			_ = notifyTelegram("", message)
			wg.Done()
		}()
	}
}

func notifyTelegram(title, msg string) error {
  [highlight]
	telegramService, err := telegram.New(
		"<telegram bot token>",
	)
  [/highlight]
	if err != nil {
		return err
	}

  [highlight]
	telegramService.AddReceivers("<chat id>")
  [/highlight]

	notifier := notify.New()

	notifier.UseServices(telegramService)

	ctx, cancel := context.WithTimeout(
		context.Background(),
		30*time.Second,
	)

	defer cancel()

	return notifier.Send(ctx, title, msg)
}

func main() {
	logger := zerolog.New(os.Stdout).
		Level(zerolog.TraceLevel).
		With().
		Timestamp().
		Logger()

	logger = logger.Hook(&TelegramHook{})

	logger.Trace().Msg("trace message")
	logger.Debug().Msg("debug message")
	logger.Info().Msg("info message")
	logger.Warn().Msg("warn message")
	logger.Error().Msg("error message")
	logger.WithLevel(zerolog.FatalLevel).Msg("fatal message")
	logger.WithLevel(zerolog.PanicLevel).Msg("panic message")

	wg.Wait()
}
```

The program above creates a `TelegramHook` type that implements the
`zerolog.Hook` interface. Its `Run()` method checks the level of the message
being logged and sends it off to a Telegram channel if it is more severe than
the `WARN` level. If you run the program (after replacing the highlighted
placeholders above), you will observe that every log message is printed to the
console and the `ERROR`, `FATAL`, and `PANIC` logs are also sent to the
configured Telegram channel.

![Zerolog Demo in Telegram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/376ba6f5-6991-407a-a7a5-d50a2b719d00/public =836x660)

## Logging errors with Zerolog

Logging unexpected errors is one of the most important things you can do to
ensure that bugs are detected and fixed quickly, so a logging framework must be
well equipped to do this satisfactorily. Zerolog provides a few helpers to log
errors which we will demonstrate in this section.

The easiest way to log an error with Zerolog is to log at the `ERROR` level and
use the `Err()` method on the resulting `zerolog.Event`. This adds an `error`
property to the log entry that contains the details of the error in question:

```go
logger.Error().
  Err(errors.New("file open failed")).
  Msg("something happened!")
```

```json
[output]
{"level":"error","error":"file open failed","time":"2022-08-31T22:59:07+01:00","message":"something happened!"}
```

You can change the field name for errors to some other value by changing the
value of `zerolog.ErrorFieldName`:

```go
zerolog.ErrorFieldName = "err"

logger.Error().
  Err(errors.New("file open failed")).
  Msg("something happened!")
```

```json
[output]
{"level":"error","err":"file open failed","time":"2022-08-31T22:59:07+01:00","message":"something happened!"}
```

While the above output gives you details about the error that occurred, it does
not show the path of code execution that led to the error which can be crucial
for debugging the issue. You can fix this by including a stack trace in your
error log through the `Stack()` method on an `Event`, but before it can have an
effect, you must assign `zerolog.ErrorStackMarshaler` to a function that can
extract stack traces from an error. You can combine
[pkg/errors](https://github.com/pkg/errors) with the
[zerolog/pkgerrors](https://pkg.go.dev/github.com/rs/zerolog@v1.27.0/pkgerrors)
helper to add a stack trace to an error log as follows:

```go
package main

import (
	"os"

	"github.com/pkg/errors"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
)

func main() {
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	logger.Error().
		Stack().
		Err(errors.New("file open failed!")).
		Msg("something happened!")
}
```

```json
[output]
{"level":"error","stack":[{"func":"main","line":"19","source":"main.go"},{"func":"main","line":"250","source":"proc.go"},{"func":"goexit","line":"1594","source":"asm_amd64.s"}],"error":"file open failed!","time":"2022-08-24T21:52:24+01:00","message":"something happened!"}
```

Notice how the `stack` property contains a JSON formatted stack trace that
describes the program's execution leading up to the error. This information can
be precious when investigating unexpected errors in your application.

You can also use the `FATAL` or `PANIC` levels to log particularly severe errors
where the application cannot recover. Note that logging at the `FATAL` level
causes the program to exit immediately with an exit status of `1` while the
`PANIC` level will call `panic()` after logging the message.

```go
err := errors.New("failed to connect to database")
logger.Fatal().Err(err).Msg("something catastrophic happened!")
```

```text
[output]
{"level":"fatal","error":"failed to connect to database","time":"2022-09-01T09:34:49+01:00","message":"something catastrophic happened!"}
exit status 1
```

If you want to log a `FATAL` or `PANIC` level message without calling
`os.Exit(1)` and `panic()` respectively, you must use the `WithLevel()` method
as shown below:

```go
err := errors.New("failed to connect to database")
logger.WithLevel(zerolog.FatalLevel).
  Err(err).
  Msg("something catastrophic happened!")
```

The program will not exit immediately anymore, but the event is still logged at
the appropriate level:

```json
[output]
{"level":"fatal","error":"failed to connect to database","time":"2022-09-01T09:35:27+01:00","message":"something catastrophic happened!"}
```

## Logging to a file

The options for logging into a file with Zerolog are pretty much the same as
when using the standard library log package. Since you can pass a type that
implements the `io.Writer` interface to `zerolog.New()` method, any `os.File`
instance will work as expected as long as the file is opened with the proper
permissions.

```go
package main

import (
	"os"

	"github.com/rs/zerolog"
)

func main() {
	file, err := os.OpenFile(
		"myapp.log",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY,
		0664,
	)
	if err != nil {
		panic(err)
	}

	defer file.Close()

	logger := zerolog.New(file).With().Timestamp().Logger()

	logger.Info().Msg("Info message")
}
```

After executing the above program, you'll notice that a `myapp.log` file is
present in the current directory. You can view its contents to verify that
logging into the file works as expected:

```command
cat myapp.log
```

```json
[output]
{"level":"info","time":"2022-08-27T11:38:27+01:00","message":"Info message"}
```

Read our article on [Logging in Go](https://betterstack.com/community/guides/logging/logging-in-go/) to learn more about other
strategies for logging into files, their pros and cons, and how to rotate the
log files so they don't grow too large and eat up your server disk space.

## Using Zerolog in a web application

Now that we've covered Zerolog's most essential concepts, let's look at a
practical example of how to use it for logging in a Go web application. We'll
utilize
[an application that searches Wikipedia](https://github.com/betterstack-community/wikipedia-demo)
for this demonstration (see the
[logging branch](https://github.com/betterstack-community/wikipedia-demo/tree/logging)
for the final result).

Clone the
[GitHub repository](https://github.com/betterstack-community/wikipedia-demo.git)
to your computer through the command below:

```command
git clone https://github.com/betterstack-community/wikipedia-demo.git
```

Afterward, change into the newly created directory:

```command
cd wikipedia-demo
```

Before we start the server, let's install the
[air](https://github.com/cosmtrek/air) utility for live reloading the app in
development:

```command
go install github.com/cosmtrek/air@latest
```

You can now start the server by running the command below:

```command
air
```

```text
[output]
  __    _   ___
 / /\  | | | |_)
/_/--\ |_| |_| \_ , built with Go

watching .
!exclude assets
watching logger
!exclude tmp
building...
running...
2022/09/02 11:02:35 Starting Wikipedia App Server on port '3000'
```

Once the server is running, visit [http://localhost:3000](http://localhost:3000)
in your browser and initiate a search query to confirm that the application
works:

![Wikipedia Demo for Zerolog](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/54739568-023b-44ea-8c9c-5ff58f5f8b00/public =839x768)

Now, open the contents of the `main.go` file in your code editor:

```command
code main.go
```

This simple web application consists of two handlers, the `indexHandler()` for
rendering the homepage, and the `searchHandler()`, for processing each search
query. We are currently using the built-in `log` package to log errors a few
places, but they will be updated to use Zerolog in subsequent sections.

Go ahead and install the `zerolog` package to your project using the command
below:

```command
go get -u github.com/rs/zerolog/log
```

Once installed, create a new `logger` package and a `logger.go` file within the
package as shown below:

```command
mkdir logger
```

```command
code logger/logger.go
```

Populate the `logger.go` file with the following code:

```go
[label logger/logger.go]
package logger

import (
	"io"
	"os"
	"runtime/debug"
	"strconv"
	"sync"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
	"gopkg.in/natefinch/lumberjack.v2"
)

var once sync.Once

var log zerolog.Logger

func Get() zerolog.Logger {
	once.Do(func() {
		zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
		zerolog.TimeFieldFormat = time.RFC3339Nano

		logLevel, err := strconv.Atoi(os.Getenv("LOG_LEVEL"))
		if err != nil {
			logLevel = int(zerolog.InfoLevel) // default to INFO
		}

		var output io.Writer = zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: time.RFC3339,
		}

		if os.Getenv("APP_ENV") != "development" {
			fileLogger := &lumberjack.Logger{
				Filename:   "wikipedia-demo.log",
				MaxSize:    5, //
				MaxBackups: 10,
				MaxAge:     14,
				Compress:   true,
			}

			output = zerolog.MultiLevelWriter(os.Stderr, fileLogger)
		}

		var gitRevision string

		buildInfo, ok := debug.ReadBuildInfo()
		if ok {
			for _, v := range buildInfo.Settings {
				if v.Key == "vcs.revision" {
					gitRevision = v.Value
					break
				}
			}
		}

		log = zerolog.New(output).
			Level(zerolog.Level(logLevel)).
			With().
			Timestamp().
			Str("git_revision", gitRevision).
			Str("go_version", buildInfo.GoVersion).
			Logger()
	})

	return log
}
```

In this file, the `Get()` function returns a `zerolog.Logger` instance that has
been configured with a minimum level according to the `LOG_LEVEL` environmental
variable (if it exists and is a valid number), otherwise it defaults to the
`INFO` level. The `APP_ENV` environmental variable is also used to specify that
the `ConsoleWriter` API should be used to prettify the log output (sent to the
standard error) in development environments alone. In other environments such as
staging or production, the logs are recorded to the standard error and a
rotating `wikipedia-demo.log` file through the use of the
[lumberjack](https://github.com/natefinch/lumberjack) library and the
`zerolog.MultiLevelWriter()` method.

The Git revision and Go version used to build the running Go binary is extracted
using the `debug` package and added to the `Logger`'s context so that they are
included in each log entry. This is helpful when debugging as you'll always know
the exact version of the program that produced each log entry and the version of
Go that was used to build the program. You can access other details about the
program through the
[debug.buildInfo](https://pkg.go.dev/runtime/debug#BuildInfo) type.

Notice that the initialization of the `Logger` is done within the function
argument to the `once.Do()` method so that it is initialized only once
regardless of how many times `Get()` is called.

Return to your `main.go` file and import the `logger` package as shown below:

```go
[label main.go]
. . .

import (
  . . .

	"github.com/betterstack-community/wikipedia-demo/logger"
)
. . .
```

Afterward, update the `main()` and `init()` functions as follows:

```go
[label main.go]
. . .
func init() {
  [highlight]
  l := logger.Get()
  [/highlight]

	var err error

	tpl, err = template.New("index.html").Funcs(template.FuncMap{
		"htmlSafe": htmlSafe,
	}).ParseFiles("index.html")
	if err != nil {
    [highlight]
		l.Fatal().Err(err).Msg("Unable to initialize HTML templates")
    [/highlight]
	}
}

func main() {
  [highlight]
	l := logger.Get()
  [/highlight]

	fs := http.FileServer(http.Dir("assets"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()
	mux.Handle("/assets/", http.StripPrefix("/assets/", fs))
	mux.Handle("/search", handlerWithError(searchHandler))
	mux.Handle("/", handlerWithError(indexHandler))

  [highlight]
	l.Info().
		Str("port", port).
		Msgf("Starting Wikipedia App Server on port '%s'", port)


	l.Fatal().
		Err(http.ListenAndServe(":"+port, mux)).
		Msg("Wikipedia App Server Closed")
  [/highlight]
}
```

Here, each use of the standard library `log` package has been replaced with the
custom `logger` package based on `zerolog`. Ensure to import the necessary
dependencies (`zerolog/pkgerrors` and `lumberjack`) by running the command below
in a separate terminal:

```command
go mod tidy
```

Afterward, kill the running server with `Ctrl-C` and restart it once again
through the command below:

```command
LOG_LEVEL=1 APP_ENV="development" air
```

You should observe the following prettified log output from Zerolog:

```text
[output]
. . .
2022-09-02T11:23:11+01:00 INF Starting Wikipedia App Server on port '3000' git_revision=510791faa17a362faeab72bd367ca26e5b0ad5f6 go_version=go1.19 port=3000
```

If you set `APP_ENV` to any other value other than `development` or if it is
left unset, you'll observe a JSON output instead:

```command
LOG_LEVEL=1 APP_ENV="production" air
```

```json
[output]
{"level":"info","git_revision":"510791faa17a362faeab72bd367ca26e5b0ad5f6","go_version":"go1.19","port":"3000","time":"2022-09-02T11:24:32.92043003+01:00","message":"Starting Wikipedia App Server on port '3000'"}
```

## Creating a logging middleware

Now that our `Logger` instance is ready, we can create a middleware function
that logs all incoming HTTP requests to the server. We'll use it to add
contextual information like the request data, response codes, and more to each
log entry.

Add the following function below `searchHandler()` in your `main.go` file:

```go
[label main.go]
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		l := logger.Get()

		next.ServeHTTP(w, r)

		l.
			Info().
			Str("method", r.Method).
			Str("url", r.URL.RequestURI()).
			Str("user_agent", r.UserAgent()).
			Dur("elapsed_ms", time.Since(start)).
			Msg("incoming request")
	})
}
. . .
```

This `requestLogger()` function returns an HTTP handler that logs several
details about the HTTP request, such as the request URL, HTTP method, client
user agent, and time taken to complete the request. You can also `defer` the
logging call to ensure that if the handler panics, the request will still be
logged so that you can find out what caused the panic. At the moment, the
logging call for the request will not be reached in such situations leaving you
none the wiser about what caused the panic.

Here's the necessary change to make to resolve this:

```go
[label main.go]
. . .
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		l := logger.Get()

    [highlight]
		defer func() {
			l.
				Info().
				Str("method", r.Method).
				Str("url", r.URL.RequestURI()).
				Str("user_agent", r.UserAgent()).
				Dur("elapsed_ms", time.Since(start)).
				Msg("incoming request")
		}()

		next.ServeHTTP(w, r)
    [/highlight]
	})
}
. . .

```

Let's utilize the `requestLogger` on all our routes by wrapping the entire HTTP
request multiplexer as follows:

```go
[label main.go]
. . .
func main() {
	. . .

	l.Fatal().
    [highlight]
		Err(http.ListenAndServe(":"+port, requestLogger(mux))).
    [/highlight]
		Msg("Wikipedia App Server Closed")
}
. . .
```

Now, return to the homepage of the application in the browser and observe that
each request to the server is being logged in the terminal along with all the
properties added to the event's context:

```text
[output]
2022-09-02T11:30:34+01:00 INF incoming request elapsed_ms=0.293015 git_revision=510791faa17a362faeab72bd367ca26e5b0ad5f6 go_version=go1.19 method=GET url=/ user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
```

While developing your application, you probably don't want to see some of the
details in the log, such as the user agent and build information which is
currently making each log entry more verbose and harder to read. You can use the
`FieldsExclude` property on the `zerolog.ConsoleWriter` to exclude those fields
from the log entry as follows:

```go
[label logger/logger.go]
. . .
var output io.Writer = zerolog.ConsoleWriter{
  Out:        os.Stdout,
  TimeFormat: time.RFC3339,
  [highlight]
  FieldsExclude: []string{
    "user_agent",
    "git_revision",
    "go_version",
  },
  [/highlight]
}
. . .
```

At this point, you'll get logs that look like this instead:

```text
[output]
2022-08-29T15:59:50+01:00 INF incoming request method=GET elapsed_ms=0.034017 url=/
2022-08-29T15:59:50+01:00 INF incoming request method=GET elapsed_ms=0.03332 url=/favicon.ico
```

### Logging the status code of the request

One crucial piece of information that is currently missing from the request logs
is the status code of each request. Without this information, you cannot
determine if the request succeeded or not, and you won't be able to track error
rates and other similar metrics using the logs. Unfortunately, there's no way to
access the status code of the response through the `http.ResponseWriter` type so
you must write some additional code to extract this information.

Add the following code just before the `indexHandler()` function in your
`main.go` file:

```go
[label main.go]
. . .
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func newLoggingResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
	return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}
. . .
```

The `loggingResponseWriter` struct embeds the `http.ResponseWriter` type and
adds a `statusCode` property which defaults to `http.StatusOK` (200) when
`newLoggingResponseWriter()` is called. A `WriteHeader()` method is defined on
the `loggingResponseWriter` which updates the value of the `statusCode` property
and calls the `WriteHeader()` method of the embedded `http.ResponseWriter`
instance.

We can use the `loggingResponseWriter` type in our `requestLogger()` as follows:

```go
[label main.go]
. . .
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		l := logger.Get()

    [highlight]
		lrw := newLoggingResponseWriter(w)
    [/highlight]

		defer func() {
      [highlight]
			panicVal := recover()
			if panicVal != nil {
				lrw.statusCode = http.StatusInternalServerError // ensure that the status code is updated
				panic(panicVal) // continue panicking
			}
      [/highlight]

			l.
				Info().
				Str("method", r.Method).
				Str("url", r.URL.RequestURI()).
				Str("user_agent", r.UserAgent()).
				Dur("elapsed_ms", time.Since(start)).
        [highlight]
				Int("status_code", lrw.statusCode).
        [/highlight]
				Msg("incoming request")
		}()

    [highlight]
		next.ServeHTTP(lrw, r)
    [/highlight]
	})
}
. . .
```

An instance of `loggingResponseWriter` type was created above, and it embeds the
local `http.ResponseWriter` instance so that it can inherit all its properties
and methods which allows it to fulfill the `ResponseWriter` interface. When
`WriteHeader()` is called, the `statusCode` property is updated and we can
access it through the `lrw` variable as demonstrated above.

When you restart the server, you'll observe that the request logs now contain
the status code for each request:

```text
[output]
2022-09-02T12:21:44+01:00 INF incoming request elapsed_ms=0.259445 method=GET status_code=200 url=/
```

### Using Zerolog's net/http helpers

Another way to create a logging middleware with Zerolog is to use the helpers
defined in the `hlog` subpackage. For example, here's an alternative version of
the `requestLogger()` method:

```go
[label main.go]
func requestLogger(next http.Handler) http.Handler {
	l := logger.Get()

	h := hlog.NewHandler(l)

	accessHandler := hlog.AccessHandler(
		func(r *http.Request, status, size int, duration time.Duration) {
			hlog.FromRequest(r).Info().
				Str("method", r.Method).
				Stringer("url", r.URL).
				Int("status_code", status).
				Int("response_size_bytes", size).
				Dur("elapsed_ms", duration).
				Msg("incoming request")
		},
	)

	userAgentHandler := hlog.UserAgentHandler("http_user_agent")

	return h(accessHandler(userAgentHandler(next)))
}
```

```text
[output]
2022-09-02T12:28:56+01:00 INF incoming request elapsed_ms=0.296199 http_user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36" method=GET response_size_bytes=1073 status_code=200 url=/
```

The `hlog.NewHandler()` method injects the provided `Logger` instance into the
`http.Request` instance of the returned `http.Handler` type. We subsequently
used `hlog.FromRequest()` to access this `Logger` in the function argument in
the `hlog.AccessHandler()` method which is called after each request. The
`UserAgentHandler()` method adds the User Agent to the `Logger`'s, and the
result is what you can observe above.

## Logging in HTTP handlers

Now that you've set up a general logging middleware that logs each request,
let's look at how to log within HTTP handlers with Zerolog. The library provides
a way to retrieve a `Logger` from a `context.Context` instance through the
`zerolog.Ctx()` method which is demonstrated in the updated `searchHandler()`
function below:

```go
[label main.go]
import (
	. . .
  [highlight]
	"github.com/rs/zerolog"
  [/highlight]
)

. . .
func searchHandler(w http.ResponseWriter, r *http.Request) error {
	u, err := url.Parse(r.URL.String())
	if err != nil {
		return err
	}

	params := u.Query()
	searchQuery := params.Get("q")
	pageNum := params.Get("page")
	if pageNum == "" {
		pageNum = "1"
	}

  [highlight]
	l := zerolog.Ctx(r.Context())

	l.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("search_query", searchQuery).Str("page_num", pageNum)
	})

	l.Info().
		Msgf("incoming search query '%s' on page '%s'", searchQuery, pageNum)
  [/highlight]

	nextPage, err := strconv.Atoi(pageNum)
	if err != nil {
		return err
	}

	pageSize := 20

	resultsOffset := (nextPage - 1) * pageSize

	searchResponse, err := searchWikipedia(searchQuery, pageSize, resultsOffset)
	if err != nil {
		return err
	}

  [highlight]
	l.Debug().Interface("wikipedia_search_response", searchResponse).Send()
  [/highlight]

	totalHits := searchResponse.Query.SearchInfo.TotalHits

	search := &Search{
		Query:      searchQuery,
		Results:    searchResponse,
		TotalPages: int(math.Ceil(float64(totalHits) / float64(pageSize))),
		NextPage:   nextPage + 1,
	}

	buf := &bytes.Buffer{}
	err = tpl.Execute(buf, search)
	if err != nil {
		return err
	}

	_, err = buf.WriteTo(w)
	if err != nil {
		return err
	}

  [highlight]
	l.Trace().Msgf("search query '%s' succeeded without errors", searchQuery)
  [/highlight]

	return nil
}
```

The `zerolog.Ctx()` method accepts a `context.Context` and returns the `Logger`
associated with the `context.Context` instance if any. If no `Logger` is found
in the context, the `DefaultContextLogger` is returned unless
`DefaultContextLogger` is `nil`. A disabled `Logger` (created with
`zerolog.Nop()`) is returned as a final resort.

After fetching the `Logger` from the request context, the `Logger`'s context is
immediately updated with some properties that need to be present in every single
record within the handler so that you don't have to repeat them at log point.

The `searchHandler()` function now contains three log points: the first one
records a new search query at the `INFO` level, the next one records the
response from the Wikipedia API at the `DEBUG` level, and the third indicates
that the search query was successful at the `TRACE` level.

After saving the `main.go` file, head over to the application in your browser
and make a new search query. If everything goes well, it should be successful.

Return to your terminal to observe the logs. You will notice that while the
request is recorded as before, none of the log statements inside the
`searchHandler()` function are recorded.

```text
2022-08-31T15:44:28+01:00 INF incoming request method=GET elapsed_ms=457.825211 status_code=200 url=/search?q=Go
```

Since the `LOG_LEVEL` property has been set to `1` (`INFO`) while starting the
application, the `DEBUG` and `TRACE` statements are not expected to appear, but
the `INFO` statement is also missing, which means there's something wrong with
our current setup.

The problem is that `zerolog.Ctx()` returned a disabled `Logger` because no
`Logger` was found in the request context, and the `DefaultContextLogger` is
`nil` by default. There are two things we can do to fix this issue:

1. Ensure that a `Logger` instance is associated with the context returned by
   `r.Context()`,
2. Set `DefaultContextLogger` to an enabled `Logger` instance.

The first approach is the most appropriate one since it allows you to retain the
context of the `Logger` and even update it as needed, while the second is more
of a fallback option. We will ensure that the `Logger` used in the
`requestLogger()` is added to the request context so that it is accessible in
all handler functions and all it takes is the single line of code highlighted
below:

```go
[label main.go]
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		l := logger.Get()

    [highlight]
		r = r.WithContext(l.WithContext(r.Context()))
    [/highlight]

		lrw := newLoggingResponseWriter(w)

		defer func() {
			panicVal := recover()
			if panicVal != nil {
				lrw.statusCode = http.StatusInternalServerError // ensure that the status code is updated
				panic(panicVal)
			}

			l.
				Info().
				Str("method", r.Method).
				Str("url", r.URL.RequestURI()).
				Str("user_agent", r.UserAgent()).
				Int("status_code", lrw.statusCode).
				Dur("elapsed_ms", time.Since(start)).
				Msg("incoming request")
		}()

		next.ServeHTTP(lrw, r)
	})
}
```

The `Logger` type provides a `WithContext()` method that associates the `Logger`
instance with the provided context and returns a copy of the context which is
immediately used as the argument to `r.WithContext()`, which returns a copy of
the request with the new context.

With this change in place, repeat the previous search query in the application.
You should observe the following logs in the console:

```text
[output]
2022-09-02T12:38:59+01:00 INF incoming search query 'Go' on page '1' page_num=1 search_query=Go
2022-09-02T12:39:00+01:00 INF incoming request elapsed_ms=854.622151 method=GET status_code=200 url=/search?q=Go
```

If you want to see the `DEBUG` and `TRACE` logs, quit the `air` command with
`Ctrl-C` and rerun it with `LOG_LEVEL` set to `-1`:

```command
LOG_LEVEL=-1 APP_ENV=development air
```

When you make a query now, the `DEBUG` and `TRACE` statements will also be
included in the logs:

```text
2022-08-31T17:19:42+01:00 INF incoming search query 'Go' on page '1' page_num=1 search_query=Go
2022-08-31T17:19:43+01:00 DBG page_num=1 search_query=Go wikipedia_search_response={...}
2022-08-31T17:19:43+01:00 TRC search query 'Go' succeeded without errors page_num=1 search_query=Go
2022-08-31T17:19:43+01:00 INF incoming request method=GET elapsed_ms=843.652451 status_code=200 url=/search?q=Go
```

If you want to configure the `DefaultContextLogger` as a fallback in case no
`Logger` is found when using `zerolog.Ctx()`, you can set
`zerolog.DefaultContextLogger` in your `logger.go` file as shown below:

```go
[label logger/logger.go]
log = zerolog.New(output).
  Level(zerolog.Level(logLevel)).
  With().
  Timestamp().
  Str("git_revision", gitRevision).
  Str("go_version", buildInfo.GoVersion).
  Logger()

[highlight]
zerolog.DefaultContextLogger = &log
[/highlight]
```

Finally, update the last standard library `log` reference as follows:

```go
[label main.go]
. . .
func (fn handlerWithError) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  [highlight]
	l := zerolog.Ctx(r.Context())
  [/highlight]

	err := fn(w, r)
	if err != nil {
    [highlight]
		l.Error().Err(err).Msg("server error")
    [/highlight]
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
. . .
```

## Correlating your logs

One thing that is currently missing from our logging setup is a way to correlate
the logs such that if there's a failure you can pinpoint the exact request that
led to the failing scenario.

The first thing you need to do is generate a correlation ID that is stored in
the request context. This correlation ID will be added to the response headers
for the request, and it will also be included in each log record produced due in
the request flow through your program. We will be using the
[xid](https://github.com/rs/xid) package to generate this ID, so ensure to
install it in your project through the command below:

```command
go get -u github.com/rs/xid
```

While you may create a separate middleware function to generate a request or
correlation ID, we will do it in the request logger for simplicity. After it's
installed, import it into your `main.go` file, and update the `requestLogger()`
function as shown below:

```go
[label main.go]
import (
	. . .
  [highlight]
	"github.com/rs/xid"
  [/highlight]
)

. . .

func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		l := logger.Get()

    [highlight]
		correlationID := xid.New().String()

		ctx := context.WithValue(r.Context(), "correlation_id", correlationID)

		r = r.WithContext(ctx)

		l.UpdateContext(func(c zerolog.Context) zerolog.Context {
			return c.Str("correlation_id", correlationID)
		})

		w.Header().Add("X-Correlation-ID", correlationID)

		lrw := newLoggingResponseWriter(w)
    [/highlight]

		r = r.WithContext(l.WithContext(r.Context()))

		defer func() {
			panicVal := recover()
			if panicVal != nil {
				lrw.statusCode = http.StatusInternalServerError
				panic(panicVal)
			}

			l.
				Info().
				Str("method", r.Method).
				Str("url", r.URL.RequestURI()).
				Str("user_agent", r.UserAgent()).
				Int("status_code", lrw.statusCode).
				Dur("elapsed_ms", time.Since(start)).
				Msg("incoming request")
		}()

		next.ServeHTTP(lrw, r)
	})
}
. . .
```

Once the correlation ID is generated, it is added to the request and `Logger`
context respectively, and it is also set in the response headers. Since the
`Logger` itself is subsequently associated with the request context, all the
logs following from the flow of the requests will include this correlation ID.
We can test it out by making a request to the server with `curl` in a separate
terminal:

```command
curl -I 'http://localhost:3000/search?q=Doom'
```

You will observe the correlation ID in the response headers:

```text
[output]
HTTP/1.1 200 OK
X-Correlation-Id: cc7qa0picq4sk77aqql0
Date: Wed, 31 Aug 2022 18:14:27 GMT
Content-Type: text/html; charset=utf-8
```

You will also observe the following log records in the server console (assuming
`LOG_LEVEL=-1`):

```text
[output]
2022-08-31T19:14:27+01:00 INF incoming search query 'Doom' on page '1' correlation_id=cc7qa0picq4sk77aqql0 page_num=1 search_query=Doom
2022-08-31T19:14:27+01:00 DBG correlation_id=cc7qa0picq4sk77aqql0 page_num=1 search_query=Doom wikipedia_search_response={...}
2022-08-31T19:14:27+01:00 TRC search query 'Doom' succeeded without errors correlation_id=cc7qa0picq4sk77aqql0 page_num=1 search_query=Doom
2022-08-31T19:14:27+01:00 INF incoming request correlation_id=cc7qa0picq4sk77aqql0 elapsed_ms=758.538297 method=HEAD status_code=200 url=/search?q=Doom
```

Notice how the `correlation_id` ties the above logs together, so you know that
they were generated in a single identifiable request thus providing some
cohesion to your logs.

## Centralizing and monitoring your logs

So far, we've discussed Zerolog's API and how to integrate it into your Go
application. The final piece of the puzzle is to centralize all logs from your
application in one place so that log monitoring, analytics, and long-term
storage can be offloaded to one single platform. 

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

Using a log management service
like [Better Stack](https://betterstack.com/log-management) makes the troubleshooting
process a lot more straightforward as you won't have to log into individual
hosts to read logs, and you can also catch problems before they affect users by
setting up automated processes to identify potential issues before they create
significant challenges for your business. Alternatively, you can check the [open-source](https://betterstack.com/community/comparisons/open-source-log-managament/) log management tools which are on the uprise.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


When it comes to routing your logs to an external service, we recommend that you
continue logging to the console or a file and use a routing tool like
[Vector](https://vector.dev/docs/reference/configuration/sources/),
[Fluentd](https://docs.fluentd.org/installation) and others to forward the logs
to the service. This way, your application does not need to know or care about
the final destination of the logs as the execution environment manages it
completely.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/8NMpHrVnJes" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



## Final thoughts

In this article, we examined the Zerolog package for logging in Go programs and
discussed many of its most essential features. We also demonstrated how to
integrate it in a typical web application setup, and how you can correlate and
aggregate your logs. To learn more about Zerolog, ensure to checkout
[the official documentation](https://pkg.go.dev/github.com/rs/zerolog) for the
package.

Thanks for reading, and happy logging!
