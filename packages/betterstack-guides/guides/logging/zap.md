# A Comprehensive Guide to Zap Logging in Go

[Zap](https://github.com/uber-go/zap) is a structured logging package developed
by Uber and designed for Go applications. According to their GitHub README
document, it offers "Blazing fast", structured, leveled logging with minimal
allocations. This claim is supported by their
[benchmarking results](https://github.com/uber-go/zap#performance), which
demonstrate that Zap outperforms almost all other comparable [structured logging
libraries](https://betterstack.com/community/guides/logging/best-golang-logging-libraries/) for Go, except [Zerolog](https://betterstack.com/community/guides/logging/zerolog/).

| Package       |    Time     | Time % to zap | Objects Allocated |
| :------------ | :---------: | :-----------: | :---------------: |
| zap           |  193 ns/op  |      +0%      |    0 allocs/op    |
| zap (sugared) |  227 ns/op  |     +18%      |    1 allocs/op    |
| zerolog       |  81 ns/op   |     -58%      |    0 allocs/op    |
| slog          |  322 ns/op  |     +67%      |    0 allocs/op    |
| go-kit        | 5377 ns/op  |    +2686%     |   56 allocs/op    |
| apex/log      | 19518 ns/op |    +10013%    |   53 allocs/op    |
| log15         | 19812 ns/op |    +10165%    |   70 allocs/op    |
| logrus        | 21997 ns/op |    +11297%    |   68 allocs/op    |

In this comprehensive guide, we'll delve into the Zap package and discuss many
of its most useful features. We'll start with the basic setup of Zap in a Go
program, then move on to detailed examples illustrating how to write and manage
logs of various levels and [formats](https://betterstack.com/community/guides/logging/log-formatting/). Finally, we'll wrap up the
article by touching base on more advanced topics such as custom encoders,
multi-output logging, and
[using Zap as an Slog backend](#using-zap-as-a-backend-for-slog).

Let's get started!

## Prerequisites

Before following through with this tutorial, we recommend having the
[latest version of Go](https://go.dev/doc/install) installed on your computer
(v1.20 at the of writing). Once you've installed Go, create a new project
directory on your computer so you can run the provided examples in this article:

```command
mkdir zap-logging
```

```command
cd zap-logging
```

```command
go mod init github.com/<user>/zap-logging
```

[summary]

### Centralize your logs with Better Stack

[Better Stack](https://betterstack.com/log-management) provides centralized log management with live tailing, SQL and PromQL queries, automated anomaly detection, and incident management.

[Start free in minutes](https://betterstack.com/log-management)

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

[/summary]

## Getting started with Zap

Before you can start working with Zap, you need to install it into your project
through the command below:

```command
go get -u go.uber.org/zap
```

Once you've installed Zap, you can start using it in your program like this:

```go
package main

import (
	"go.uber.org/zap"
)

func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	logger.Info("Hello from Zap logger!")
}
```

```json
[output]
{"level":"info","ts":1684092708.7246346,"caller":"zap/main.go:12","msg":"Hello from Zap logger!"}
```

Unlike most other logging packages for Go, Zap does not provide a pre-configured
global logger ready for use. Therefore, you must create a
[zap.Logger](https://pkg.go.dev/go.uber.org/zap#Logger) instance before you can
begin to write logs. The `NewProduction()` method returns a `Logger` configured
to log to the standard error in [JSON format](https://betterstack.com/community/guides/logging/json-logging/), and its minimum log level is set to
`INFO`.

The output produced is relatively straightforward and contains no surprises
except for its default timestamp format (`ts`), which is presented as the number
of nanoseconds elapsed since January 1, 1970 UTC instead of the typical ISO-8601
format.

You can also utilize the `NewDevelopment()` preset to create a `Logger` that is
more optimized for use in development environments. This means logging at the
`DEBUG` level and using a more human-friendly format:

```go
logger := zap.Must(zap.NewDevelopment())
```

```text
[output]
2023-05-14T20:42:39.137+0100    INFO    zap/main.go:12  Hello from Zap logger!
```

You can easily switch between a development and production `Logger` using an
environmental variable:

```go
logger := zap.Must(zap.NewProduction())
if os.Getenv("APP_ENV") == "development" {
	logger = zap.Must(zap.NewDevelopment())
}
```

### Setting up a global logger

If you want to write logs without creating a `Logger` instance first, you can
use the `ReplaceGlobals()` method perhaps in an `init()` function:

```go
package main

import (
	"go.uber.org/zap"
)

func init() {
	zap.ReplaceGlobals(zap.Must(zap.NewProduction()))
}

func main() {
	zap.L().Info("Hello from Zap!")
}
```

This method replaces the global logger accessible through `zap.L()` with a
functional `Logger` instance so that you can use it directly just by importing
the `zap` package into your file.

## Examining Zap's logging API

Zap provides two primary APIs for logging. The first is the low-level `Logger`
type that provides a structured way to log messages. It is designed for use in
performance-sensitive contexts where every allocation matters, and it only
supports strongly typed contextual fields:

```go
func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	logger.Info("User logged in",
		zap.String("username", "johndoe"),
		zap.Int("userid", 123456),
		zap.String("provider", "google"),
	)
}
```

```json
[output]
{"level":"info","ts":1684094903.7353888,"caller":"zap/main.go:17","msg":"User logged in","username":"johndoe","userid":123456,"provider":"google"}
```

The `Logger` type exposes a single method for each of the supported log levels
(`Info()`, `Warn()`, `Error()`, etc), and each one accepts a message and zero or
more [Fields](https://pkg.go.dev/go.uber.org/zap#Field) which are strongly typed
key/value pairs, as shown in the above example.

The second higher-level API is the `SugaredLogger` type which represents a more
laid-back approach to logging. It has a less verbose API than the `Logger` type
at a
[small performance cost](https://web.archive.org/web/20230201003600/http://hackemist.com/logbench/).
Behind the scenes, it relies on the `Logger` type for actual logging operations:

```go
func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	sugar := logger.Sugar()

	sugar.Info("Hello from Zap logger!")
	sugar.Infoln(
		"Hello from Zap logger!",
	)
	sugar.Infof(
		"Hello from Zap logger! The time is %s",
		time.Now().Format("03:04 AM"),
	)

	sugar.Infow("User logged in",
		"username", "johndoe",
		"userid", 123456,
		zap.String("provider", "google"),
	)
}
```

```json
[output]
{"level":"info","ts":1684147807.960761,"caller":"zap/main.go:17","msg":"Hello from Zap logger!"}
{"level":"info","ts":1684147807.960845,"caller":"zap/main.go:18","msg":"Hello from Zap logger!"}
{"level":"info","ts":1684147807.960909,"caller":"zap/main.go:21","msg":"Hello from Zap logger! The time is 11:50 AM"}
{"level":"info","ts":1684148355.2692218,"caller":"zap/main.go:25","msg":"User logged in","username":"johndoe","userid":123456,"provider":"google"}
```

A `Logger` can be converted to a `SugaredLogger` type by calling the `Sugar()`
method on it. Conversely, the `Desugar()` method converts a `SugaredLogger` to a
`Logger`, and you can perform these conversions as often as necessary as the
performance overhead is negligible.

```go
sugar := zap.Must(zap.NewProduction()).Sugar()

defer sugar.Sync()
sugar.Infow("Hello from SugaredLogger!")

logger := sugar.Desugar()

logger.Info("Hello from Logger!")
```

This feature means you don't have to adopt one or the other in your codebase.
For example, you can default to the `SugaredLogger` in the common case for its
flexibility, then convert to the `Logger` type at the boundaries of
performance-sensitive code.

The `SugaredLogger` type provides four methods for each supported level:

1. The first one (`Info()`, `Error()`, etc.) is identical in name to the level
   method on a `Logger`, but it accepts one or more arguments of `any` type.
   Under the hood, they use the `fmt.Sprint()` method to concatenate the
   arguments into the `msg` property in the output.

2. Methods ending with `ln` (such as `Infoln()` and `Errorln()` are the same as
   the first except that `fmt.Sprintln()` is used to construct and log the
   message instead.

3. Methods ending with `f` use the `fmt.Sprintf()` method to construct and log a
   templated message.

4. Finally, methods ending with `w` allow you to add a mix of strongly and
   loosely typed key/value pairs to your log records. The log message is the
   first argument; subsequent arguments are expected to be in key/value pairs as
   shown in the example above.

One thing to note about using loosely-typed key/value pairs is that the keys are
always expected to be strings, while the value can be of any type. If you use a
non-string key, your program will panic in development:

```go
sugar.Infow("User logged in", 1234, "userID")
```

```text
[output]
2023-05-15T12:06:12.996+0100    ERROR   zap@v1.24.0/sugar.go:210        Ignored key-value pairs with non-string keys.   {"invalid": [{"position": 0, "key": 1234, "value": "userID"}]}
go.uber.org/zap.(*SugaredLogger).Infow
        /home/ayo/go/pkg/mod/go.uber.org/zap@v1.24.0/sugar.go:210
main.main
        /home/ayo/dev/demo/zap/main.go:14
runtime.main
        /usr/local/go/src/runtime/proc.go:250
2023-05-15T12:06:12.996+0100    INFO    zap/main.go:14  User logged in
```

In production, a separate error is logged and the key/value pair is skipped:

```json
[output]
{"level":"error","ts":1684148883.086758,"caller":"zap@v1.24.0/sugar.go:210","msg":"Ignored key-value pairs with non-string keys.","invalid":[{"position":0,"key":1234,"value":"userID"}],"stacktrace":"go.uber.org/zap.(*SugaredLogger).Infow\n\t/home/ayo/go/pkg/mod/go.uber.org/zap@v1.24.0/sugar.go:210\nmain.main\n\t/home/ayo/dev/demo/zap/main.go:14\nruntime.main\n\t/usr/local/go/src/runtime/proc.go:250"}
{"level":"info","ts":1684148883.0867138,"caller":"zap/main.go:14","msg":"User logged in"}
```

Passing an orphaned key (one with no corresponding value) behaves similarly: a
panic in development and an error in production. Due to all these caveats with
loosely typed key/value pairs, we recommend using strongly-typed contextual
fields at all times regardless of whether you're using `Logger` or
`SugaredLogger`.

## Log levels in Zap

Zap provides the [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) below in increasing order of
severity. Each one is associated with a corresponding integer:

- `DEBUG` (-1): for recording messages useful for debugging.
- `INFO` (0): for messages describing normal application operations.
- `WARN` (1): for recording messages indicating something unusual happened that
  may need attention before it escalates to a more severe issue.
- `ERROR` (2): for recording unexpected error conditions in the program.
- `DPANIC` (3): for recording severe error conditions in development. It behaves
  like `PANIC` in development and `ERROR` in production.
- `PANIC` (4): calls `panic()` after logging an error condition.
- `FATAL` (5): calls `os.Exit(1)` after logging an error condition.

These levels are defined in the
[zapcore](https://pkg.go.dev/go.uber.org/zap@v1.24.0/zapcore#Level) package
which defines and implements the low-level interfaces upon which Zap is built.

Notably, there is no `TRACE` level, and neither is there a way to
[add custom levels to a Logger](https://github.com/uber-go/zap/issues/680) which
could be a deal-breaker for some. As previously stated, the log level set by
default for the production logger is `INFO`. If you desire to modify this
setting, you must create a custom logger, which we will elaborate on in the
following section.

## Creating a custom logger

So far, we've shown how to use the default configurations provided by Zap
through its production and development presets. Let's now examine how to create
a `Logger` instance with custom configuration options.

There are two main ways to create a custom `Logger` with Zap. The first involves
using its [Config type](https://pkg.go.dev/go.uber.org/zap#Config) to build a
custom logger as demonstrated below:

```go
package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func createLogger() *zap.Logger {
	encoderCfg := zap.NewProductionEncoderConfig()
	encoderCfg.TimeKey = "timestamp"
	encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder

	config := zap.Config{
		Level:             zap.NewAtomicLevelAt(zap.InfoLevel),
		Development:       false,
		DisableCaller:     false,
		DisableStacktrace: false,
		Sampling:          nil,
		Encoding:          "json",
		EncoderConfig:     encoderCfg,
		OutputPaths: []string{
			"stderr",
		},
		ErrorOutputPaths: []string{
			"stderr",
		},
		InitialFields: map[string]interface{}{
			"pid": os.Getpid(),
		},
	}

	return zap.Must(config.Build())
}

func main() {
	logger := createLogger()

	defer logger.Sync()

	logger.Info("Hello from Zap!")
}
```

```json
[output]
{"level":"info","timestamp":"2023-05-15T12:40:16.647+0100","caller":"zap/main.go:42","msg":"Hello from Zap!","pid":2329946}
```

The `createLogger()` function above returns a new `zap.Logger` that acts similar
to the `NewProduction()` `Logger` but with a few differences. We're using Zap's
production config as a base for our custom logger by calling the
`NewProductionEncoderConfig()` and modifying it a bit by changing the `ts` field
to `timestamp` and the time format to ISO-8601. The
[zapcore package](https://pkg.go.dev/go.uber.org/zap@v1.24.0/zapcore) exposes
the interfaces that Zap is built on so that you can customize and extend its
capabilities.

The `Config` object contains many of the most common configuration options
desired when creating a new `Logger`. Detailed descriptions of what each field
represents are in the
[project's documentation](https://pkg.go.dev/go.uber.org/zap#Config) so we won't
rehash them all here except for a few:

- `OutputPaths` specifies one or more targets for the logging output (see
  [Open](https://pkg.go.dev/go.uber.org/zap#Open) for more details).

- `ErrorOutputPaths` is similar to `OutputPaths` but is used for Zap's internal
  errors only, not those generated or logged by your application (such as the
  error from mismatched loosely-typed key/value pairs).

- `InitialFields` specifies global contextual fields that should be included in
  every log entry produced by each logger created from the `Config` object.
  We're only including the process ID of the program here, but you can add other
  useful global metadata like the Go version running the program, git commit
  hash or application version, environment or deployment information, and more.

Once you've set up your preferred configuration settings, you must call the
`Build()` method to generate a `Logger`. Ensure to see the documentation for
[Config](https://pkg.go.dev/go.uber.org/zap#Config) and
[zapcore.EncoderConfig](https://pkg.go.dev/go.uber.org/zap@v1.23.0/zapcore#EncoderConfig)
for all the available options.

A second, more advanced way to create a custom logger involves using the
`zap.New()` method. It accepts a
[zapcore.Core](https://pkg.go.dev/go.uber.org/zap@v1.24.0/zapcore#Core)
interface and zero or more [Options](https://pkg.go.dev/go.uber.org/zap#Option)
to configure the `Logger`. Here's an example that logs a colorized output to the
console and JSON format to a file simultaneously:

```go
func createLogger() *zap.Logger {
	stdout := zapcore.AddSync(os.Stdout)

	file := zapcore.AddSync(&lumberjack.Logger{
		Filename:   "logs/app.log",
		MaxSize:    10, // megabytes
		MaxBackups: 3,
		MaxAge:     7, // days
	})

	level := zap.NewAtomicLevelAt(zap.InfoLevel)

	productionCfg := zap.NewProductionEncoderConfig()
	productionCfg.TimeKey = "timestamp"
	productionCfg.EncodeTime = zapcore.ISO8601TimeEncoder

	developmentCfg := zap.NewDevelopmentEncoderConfig()
	developmentCfg.EncodeLevel = zapcore.CapitalColorLevelEncoder

	consoleEncoder := zapcore.NewConsoleEncoder(developmentCfg)
	fileEncoder := zapcore.NewJSONEncoder(productionCfg)

	core := zapcore.NewTee(
		zapcore.NewCore(consoleEncoder, stdout, level),
		zapcore.NewCore(fileEncoder, file, level),
	)

	return zap.New(core)
}

func main() {
	logger := createLogger()

	defer logger.Sync()

	logger.Info("Hello from Zap!")
}
```

```text
[output]
2023-05-15T16:15:05.466+0100    INFO    Hello from Zap!
```

```json
[output]
{"level":"info","timestamp":"2023-05-15T16:15:05.466+0100","msg":"Hello from Zap!"}
```

This example uses the
[Lumberjack package](https://gopkg.in/natefinch/lumberjack.v2) to [automatically
rotate log files](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) so
they don't get too large. The `NewTee()` method duplicates log entries into two
or more destinations. In this case, the logs are sent to the standard output
using a colorized plaintext format, while the JSON equivalent is sent to the
`logs/app.log` file.

By the way, we generally recommend using an external tool like
[Logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) to manage
and rotate log files instead of doing it in the application itself.

## Adding context to your logs

As mentioned earlier, contextual logging with Zap is done by passing strongly
typed key/value pairs after the log message like this:

```go
logger.Warn("User account is nearing the storage limit",
    zap.String("username", "john.doe"),
    zap.Float64("storageUsed", 4.5),
    zap.Float64("storageLimit", 5.0),
)
```

```json
[output]
{"level":"warn","ts":1684166023.952419,"caller":"zap/main.go:46","msg":"User account is nearing the storage limit","username":"john.doe","storageUsed":4.5,"storageLimit":5}
```

Using child loggers, you can also add contextual properties to all the logs
produced in a specific scope. This helps you avoid unnecessary repetition at log
point. Child loggers are created using the `With()` method on a `Logger`:

```go
func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	childLogger := logger.With(
		zap.String("service", "userService"),
		zap.String("requestID", "abc123"),
	)

	childLogger.Info("user registration successful",
		zap.String("username", "john.doe"),
		zap.String("email", "john@example.com"),
	)

	childLogger.Info("redirecting user to admin dashboard")
}
```

Notice how the `service` and `requestID` are present in both logs:

```json
[output]
{"level":"info","ts":1684164941.7644951,"caller":"zap/main.go:52","msg":"user registration successful","service":"userService","requestID":"abc123","username":"john.doe","email":"john@example.com"}
{"level":"info","ts":1684164941.764551,"caller":"zap/main.go:57","msg":"redirecting user to admin dashboard","service":"userService","requestID":"abc123"}
```

You can use the same method to add global metadata to all your logs. For
example, you can do something like this to include the process ID and Go version
used to compile the program in all your records:

```go
func createLogger() *zap.Logger {
	. . .

	buildInfo, _ := debug.ReadBuildInfo()

	return zap.New(samplingCore.With([]zapcore.Field{
		zap.String("go_version", buildInfo.GoVersion),
		zap.Int("pid", os.Getpid()),
	},
	))
}
```

## Logging errors with Zap

Errors are one of the most important logging targets, so knowing how a framework
handles errors is crucial before adopting it. In Zap, you can log errors using
the `Error()` method. A `stacktrace` is included in the output along with an
`error` property if the `zap.Error()` method is used:

```go
logger.Error("Failed to perform an operation",
    zap.String("operation", "someOperation"),
    zap.Error(errors.New("something happened")), // the key will be `error` here
    zap.Int("retryAttempts", 3),
    zap.String("user", "john.doe"),
)
```

```json
[output]
{"level":"error","ts":1684164638.0570025,"caller":"zap/main.go:47","msg":"Failed to perform an operation","operation":"someOperation","error":"something happened","retryAttempts":3,"user":"john.doe","stacktrace":"main.main\n\t/home/ayo/dev/demo/zap/main.go:47\nruntime.main\n\t/usr/local/go/src/runtime/proc.go:250"}
```

For more severe errors, the `Fatal()` method is available. It calls `os.Exit(1)`
after writing and flushing the log message:

```go
logger.Fatal("Something went terribly wrong",
    zap.String("context", "main"),
    zap.Int("code", 500),
    zap.Error(errors.New("An error occurred")),
)
```

```json
[output]
{"level":"fatal","ts":1684170760.2103574,"caller":"zap/main.go:47","msg":"Something went terribly wrong","context":"main","code":500,"error":"An error occurred","stacktrace":"main.main\n\t/home/ayo/dev/demo/zap/main.go:47\nruntime.main\n\t/usr/local/go/src/runtime/proc.go:250"}
exit status 1
```

If the error is recoverable, you may use the `Panic()` method instead. It logs
at the `PANIC` level and calls `panic()` instead of `os.Exit(1)`. There's also a
`DPanic()` level that only panics in development after logging at the `DPANIC`
level. In production, it logs at the `DPANIC` level without actually panicking.

If you'd prefer not to use non-standard levels like `PANIC` and `DPANIC`, you
can configure both methods to log at the `ERROR` level instead using the
following code:

```go
[highlight]
func lowerCaseLevelEncoder(
	level zapcore.Level,
	enc zapcore.PrimitiveArrayEncoder,
) {
	if level == zap.PanicLevel || level == zap.DPanicLevel {
		enc.AppendString("error")
		return
	}

	zapcore.LowercaseLevelEncoder(level, enc)
}
[/highlight]

func createLogger() *zap.Logger {
	stdout := zapcore.AddSync(os.Stdout)

	level := zap.NewAtomicLevelAt(zap.InfoLevel)

	productionCfg := zap.NewProductionEncoderConfig()
	productionCfg.TimeKey = "timestamp"
	productionCfg.EncodeTime = zapcore.ISO8601TimeEncoder
    [highlight]
	productionCfg.EncodeLevel = lowerCaseLevelEncoder
    [/highlight]

	jsonEncoder := zapcore.NewJSONEncoder(productionCfg)

	core := zapcore.NewCore(jsonEncoder, stdout, level)

	return zap.New(core)
}

func main() {
	logger := createLogger()

	defer logger.Sync()

	logger.DPanic(
		"this was never supposed to happen",
	)
}
```

```json
[output]
{"level":"error","timestamp":"2023-05-15T18:55:33.534+0100","msg":"this was never supposed to happen"}
```

[ad-logs]

## Log sampling with Zap

Log sampling is a technique used to reduce application log volume by selectively
capturing and recording only a subset of log events. Its purpose is to strike a
balance between the need for comprehensive logging and the potential performance
impact of logging too much data.

Rather than capturing every single log event, log sampling allows you to select
a representative subset of log messages based on specific criteria or rules.
This way the amount of generated log data is greatly reduced, which can be
especially beneficial in high-throughput systems.

In Zap, sampling can be configured on a `Logger` by using the
[zapcore.NewSamplerWithOptions()](https://pkg.go.dev/go.uber.org/zap@v1.24.0/zapcore#NewSamplerWithOptions)
method as shown below:

```go
func createLogger() *zap.Logger {
	stdout := zapcore.AddSync(os.Stdout)

	level := zap.NewAtomicLevelAt(zap.InfoLevel)

	productionCfg := zap.NewProductionEncoderConfig()
	productionCfg.TimeKey = "timestamp"
	productionCfg.EncodeTime = zapcore.ISO8601TimeEncoder
	productionCfg.EncodeLevel = lowerCaseLevelEncoder
	productionCfg.StacktraceKey = "stack"

	jsonEncoder := zapcore.NewJSONEncoder(productionCfg)

	jsonOutCore := zapcore.NewCore(jsonEncoder, stdout, level)

[highlight]
	samplingCore := zapcore.NewSamplerWithOptions(
		jsonOutCore,
		time.Second, // interval
		3, // log first 3 entries
		0, // thereafter log zero entires within the interval
	)
[/highlight]

	return zap.New(samplingCore)
}
```

Zap samples by logging the first N entries with a given level and message within
the specified time interval. In the above example, only the first 3 log entries
with the same level and message are recorded in a one-second interval. Every
other log entry will be dropped within the interval since `0` is specified here.

You can test this out by logging in a `for` loop:

```go
func main() {
	logger := createLogger()

	defer logger.Sync()

	for i := 1; i <= 10; i++ {
		logger.Info("an info message")
		logger.Warn("a warning")
	}
}
```

Therefore, instead of observing 20 log entries, you should see just six:

```json
[output]
{"level":"info","timestamp":"2023-05-17T16:00:17.611+0100","msg":"an info message"}
{"level":"warn","timestamp":"2023-05-17T16:00:17.611+0100","msg":"a warning"}
{"level":"info","timestamp":"2023-05-17T16:00:17.611+0100","msg":"an info message"}
{"level":"warn","timestamp":"2023-05-17T16:00:17.611+0100","msg":"a warning"}
{"level":"info","timestamp":"2023-05-17T16:00:17.611+0100","msg":"an info message"}
{"level":"warn","timestamp":"2023-05-17T16:00:17.611+0100","msg":"a warning"}
```

Here, only the first three iterations of the loop produced some output. This is
because the logs produced in the other seven iterations were discarded due to
the sampling configuration. Likewise, Zap will drop duplicates when similar
entries are being logged several times each second due to heavy load or when the
application is experiencing a run of errors.

While log sampling can be used to reduce log volume and the performance impact
of logging, it could also potentially cause some log events to be missed which
might impact troubleshooting and debugging efforts. Therefore, sampling should
only be applied after carefully considering the specific requirements of the
application in question.

## Hiding sensitive details in your logs

Back in 2018,
[Twitter had to urge their users to change their passwords](https://www.yahoo.com/news/twitter-asks-users-change-passwords-221748059.html)
due to their accidental logging of millions of passwords in plaintext form to an
internal log. While no evidence of misuse was discovered, this incident serves
as a poignant reminder of how application logs, if not handled with due
diligence, can compromise user security and privacy.

One technique to prevent inadvertently logging a type with sensitive fields is
by redacting or masking the data at log point. In Zap, this can be done by
implementing the [Stringer](https://pkg.go.dev/fmt#Stringer) interface and then
defining the exact string that should be returned when the type is logged.
Here's a short demonstration:

```go
type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func main() {
	logger := createLogger()

	defer logger.Sync()

	user := User{
		ID:    "USR-12345",
		Name:  "John Doe",
		Email: "john.doe@example.com",
	}

	logger.Info("user login", zap.Any("user", user))
}
```

```json
[output]
{"level":"info","timestamp":"2023-05-17T17:00:59.899+0100","msg":"user login","user":{"id":"USR-12345","name":"John Doe","email":"john.doe@example.com"}}
```

In this example, the entire `user` is logged exposing the user's email address
unnecessarily. You can prevent this by implementing the `Stringer` interface as
follows:

```go
func (u User) String() string {
	return u.ID
}
```

This replaces the entire `User` type with just the `ID` field in the logs:

```json
[output]
{"level":"info","timestamp":"2023-05-17T17:05:01.081+0100","msg":"user login","user":"USR-12345"}
```

If you need more control, you can create your own `zapcore.Encoder` that uses
the JSON encoder as a base while filtering out sensitive fields:

```go
type SensitiveFieldEncoder struct {
	zapcore.Encoder
	cfg zapcore.EncoderConfig
}

// EncodeEntry is called for every log line to be emitted so it needs to be
// as efficient as possible so that you don't negate the speed/memory advantages
// of Zap
func (e *SensitiveFieldEncoder) EncodeEntry(
	entry zapcore.Entry,
	fields []zapcore.Field,
) (*buffer.Buffer, error) {
	filtered := make([]zapcore.Field, 0, len(fields))

	for _, field := range fields {
		user, ok := field.Interface.(User)
		if ok {
			user.Email = "[REDACTED]"
			field.Interface = user
		}

		filtered = append(filtered, field)
	}

	return e.Encoder.EncodeEntry(entry, filtered)
}

func NewSensitiveFieldsEncoder(config zapcore.EncoderConfig) zapcore.Encoder {
	encoder := zapcore.NewJSONEncoder(config)
	return &SensitiveFieldEncoder{encoder, config}
}

func createLogger() *zap.Logger {
	. . .

[highlight]
	jsonEncoder := NewSensitiveFieldsEncoder(productionCfg)
[/highlight]

	. . .

	return zap.New(samplingCore)
}
```

This above snippet ensures that the `email` property is redacted while the other
fields are left as is:

```json
[output]
{"level":"info","timestamp":"2023-05-17T17:38:11.749+0100","msg":"user login","user":{"id":"USR-12345","name":"John Doe","email":"[REDACTED]"}}
```

Of course, this won't help much if the `User` type is logged under a different
key, such as `user_details`. You may remove the `if field.Key == "user"`
condition to ensure redaction is carried out regardless of the provided key.

## Some caveats with custom encoders

When using custom encoding with Zap, like in the previous section, you may also
need to implement the `Clone()` method on the `zapcore.Encoder` interface so
that it also works for child loggers created with the `With()` method:

```go
child := logger.With(zap.String("name", "main"))
child.Info("an info log", zap.Any("user", u))
```

Before implementing `Clone()` you will observe that the custom `EncodeEntry()`
isn't executed for the child logger, causing the email field to appear
unredacted:

```json
[output]
{"level":"info","timestamp":"2023-05-20T09:14:46.043+0100","msg":"an info log","name":"main","user":{"id":"USR-12345","name":"John Doe","email":"john.doe@example.com"}}
```

When `With()` is used to create a child logger, the `Clone()` method on the
configured `Encoder` is executed to copy it and ensure that added fields do not
affect the original. Without implementing this method on your custom encoder
type, the `Clone()` method declared on the embedded `zapcore.Encoder` (the JSON
Encoder in this case) is invoked instead, and this means that child loggers will
not use your custom encoding.

You can correct this situation by implementing the `Clone()` method as follows:

```go
func (e *SensitiveFieldEncoder) Clone() zapcore.Encoder {
	return &SensitiveFieldEncoder{
		Encoder: e.Encoder.Clone(),
	}
}
```

You will now observe the correct redacted output:

```json
[output]
{"level":"info","timestamp":"2023-05-20T09:28:31.231+0100","msg":"an info log","name":"main","user":{"id":"USR-12345","name":"John Doe","email":"[REDACTED]"}}
```

However, note that custom encoders do not affect fields attached using the
`With()` method, so if you do something like this:

```go
[highlight]
child := logger.With(zap.String("name", "main"), zap.Any("user", u))
[/highlight]
child.Info("an info log")
```

You will get the previous unredacted output regardless of whether `Clone()` is
implemented or not because only the fields added at log point are present in the
`fields []zapcore.Field` argument of `EncodeEntry()`:

```json
[output]
{"level":"info","timestamp":"2023-05-20T09:31:11.919+0100","msg":"an info log","name":"main","user":{"id":"USR-12345","name":"John Doe","email":"john.doe@example.com"}}
```

## Logging with Zap in a Go application

Now that we've explored Zap's logging API and some of its most useful features,
it's time to examine a practical example showcasing how you can employ it to
incorporate logging in a Go web application. You can find a concrete example of
this implementation
[here](https://github.com/betterstack-community/go-logging/tree/zap).

![screenshot.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b17feb15-a395-46b5-5122-24600245b400/orig=2820x2070)

Start by cloning the demo project to your machine using the command below:

```command
git clone https://github.com/betterstack-community/go-logging
```

```command
cd go-logging
```

Then switch to the `zap` branch as follows:

```command
git checkout zap
```

Open the `logger/logger.go` file in your text editor and examine its contents:

```go
[label logger/logger.go]
package logger

. . .

func Get() *zap.Logger {

    . . .

	return logger
}

func FromCtx(ctx context.Context) *zap.Logger {
	if l, ok := ctx.Value(ctxKey{}).(*zap.Logger); ok {
		return l
	} else if l := logger; l != nil {
		return l
	}

	return zap.NewNop()
}

func WithCtx(ctx context.Context, l *zap.Logger) context.Context {
	if lp, ok := ctx.Value(ctxKey{}).(*zap.Logger); ok {
		if lp == l {
			return ctx
		}
	}

	return context.WithValue(ctx, ctxKey{}, l)
}
```

The `Get()` function is used to initialize a `zap.Logger` instance if it has not
been initialized already, and it returns the same instance for subsequent calls.
The logger is configured to log to the standard output and `logs/app.log` file
simultaneously:

```go
func Get() *zap.Logger {
	once.Do(func() {
        . . .

		// log to multiple destinations (console and file)
		// extra fields are added to the JSON output alone
		core := zapcore.NewTee(
			zapcore.NewCore(consoleEncoder, stdout, logLevel),
			zapcore.NewCore(fileEncoder, file, logLevel).
				With(
					[]zapcore.Field{
						zap.String("git_revision", gitRevision),
						zap.String("go_version", buildInfo.GoVersion),
					},
				),
		)

		logger = zap.New(core)
	})

	return logger
}
```

It is used in the `main` function like this:

```go
[label main.go]
func main() {
	l := logger.Get()
    . . .
}
```

On the other hand, the `WithCtx()` method associates a `zap.Logger` instance
with a `context.Context` and returns it, while `FromCtx()` takes a
`context.Context` and returns the `zap.Logger` associated with it (if any). This
makes storing and retrieving the same `Logger` instance in the context of an
HTTP request easy.

For example, the `requestLogger()` is a middleware function that retrieves a
logger instance and creates a child logger using the request's correlation ID.
It then proceeds to associate the child logger with the request context so that
you can retrieve it in subsequent handlers:

```go
[label middleware.go]
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// retrieve the standard logger instance
		l := logger.Get()

		// create a correlation ID for the request
		correlationID := xid.New().String()

		ctx := context.WithValue(
			r.Context(),
			correlationIDCtxKey,
			correlationID,
		)

		r = r.WithContext(ctx)

		// create a child logger containing the correlation ID
		// so that it appears in all subsequent logs
		l = l.With(zap.String(string(correlationIDCtxKey), correlationID))

		w.Header().Add("X-Correlation-ID", correlationID)

		lrw := newLoggingResponseWriter(w)

		// the logger is associated with the request context here
        // so that it may be retrieved in subsequent `http.Handlers`
		r = r.WithContext(logger.WithCtx(ctx, l))

		. . .

		next.ServeHTTP(lrw, r)
	})
}
```

The logger can be subsequently retrieved from the request context as follows:

```go
[label handlers.go]
func searchHandler(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()

[highlight]
	l := logger.FromCtx(ctx)
[/highlight]

	l.Debug("entered searchHandler()")

	 . . .
}
```

Notice the presence of the `correlation_id` in the output:

```text
[output]
2023-05-20T15:32:50.821+0100    DEBUG   entered searchHandler() {"correlation_id": "chkdk4koo2ej1bpr4l90"}
```

![logs.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d1bbe460-8d17-47bb-2d44-d948aba83900/public=2632x1620)

## Using Zap as a backend for Slog

After the introduction of the
[new structured logging package for Go](https://github.com/golang/go/issues/56345),
known as [Slog](https://betterstack.com/community/guides/logging/logging-in-go/#structured-logging-in-go-with-slog), there has
been work on implementing the `slog.Handler` interface in Zap, allowing the
utilization of the Slog API with a Zap backend. This integration ensures
consistency in the logging API across various dependencies and facilitates the
seamless swapping of logging packages with minimal changes to the code.

As of now, Slog has not been included in an official Go release. Therefore, the
official integration of Zap with Slog has been provided in a
[separate module](https://github.com/uber-go/zap/tree/master/exp/zapslog), which
can be installed using the following command:

```command
go get go.uber.org/zap/exp/zapslog
```

Afterwards, you can use it in your program like this:

```go
func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

[highlight]
	sl := slog.New(zapslog.NewHandler(zapL.Core(), nil))
[/highlight]

	sl.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}
```

```json
[output]
{"level":"info","ts":1684613929.8395753,"msg":"incoming request","method":"GET","path":"/api/user","status":200}
```

If you ever decide to switch to a different backend, the only change needed is
the argument to the `slog.New()` method. For example, you can switch from Zap to
Slog's [JSONHandler](https://pkg.go.dev/golang.org/x/exp/slog#JSONHandler)
backend by making the following change:

```go
func main() {
    [highlight]
	sl := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    [/highlight]

	sl.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}
```

Everything else should continue working except that the log output could be
slightly different depending on your configuration.

```json
[output]
{"time":"2023-05-20T21:21:43.335894635+01:00","level":"INFO","msg":"incoming request","method":"GET","path":"/api/user","status":200}
```

## Centralize your Go logs with Better Stack

Once you've configured Zap for structured logging in your Go application, you'll eventually need to centralize those logs to monitor your services effectively across different environments.

[Better Stack](https://betterstack.com/log-management) provides a centralized platform that works seamlessly with Zap's JSON output. It automatically indexes your structured logs for instant searchability, letting you query across all your Go services using SQL, PromQL, or live tail filtering.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

If you want to understand error patterns or track performance metrics, you can transform your Zap logs into custom dashboards. Better Stack automatically analyzes your structured log data to identify trends, error spikes, and anomalies.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Getting started takes just minutes: [sign up for a free account](https://betterstack.com/users/sign-in), keep your existing Zap configuration (the JSON output works perfectly), and forward logs using Better Stack's collector or your preferred log shipper like Vector or Fluent Bit.

## Final thoughts

This article provides an analysis of the Zap package, one of the most popular
logging packages used in Go programs. It highlights many of the package's key
features and explains how it can be integrated into a standard web application
setup. The article also covers some advanced logging techniques, and how to
integrate it with the new standard library Slog package. To delve deeper into
Zap logging, ensure to explore its
[official documentation](https://pkg.go.dev/go.uber.org/zap) and
[FAQs](https://github.com/uber-go/zap/blob/master/FAQ.md).

Thank you for reading, and happy logging!