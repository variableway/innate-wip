# Contextual Logging in Go with Slog

![Confused developer trying to debug a contextless log](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/69225c4b-5342-4adb-37ce-eb7f4d4eac00/md2x =637x360)

Logging is an essential part of software development and system maintenance.
However, the effectiveness of logs largely depends on the information they
contain.

The following log entry is too vague to be helpful for debugging. It only tells
us that a login attempt failed but provides no details about the cause of the
failure.

```text
2024/07/02 19:34:50 ERROR failed to login
```

Contextual logging involves embedding additional information within the log
entries to make them more informative. By [adding contextual information](https://betterstack.com/community/guides/observability/high-cardinality-observability/) to the log
messages, you can better understand the system and improve its
[observability](https://betterstack.com/community/guides/observability/what-is-observability/).

For instance, the previous error message could be improved by including:

- The specific location within the code where the error occurred.
- The server instance handling the login request.
- The username or ID of the user attempting to log in.

```text
time=2024-07-02T19:50:39.181+02:00 level=ERROR source=/home/pp/contextual-logs/main.go:31 msg="failed to login" service=authService node=auth-node-1 environment=production request_id=0b0d3131-af6f-4775-a825-f115e21f1e68 user_id=cf2db94f-ca8e-43db-b50a-2f17215d057d payload.username="Harry Potter" payload.auth_method=password
```

Given the contextual fields in the updated log entry, you get a much clearer
picture when debugging. You now know what user is having issues and which node
the issue occurred on.

In this article, we will take a look at how to implement contextual logging in
Go through the built-in `log/slog` package.

[ad-logs]

## Prerequisites

You only need a basic understanding of [structured logging in
Go](https://betterstack.com/community/guides/logging/logging-in-go/), and a recent version of Go installed to follow through with
this tutorial.

## What is contextual logging?

![Happy developer knowing the issue due  to contextual logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4193f4fd-0668-4c06-a32a-bafc57517400/public =614x345)

Contextual logging means enriching log entries with additional data providing
context about the situation or event. This extra information can significantly
enhance the usefulness of your logs, making them more actionable and insightful.

Think of it like adding crucial details to a story: instead of just stating "an
error occurred," contextual logging tells you _who_ was affected, _when_ it
happened, _where_ in the system it originated, and even _what_ data was
involved.

At first glance, this might seem like extra work, but consider the benefits:

1. **Enhanced debugging**: Adding context to logs helps pinpoint the exact issue
   quickly. For instance, knowing which user or service was affected can
   drastically reduce the time spent debugging.
2. **Improved traceability**: Contextual logs make it much easier to follow the
   flow of requests and actions across different parts of the system. This can
   be crucial in distributed systems.
3. **Better monitoring**: Logs enriched with context provide much more detailed
   insights for monitoring tools, improving how we can search and index logs in
   tools, improving alerting mechanisms to help us minimize downtimes.
4. **Efficient incident response**: A detailed insight into the context during
   incidents and debugging can help teams resolve the issue faster.
5. **Reproducibility**: Having access to the exact input that led to the error
   makes it much easier to reproduce and diagnose by the developers. [Remember
   to always protect sensitive data](https://betterstack.com/community/guides/logging/sensitive-data/) to avoid breaking any
   privacy regulations (e.g. GDPR, HIPAA). It's also important to be mindful
   about the size of payloads.

Let's take a look at how logs with contextual information can help us. Given the
log messages, below we can deduce a bit of information.

```log
time=2024-07-02T19:50:39.181+02:00 level=ERROR source=/home/pp/contextual-logs/main.go:31 msg="failed to login" service=authService node=auth-node-1 environment=production request_id=0b0d3131-af6f-4775-a825-f115e21f1e68 user_id=cf2db94f-ca8e-43db-b50a-2f17215d057d payload.username="Harry Potter" payload.auth_method=password
time=2024-07-02T19:50:42.181+02:00 level=DEBUG source=/home/pp/contextual-logs/main.go:31 msg="successful login" service=authService node=auth-node-1 environment=production request_id=0b0d3131-af6f-4775-a825-f115e21f1e69 user_id=cf2db94f-ca8e-43db-b50a-2f17215d057d payload.username="Harry Potter" payload.auth_method=oauth
time=2024-07-02T19:52:29.181+02:00 level=DEBUG source=/home/pp/contextual-logs/main.go:31 msg="successful login" service=authService node=auth-node-2 environment=production request_id=0b0d3131-af6f-4775-a825-f115e21f1e70 user_id=cf2db94f-ca8e-43db-b50a-2f17215d057e payload.username="Beelzebub" payload.auth_method=password
```

We can gather from the logs that it seems that the problem is isolated to the
node `auth-node-1` and also only when using the `password` authentication
method.

Thanks to the contextual information have a very good idea of where to start
searching for the error. Maybe it's a configuration on `auth-node-1` or a
firewall preventing it from connecting properly with the database.

Remember that the best context to include will depend on your specific
application and observability goals. Choose the information that provides the
most value for understanding and improving your system's behavior.

Enough talk! Let's see contextual logging in action through the `log/slog`
package.

## Implementing contextual logging with slog

The `log/slog` package in Go makes adding context to your log entries a breeze.
We'll enhance our authentication service to demonstrate this.

Here's the starting point:

```go
package main

import (
	"log/slog"
	"net/http"
)

func main() {
	slog.Debug("Starting authentication service")

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		slog.Error("failed to login")
	})

	if err := http.ListenAndServe(":8080", nil); err != nil {
		slog.Error("the server crashed")
	}
}
```

Now, let's enrich our logs with contextual data by adding default attributes for
the service, then including request-specific details in the login handler:

```go
package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/google/uuid"
)

func main() {
	// Add a few default environmental attributes that always are included
	defaultAttrs := []slog.Attr{
		slog.String("service", "authService"),
		slog.String("node", "auth-node-1"),
		slog.String("environment", "production"),
	}

	// Create a Logger and apply the Default attrs to the handler
	handler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}).WithAttrs(defaultAttrs)
	logger := slog.New(handler)

	logger.Debug("Starting authentication service")

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		// Mock a Request ID for tracing and UserID
		request_id := uuid.NewString()
		user_id := uuid.NewString()

		// Add Contextual information for this Function call,
		logger.Error("failed to login",
			slog.String("request_id", request_id),
			slog.String("user_id", user_id),
			slog.Group("payload",
				slog.String("username", "Harry Potter"),
				slog.String("auth_method", "password"),
			),
		)
	})

	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}
```

Run the program, send a login request, and observe the enriched log output:

```command
go mod tidy
```

```command
go run main.go
```

```command
curl localhost:8080/login
```

```text
[output]
time=2024-07-02T19:50:39.181+02:00 level=ERROR source=/home/pp/contextual-logs/main.go:31 msg="failed to login" service=authService node=auth-node-1 environment=production request_id=0b0d3131-af6f-4775-a825-f115e21f1e68 user_id=cf2db94f-ca8e-43db-b50a-2f17215d057d payload.username="Harry Potter" payload.auth_method=password
```

We now have a wealth of information to aid debugging! This is the power of
contextual logging with slog. The great thing about this is that any decent
logging tool (such as [Better Stack](https://betterstack.com/logs)) will also
allow you to filter and search on the included attributes, making
troubleshooting a breeze.

In the next section, we'll look at an easier way to add contextual attributes to
the logs without repeating them at the log point.

## Using `context.Context` with slog

In the example above, you added contextual information by including attributes
directly in the log statements. This approach works, but in a real-world
application, it is impractical to repeatedly add dynamic values like
`request_id` to each log statement generated from a request.

To streamline this process, you can leverage `context.Context` to pass
contextual information to the logger, allowing the log handler to include these
values automatically.

This can be achieved by creating a custom handler that retrieves attributes from
a `context.Context` instance, and using the context-aware slog methods with a
`Context` suffix, such as `slog.DebugContext()`.

We will create a custom handler that extracts specific values from the context
and includes them in the log entries. This way, you don't have to manually add
these attributes in every log statement.

```go
package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/google/uuid"
)

[highlight]
type ContextHandler struct {
	slog.Handler
}

// Handle overrides the default Handle method to add context values.
func (h *ContextHandler) Handle(ctx context.Context, r slog.Record) error {
	if requestID, ok := ctx.Value("request_id").(string); ok {
		r.AddAttrs(slog.String("request_id", requestID))
	}
	if userID, ok := ctx.Value("user_id").(string); ok {
		r.AddAttrs(slog.String("user_id", userID))
	}
	return h.Handler.Handle(ctx, r)
}
[/highlight]

func main() {
	// Add a few default environmental attributes that always are included
	defaultAttrs := []slog.Attr{
		slog.String("service", "authService"),
		slog.String("node", "auth-node-1"),
		slog.String("environment", "production"),
	}

	// Create a Logger and apply the Default attrs to the handler
[highlight]
	baseHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}).WithAttrs(defaultAttrs)
	customHandler := &ContextHandler{Handler: baseHandler}
	logger := slog.New(customHandler)

	logger.Debug("Starting authentication service")
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		// Create Request ID for tracing
		request_id := uuid.NewString()
		user_id := uuid.NewString()
		ctx := r.Context()

		ctx = context.WithValue(ctx, "request_id", request_id)
		ctx = context.WithValue(ctx, "user_id", user_id)
		// Pass contextual information using the context
		logger.ErrorContext(ctx, "failed to login",
			slog.Group("payload",
				slog.String("username", "Harry Potter"),
				slog.String("auth_method", "password"),
			),
		)
	})
[/highlight]

	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}
```

The `ContextHandler` is designed to extract `request_id` and `user_id` from the
provided `ctx`. If found, these values are seamlessly incorporated into the log
record as attributes.

Give the program another run, and witness the changes: context values are now
automatically populated in your logs!

```command
go run main.go
```

```command
curl localhost:8080/login
```

```text
[output]
time=2024-07-02T20:30:58.807+02:00 level=ERROR source=/home/pp/contextual-logs/main.go:50 msg="failed to login" service=authService node=auth-node-1 environment=production payload.username="Harry Potter" payload.auth_method=password request_id=f833cba9-96ec-4e38-aa55-c9f7b2030e1a user_id=40b834ad-264d-4a17-abfd-2b9fe707f3ba
```

This technique is great when you need to enrich your logs without altering
existing function signatures. Simply embed the information within the
`context.Context`, and let the `ContextHandler` handle the rest.

However, it has a fundamental limitation: restricting you to predefined context
values within the `Handle()` method. What if you need to add arbitrary values to
your logs dynamically?

Let's explore a better solution that will help you do just that through a
third-party library:

```go
package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/google/uuid"
	slogctx "github.com/veqryn/slog-context"
)

func main() {
	// Add a few default environmental attributes that always are included
	defaultAttrs := []slog.Attr{
		slog.String("service", "authService"),
		slog.String("node", "auth-node-1"),
		slog.String("environment", "production"),
	}

	// Create a Logger and apply the Default attrs to the handler
	baseHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}).
		WithAttrs(defaultAttrs)
    [highlight]
	customHandler := slogctx.NewHandler(baseHandler, nil)
    [/highlight]
	logger := slog.New(customHandler)

	logger.Debug("Starting authentication service")
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		// Create Request ID for tracing
		request_id := uuid.NewString()
		user_id := uuid.NewString()
		ctx := r.Context()

		// You can add arbitrary key/value pairs to the context
    [highlight]
		ctx = slogctx.Append(ctx, "request_id", request_id)
		ctx = slogctx.Append(ctx, "user_id", user_id)
    [/highlight]

		// Pass contextual information using the context
		logger.ErrorContext(ctx, "failed to login",
			slog.Group("payload",
				slog.String("username", "Harry Potter"),
				slog.String("auth_method", "password"),
			),
		)
	})

	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}
```

Instead of writing our own `ContextHandler`, we're now using the `Handler`
provided by the [slog-context](https://github.com/veqryn/slog-context) library.
It allows us to prepend or append arbitrary key/value pairs to log lines, and
the Handler picks them up later when a new log line is written:

Re-running the program should print the `request_id` and the `user_id` as
before, but also any other attributed you choose to append with
`slogctx.Append()`:

```command
go mod tidy
```

```command
go run main.go
```

```command
curl localhost:8080/login
```

```text
[output]
time=2024-07-02T20:30:58.807+02:00 level=ERROR source=/home/pp/development/betterstack/contextual-logs/thirdpartyctx/main.go:39 msg="failed to login" service=authService node=auth-node-1 environment=production payload.username="Harry Potter" payload.auth_method=password request_id=d2778f5b-6c80-4a23-893e-af70ee9ec19c user_id=487b514a-b73b-4a6f-af2b-ff271cb2cd17
```

## Adding trace IDs and span IDs to logs

The previous section showcased how you can automate including the `request_id`
and `user_id` attributes in logs. Those two are just examples: so much more can
be added as contextual information to logs.

If you are familiar with [distributed tracing](https://betterstack.com/community/guides/observability/distributed-tracing/) with
[OpenTelemetry (OTel)](https://betterstack.com/community/guides/observability/what-is-opentelemetry/), one useful technique is adding a
`SpanID` and `TraceID` to log messages.

A `TraceID`, often paired with its `SpanID`, is invaluable for tracing the
origin and flow of actions in distributed systems. It helps you understand why a
service behaves a certain way and what triggered its actions.

By incorporating these IDs into your logs, you gain the ability to seamlessly
connect traces and logs, enabling robust joint analysis and troubleshooting.

Let's leverage our context-passing knowledge to automatically extract and
include these IDs in our logs:

```go
package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"

	slogctx "github.com/veqryn/slog-context"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.20.0"
	"go.opentelemetry.io/otel/trace"
)

const (
	OtelTraceID = "TraceID"
	OtelSpanID  = "SpanID"
)

// InitTracer returns an Mock Tracer
func InitTracer(ctx context.Context, service string) trace.Tracer {
	client := otlptracegrpc.NewClient(
		otlptracegrpc.WithInsecure(),
	)
	exporter, err := otlptrace.New(ctx, client)
	if err != nil {
		log.Fatal("creating OTLP trace exporter: %w", err)
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(newResource(service)),
	)

	return tp.Tracer(service)
}

func newResource(service string) *resource.Resource {
	return resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceName(service),
		semconv.ServiceVersion("0.0.1"),
	)
}

// TracingMiddleware extracts OTEL headers and adds them to the request context.
func TracingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract headers
		spanID := r.Header.Get(OtelSpanID)
		traceID := r.Header.Get(OtelTraceID)

		// Add values to the request context
		ctx := r.Context()
		if spanID != "" {
			ctx = slogctx.Append(ctx, OtelSpanID, spanID)
		}
		if traceID != "" {
			ctx = slogctx.Append(ctx, OtelTraceID, traceID)
		}

		// Pass the request with the updated context to the next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
func main() {
	// Add a few default environmental attributes that always are included
	rootCtx := context.Background()
	tracer := InitTracer(rootCtx, "authService")
	// Create a Logger and apply the Default attrs to the handler
	baseHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true})
	// Wrap the base handler with slogctx to handle context logging
	customHandler := slogctx.NewHandler(baseHandler, nil)
	logger := slog.New(customHandler)
	logger.Debug("Starting authentication service")

	loginHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Create Trace
		ctx, span := tracer.Start(r.Context(), "login")
		defer span.End()
		// Add Contextual information for this Function call
		logger.ErrorContext(ctx, "failed to login",
			slog.Group("payload",
				slog.String("username", "Harry Potter"),
				slog.String("auth_method", "password"),
			),
		)

		w.WriteHeader(http.StatusOK)
	})

	// Wrap your handler with the TracingMiddleware
	http.Handle("/login", TracingMiddleware(loginHandler))

	// Start the HTTP server
	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}

```

The `InitTracer()` function is used to set up an OTel tracer, while
`TracingMiddleware()` automatically adds the `TraceID` and `SpanID` attributes
to log entries if they exist in the request headers. By leveraging `slogctx` we
easily add automatic extraction of the `SpanID` and `TraceID` to be included in
future logs down the stack as long as the `Context` methods are used to generate
them.

Try restarting the server and requesting the `/login` route once again to see
the IDs being printed. Remember to run `go mod tidy` to download all the new
dependencies first.

```command
go run main.go
```

```command
curl localhost:8080/login -H "SpanID: abcdef1234567890"
```

```text
[output]
time=2024-07-02T21:10:53.718+02:00 level=ERROR source=/home/pp/development/betterstack/contextual-logs/thirdpartyctx/main.go:88 msg="failed to login" payload.username="Harry Potter" payload.auth_method=password SpanID=abcdef1234567890
```

With the automatic inclusion of tracing IDs in place, your logs are now equipped
with traceability, significantly improving your ability to navigate and
understand complex system interactions.

You can also use the
[slog-context/otel](https://github.com/veqryn/slog-context/tree/main/otel)
package to achieve the same thing without writing your own `TracingMiddleware()`
function.

**Learn more**: [Practical Tracing for Go Apps with OpenTelemetry](https://betterstack.com/community/guides/observability/opentelemetry-go/)

## Passing your logger: context, parameters, or global scope?

A perennial debate in the Go community revolves around the optimal way to manage
your logger throughout your application. The three most common approaches are:

- **Context-based passing**: Embed the logger within the `context.Context`.
- **Function parameters**: Explicitly pass the logger as an argument to
  functions.
- **Global logger**: Maintain a single, globally accessible logger instance.

Each method has its own advantages and drawbacks, and the ideal choice hinges on
the unique requirements and architecture of your application. Your team's
preferences and familiarity also play a significant role.

Let's look at the three approaches in turn:

### 1. Passing loggers by context

This approach leverages the `context.Context` to seamlessly propagate the logger
throughout your application. It's straightforward: add the logger as a value to
the context using `ctx.WithValue()`, and retrieve it wherever you need it using
the associated key.

The pros of this approach are

- **Consistency**: The logger is readily available where needed, even allowing
  for optional logging based on its presence in the context.
- **Simplified function signatures**: No need for additional parameters for the
  logger, which keeps the signatures cleaner, especially in deeply nested calls.
- **Ease of use**: Many functions already accept a context as a first parameter
  according to Go conventions making it very easy to implement.

There are, however, some cons to this approach:

- **Implicit dependency**: The logger's presence can be less obvious,
  potentially leading to confusion or crashes if not handled carefully.
- **Performance overhead**: You need to extract the logger from the context, so
  while atomically small, there is still an overhead.
- **Context misuse**: Overloading the context with too many dependencies can
  lead to complex and difficult-to-maintain code.

Here's what the implementation of this approach could look like:

```go
package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
)

// ContextKey is an alias for string type
type ContextKey string

const (
	// LoggerCtxKey is the string used to extract logger
	LoggerCtxKey ContextKey = "logger"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))

	loginHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Fetch the Logger from Context
		ctx := r.Context()
		// Grab the Logger from the context
		logger := ctx.Value(LoggerCtxKey).(*slog.Logger)
		logger.ErrorContext(ctx, "failed to login")

		w.WriteHeader(http.StatusOK)
	})

	// Wrap your handler with the LoggerMiddleware
	http.Handle("/login", LoggerMiddleware(loginHandler, logger))
}

// LoggerMiddleware adds a logger to the requests
func LoggerMiddleware(next http.Handler, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add the logger to the context using our special Logger
		ctx := context.WithValue(r.Context(), LoggerCtxKey, logger)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
```

This context-based approach is generally favored when you need to propagate
additional metadata alongside the logger, ensuring it's readily available
throughout your application. It's particularly useful when you want to avoid
modifying existing function signatures, especially if your functions already
accept a context parameter.

The `slogctx.NewCtx()` and `slogctx.FromCtx()` methods also allow you to
[work directly with a logger residing with the context](https://github.com/veqryn/slog-context?tab=readme-ov-file#logger-in-context-workflow-1)
(or a default logger if no logger is stored in the context). Do check them out
if you intend to utilize this pattern in your applications.

### Passing loggers by parameter

In this approach, the logger is explicitly passed into functions or embedded
within structs as part of their API.

The pros are:

- **Explicit dependency**: Passing the logger as a function parameter makes it
  very clear that it is expected. There is no question that this function relies
  on logging.
- **Flexibility**: It allows more flexibility in how the logger is used and
  replaced, you can create a copy of the current logger and change it, like
  adding default fields. Then pass that logger deeper into the stack trace.

Then there is the obvious con of this approach

- **Verbose signatures**: It is very verbose to add the logger as a parameter to
  each function that needs a logger. This is especially true in deeply nested
  functions.

To reduce verbosity, consider storing the logger as a field within a struct.
This allows all the struct methods to access the logger without explicitly
passing it as a parameter.

```go
package main

import (
	"log/slog"
	"net/http"
	"os"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))

	as := &AuthService{
		logger: logger,
	}
	// Regular Login handler
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		loginHandler(w, r, logger)
	})
	// Logging with Struct
	http.HandleFunc("/login-struct", as.loginHandler)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}

// loginHandler that accepts the logger as a parameter
func loginHandler(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	logger.Error("failed to login")
}

// A struct holding the Logger to reduce dependency and avoid verbositiy
type AuthService struct {
	logger *slog.Logger
}

func (as *AuthService) loginHandler(w http.ResponseWriter, r *http.Request) {
	as.logger.Error("failed to login")
}

```

This approach is often recommended when you prefer an explicit dependency and
want to make reliance on the logger clear. The verbosity is often reduced by
adding the logger as part of a struct.

### Using a global logger

The third approach involves employing a global logger, either created in your
main function or exposed by a logging package for import and use across your
codebase.

Both the standard `log` package and `log/slog` offer this out-of-the-box
functionality, allowing you to log immediately after import. You retain the
flexibility to configure these loggers to suit your needs.

The pros of this approach are:

- **Ease of use**: The logger is available anywhere in the codebase without
  needing to pass it explicitly.
- **Consistency**: Ensures the same logger configuration is applied throughout
  the application.

The cons are:

- **Global state issues**: Relying on a global state can make code harder to
  test and maintain. Changes to the global logger affect the entire application.
- **Less flexible**: It can get harder to change logger configuration for
  specific parts of the application, although child loggers can mitigate this.
- **Concurrency issues**: Depending on the implementation, there may be
  concurrency issues when using a global logger. While default handlers are
  generally safe, custom handlers might introduce concurrency concerns.

```go
package main

import (
	"log/slog"
	"net/http"
	"os"
)

func init() {
	// Setup and configure you're logger how you want it
    logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))
	// You can set the default logger using the Slog package, it will modify all calls to slog to use the configured logger
	slog.SetDefault(logger)
}

func main() {
	slog.Debug("Starting authentication service")

	http.HandleFunc("/login", loginHandler)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		slog.Error("the server crashed")
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	slog.Error("failed to login")
}

```

A global logger is often recommended in small to medium-sized applications where
simplicity is a priority and you're comfortable with the trade-offs associated
with global state.

## Final thoughts

In this article, we've explored the importance and implementation of contextual
logging in Go using the slog package. Contextual logging significantly enhances
the usefulness of log entries by embedding relevant metadata to improve
debugging, traceability, monitoring, and incident response, making logs more
informative and actionable.

We also demonstrated the three primary methods to pass a logger around in Go
applications. By understanding the pros and cons of each approach, you can
choose the best approach for your application's needs.

Whether you prioritize consistency and traceability with context, explicit
dependencies with parameters, or simplicity with a global logger, contextual
logging will greatly enhance your ability to monitor and debug your applications
effectively.

Thanks for reading!
