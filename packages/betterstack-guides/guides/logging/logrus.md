# A Comprehensive Guide to Logrus Logging in Go

Effective logging is essential for debugging, monitoring, and understanding the
behavior of Go applications in production.

While Go's `log` library provides basic logging capabilities, many developers
need more advanced features like structured logging, customizable log levels,
and multiple output destinations. [Logrus](https://github.com/sirupsen/logrus) is one of Go's most popular logging
libraries that addresses these needs.

This comprehensive guide explores how to use Logrus effectively in your Go
applications, from basic setup to advanced features and best practices.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/cwa_MBL1kek" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## What is Logrus?

Logrus is a structured logging library for Go that enhances the standard
library's logging capabilities with features like log levels, structured data
fields, and multiple output formats. It allows developers to log in a way that
both humans and machines can understand and process.

The key advantages of Logrus include:

- Structured logging with JSON support
- Flexible log levels
- Field-based contextual logging
- Extensible hook system
- Drop-in replacement for the standard library

Let's explore how to implement Logrus in your Go applications and leverage these
features effectively.

## Getting started with Logrus

To begin using Logrus, you first need to install it using Go's package
management:

```command
go get github.com/sirupsen/logrus
```

This command fetches the Logrus package and adds it to your project's
dependencies. Once installed, you can import and use it in your code.

Let's create a basic program that uses Logrus for logging:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    // Create a new logger
    log := logrus.New()

    // Set the output format to JSON
    log.SetFormatter(&logrus.JSONFormatter{})

    // Log a simple message
    log.Info("Hello from Logrus!")
}
```

When you run this program, it will produce a JSON-formatted log entry that
includes the timestamp, log level, and message:

```json
[output]
{"level":"info","msg":"Hello from Logrus!","time":"2025-03-09T10:10:30+01:00"}
```

The JSON format makes it easy for log management systems to parse and index your
logs, enabling powerful search and analysis capabilities.

Logrus provides a global logger instance that you can use without creating your
own instance. This is helpful for quick integration or smaller applications:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    // Using the global logger
    logrus.SetFormatter(&logrus.JSONFormatter{})
    logrus.Info("Hello from the global Logrus logger!")

    // You can also configure the global logger
    logrus.SetLevel(logrus.DebugLevel)
    logrus.Debug("This debug message will now be visible")
}
```

```json
[output]
{"level":"info","msg":"Hello from the global Logrus logger!","time":"2025-03-09T10:11:57+01:00"}
{"level":"debug","msg":"This debug message will now be visible","time":"2025-03-09T10:11:57+01:00"}
```

While the global logger is convenient, creating your own logger instances gives
you more control over configuration for different parts of your application.
This is particularly important in larger applications where you might want
different logging configurations for different components.

You'll see an example of this in the next section.

## Log levels in Logrus

Logrus supports several log levels that allow you to differentiate between
events of different severities in your application. This helps you control the
verbosity of your logs and filter them according to their importance.

The available log levels in Logrus, from most to least verbose, are:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    // Creating your own logger instance
    log := logrus.New()

    // Try different log levels
    log.Trace("Trace message") // Most detailed level
    log.Debug("Debug message") // Detailed information for debugging
    log.Info("Info message")   // General information about system operation
    log.Warn("Warning message") // Something unexpected but not critical
    log.Error("Error message")  // An error that doesn't stop operation
    log.Fatal("Fatal message") // Logs and then calls os.Exit(1)
    log.Panic("Panic message") // Logs and then calls panic()
}
```

By default, Logrus is set to the `Info` level, meaning that `Trace` and `Debug`
messages won't appear in the logs. This is a good default for production
environments where you want to reduce noise. However, during development or
troubleshooting, you might want to see more detailed logs.

![Logrus log levels](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6c512baf-4842-40ab-67c5-63f8bd985100/md1x =1966x768)

You can change the log level to see more or fewer messages:

```go
[label setlevel.go]
package main

import (
    "github.com/sirupsen/logrus"
    "os"
)

func main() {
    log := logrus.New()

    // Set log level to Debug to see more details
    [highlight]
    log.SetLevel(logrus.DebugLevel)
    [/highlight]

    log.Debug("This debug message will now be visible")
    log.Info("Along with info and higher levels")

    // You can also set the level dynamically based on environment
    if env := os.Getenv("APP_ENV"); env == "production" {
        log.SetLevel(logrus.WarnLevel) // Only log warnings and above in production
    } else {
        log.SetLevel(logrus.DebugLevel) // Log everything in development
    }
}
```

The ability to adjust log levels dynamically is particularly useful for
controlling verbosity in different environments without changing your code.

## Structured logging with fields

One of the most powerful features of Logrus is [structured
logging](https://betterstack.com/community/guides/logging/structured-logging/) with fields. Instead of embedding variable data in
your log messages as strings, you can add structured fields that make your logs
more readable and easier to query:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    log := logrus.New()
    [highlight]
    log.SetFormatter(&logrus.JSONFormatter{}) // set this to produce JSON output
    [/highlight]

    // Log with structured fields
    log.WithFields(logrus.Fields{
        "user_id":   12345,
        "component": "auth_service",
        "action":    "login",
        "ip_address": "192.168.1.1",
        "success": true,
    }).Info("User login successful")

    // You can also add single fields
    log.WithField("request_id", "req-abc-123").Info("Processing request")

    // Or chain multiple field operations
    log.WithField("module", "api").
        WithField("method", "GET").
        WithField("endpoint", "/users").
        Info("Request received")
}
```

The output will include the structured fields, making it much easier to filter
logs by specific attributes:

```json
[output]
{"action":"login","component":"auth_service","ip_address":"192.168.1.1","level":"info","msg":"User login successful","success":true,"ti
me":"2025-03-09T10:15:25+01:00","user_id":12345}
{"level":"info","msg":"Processing request","request_id":"req-abc-123","time":"2025-03-09T10:15:25+01:00"}
{"endpoint":"/users","level":"info","method":"GET","module":"api","msg":"Request received","time":"2025-03-09T10:15:25+01:00"}
```

Structured logging offers several advantages over traditional text-based logs:

1. Log entries can be easily parsed and indexed by log management systems
2. You can perform sophisticated queries on your logs (e.g., "find all failed
   login attempts from a specific IP")
3. Fields maintain their data types (numbers stay as numbers, booleans as
   booleans)
4. Log messages can be simpler and more consistent, with variable data in fields

This approach significantly improves log analysis and troubleshooting
capabilities.

## Configuring formatters in Logrus

Logrus supports multiple output formats through its formatter interface. The two
built-in formatters are the `JSONFormatter` and `TextFormatter`, each with its
own configuration options:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
    "os"
)

func main() {
    log := logrus.New()

    // Configure JSON formatter with custom settings
    log.SetFormatter(&logrus.JSONFormatter{
        TimestampFormat: "2006-01-02 15:04:05", // Customize time format
        PrettyPrint:     true, // Makes the output more readable for humans
        DataKey:         "data", // Put all fields under a nested "data" key
    })
    log.WithField("user_id", 123).Info("This will be formatted as pretty JSON")

    // Switch to text formatter with custom settings
    log.SetFormatter(&logrus.TextFormatter{
        FullTimestamp:   true, // Show full timestamp instead of elapsed time
        TimestampFormat: "2006-01-02 15:04:05",
        DisableColors:   false, // Enable colors for better readability
        ForceColors:     true, // Force colors even when not in a terminal
    })
    log.WithField("user_id", 123).Info("This will be formatted as colored text")

    // You can also customize the output destination
    file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
    if err == nil {
        log.SetOutput(file)
    } else {
        log.Error("Failed to log to file, using default stderr")
    }

    log.Info("This goes to the file instead of the console")
}
```

The JSON formatter produces structured data that's ideal for machine processing:

```json
[output]
{
  "data": {
    "user_id": 123
  },
  "level": "info",
  "msg": "This will be formatted as pretty JSON",
  "time": "2025-03-09 10:17:32"
}
```

While the text formatter produces output that's more human-readable:

```text
[output]
time="2023-03-09 14:02:00" level=info msg="This will be formatted as colored text" user_id=123
```

The choice of formatter depends on your use case. JSON is better for log
aggregation and analysis, while text is more suitable for local development and
debugging.

## Contextual logging with Logrus

Contextual logging is vital for tracking related events in complex systems.
Logrus provides several ways to maintain context across multiple log statements.

### Adding fields to individual logs

The most basic way to add context is by adding fields to individual log entries,
as we saw earlier:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    log := logrus.New()

    // Add a single field
    log.WithField("request_id", "req-123").Info("Processing request")

    // Add multiple fields
    log.WithFields(logrus.Fields{
        "request_id": "req-123",
        "user_id":    456,
        "path":       "/api/users",
        "method":     "GET",
        "latency_ms": 42,
    }).Info("Request completed")

    // You can also build up context incrementally
    entry := log.WithField("request_id", "req-123")
    // Do some processing...
    entry = entry.WithField("user_found", true)
    // Do more processing...
    entry.WithField("response_size", 1024).Info("Response sent")
}
```

![2.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d081ac9a-67a5-4875-21f5-0f104e392200/md2x =2644x768)

Each call to `WithField` or `WithFields` creates a new entry with the combined
fields. This approach is useful for adding context as it becomes available
throughout the execution flow.

### Creating child loggers

For more complex scenarios, you can create "child loggers" that inherit fields
from their parent. This is especially useful for maintaining context across
different functions or components:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    log := logrus.New()
    log.SetFormatter(&logrus.JSONFormatter{})

    // Create a child logger with request context
    requestLogger := log.WithFields(logrus.Fields{
        "request_id": "req-123",
        "client_ip":  "192.168.1.1",
        "user_agent": "Mozilla/5.0",
    })

    // All these logs will include the request context
    requestLogger.Info("Request started")
    processRequest(requestLogger)
    requestLogger.WithField("duration_ms", 42).Info("Request completed")
}

func processRequest(log *logrus.Entry) {
    // The logger already has the request context
    log.Debug("Parsing request parameters")

    // We can add more context specific to this function
    log.WithField("path", "/api/users").Info("Routing request")

    // Further function calls can use the same logger
    validateAuth(log)
}

func validateAuth(log *logrus.Entry) {
    // Create a more specialized logger for auth operations
    authLogger := log.WithField("component", "auth")
    authLogger.Debug("Checking authentication token")
    authLogger.Info("User authenticated successfully")
}
```

```json
[output]
{"client_ip":"192.168.1.1","level":"info","msg":"Request started","request_id":"req-123","time":"2025-03-09T10:21:22+01:00","user_agent
":"Mozilla/5.0"}
{"client_ip":"192.168.1.1","level":"info","msg":"Routing request","path":"/api/users","request_id":"req-123","time":"2025-03-09T10:21:2
2+01:00","user_agent":"Mozilla/5.0"}
{"client_ip":"192.168.1.1","component":"auth","level":"info","msg":"User authenticated successfully","request_id":"req-123","time":"202
5-03-09T10:21:22+01:00","user_agent":"Mozilla/5.0"}
{"client_ip":"192.168.1.1","duration_ms":42,"level":"info","msg":"Request completed","request_id":"req-123","time":"2025-03-09T10:21:22
+01:00","user_agent":"Mozilla/5.0"}
```

This pattern ensures that all logs related to a specific request include the
same contextual information, making it easier to trace request flow through your
system. Each function receives a logger that already has the appropriate
context, and can add more specific context as needed.

### Using WithContext and FromContext patterns

In web applications, you often want to associate logs with the current request
context. This pattern demonstrates how to store and retrieve a logger from a
context:

```go
[label main.go]
package main

import (
    "context"
    "github.com/sirupsen/logrus"
    "net/http"
)

type contextKey string

const loggerKey contextKey = "logger"

// Middleware to add logger to request context
func LoggerMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Create a request ID
        requestID := "req-" + generateID() // Implement this function

        // Create a logger with request fields
        logger := logrus.WithFields(logrus.Fields{
            "request_id": requestID,
            "path":       r.URL.Path,
            "method":     r.Method,
            "user_agent": r.UserAgent(),
            "remote_ip":  r.RemoteAddr,
        })

        // Add the logger to the request context
        ctx := context.WithValue(r.Context(), loggerKey, logger)
        r = r.WithContext(ctx)

        logger.Info("Request started")

        // Call the next handler
        next.ServeHTTP(w, r)

        logger.Info("Request completed")
    })
}

// Helper function to get logger from context
func LoggerFromContext(ctx context.Context) *logrus.Entry {
    if logger, ok := ctx.Value(loggerKey).(*logrus.Entry); ok {
        return logger
    }
    // Return default logger if none in context
    return logrus.NewEntry(logrus.StandardLogger())
}

// Handler that uses the logger from context
func MyHandler(w http.ResponseWriter, r *http.Request) {
    logger := LoggerFromContext(r.Context())

    logger.Info("Processing request in handler")

    // Do work...

    logger.WithField("status", 200).Info("Successfully processed request")
}

// In your main function, you'd set up the HTTP server with this middleware
func main() {
    logrus.SetFormatter(&logrus.JSONFormatter{})

    router := http.NewServeMux()
    router.Handle("/api/endpoint", http.HandlerFunc(MyHandler))

    // Wrap all handlers with the logger middleware
    http.ListenAndServe(":8080", LoggerMiddleware(router))
}

// Dummy function to generate IDs
func generateID() string {
    return "123456" // In real code, generate a unique ID
}
```

This pattern provides several benefits:

1. Every log entry for a request automatically includes request-specific fields
2. You don't need to pass the logger through function parameters
3. Request handling code can focus on business logic, not log context
4. All logs for a single request can be easily correlated through the request ID

```json
[output]
{"level":"info","method":"GET","msg":"Request started","path":"/api/endpoint","remote_ip":"[::1]:34142","request_id":"req-123456","time
":"2025-03-09T10:22:54+01:00","user_agent":"HTTPie/3.2.3"}
{"level":"info","method":"GET","msg":"Processing request in handler","path":"/api/endpoint","remote_ip":"[::1]:34142","request_id":"req
-123456","time":"2025-03-09T10:22:54+01:00","user_agent":"HTTPie/3.2.3"}
{"level":"info","method":"GET","msg":"Successfully processed request","path":"/api/endpoint","remote_ip":"[::1]:34142","request_id":"re
q-123456","status":200,"time":"2025-03-09T10:22:54+01:00","user_agent":"HTTPie/3.2.3"}
{"level":"info","method":"GET","msg":"Request completed","path":"/api/endpoint","remote_ip":"[::1]:34142","request_id":"req-123456","ti
me":"2025-03-09T10:22:54+01:00","user_agent":"HTTPie/3.2.3"}
```

It's particularly valuable in complex web applications with deep call stacks.

## Advanced configuration

Logrus offers numerous configuration options to tailor your logging setup to
your specific needs. Let's look at a few of these below.

### Custom formatters

You can create custom formatters by implementing the `logrus.Formatter`
interface. This gives you complete control over how your logs are formatted:

```go
[label main.go]
package main

import (
    "bytes"
    "fmt"
    "github.com/sirupsen/logrus"
    "sort"
    "strings"
    "time"
)

// CustomFormatter implements logrus.Formatter interface
type CustomFormatter struct {
    // Custom configuration options can go here
    TimestampFormat string
    IncludeFields   []string // Only include these fields
    ExcludeFields   []string // Exclude these fields
}

// Format renders a log entry
func (f *CustomFormatter) Format(entry *logrus.Entry) ([]byte, error) {
    var b *bytes.Buffer

    if entry.Buffer != nil {
        b = entry.Buffer
    } else {
        b = &bytes.Buffer{}
    }

    // Format timestamp
    timestamp := entry.Time.Format(f.TimestampFormat)

    // Format level name with padding for alignment
    level := strings.ToUpper(entry.Level.String())
    level = fmt.Sprintf("%-7s", level) // Pad to 7 characters

    // Add timestamp, level, and message
    fmt.Fprintf(b, "[%s] [%s] %s", timestamp, level, entry.Message)

    // Sort fields by key for consistent output
    var keys []string
    for k := range entry.Data {
        // Skip excluded fields
        if contains(f.ExcludeFields, k) {
            continue
        }

        // Only add included fields if the list is not empty
        if len(f.IncludeFields) > 0 && !contains(f.IncludeFields, k) {
            continue
        }

        keys = append(keys, k)
    }
    sort.Strings(keys)

    // Add fields
    for _, key := range keys {
        fmt.Fprintf(b, " | %s=%v", key, entry.Data[key])
    }

    b.WriteByte('\n')
    return b.Bytes(), nil
}

// Helper function to check if a slice contains a string
func contains(slice []string, s string) bool {
    for _, item := range slice {
        if item == s {
            return true
        }
    }
    return false
}

func main() {
    log := logrus.New()

    // Use our custom formatter
    log.SetFormatter(&CustomFormatter{
        TimestampFormat: "2006-01-02 15:04:05",
        ExcludeFields:   []string{"internal_id"}, // Don't show internal IDs
    })

    log.WithFields(logrus.Fields{
        "user_id":    123,
        "action":     "login",
        "internal_id": "some-internal-value", // This will be excluded
    }).Info("User logged in")

    // Test with different log levels to see alignment
    log.WithField("component", "test").Debug("This is a debug message")
    log.WithField("component", "test").Info("This is an info message")
    log.WithField("component", "test").Warn("This is a warning message")
    log.WithField("component", "test").Error("This is an error message")
}
```

This example creates a custom formatter that:

- Formats the timestamp according to a specified format
- Aligns log levels for better readability
- Allows including or excluding specific fields
- Sorts fields alphabetically for consistent output

The output might look like:

```
[output]
[2025-03-09 10:23:57] [INFO   ] User logged in | action=login | user_id=123
[2025-03-09 10:23:57] [INFO   ] This is an info message | component=test
[2025-03-09 10:23:57] [WARNING] This is a warning message | component=test
[2025-03-09 10:23:57] [ERROR  ] This is an error message | component=test
```

Custom formatters are particularly useful when you have specific formatting
requirements that aren't met by the built-in formatters, such as:

- Custom log formats required by certain log management systems
- Specialized formatting for specific environments (e.g., development vs.
  production)
- Compliance with organizational logging standards

### Multiple output targets

You can configure Logrus to send logs to multiple destinations simultaneously,
which is useful for scenarios where you want logs to be both displayed locally
and stored for later analysis:

```go
[label multioutput.go]
package main

import (
    "github.com/sirupsen/logrus"
    "io"
    "os"
)

func main() {
    // Create a new logger
    log := logrus.New()

    // Open a file for writing logs
    file, err := os.OpenFile("application.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
    if err != nil {
        log.Fatal("Failed to open log file:", err)
    }

    // Send logs to both file and stdout
    mw := io.MultiWriter(os.Stdout, file)
    log.SetOutput(mw)

    // Configure the formatter (optional)
    log.SetFormatter(&logrus.JSONFormatter{})

    // Now logs will go to both console and file
    log.Info("Application started")
    log.WithField("user_id", 123).Info("User logged in")

    // Using different formatters for different outputs
    // For this case, you would need two separate loggers
    fileLogger := logrus.New()
    fileLogger.SetOutput(file)
    fileLogger.SetFormatter(&logrus.JSONFormatter{})

    consoleLogger := logrus.New()
    consoleLogger.SetOutput(os.Stdout)
    consoleLogger.SetFormatter(&logrus.TextFormatter{})

    // Now use the appropriate logger based on where you want the log to go
    fileLogger.WithField("source", "file_only").Info("This goes only to the file as JSON")
    consoleLogger.WithField("source", "console_only").Info("This goes only to the console as text")
}
```

This approach with `io.MultiWriter` allows the same log entries to be sent to
multiple destinations with the same format. For more complex scenarios where you
want different formatting for different destinations, you'll need separate
logger instances as shown in the second part of the example.

For even more sophisticated setups, such as routing different log levels to
different destinations, you'll need to implement custom hooks, which we'll cover
later.

### Setting default fields

You can configure Logrus to include default fields in all log entries, which is
useful for identifying the source of logs when aggregating from multiple
services:

```go
[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
    "os"
    "runtime"
)

func main() {
    log := logrus.New()
    log.SetFormatter(&logrus.JSONFormatter{})

    // Gather information about the environment
    hostname, _ := os.Hostname()

    // Create an entry with default fields
    logger := log.WithFields(logrus.Fields{
        "environment": os.Getenv("APP_ENV"),
        "service":     "user-service",
        "version":     "1.0.0",
        "host":        hostname,
        "go_version":  runtime.Version(),
        "pid":         os.Getpid(),
    })

    // All these logs will include the default fields
    logger.Info("Application started")
    logger.WithField("component", "database").Info("Connected to database")
    logger.WithField("component", "http").Info("HTTP server listening")

    // Specific components can add their own default fields
    dbLogger := logger.WithField("component", "database")
    dbLogger.Info("Migrations completed")
    dbLogger.WithField("query_time_ms", 15).Info("Query executed")
}
```

This pattern ensures that critical metadata is attached to every log entry,
providing valuable context for troubleshooting and analysis. The output will
include all the default fields:

```json
[output]
{"environment":"development","go_version":"go1.17.5","host":"myserver","level":"info","msg":"Application started","pid":12345,"service":"user-service","time":"2023-03-09T15:32:10Z","version":"1.0.0"}
{"component":"database","environment":"development","go_version":"go1.17.5","host":"myserver","level":"info","msg":"Connected to database","pid":12345,"service":"user-service","time":"2023-03-09T15:32:10Z","version":"1.0.0"}
{"component":"http","environment":"development","go_version":"go1.17.5","host":"myserver","level":"info","msg":"HTTP server listening","pid":12345,"service":"user-service","time":"2023-03-09T15:32:10Z","version":"1.0.0"}
{"component":"database","environment":"development","go_version":"go1.17.5","host":"myserver","level":"info","msg":"Migrations completed","pid":12345,"service":"user-service","time":"2023-03-09T15:32:10Z","version":"1.0.0"}
{"component":"database","environment":"development","go_version":"go1.17.5","host":"myserver","level":"info","msg":"Query executed","pid":12345,"query_time_ms":15,"service":"user-service","time":"2023-03-09T15:32:10Z","version":"1.0.0"}
```

## Error logging with Logrus

Effective error logging is crucial for troubleshooting issues in production.
Logrus provides special support for logging errors:

```go
[label main.go]
package main

import (
	"errors"

	"github.com/sirupsen/logrus"
)

func main() {
	log := logrus.New()
	log.SetFormatter(&logrus.JSONFormatter{})

	// Simple error logging
	err := errors.New("something went wrong")
	log.WithError(err).Error("Failed to process request")

	// WithError is a shorthand for WithField("error", err)
	// It's equivalent to:
	log.WithField("error", err).Error("Failed to process request")

	// With additional context
	log.WithFields(logrus.Fields{
		"user_id": 123,
		"error":   err.Error(),
		"context": "user lookup",
	}).Error("User data could not be retrieved")

	// Fatal errors - will exit the program
	if criticalErr := performCriticalOperation(); criticalErr != nil {
		log.WithError(criticalErr).Fatal("System cannot continue")
		// The program exits here with status code 1
	}

	// Panic errors - will panic after logging
	if panicErr := performRiskyOperation(); panicErr != nil {
		log.WithError(panicErr).Panic("Unexpected state detected")
		// The program panics here
	}
}

func performCriticalOperation() error {
	// Simulate an error
	return errors.New("critical subsystem failure")
}

func performRiskyOperation() error {
	// Simulate an error
	return errors.New("invalid state")
}
    // Simulate an error
    return errors.New("critical subsystem failure")
}

func performRiskyOperation() error {
    // Simulate an error
    return errors.New("invalid state")
}
```

```json
[output]
{"error":"something went wrong","level":"error","msg":"Failed to process request","time":"2025-03-09T10:25:17+01:00"}
{"error":"something went wrong","level":"error","msg":"Failed to process request","time":"2025-03-09T10:25:17+01:00"}
{"context":"user lookup","error":"something went wrong","level":"error","msg":"User data could not be retrieved","time":"2025-03-09T10:
25:17+01:00","user_id":123}
{"error":"critical subsystem failure","level":"fatal","msg":"System cannot continue","time":"2025-03-09T10:25:17+01:00"}
exit status 1
```

The `WithError()` method adds the error to the log entry with the key "error".
This is a convenient way to include error information in your logs.

It's important to understand the behavior of the different error logging levels:

- `Error`: Logs the error but allows the program to continue
- `Fatal`: Logs the error and then calls `os.Exit(1)`, terminating the program
- `Panic`: Logs the error and then calls `panic()`, which can be recovered from

Choose the appropriate level based on whether the error is recoverable and how
critical it is to the operation of your application.

## Understanding the Logrus hooks system

Logrus hooks allow you to trigger actions when logs of certain levels are
emitted. This powerful feature enables integration with external systems like
alerting tools, metrics systems, or specialized log processors.

Here's how to create and use a custom hook:

```go
[label main.go]
package main

import (
    "fmt"
    "github.com/sirupsen/logrus"
    "strings"
)

// Define a custom hook
type AlertHook struct {
    // Configuration fields go here
    AlertThreshold logrus.Level
    AlertEndpoint  string
}

// Implement the Levels method to specify which log levels this hook should be triggered for
func (hook *AlertHook) Levels() []logrus.Level {
    // Get all levels at or above the threshold
    levels := []logrus.Level{}
    for _, level := range logrus.AllLevels {
        if level <= hook.AlertThreshold {
            levels = append(levels, level)
        }
    }
    return levels
}

// Implement the Fire method to define what happens when the hook is triggered
func (hook *AlertHook) Fire(entry *logrus.Entry) error {
    // Extract relevant information from the log entry
    level := entry.Level.String()
    message := entry.Message

    // Build alert payload
    alertText := fmt.Sprintf("[%s] %s", strings.ToUpper(level), message)

    // Include relevant fields
    for k, v := range entry.Data {
        alertText += fmt.Sprintf(" | %s=%v", k, v)
    }

    // In a real implementation, this would send the alert to an external system
    fmt.Printf("ALERT to %s: %s\n", hook.AlertEndpoint, alertText)

    // Return nil if successful, or an error if something went wrong
    return nil
}

func main() {
    log := logrus.New()

    // Add our custom hook
    log.AddHook(&AlertHook{
        AlertThreshold: logrus.WarnLevel,
        AlertEndpoint:  "https://alerts.example.com/webhook",
    })

    // These logs won't trigger the hook
    log.Debug("Debug message")
    log.Info("Info message")

    // These logs will trigger the hook
    log.Warn("Warning message")
    log.WithField("component", "database").Error("Connection failed")
}
```

When run, this program will print the alert messages for the `Warning` and
`Error` logs:

![3.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1c14b49f-7ca7-4d62-6ec6-c4ca11414600/orig =2644x768)

Multiple hooks can also be added to a single logger, allowing for sophisticated
logging pipelines. Each hook will be called for any log entry that matches its
specified levels.

## Creating a logging middleware

Logrus integrates well with web applications for HTTP request logging. Here's an
example:

```go
[label httpmiddleware.go]
package main

import (
    "github.com/sirupsen/logrus"
    "net/http"
    "time"
    "github.com/google/uuid"
)

[highlight]
// LoggingMiddleware logs HTTP requests with detailed information
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Generate a unique request ID
        requestID := uuid.New().String()

        // Add the request ID to the response headers
        w.Header().Set("X-Request-ID", requestID)

        // Create a logger with request details
        log := logrus.WithFields(logrus.Fields{
            "request_id":  requestID,
            "method":      r.Method,
            "path":        r.URL.Path,
            "query":       r.URL.RawQuery,
            "remote_addr": r.RemoteAddr,
            "user_agent":  r.UserAgent(),
            "referer":     r.Referer(),
        })

        // Create a custom response writer to capture the status code
        rw := &responseWriter{w, http.StatusOK, 0}

        // Record start time for duration calculation
        start := time.Now()

        // Log the incoming request
        log.Info("HTTP request started")

        // Process the request
        next.ServeHTTP(rw, r)

        // Calculate request duration
        duration := time.Since(start)

        // Log the completed request with additional information
        log.WithFields(logrus.Fields{
            "status_code": rw.statusCode,
            "duration_ms": duration.Milliseconds(),
            "size_bytes":  rw.size,
        }).Info("HTTP request completed")
    })
}
[/highlight]

// Custom response writer to capture status code and response size
type responseWriter struct {
    http.ResponseWriter
    statusCode int
    size       int
}

// Override WriteHeader to capture status code
func (rw *responseWriter) WriteHeader(code int) {
    rw.statusCode = code
    rw.ResponseWriter.WriteHeader(code)
}

// Override Write to capture response size
func (rw *responseWriter) Write(b []byte) (int, error) {
    size, err := rw.ResponseWriter.Write(b)
    rw.size += size
    return size, err
}

func main() {
    logrus.SetFormatter(&logrus.JSONFormatter{})

    helloHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello, world!"))
    })

    errorHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte("Something went wrong!"))
    })

    // Register handlers with our logging middleware
    [highlight]
    http.Handle("/", LoggingMiddleware(helloHandler))
    http.Handle("/error", LoggingMiddleware(errorHandler))
    [/highlight]

    logrus.Info("Starting server on :8080")
    http.ListenAndServe(":8080", nil)
}
```

This middleware captures detailed information about each HTTP request,
including:

- A unique request ID for tracing
- Request details (method, path, query parameters)
- Client information (IP address, user agent, referer)
- Response details (status code, size, duration)

The request ID is particularly valuable for correlating logs across different
components of your system. By adding it to response headers, you also make it
available to clients for their own debugging.

The custom `responseWriter` type allows us to capture information about the
response without interfering with normal operation. This is a common pattern in
HTTP middleware.

You can enhance this middleware further to include additional context, such as
authenticated user information, or to implement more sophisticated logging
strategies based on request attributes.

## Final thoughts

Logrus is a powerful structured logging library for Go that offers significant
improvements over the standard library logger. Its key strengths include
structured JSON logging, flexible log levels, contextual logging with fields,
and an extensible hook system.

By following the best practices outlined in this guide, you can create
maintainable, efficient, and insightful logging for your Go applications.

Thanks for reading!
