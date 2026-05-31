# Practical Tracing for Go Apps with OpenTelemetry

[OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) provides a unified standard for
[observability instrumentation](https://betterstack.com/community/guides/observability/what-is-observability/), making it easier to
gather telemetry data like logs, traces, and metrics, regardless of your
specific Go framework or observability backend.

In this tutorial, **we'll focus on using OpenTelemetry to instrument your Go
applications for tracing**. You'll learn how to seamlessly integrate the
OpenTelemetry SDK to gain a comprehensive view of your application's behavior,
enabling effective troubleshooting and optimization.

Let's dive in!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Prerequisites

- Basic Linux skills.
- Prior Go development experience and a
  [recent version](https://go.dev/doc/install) installed.
- Familiarity with [Docker](https://www.docker.com/) and [Docker
  Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/).
- Basic understanding of [distributed tracing terminology](https://betterstack.com/community/guides/observability/distributed-tracing/).
- Basic familiarity with OpenTelemetry concepts.

## Step 1 — Setting up the demo project

In this tutorial, your focus will be on instrumenting a Go application to
generate traces with OpenTelemetry.
[The application](https://github.com/betterstack-community/go-image-upload) is
designed for converting images (such as JPEGS) to the
[AVIF format](https://en.wikipedia.org/wiki/AVIF). It also incorporates a GitHub
social login to secure the `/upload` route, preventing unauthorized access.

To begin, clone the application to your local machine:

```command
git clone https://github.com/betterstack-community/go-image-upload
```

Navigate into the project directory and install the necessary dependencies:

```command
cd go-image-upload
```

```command
go mod tidy
```

Rename the `.env.sample` file to `.env`:

```command
mv .env.sample .env
```

Before running the application, you'll need to
[create a GitHub application](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app)
to enable
[GitHub OAuth](https://docs.github.com/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
for user authentication.

Open the **GitHub Developer Settings** page at
`https://github.com/settings/apps` in your browser:

![GitHub New App page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bac56452-b0e8-4815-82cb-a6314bb4db00/md2x
=3102x1750)

Click the **New GitHub App** button and provide a suitable name. Set the
**Homepage URL** to `http://localhost:8000` and the **Callback URL** to
`http://localhost:8000/auth/github/callback`.

![GitHub Register New App page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a02a73c5-810b-42a6-2e5a-ae1715c89900/orig
=3102x2856)

Also, make sure to uncheck the **Webhook** option as it won't be necessary for
this tutorial:

![Deactivate WebHook](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1d3a0886-f129-4830-cd1d-d7bd02670b00/orig
=3102x1978)

Once you're done, click **Create GitHub App** at the bottom of the page:

![GitHub Create App Button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0ec2c147-4935-4a1e-9b59-2eaf54dfdc00/orig
=3102x1978)

Click the **Generate a new client secret** button on the resulting page. Copy
both the generated token and the **Client ID**:

![GitHub App Copy Client Secret and Client ID](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95625ba6-349c-4bc5-4635-d1e02758bd00/lg2x
=3102x2434)

Now, return to your terminal, open the `.env` file in your text editor, and
update the highlighted lines with the copied values:

```command
code .env
```

```text
[label .env]
GO_ENV=development
PORT=8000
LOG_LEVEL=info
POSTGRES_DB=go-image-upload
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_HOST=go-image-upload-db
[highlight]
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
[/highlight]
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
REDIS_ADDR=go-image-upload-redis:6379
OTEL_SERVICE_NAME=go-image-upload
```

Finally, launch the application and its associated services. You can start the
entire setup locally using Docker Compose:

```command
docker compose up -d --build
```

This will initiate the following containers:

```text
[output]
 ✔ Network go-image-upload_go-image-upload-network  Created                0.2s
 ✔ Container go-image-upload-redis                  Healthy               12.2s
 ✔ Container go-image-upload-db                     Healthy               12.2s
 ✔ Container go-image-upload-migrate                Exited                12.0s
 ✔ Container go-image-upload-app                    Started               12.2s
```

- The `app` service runs the application in development mode, utilizing
  [air](https://github.com/air-verse/air) for live reloading on file changes.
- The `db` service runs PostgreSQL.
- The `migrate` service runs database migrations and exits.
- The `redis` service runs Redis.

With everything up and running, navigate to `http://localhost:8000` in your
browser to access the application user interface:

![Image Upload Service](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6ee32595-0518-466d-e7ed-f59107553300/lg2x
=3388x1888)

After authenticating with your GitHub account, you'll see the following page:

![Image Upload Service Authenticated](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9eddf45a-4e25-412a-d8df-64cdf804ed00/orig
=3388x2044)

Uploading an image will display its AVIF version in the browser, confirming the
application's functionality.

![Converted AVIF image](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8fa86e52-d8f2-4874-e0aa-68771c643200/public
=3444x2044)

You've successfully set up and explored the demo application in this initial
step. The upcoming sections will guide you through instrumenting this program
with the OpenTelemetry API.

## Step 2 — Initializing the OpenTelemetry SDK

Now that you're acquainted with the sample application, let's explore how to add
basic instrumentation using OpenTelemetry to create a trace for every HTTP
request the application handles.

The initial step involves setting up the OpenTelemetry SDK in the application.
Install the necessary dependencies with the following command:

```command
go get go.opentelemetry.io/otel \
  go.opentelemetry.io/otel/exporters/stdout/stdouttrace \
  go.opentelemetry.io/otel/sdk/trace \
  go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
```

This command installs these OpenTelemetry SDK components:

- [go.opentelemetry.io/otel](https://pkg.go.dev/go.opentelemetry.io/otel): The
  Go implementation of OpenTelemetry APIs.
- [go.opentelemetry.io/otel/exporters/stdout/stdouttrace](https://pkg.go.dev/go.opentelemetry.io/otel/exporters/stdout/stdouttrace):
  An OpenTelemetry exporter for exporting tracing telemetry to an `io.Writer`
  compatible destination (defaults to the standard output).
- [go.opentelemetry.io/otel/sdk/trace](https://pkg.go.dev/go.opentelemetry.io/otel/sdk/trace):
  Provides support for OpenTelemetry distributed tracing.
- [go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp):
  `net/http` instrumentation that automatically creates spans and metrics for
  each HTTP request.

**Note**: If you're using a different framework for HTTP requests (such as
[Gin](https://github.com/gin-gonic/gin)), you'll need to install the appropriate
instrumentation library instead of the `otelhttp` instrumentation. Ensure to
search the
[OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=go&component=instrumentation)
to find the relevant instrumentation library and `go get` it.

![Screenshot of OpenTelemetry Instrumentation Search Page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e7cc1ea2-ad22-428d-356c-0e9106c04b00/md1x
=3280x1798)

Once the packages are installed, you need to bootstrap the OpenTelemetry SDK in
your code for distributed tracing. Place the following code within an `otel.go`
file in your project's root directory:

```go
[label otel.go]
package main

import (
	"context"
	"errors"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/sdk/trace"
)

func setupOTelSDK(
	ctx context.Context,
) (shutdown func(context.Context) error, err error) {
	var shutdownFuncs []func(context.Context) error

	shutdown = func(ctx context.Context) error {
		var err error

		for _, fn := range shutdownFuncs {
			err = errors.Join(err, fn(ctx))
		}

		shutdownFuncs = nil
		return err
	}

	handleErr := func(inErr error) {
		err = errors.Join(inErr, shutdown(ctx))
	}

	tracerProvider, err := newTraceProvider(ctx)
	if err != nil {
		handleErr(err)
		return
	}

	shutdownFuncs = append(shutdownFuncs, tracerProvider.Shutdown)
	otel.SetTracerProvider(tracerProvider)

	return
}

func newTraceProvider(ctx context.Context) (*trace.TracerProvider, error) {
	traceExporter, err := stdouttrace.New(
		stdouttrace.WithPrettyPrint())
	if err != nil {
		return nil, err
	}

	traceProvider := trace.NewTracerProvider(
		trace.WithBatcher(traceExporter,
			trace.WithBatchTimeout(time.Second)),
	)
	return traceProvider, nil
}
```

This code establishes an OpenTelemetry SDK for tracing in your Go application.
It configures a trace exporter that directs traces to standard output in a
human-readable format.

The `setUpOtelSDK()` function initializes the global trace provider using
`otel.SetTraceProvider()`. Additionally, it provides a mechanism for gracefully
shutting down the initialized OpenTelemetry SDK components by iterating through
registered `shutdownFuncs` and executing each function while consolidating any
errors that arise.

On the other hand, the `newTraceProvider()` function, creates a trace exporter
that outputs traces to standard output with pretty-printing enabled. It then
constructs a trace provider utilizing this exporter and configures it with a
batcher featuring a one-second timeout.

The batcher serves to buffer traces before exporting them in batches for
enhanced efficiency. The default timeout is five seconds, but it's adjusted to
one second here for faster feedback when testing.

In the next section, you'll proceed to set up automatic instrumentation for the
HTTP server, allowing you to observe traces for each incoming request.

[summary]
### Skip manual OpenTelemetry instrumentation
While manual instrumentation gives you control over your traces, [Better Stack Tracing](https://betterstack.com/tracing/) uses eBPF to automatically instrument your Kubernetes or Docker workloads without code changes. Your traces start flowing immediately, and you can still export to Jaeger or any OpenTelemetry-compatible backend.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.
[/summary]

![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)

## Step 3 — Instrumenting the HTTP server

Now that you have the OpenTelemetry SDK set up, let's instrument the HTTP server
to automatically generate trace spans for incoming requests.

Modify your `main.go` file to include code that sets up the OpenTelemetry SDK
and instruments the HTTP server through the `otelhttp` instrumentation library:

```go
[label main.go]
package main

import (
	"context"
	"embed"
[highlight]
	"errors"
[/highlight]
	"log"
	"net/http"
	"os"

	"github.com/betterstack-community/go-image-upload/db"
	"github.com/betterstack-community/go-image-upload/redisconn"
	"github.com/joho/godotenv"
[highlight]
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
[/highlight]
)

. . .

func main() {
[highlight]
	ctx := context.Background()

	otelShutdown, err := setupOTelSDK(ctx)
	if err != nil {
		log.Fatal(err)
	}

	defer func() {
		err = errors.Join(err, otelShutdown(ctx))
		log.Println(err)
	}()
[/highlight]

	mux := http.NewServeMux()

	mux.HandleFunc("GET /auth/github/callback", completeGitHubAuth)

	mux.HandleFunc("GET /auth/github", redirectToGitHubLogin)

	mux.HandleFunc("GET /auth/logout", logout)

	mux.HandleFunc("GET /auth", renderAuth)

	mux.HandleFunc("GET /", getUser)

[highlight]
	httpSpanName := func(operation string, r *http.Request) string {
		return fmt.Sprintf("HTTP %s %s", r.Method, r.URL.Path)
	}

	handler := otelhttp.NewHandler(
		mux,
		"/",
		otelhttp.WithSpanNameFormatter(httpSpanName),
	)

	log.Println("Server started on port 8000")

	log.Fatal(http.ListenAndServe(":8000", handler))
[/highlight]
}
```

In this code, the `setupOTelSDK()` function is called to initialize the
OpenTelemetry SDK. Then, the `otelhttp.NewHandler()` method wraps the request
multiplexer to add HTTP instrumentation across the entire server. The
`otelhttp.WithSpanNameFormatter()` method is used to customize the generated
span names, providing a clear description of the traced operation (e.g.,
`HTTP GET /`).

You can also exclude specific requests from being traced using
`otelhttp.WithFilter()`:

```go
otelhttp.NewHandler(mux, "/", otelhttp.WithFilter(otelReqFilter))

func otelReqFilter(req *http.Request) bool {
	return req.URL.Path != "/auth"
}
```

Refer to the
[documentation](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp)
for additional customization options.

Once your server restarts, revisit the application's home page at
`http://localhost:8000`. If you're already authenticated, you'll see the upload
page:

![Image Upload page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/53cacd52-f8ee-42b6-54c9-07e9e951d600/public
=3388x2044)

Now, check your application logs to view the trace spans:

```command
docker compose logs -f app
```

You should observe a JSON object similar to this (note that the `Attributes` and
`Resource` arrays are truncated for brevity):

```json
[output]
. . .
{
        "Name": "HTTP GET /",
        "SpanContext": {
                "TraceID": "e3c306d18bac2742de07756bdb9e607b",
                "SpanID": "3ee91f86b5468681",
                "TraceFlags": "01",
                "TraceState": "",
                "Remote": false
        },
        "Parent": {
                "TraceID": "00000000000000000000000000000000",
                "SpanID": "0000000000000000",
                "TraceFlags": "00",
                "TraceState": "",
                "Remote": false
        },
        "SpanKind": 2,
        "StartTime": "2024-08-26T14:19:47.205308249+01:00",
        "EndTime": "2024-08-26T14:19:47.206802188+01:00",
        "Attributes": [. . .],
        "Events": null,
        "Links": null,
        "Status": {
                "Code": "Unset",
                "Description": ""
        },
        "DroppedAttributes": 0,
        "DroppedEvents": 0,
        "DroppedLinks": 0,
        "ChildSpanCount": 0,
        "Resource": [. . .],
        "InstrumentationLibrary": {
                "Name": "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
                "Version": "0.53.0",
                "SchemaURL": ""
        }
}
```

This object is a span representing a successful HTTP GET request to the root
path of the service. Let's explore the key components of the span in more
detail:

- `Name`: This is the human-readable name for the span, often used to represent
  the traced operation.

- `SpanContext`: This holds the core identifies for the span:

  - `TraceID`: A unique identifier for the entire trace to which this span
    belongs.
  - `SpanID`: A unique identifier for this specific span within the trace.
  - `TraceFlags`: Used to encode information about the trace, like whether it
    should be sampled.
  - `TraceState`: Carries vendor-specific trace context information.
  - `Remote`: Indicates whether the parent of this span is in a different
    process.

- `Parent`: This identifies the parent span in the trace hierarchy. In this
  case, the parent has all zero values, indicating that this is the root span.

- `SpanKind`: Specifies the role of the span in the trace. Here, the value `2`
  signifies a `Server` span, meaning this span represents the server-side
  handling of a client request.

- `StartTime`, `EndTime`: These timestamps record when the span started and
  ended.

- `Attributes`: A collection of key-value pairs providing additional context
  about the span.

- `Events`: Used to log specific occurrences within the span's lifetime.
- `Links`: Used to associate this span with other spans in the same or different
  traces.

- `Status`: This conveys the outcome of the operation represented by the span.
  It is `Unset` in this example indicating no explicit status was set, but it
  could also be `OK` or `Error`.

- `DroppedAttributes`, `DroppedEvents`, `DroppedLinks`: These counters track how
  many attributes, events, or links were dropped due to exceeding limits set by
  the OpenTelemetry SDK or exporter.

- `ChildSpanCount`: This indicates how many direct child spans this span has. A
  value of `0` suggests that this is a leaf span (no further operations were
  traced within this one).

- `Resource`: Describes the entity that produced the span. Here, it includes the
  service name (see `OTEL_SERVICE_NAME` in your `.env`) and information about
  the OpenTelemetry SDK used.

- `IntrumentationLibrary`: This identifies the OpenTelemetry instrumentation
  library responsible for creating this span.

In the next step, you'll configure the OpenTelemetry Collector to gather and
export these spans to a backend system for visualization and analysis.

## Step 4 — Configuring the OpenTelemetry Collector

In the previous steps, you instrumented the Go application with OpenTelemetry
and configured it to send telemetry to the standard output. While this is useful
for testing, it's recommended that the data be sent to a suitable distributed
tracing backend for visualization and analysis.

OpenTelemetry offers two primary export approaches:

1. [The OpenTelemetry collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) which offers
   flexibility in data processing and routing to various backends (recommended).

2. A direct export from your application to one or more backends of your choice.

The Collector itself doesn't store observability data; it processes and routes
it. It receives different types of observability signals from applications, then
transforms and sends them to dedicated storage and analysis systems.

In this section, you'll configure the OpenTelemetry Collector to export traces
to [Jaeger](https://betterstack.com/community/guides/observability/jaeger-guide/), a free and open-source distributed tracing tool that
facilitates the storage, retrieval, and visualization of trace data.

To get started, go ahead and create an `otelcol.yaml` file in the root of your
project as follows:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
        endpoint: go-image-upload-collector:4318

processors:
  batch:

exporters:
  otlp/jaeger:
    endpoint: go-image-upload-jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
```

This file configures the local OpenTelemetry Collector and comprises the
following sections:

### Receivers

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: go-image-upload-collector:4318
```

The configuration specifies an `otlp` receiver, designed to handle incoming
telemetry data in the [OTLP format](https://opentelemetry.io/docs/specs/otlp/).
It's set up to accept this data over HTTP, meaning the Collector will start an
HTTP server on port 4318, ready to receive OTLP payloads from your application.

### Processors

```yaml
processors:
  batch:
```

Next, we have an optional `batch` processor. While not mandatory, processors sit
between receivers and exporters, allowing you to manipulate the incoming data.
In this case, the `batch` processor groups data into batches to optimize network
performance when sending it to the backend.

### Exporters

```yaml
exporters:
  otlp/jaeger:
    endpoint: go-image-upload-jaeger:4317
    tls:
      insecure: true
```

The `otlp/jaeger` exporter is responsible for sending the processed trace data
to Jaeger. The endpoint points to the local Jaeger instance running in your
Docker Compose setup (to be added shortly). The `insecure: true` setting under
`tls` is necessary because the local Jaeger container will use an unencrypted
HTTP connection for its OTLP gRPC endpoint.

### Pipelines

```yaml
service:
[highlight]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
[/highlight]
```

Finally, the `traces` pipeline ties everything together. It instructs the
Collector to take trace data received from the `otlp` receiver, process it with
the `batch` processor, and then export it to Jaeger using the `otlp/jaeger`
exporter.

This configuration demonstrates the flexibility of the OpenTelemetry Collector.
By defining different pipelines, you can easily customize how data is received,
processed, and exported.

## Step 5 — Forwarding traces to the OpenTelemetry Collector

Now that the OpenTelemetry Collector configuration file is ready, let's update
your Go application to transmit trace spans in the OTLP format to the Collector
instead of outputting them to the console.

Install the
[OLTP Trace Exporter](https://pkg.go.dev/go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp)
package with:

```command
go get go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp
```

Once installed, modify your `otel.go` file as follows:

```go
[label otel.go]
package main

import (
	"context"
	"errors"
	"time"

	"go.opentelemetry.io/otel"
    [highlight]
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
    [/highlight]
	"go.opentelemetry.io/otel/sdk/trace"
)

. . .

func newTraceProvider(ctx context.Context) (*trace.TracerProvider, error) {
    [highlight]
	traceExporter, err := otlptracehttp.New(ctx)
    [/highlight]
	if err != nil {
		return nil, err
	}

	traceProvider := trace.NewTracerProvider(
		trace.WithBatcher(traceExporter,
			trace.WithBatchTimeout(time.Second)),
	)
	return traceProvider, nil
}
```

Here, you're replacing the `stdouttrace` exporter with the `oltptracehttp`
exporter. This exporter sends each generated span to
`https://localhost:4318/v1/traces` by default.

Since the Collector will run in Docker, adjust the OTLP endpoint in your `.env`
file:

```text
[label .env]
. . .
OTEL_EXPORTER_OTLP_ENDPOINT=http://go-image-upload-collector:4318
```

The `OTEL_EXPORTER_OLTP_ENDPOINT` allows you to configure the target base URL
for telemetry data. Its value reflects the Collector's hostname within Docker
(to be set up shortly) and the port it listens on for OTLP data over HTTP.

This now means that the generated trace data will be sent to
`http://go-image-upload-collector:4318/v1/traces`.

In the next section, you'll set up the OpenTelemetry Collector and Jaeger
containers using Docker Compose.

## Step 6 — Setting up OpenTelemetry Collector and Jaeger

Now that you've configured your application to export data to the OpenTelemetry
Collector, the next step is launching the Jaeger and OpenTelemetry Collector
containers so that you can visualize the traces more effectively.

Open up your `docker-compose.yml` file and add the following services below the
existing ones:

```yaml
[label docker-compose.yml]
  collector:
    container_name: go-image-upload-collector
    image: otel/opentelemetry-collector:0.107.0
    volumes:
      - ./otelcol.yaml:/etc/otelcol/config.yaml
    depends_on:
      jaeger:
        condition: service_healthy
    networks:
      - go-image-upload-network

  jaeger:
    container_name: go-image-upload-jaeger
    image: jaegertracing/all-in-one:latest
    environment:
      JAEGER_PROPAGATION: w3c
    ports:
      - 16686:16686
    healthcheck:
      test: [CMD, wget, -q, -S, -O, "-", "localhost:14269"]
    networks:
      - go-image-upload-network
```

The `collector` service uses the
[otel/opentelemetry-collector](https://hub.docker.com/r/otel/opentelemetry-collector)
image to process and export telemetry data. It mounts the local configuration
file (`otelcol.yaml`) into the container and is set to start only after the
`jaeger` service is healthy. If you're using the
[Contrib distribution](https://hub.docker.com/r/otel/opentelemetry-collector-contrib)
instead, ensure that your configuration file is mounted to the appropriate path
like this:

```yaml
collector:
  container_name: go-image-upload-collector
  image: otel/opentelemetry-collector-contrib:0.107.0
  volumes:
[highlight]
    - ./otelcol.yaml:/etc/otelcol-contrib/config.yaml
[/highlight]
```

The `jaeger` service runs the
[jaegertracing/all-in-one](https://hub.docker.com/r/jaegertracing/all-in-one),
which includes all components of the Jaeger backend. It uses the
[W3C trace context](https://www.w3.org/TR/trace-context/) format for
propagation, exposes the Jaeger UI on port 16686, and includes a health check to
ensure the service is running correctly before allowing dependent services to
start.

Once you've saved the file, stop and remove the existing containers with:

```command
docker compose down
```

Then execute the command below to launch them all at once:

```command
docker compose up -d --build
```

```text
[output]
. . .
 ✔ Network go-image-upload_go-image-upload-network      Created            0.2s
 ✔ Container go-image-upload-jaeger                     Healthy           31.5s
 ✔ Container go-image-upload-db                         Healthy           11.4s
 ✔ Container go-image-upload-redis                      Healthy           12.2s
 ✔ Container go-image-upload-migrate                    Exited            12.0s
 ✔ Container go-image-upload-collector                  Started           31.6s
 ✔ Container go-image-upload-app                        Started           12.1s
```

With the services ready, head to your application at `http://localhost:8000` and
generate some traces by refreshing the page a few times. Then, open the Jaeger
UI in your browser at `http://localhost:16686`:

![Jaeger UI showing Go Image Upload Service](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c5e6a87c-facf-46aa-e706-8267ddc6b200/md1x
=3310x1994)

Find the **go-image-upload** service and click **Find Traces**:

![Jaeger UI showing traces](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5ee17727-9c90-43fc-1698-6b8691522600/lg1x
=3310x1994)

You should see a list of the traces you generated. Click on any one of them to
see the component spans:

![Jaeger UI showing component spans in a trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/78d43803-ec13-4d1f-b258-eebe7b428700/orig
=3310x2074)

Currently, each trace contains only a single span, so there's not much to see.
However, you can now easily explore the span attributes by expanding the
**Tags** section above.

In the next section, you'll add more instrumentation to the application to make
the traces more informative and interesting.

## Step 7 — Instrumenting the HTTP client

The `otelhttp` package also offers a way to automatically instrument outbound
requests made through `http.Client`.

To enable this, override the default transport in your `github.go` file:

```go
[label github.go]
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/go-resty/resty/v2"
    [highlight]
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    [/highlight]
)

var httpClient = &http.Client{
	Timeout:   2 * time.Minute,
    [highlight]
	Transport: otelhttp.NewTransport(http.DefaultTransport),
    [/highlight]
}

. . .
```

By making this change, a span will be created for all subsequent requests made
to GitHub APIs.

You can test this by authenticating with GitHub once again. Once logged in,
return to Jaeger and click the **Find Traces** button.

You'll notice that the request to the `/auth/github/callback` route now has
three spans instead of one:

![Jaeger UI showing three spans for the callback route](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cbbaf956-0afc-4c51-3c59-50dab3f41900/public
=3310x2074)

Clicking on the span reveals the flow of the requests:

![Jaeger UI showing Gantt chart with trace spans](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b68c5cb7-4a71-43e7-0eb0-0e70698f6d00/lg2x
=3310x1598)

You'll observe that the request to `https://github.com/login/oauth/access_token`
took 711ms, while the one to `https://api.github.com/user` took 674ms (at least
on my end).

**Important**: The `client_id` and `client_secret` tokens are visible in the API
calls. The
[recommended practice](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/security-best-practices.md)
is to remove such sensitive data from telemetry before forwarding it to a
storage backend. This is possible with the OpenTelemetry Collector's but setting
it up this is beyond the scope of this tutorial.

In the upcoming sections, you'll instrument the Redis and PostgreSQL libraries.

## Step 8 — Instrumenting the Redis Go client

The demo application makes several calls to Redis to store and retrieve session
tokens. Let's instrument the Redis client to generate spans that help you
monitor the performance and errors associated with each Redis query.

Begin by installing the OpenTelemetry instrumentation for `go-redis`:

```command
go get github.com/redis/go-redis/extra/redisotel/v9
```

Next, open your `redisconn/redis.go` file and modify it as follows:

```go
[label redisconn/redis.go]
package redisconn

import (
	"context"
	"log/slog"
	"time"

    [highlight]
	"github.com/redis/go-redis/extra/redisotel/v9"
    [/highlight]
	redis "github.com/redis/go-redis/v9"
)

. . .

func NewRedisConn(ctx context.Context, addr string) (*RedisConn, error) {
	r := redis.NewClient(&redis.Options{
		Addr: addr,
		DB:   0,
	})

	err := r.Ping(ctx).Err()
	if err != nil {
		return nil, err
	}

	slog.DebugContext(ctx, "redis connection is successful")

    [highlight]
	if err := redisotel.InstrumentTracing(r); err != nil {
		return nil, err
	}
    [/highlight]

	return &RedisConn{
		client: r,
	}, nil
}
```

Instrumenting the Redis client for traces is done by using the
`InstrumentTracing()` hook provided by `redisotel` package. You can also report
OpenTelemetry metrics with
[InstrumentMetrics()](https://pkg.go.dev/github.com/go-redis/redis/extra/redisotel/v9#InstrumentMetrics).

After saving your changes, navigate to your application, log out, and then log
in again.

In Jaeger, you'll start seeing spans for the Redis `set`, `get`, and `del`
operations accordingly:

![Jaeger UI showing Redis Go Trace Spans with OpenTelemetry](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4bf28de-7b82-4a79-51e9-f752d8170a00/lg2x
=3310x1954)

## Step 9 — Instrumenting the Bun SQL client

Instrumenting the [uptrace/bun](https://bun.uptrace.dev/) library is quite
similar to the Redis client. Bun provides a dedicated OpenTelemetry
instrumentation module called `bunotel`, which needs to be installed first:

```command
go get github.com/uptrace/bun/extra/bunotel
```

Once installed, add the `bunotel` hook to your db/db.go file:

```go
[label db/db.go]
package db

import (
	"context"
	"database/sql"
	"errors"

	"github.com/betterstack-community/go-image-upload/models"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
    [highlight]
	"github.com/uptrace/bun/extra/bunotel"
    [/highlight]
)

type DBConn struct {
	db *bun.DB
}

func NewDBConn(ctx context.Context, name, url string) (*DBConn, error) {
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(url)))

	db := bun.NewDB(sqldb, pgdialect.New())
    [highlight]
	db.AddQueryHook(
		bunotel.NewQueryHook(bunotel.WithDBName(name)),
	)
    [/highlight]
	return &DBConn{db}, nil
}
. . .
```

After saving the changes, interact with it in the same manner as before.

You will notice that new trace spans for each PostgreSQL query start to appear
in Jaeger:

![Jaeger UI showing PostgreSQL spans](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/30e83be5-f15f-42e5-9994-ed9237581100/orig
=3750x2236)

## Step 10 — Adding custom instrumentation

While instrumentation libraries capture telemetry at the system boundaries, such
as inbound/outbound HTTP requests or database calls, they don't capture what's
happening within your application itself. To achieve that, you'll need to write
custom manual instrumentation.

In this section, let's add custom instrumentation for the `requireAuth`
function.

To create spans, you first need a tracer. Create one by providing the name and
version of the library/application performing the instrumentation. Typically,
you only need one tracer per application:

```go
[label main.go]
package main

import (
	. . .
    [highlight]
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
    [/highlight]
)

var redisConn *redisconn.RedisConn

var dbConn *db.DBConn

[highlight]
var tracer trace.Tracer
[/highlight]

. . .

func init() {
	. . .

    [highlight]
	tracer = otel.Tracer(conf.ServiceName)
    [/highlight]
}

. . .
```

Once your tracer is initialized, you can use it to create spans with
`tracer.Start()`. Let's add a span for the `requireAuth()` middleware function:

```go
[label handler.go]
package main

import (
	. . .
    [highlight]
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
    [/highlight]

	"github.com/betterstack-community/go-image-upload/models"
)

. . .

func requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        [highlight]
		ctx, span := tracer.Start(
			r.Context(),
			"requireAuth",
			trace.WithSpanKind(trace.SpanKindServer),
		)
        [/highlight]

		cookie, err := r.Cookie(sessionCookieKey)
		if err != nil {
			http.Redirect(w, r, "/auth", http.StatusSeeOther)
            [highlight]
			span.AddEvent(
				"redirecting to /auth",
				trace.WithAttributes(
					attribute.String("reason", "missing session cookie"),
				),
			)
			span.End()
            [/highlight]
			return
		}

        [highlight]
		span.SetAttributes(
			attribute.String("app.cookie.value", cookie.Value),
		)
        [/highlight]

		email, err := redisConn.GetSessionToken(ctx, cookie.Value)
		if err != nil {
			http.Redirect(w, r, "/auth", http.StatusSeeOther)
            [highlight]
			span.AddEvent(
				"redirecting to /auth",
				trace.WithAttributes(
					attribute.String("reason", err.Error()),
				))
			span.End()
            [/highlight]
			return
		}

		ctx = context.WithValue(r.Context(), "email", email)

		req := r.WithContext(ctx)

        [highlight]
		span.SetStatus(codes.Ok, "authenticated successfully")

		span.End()
        [/highlight]

		next.ServeHTTP(w, req)
	})
}

. . .
```

The `requireAuth` middleware is designed to protect certain routes in the
application by ensuring that only authenticated users can access them. It checks
for a session cookie and validates it against a Redis store to determine if the
user is logged in. If not, it redirects them to the login page (`/auth`).

The `tracer.Start()` method initiates a new span named `requireAuth` with the
context of the incoming HTTP request. The `otelhttp.NewHander()` method used to
instrument the server earlier adds the active span for the incoming request to
the request context. This means the `requireAuth` span will be nested within it
as you'll soon see.

The `span.SetAttributes()` method adds the value of the session cookie as an
attribute to the span. It is mainly used for recording [contextual
information](https://betterstack.com/community/guides/observability/high-cardinality-observability/) about the operation that may be
helpful for debugging purposes.

In cases where authentication fails (either due to a missing cookie or an
invalid session token), an event is added to the span. This event provides
additional context about why the authentication failed.

Finally, if authentication is successful, the span's status is explicitly set to
`Ok` with an "authenticated successfully" message. The `span.End()` method is
then called before the `next` handler is executed.

When you play around with the application once again and check the traces in
Jaeger, you'll notice that a new span is created for the protected routes like
`/` and `/upload`:

![Jaeger UI showing trace spans from custom instrumentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/930e82db-fad2-4658-db3f-8afeef35fc00/md1x
=3750x2236)

If an event is recorded in the span, it appears in the **Logs** section:

![Jaeger UI showing trace span event](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/905c2604-99aa-495a-2b7c-db23c1449800/public
=3494x1602)

You now have the knowledge to create spans for any operation in your
application. Consider creating a span that tracks the image conversion to AVIF
in the `uploadImage()` handler as an exercise.


## Simplifying tracing with Better Stack

Throughout this tutorial, you've seen how to manually instrument a Go application with OpenTelemetry. While this approach gives you granular control, it requires adding SDK dependencies, wrapping handlers, creating spans, and maintaining instrumentation code as your application evolves.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/7tQ7haFmSXI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Better Stack Tracing](https://betterstack.com/tracing) takes a different approach using eBPF technology. Point it at your Kubernetes or Docker cluster and it automatically instruments your workloads without modifying your code. Here's what you get:

- Traces start flowing immediately without adding SDK dependencies or wrapping handlers
- Databases like PostgreSQL, MySQL, Redis, and MongoDB get recognized and instrumented automatically
- Context propagation works out of the box across your services
- Visual "bubble up" investigation lets you select services and timeframes through drag and drop
- AI analyzes your service map and logs during incidents, suggesting potential causes
- OpenTelemetry-native architecture keeps your trace data portable
- Works with Jaeger or any OpenTelemetry-compatible backend
- Combines traces, logs, metrics, and incident management in one platform

If you'd like to try automatic instrumentation while keeping the flexibility of OpenTelemetry, check out [Better Stack Tracing](https://betterstack.com/tracing/).


## Final thoughts

You've covered a lot of ground with this tutorial, and you should now have a solid grasp of OpenTelemetry and its application for instrumenting Go applications with tracing capabilities.

To delve deeper into the OpenTelemetry project, consider exploring its [official documentation](https://opentelemetry.io/docs/languages/go/). The [OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=go) is also an excellent resource to discover numerous auto-instrumentation libraries covering popular Go frameworks and libraries.

If manual instrumentation feels like too much overhead for your setup, [Better Stack Tracing](https://betterstack.com/tracing/) handles OpenTelemetry automatically with eBPF, so you can skip the SDK integration steps while keeping the same observability benefits.

Remember to thoroughly test your OpenTelemetry instrumentation before deploying your applications to production. This ensures that the captured data is accurate, meaningful, and useful for detecting and solving problems.

Feel free to also check out the [complete code](https://github.com/betterstack-community/go-image-upload/tree/final) on GitHub.

Thanks for reading, and happy tracing!