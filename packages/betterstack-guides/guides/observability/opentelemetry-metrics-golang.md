# Monitoring Go Apps with OpenTelemetry Metrics

Modern applications demand robust observability solutions to monitor
performance, detect bottlenecks, and ensure seamless user experiences.

[OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) has emerged as a powerful, standardized
framework for capturing telemetry data — including traces, metrics, and logs —
from distributed systems. By offering a unified approach to instrumentation,
OpenTelemetry allows developers to track and visualize application health across
complex architectures.

In this tutorial, we'll focus on implementing OpenTelemetry metrics in a Go
application. Starting with the setup of the OpenTelemetry SDK, we'll explore key
metric types such as `Counter`, `UpDownCounter`, `Gauge`, and `Histogram`.

You'll learn how to instrument your application to automatically track HTTP
metrics, customize data aggregation, and configure efficient data collection and
filtering. Finally, we'll cover how to send your metrics data to an
OpenTelemetry Collector, allowing you to route it to a backend of your choice
for analysis and visualization.

By the end of this guide, you'll have a comprehensive understanding of how to
leverage OpenTelemetry metrics in Go, empowering you to gain actionable insights
into your application's performance and health.

Let's get started!

[ad-logs]

## Prerequisites

Before proceeding with this tutorial, you'll need to know the basics of [metrics
in OpenTelemetry](https://betterstack.com/community/guides/observability/opentelemetry-metrics/).

## Step 1 — Setting up the demo project

Let's start by setting up the
[demo project](https://github.com/betterstack-community/otel-metrics-golang)
which is a basic "Hello World" server. Go ahead and clone the GitHub repository
to your machine with:

```command
git clone https://github.com/betterstack-community/otel-metrics-golang
```

Then change into the resulting directory:

```command
cd otel-metrics-golang
```

The project contains a `docker-compose.yml` file that sets up two services:

```yaml
[label docker-compose.yml]
services:
  app:
    build:
      context: .
      target: ${GO_ENV}
    container_name: otel-metrics-demo
    environment:
      PORT: ${PORT}
      LOG_LEVEL: ${LOG_LEVEL}
    env_file:
      - ./.env
    ports:
      - 8000:8000
    networks:
      - otel-metrics-demo-network
    volumes:
      - .:/app

  collector:
    container_name: otel-metrics-demo-collector
    image: otel/opentelemetry-collector:latest
    volumes:
      - ./otelcol.yaml:/etc/otelcol/config.yaml
    networks:
      - otel-metrics-demo-network

networks:
  otel-metrics-demo-network:
```

- `app`: runs the application on port `8000`, utilizing
  [air](https://github.com/air-verse/air) for live reloading on file changes.

- `collector`: runs the [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) and
  configures it with an `otelcol.yaml` file.

Before you launch the services, rename the `.env.example` file to `.env` as it
contains some of the basic configuration that the application needs:

```text
[label .env]
GO_ENV=development
PORT=8000
LOG_LEVEL=info
OTEL_SERVICE_NAME=otel-metrics-demo
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-metrics-demo-collector:4318
```

```command
mv .env.example .env
```

To launch both services, go ahead and execute the command below:

```command
docker compose up
```

You should see output similar to the following:

```text
[output]
. . .
otel-metrics-demo            |
otel-metrics-demo            |   __    _   ___
otel-metrics-demo            |  / /\  | | | |_)
otel-metrics-demo            | /_/--\ |_| |_| \_ v1.52.3, built with Go go1.23.1
otel-metrics-demo            |
otel-metrics-demo            | watching .
otel-metrics-demo            | !exclude tmp
otel-metrics-demo            | building...
otel-metrics-demo            | running...
[highlight]
otel-metrics-demo            | 2024/11/04 10:34:15 Starting HTTP server on port 8000
[/highlight]
. . .
```

To test the application, send a request to the root endpoint from a different
terminal:

```command
curl http://localhost:8000
```

The response should be:

```text
[output]
Hello world
```

Now that the services are up and running, let's go ahead and set up the
OpenTelemetry SDK in the next step.

## Step 2 — Initializing the OpenTelemetry SDK

Before you can instrument your application with OpenTelemetry, you need to
install the necessary packages first:

```command
go get go.opentelemetry.io/otel \
  go.opentelemetry.io/otel/exporters/stdout/stdoutmetric \
  go.opentelemetry.io/otel/sdk/resource \
  go.opentelemetry.io/otel/sdk/metric \
  go.opentelemetry.io/otel/semconv/v1.26.0 \
  go.opentelemetry.io/otel/attribute \
  go.opentelemetry.io/otel/sdk/instrumentation
```

This command installs these OpenTelemetry SDK components:

- [go.opentelemetry.io/otel](https://pkg.go.dev/go.opentelemetry.io/otel): The
  Go implementation of OpenTelemetry APIs.
- [go.opentelemetry.io/otel/exporters/stdout/stdoutmetric](https://pkg.go.dev/go.opentelemetry.io/otel/exporters/stdout/stdoutmetric):
  An OpenTelemetry exporter for exporting metrics to the standard output for
  testing or debugging purposes.
- [go.opentelemetry.io/otel/sdk/metrics](https://pkg.go.dev/go.opentelemetry.io/otel/sdk/metric):
  Provides an implementation of the OpenTelemetry metrics SDK in Go.
- [go.opentelemetry.io/otel/semconv/v1.26.0](https://pkg.go.dev/go.opentelemetry.io/otel/semconv/v1.26.0):
  This package implements [OpenTelemetry semantic
  conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/).
- [go.opentelemetry.io/otel/sdk/resource](https://pkg.go.dev/go.opentelemetry.io/otel/sdk/resource):
  This package is useful for creating and representing OpenTelemetry resources.
- [go.opentelemetry.io/otel/attribute](https://pkg.go.dev/go.opentelemetry.io/otel):
  This package is used for creating attributes for telemetry data.
- [go.opentelemetry.io/otel/sdk/instrumentation](https://pkg.go.dev/go.opentelemetry.io/otel/sdk/instrumentation):
  This package provides a `Scope` type to signal the source of telemetry data.

Next, initialize a `MeterProvider` to manage metrics in your application.
Without this step, OpenTelemetry defaults to a no-operation mode where no data
is collected.

Create an `otel.go` file at the project root with the following contents to set
up the OpenTelemetry SDK:

```go
[otel.go]
package main

import (
	"context"
	"errors"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
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

	res, err := newResource()
	if err != nil {
		handleErr(err)
		return
	}

	meterProvider, err := newMeterProvider(ctx, res)
	if err != nil {
		handleErr(err)
		return
	}

	shutdownFuncs = append(shutdownFuncs, meterProvider.Shutdown)

	otel.SetMeterProvider(meterProvider)

	return
}

func newResource() (*resource.Resource, error) {
	return resource.Merge(resource.Default(),
		resource.NewWithAttributes(semconv.SchemaURL,
			semconv.ServiceName("my-service"),
			semconv.ServiceVersion("0.1.0"),
		))
}

func newMeterProvider(
	ctx context.Context,
	res *resource.Resource,
) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New(stdoutmetric.WithPrettyPrint())
	if err != nil {
		return nil, err
	}

	meterProvider := metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			metric.WithInterval(3*time.Second))),
	)

	return meterProvider, nil
}
```

This code sets up a metrics system for your Go application using OpenTelemetry.
The main configuration work is done in the `setupOTelSDK()` function which
prepares and registers the application's metrics provider, while also providing
a mechanism for gracefully shutting down the initialized OpenTelemetry SDK
components.

First, a `Resource` instance is created through the `newResource()` function
which gives the application a unique identity by setting attributes like the
`ServiceName` and `ServiceVersion`.

Next, a `MeterProvider` is initialized with `newMeterProvider()`. To ensure
metrics are accessible across the application, this `MeterProvider` is set as
the global provider using `otel.SetMeterProvider()`. This allows you to acquire
a `Meter` instance anywhere in your application using `otel.Meter()`

For exporting the collected metrics data, a `stdoutmetric` exporter is
configured to output metrics to the console, providing a straightforward way to
test or debug or configuration. The exporter is set to output data every three
seconds instead of every minute to for a quicker feedback cycle.

Now, modify your `main.go` file to incorporate the OpenTelemetry setup:

```go
package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)


func init() {
	_ = godotenv.Load()
}

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
    [highlight]

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello world!"))
	})

	log.Println("Starting HTTP server on port 8000")

	if err := http.ListenAndServe(":8000", mux); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
```

Here, the `setupOTelSDK()` function is called to initialize OpenTelemetry, and a
deferred function (`otelShutdown()`) ensures clean shutdown of the SDK resources
when `main()` completes.

You should start seeing the following output in your terminal every three
seconds:

```json
{
  "Resource": [
    {
      "Key": "service.name",
      "Value": {
        "Type": "STRING",
        "Value": "my-service"
      }
    },
    {
      "Key": "service.version",
      "Value": {
        "Type": "STRING",
        "Value": "0.1.0"
      }
    },
    {
      "Key": "telemetry.sdk.language",
      "Value": {
        "Type": "STRING",
        "Value": "go"
      }
    },
    {
      "Key": "telemetry.sdk.name",
      "Value": {
        "Type": "STRING",
        "Value": "opentelemetry"
      }
    },
    {
      "Key": "telemetry.sdk.version",
      "Value": {
        "Type": "STRING",
        "Value": "1.31.0"
      }
    }
  ],
  "ScopeMetrics": null
}
```

The `Resource` array contains key-value pairs representing resource metadata,
while `ScopeMetrics` is used to group metrics sharing the same instrumentation
scope. Since we're yet to instrument any metrics, the `ScopeMetrics` property is
`null`.

With this foundational setup in place, let's proceed to automatically instrument
the server with some metrics through the
[otelhttp](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp)
package.

## Step 3 — Automatically instrument HTTP server metrics

OpenTelemetry provides automatic instrumentation for common libraries to help
you save time and let you focus on business-specific metrics. Since our server
uses Go's `net/http` package, we'll use the corresponding instrumentation
package which is `otelhttp`.

If you're using a different framework (e.g., Gin), you can find the appropriate
instrumentation library in the
[OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=go&component=instrumentation).

To install `otelhttp`, run:

```command
go get go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
```

After installing `otelhttp`, update your `main.go` file as follows:

```go
[label main.go]
package main

import (
    . . .

    [highlight]
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    [/highlight]
)

. . .

func main.go() {
   . . .
    [highlight]
	handler := otelhttp.NewHandler(mux, "/")
    [/highlight]

	log.Println("Starting HTTP server on port 8000")

    [highlight]
	if err := http.ListenAndServe(":8000", handler); err != nil {
    [/highlight]
		log.Fatal("Server failed to start:", err)
	}
}
```

The `otelhttp.NewHandler()` function wraps the request multiplexer (`mux`),
adding both metric and [trace instrumentation](https://betterstack.com/community/guides/observability/opentelemetry-go/). Since we
haven't set up a trace provider, traces will default to a no-op implementation.

Once you're done modifying the source code, the server will automatically
restart:

```text
[output]
. . .
otel-metrics-demo            | main.go has changed
otel-metrics-demo            | building...
otel-metrics-demo            | running...
otel-metrics-demo            | 2024/11/04 17:20:08 Starting HTTP server on port 8000
. . .
```

Now, send a request to the root endpoint as before:

```command
curl http://localhost:8000
```

```text
[output]
Hello world
```

The `ScopeMetrics` portion of the output will be populated now with the
`otelhttp` instrumentation scope and its three default metrics:

```json
{
  "Resource": [. . .],
  "ScopeMetrics": [
    {
      "Scope": {
        "Name": "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
        "Version": "0.56.0",
        "SchemaURL": ""
      },
      "Metrics": [
        {
[highlight]
          "Name": "http.server.request.size",
[/highlight]
          "Description": "Measures the size of HTTP request messages.",
          "Unit": "By",
          "Data": {
            "DataPoints": [
              {
                "Attributes": [. . .],
                "StartTime": "2024-10-30T09:24:38.457932153+01:00",
                "Time": "2024-10-30T09:24:47.460096693+01:00",
                "Value": 0
              }
            ],
            "Temporality": "CumulativeTemporality",
            "IsMonotonic": true
          }
        },
        {
[highlight]
          "Name": "http.server.response.size",
[/highlight]
          "Description": "Measures the size of HTTP response messages.",
          "Unit": "By",
          "Data": {
            "DataPoints": [
              {
                "Attributes": [. . .],
                "StartTime": "2024-10-30T09:24:38.457933515+01:00",
                "Time": "2024-10-30T09:24:47.460100785+01:00",
                "Value": 12
              }
            ],
            "Temporality": "CumulativeTemporality",
            "IsMonotonic": true
          }
        },
        {
[highlight]
          "Name": "http.server.duration",
[/highlight]
          "Description": "Measures the duration of inbound HTTP requests.",
          "Unit": "ms",
          "Data": {
            "DataPoints": [
              {
                "Attributes": [. . . ],
                "StartTime": "2024-10-30T09:24:38.457935351+01:00",
                "Time": "2024-10-30T09:24:47.460101534+01:00",
                "Count": 1,
                "Bounds": [0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000],
                "BucketCounts": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "Min": 0.044231,
                "Max": 0.044231,
                "Sum": 0.044231
              }
            ],
            "Temporality": "CumulativeTemporality"
          }
        }
      ]
    }
  ]
}
```

At the time of writing, the latest version of the `otelhttp` instrumentation
automatically generates three metrics which are:

1. `http.server.request.size`: A `Counter` that tracks the cumulative size of
   all HTTP request messages.
2. `http.server.response.size`: A `Counter` that tracks the cumulative size of
   all HTTP response messages.
3. `http.server.duration`: A `Histogram` that measures the duration of inbound
   HTTP requests, with data grouped into predefined buckets for analyzing
   response times.

All three metrics share similar attributes which have been truncated in the
above example. In the next steps, you'll learn to refine or drop metrics that
aren't essential to reduce storage or bandwidth. Then, we'll look at creating
custom metrics specific to your needs.

## Step 4 — Dropping unwanted metrics

When using automatic instrumentation with OpenTelemetry, you may encounter
metrics or attributes that aren't relevant to your needs, potentially creating
an overload of data. You can filter out these unwanted metrics using custom
views. In this step, you will drop the `http.server.request.size` and
`http.server.response.size` metrics generated by the `otelhttp` instrumentation.

To drop these metrics, modify your `newMeterProvider()` function like this:

```go
[label otel.go]
package main

import (
	. . .
    [highlight]
	"go.opentelemetry.io/otel/sdk/instrumentation"
    [/highlight]
	. . .
)

. . .

func newMeterProvider(
	ctx context.Context,
	res *resource.Resource,
) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New(stdoutmetric.WithPrettyPrint())
	if err != nil {
		return nil, err
	}

[highlight]
	dropRequestSizeView := metric.NewView(
		metric.Instrument{
			Name: "http.server.request.size",
			Scope: instrumentation.Scope{
				Name: "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
			},
		},
		metric.Stream{Aggregation: metric.AggregationDrop{}},
	)

	dropResponseSizeView := metric.NewView(
		metric.Instrument{
			Name: "http.server.response.size",
			Scope: instrumentation.Scope{
				Name: "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
			},
		},
		metric.Stream{Aggregation: metric.AggregationDrop{}},
	)
[/highlight]

	meterProvider := metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			metric.WithInterval(3*time.Second))),
[highlight]
		metric.WithView(dropRequestSizeView, dropResponseSizeView),
[highlight]
	)

	return meterProvider, nil
}
```

In this snippet, we created two views: one for `http.server.request.size` and
another for `http.server.response.size`. Each view uses the
`metric.AggregationDrop{}` to tell OpenTelemetry to drop these metrics and they
are passed to the `metric.NewMeterProvider()` function to ensure that they are
applied during metric collection.

Once you save the changes, those metrics will be excluded from the output,
leaving only `http.server.duration`:

```json
{
  "Resource": [. . .],
  "ScopeMetrics": [
    {
      "Scope": {
        "Name": "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
        "Version": "0.56.0",
        "SchemaURL": ""
      },
      "Metrics": [
        {
          "Name": "http.server.duration",
          "Description": "Measures the duration of inbound HTTP requests.",
          "Unit": "ms",
          "Data": {
            "DataPoints": [
              {
                "Attributes": [. . . ],
                "StartTime": "2024-10-30T09:24:38.457935351+01:00",
                "Time": "2024-10-30T09:24:47.460101534+01:00",
                "Count": 1,
                "Bounds": [0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000],
                "BucketCounts": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "Min": 0.044231,
                "Max": 0.044231,
                "Sum": 0.044231
              }
            ],
            "Temporality": "CumulativeTemporality"
          }
        }
      ]
    }
  ]
}
```

If you have many metrics to drop, it might become tedious to create individual
views for each one. Instead, you can use a custom view with regular expressions
to drop multiple metrics at once:

```go
[label otel.go]
. . .

func newMeterProvider(
	ctx context.Context,
	res *resource.Resource,
) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New(stdoutmetric.WithPrettyPrint())
	if err != nil {
		return nil, err
	}

    [highlight]
	re := regexp.MustCompile(`http\.server\.(request|response)\.size`)
	var dropMetricsView metric.View = func(i metric.Instrument) (metric.Stream, bool) {
		// In a custom View function, you need to explicitly copy
		// the name, description, and unit.
		s := metric.Stream{
			Name:        i.Name,
			Description: i.Description,
			Unit:        i.Unit,
			Aggregation: metric.AggregationDrop{},
		}

		if re.MatchString(i.Name) {
			return s, true
		}

		return s, false
	}
    [/highlight]

	meterProvider := metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			metric.WithInterval(3*time.Second))),
    [highlight]
			metric.WithView(dropMetricsView),
    [/highlight]
	)

	return meterProvider, nil
}
```

This solution uses a regular expression to match both `http.server.request.size`
and `http.server.response.size` metrics and apply the Drop aggregation to them.
If a metric matches the regex, the view drops it; otherwise, the metric is
retained.

With these strategies, you can manage the amount of metric data generated,
keeping only what's useful to prevent added costs.

In the following steps, we'll focus on create custom metrics tailored to your
specific use cases.

## Step 5 — Creating a Counter metric

To demonstrate the creation of a `Counter` metric, let's track the cumulative
number of HTTP requests received by the server.

Edit your `main.go` file to include the new metric setup:

```go
package main

import (
    . . .

[highlight]
	"os"

	"github.com/joho/godotenv"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
[/highlight]
)

[highlight]
type metrics struct {
	httpRequestCounter metric.Int64Counter
}

func newMetrics(meter metric.Meter) (*metrics, error) {
	var m metrics

	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests",
		metric.WithDescription("Total number of HTTP requests received."),
		metric.WithUnit("{requests}"),
	)
	if err != nil {
		return nil, err
	}

	m.httpRequestCounter = httpRequestsCounter

	return &m, nil
}
[/highlight]

. . .

func main() {
    . . .

[highlight]
	meter := otel.Meter(os.Getenv("OTEL_SERVICE_NAME"))

	m, err := newMetrics(meter)
	if err != nil {
		panic(err)
	}
[/highlight]

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
[highlight]
		m.httpRequestCounter.Add(
			r.Context(),
			1,
			metric.WithAttributes(
				attribute.String("http.route", r.URL.Path),
			),
		)
[/highlight]

		w.Write([]byte("Hello world!"))
	})

    . . .
}
```

The `metrics` struct will hold all the metrics we'll be creating in this
tutorial, and `NewMetrics()` is used to initialize it. It accepts a `meter`
(retrieved with `otel.Meter()`) and returns the pointer to the `metrics`
instance.

To create a `Counter` metric, you need to use the appropriate function depending
on whether you're counting integers (`meter.Int64Counter()`) or floating point
numbers (`meter.Float64Counter()`).

Once the counter is created, you can increment its value through the `Add()`
method shown above. You can also add attributes to a metric through the
`attributes` package as shown.

The server will restart automatically when you save your changes, so you can go
ahead and repeat the request to the server root as before. You'll start seeing
the new metric in a new instrumentation scope:

```json
{
  "Resource": [. . .],
  "ScopeMetrics": [
    {
      "Scope": {
        "Name": "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
        "Version": "0.56.0",
        "SchemaURL": ""
      },
      "Metrics": [. . .]
    },
    {
      "Scope": {
        "Name": "otel-metrics-demo",
        "Version": "",
        "SchemaURL": ""
      },
      "Metrics": [
        {
[highlight]
          "Name": "http.server.requests",
[/highlight]
          "Description": "Total number of HTTP requests received.",
          "Unit": "{requests}",
          "Data": {
            "DataPoints": [
              {
                "Attributes": [
                  {
                    "Key": "http.route",
                    "Value": {
                      "Type": "STRING",
                      "Value": "/"
                    }
                  }
                ],
                "StartTime": "2024-10-30T12:08:52.480835467+01:00",
                "Time": "2024-10-30T12:09:04.482299763+01:00",
                "Value": 1
              }
            ],
            "Temporality": "CumulativeTemporality",
            "IsMonotonic": true
          }
        }
      ]
    }
  ]
}
```

## Step 6 — Creating an UpDownCounter metric

An `UpDownCounter` metric allows you to track values that can increase or
decrease, making it ideal for monitoring the number of active requests. In this
step, we'll create an `UpDownCounter` metric to track in-progress requests.

Edit your main.go file to add the `activeRequestUpDownCounter`:

```go
[label main.go]

. . .

type metrics struct {
	httpRequestCounter         metric.Int64Counter
[highlight]
	activeRequestUpDownCounter metric.Int64UpDownCounter
[/highlight]
}

func newMetrics(meter metric.Meter) (*metrics, error) {
	var m metrics

	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests",
		metric.WithDescription("Total number of HTTP requests received."),
		metric.WithUnit("{requests}"),
	)
	if err != nil {
		return nil, err
	}

[highlight]
	activeRequestUpDownCounter, err := meter.Int64UpDownCounter(
		"http.server.active_requests",
		metric.WithDescription("Number of in-flight requests."),
		metric.WithUnit("{requests}"),
	)
	if err != nil {
		return nil, err
	}
[/highlight]

	m.httpRequestCounter = httpRequestsCounter
[highlight]
	m.activeRequestUpDownCounter = activeRequestUpDownCounter
[/highlight]

	return &m, nil
}

. . .
```

The `activeRequestUpDownCounter` tracks active requests. It is incremented when
a request is received and decremented once the response is sent. This allows you
to see a live count of in-progress requests. The `time.Sleep()` call simulates a
delay to keep requests active longer, which helps observe the
`activeRequestUpDownCounter` changes.

Next, update the root route as follows to see it in action:

```go
[label main.go]
mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    m.httpRequestCounter.Add(
        r.Context(),
        1,
        metric.WithAttributes(
            attribute.String("http.route", r.URL.Path),
        ),
    )

    [highlight]
    m.activeRequestUpDownCounter.Add(r.Context(), 1)

    time.Sleep(1 * time.Second)
    [/highlight]

    w.Write([]byte("Hello world!"))

    [highlight]
    m.activeRequestUpDownCounter.Add(r.Context(), -1)
    [/highlight]
})
```

Once you save the file, send some traffic to the server root using a tool like
[wrk](https://github.com/wg/wrk):

```command
wrk -t 10 -c400 -d 10s --latency "http://localhost:8000"
```

This command runs a 10-second test with 10 threads and 400 connections,
simulating high traffic.

With the load test in progress, you'll see the number of request in-progress
which will eventually be 0 when the `wrk` command exits.

```json
{
  "Scope": {
    "Name": "otel-metrics-demo",
    "Version": "",
    "SchemaURL": ""
  },
  "Metrics": [
    . . .
    {
[highlight]
      "Name": "http.server.active_requests",
[/highlight]
      "Description": "Number of in-flight requests.",
      "Unit": "{requests}",
      "Data": {
        "DataPoints": [
          {
            "Attributes": [],
            "StartTime": "2024-10-30T15:08:44.081618023+01:00",
            "Time": "2024-10-30T15:09:32.082396312+01:00",
[highlight]
            "Value": 250
[/highlight]
          }
        ],
        "Temporality": "CumulativeTemporality",
        "IsMonotonic": false
      }
    }
  ]
}
```

## Step 7 — Creating a Guage metric

A `Gauge` metric in OpenTelemetry is used to track values that fluctuate over
time without being accumulated across time periods. This is particularly useful
for metrics like memory usage, which vary based on application state.

In this section, you'll set up a `Gauge` metric to monitor the memory usage of
your Go application. We'll use the `ObservableGuage` instrument since the
measurement cycle isn't tied to a specific event.

Here's how to set it up:

```go
[label main.go]
package main

import (
	. . .
    [highlight]
	"runtime"
    [/highlight]

    . . .
)

type metrics struct {
	httpRequestCounter         metric.Int64Counter
	activeRequestUpDownCounter metric.Int64UpDownCounter
    [highlight]
	memoryUsageObservableGuage metric.Int64ObservableGauge
    [/highlight]
}

func newMetrics(meter metric.Meter) (*metrics, error) {
	var m metrics

	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests",
		metric.WithDescription("Total number of HTTP requests received."),
		metric.WithUnit("{requests}"),
	)
	if err != nil {
		return nil, err
	}

	activeRequestUpDownCounter, err := meter.Int64UpDownCounter(
		"http.server.active_requests",
		metric.WithDescription("Number of in-flight requests."),
		metric.WithUnit("{requests}"),
	)
	if err != nil {
		return nil, err
	}

    [highlight]
	m.memoryUsageObservableGuage, err = meter.Int64ObservableGauge(
		"system.memory.heap",
		metric.WithDescription(
			"Memory usage of the allocated heap objects.",
		),
		metric.WithUnit("By"),
		metric.WithInt64Callback(
			func(ctx context.Context, o metric.Int64Observer) error {
				memoryUsage := getMemoryUsage()
				o.Observe(int64(memoryUsage))
				return nil
			},
		),
	)
    [/highlight]

	m.httpRequestCounter = httpRequestsCounter
	m.activeRequestUpDownCounter = activeRequestUpDownCounter

	return &m, nil
}

[highlight]
func getMemoryUsage() uint64 {
	var memStats runtime.MemStats

	runtime.ReadMemStats(&memStats)

	currentMemoryUsage := memStats.HeapAlloc

	return currentMemoryUsage
}
[/highlight]

. . .
```

It starts by creating a special gauge called `memoryUsageObservableGuage`
designed to hold an `Int64ObservableGauge` instrument which will be responsible
for tracking memory usage.

A callback function is registered using `metric.WithInt64Callback()`. Inside the
function, `getMemoryUsage()` fetches the current memory usage, and `Observer()`
reports this value to the monitoring system.

Since the metrics are being collected every three seconds, this means the
callback function (and therefore the memory measurement) will execute every
three seconds.

```jsonc
{
  "Name": "system.memory.heap",
  "Description": "Memory usage of the allocated heap objects.",
  "Unit": "By",
  "Data": {
    "DataPoints": [
      {
        "Attributes": [],
        "StartTime": "2024-10-31T10:29:12.906723195+01:00",
        "Time": "2024-10-31T10:29:24.909464553+01:00",
        "Value": 619032 // The memory usage in bytes
      }
    ]
  }
}
```

## Step 8 — Creating and customizing Histograms

Histograms are useful for tracking distributions of measurements, such as the
duration of HTTP requests. In OpenTelemetry, creating a Histogram metric is
straightforward. You can use `meter.Float64Histogram()` or
`meter.Int64Histogram()` depending on the measurement type.

```go
requestDurHistogram, _ := meter.Float64Histogram(
    "http.server.request.duration",
    metric.WithDescription("The duration of an HTTP request."),
    metric.WithUnit("s"),
)
```

With the `Histogram` instrument created, you can then call `Record()` to record
an observation:

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  start := time.Now()

  // do some work in an API call

  duration := time.Since(start)
[highlight]
  requestDurHistogram.Record(r.Context(), duration.Seconds())
[/highlight]
})
```

The
[default bucket boundaries](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/sdk.md#explicit-bucket-histogram-aggregation)
for histograms in OpenTelemetry are optimized for millisecond durations:

```text
[0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000]
```

If these boundaries don't fit your use case (e.g., if you're measuring in
seconds), you can customize them using `metric.WithExplicitBucketBoundaries()`:

```go
requestDurHistogram, err := meter.Float64Histogram(
    "http.server.request.duration",
    metric.WithDescription("The duration of an HTTP request."),
    metric.WithUnit("s"),
[highlight]
    metric.WithExplicitBucketBoundaries(0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10),
[/highlight]
)
```

[Recent updates in OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/non-normative/http-migration/)
have renamed `http.server.duration` to `http.server.request.duration`, with
measurement units in seconds instead of milliseconds. However, the `otelhttp`
instrumentation currently still emits the older metrics by default, although
there is ongoing work to
[support the new metric conventions in a future release](https://github.com/open-telemetry/opentelemetry-go-contrib/issues/6261).

While you can use views to update the metric name, unit, and bucket boundaries,
since we cant change how the values are being observed, the resulting metric
observation will be useless.

```go
// Don't do this
serverDurationView := metric.NewView(
    metric.Instrument{
        Name: "http.server.duration",
        Scope: instrumentation.Scope{
            Name: "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
        },
    },
    metric.Stream{
        Name: "http.server.request.duration",
        Unit: "s",
        Aggregation: metric.AggregationExplicitBucketHistogram{
            Boundaries: []float64{0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10},
        },
    },
)
```

A better solution is using the OpenTelemetry Collector to rename and transform
the metrics using the
[Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/metricstransformprocessor/README.md).
We'll look at some examples of this in a future tutorial.

## Step 9 — Sending metrics data to an OpenTelemetry backend

After setting up your application to collect metrics, the next step is to send
them to an OpenTelemetry backend for analysis and visualization. A common and
recommended approach is to route this data through the OpenTelemetry Collector,
which can then process and forward the metrics to a backend of your choice. This
setup offers flexibility, as the Collector can integrate with various backends.
In this step, we'll send the collected metrics to
[Better Stack](https://betterstack.com/telemetry).

Start by creating a
[free Better Stack account](https://telemetry.betterstack.com/users/sign-up).
Once signed in, go to the
[Telemetry dashboard](https://telemetry.betterstack.com/dashboard). Under the
**Sources** menu, click **Connect source**:

![Connect source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d1932bab-aac5-4d87-44ec-0cdd32bbad00/public
=3840x1051)

Name the source **Golang Metrics** and set the platform to **OpenTelemetry**,
then click **Create source**:

![Creating a source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7321a77a-f5b0-4e60-d02d-a5572b667000/md1x
=2829x1802)

You'll see a page displaying the details of your new source. Copy the source
token for use in the OpenTelemetry Collector configuration:

![Copy the source token](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/22a90694-9d46-4874-a561-4cca3e03cc00/lg1x
=2499x1289)

If you scroll down to the bottom of the page, you'll see a "Waiting for metrics"
message:

![Waiting for metrics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/db7c0ef6-6f71-4083-e66e-b0eb706fb800/lg1x
=2103x1107)

Return to your text editor, and open the `otelcol.yaml` file. Replace the
`<source_token>` placeholder with the token you just copied:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
        endpoint: otel-metrics-demo-collector:4318

processors:
  attributes/betterstack:
    actions:
      - key: better_stack_source_token
[highlight]
        value: <source_token>
[/highlight]
        action: insert
  batch:

exporters:
  prometheusremotewrite/betterstack:
    endpoint: https://in-otel.logs.betterstack.com/metrics

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch, attributes/betterstack]
      exporters: [prometheusremotewrite/betterstack]
```

Next, return to your terminal and install the `otlpmetrichttp` exporter with:

```command
go get go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp
```

Once installed, modify your `metricExporter` as follows:

```go
[label otel.go]
package main

import (
	"context"
	"errors"
	"regexp"
	"time"

	"go.opentelemetry.io/otel"
[highlight]
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
[/highlight]
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)
. . .

func newMeterProvider(
	ctx context.Context,
	res *resource.Resource,
) (*metric.MeterProvider, error) {
[highlight]
	metricExporter, err := otlpmetrichttp.New(ctx)
[/highlight]
	if err != nil {
		return nil, err
	}

    . . .
}
```

This instructs your Go application to send the metrics to the HTTP endpoint
configured with the `OTEL_EXPORTER_OTLP_ENDPOINT` environmental variable which
is `http://otel-metric-demo-collector:4318`.

You may now run the command below to restart the services so that your updated
configuration take effect:

```command
docker compose restart
```

Once the containers are restarted, send a request to the server root to generate
some metrics:

```command
curl http://localhost:8000
```

Now, return to your Better Stack Dashboard. You will see a **Metrics received**
message confirming that the metrics are now being ingested into Better Stack.

![Metrics received in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/11ba4591-3387-45c8-170e-da23effade00/md1x
=2103x1107)

From here, you can explore the automatic OpenTelemetry dashboard in Better Stack
to visualize your metrics. We'll cover advanced visualization and analysis in a
future tutorial.

## Final thoughts

In this tutorial, we explored the essentials of setting up and using
OpenTelemetry metrics in a Go application, covering everything from setting up
counters and gauges to customizing histograms.

Starting with the OpenTelemetry SDK setup, we saw how to instrument applications
with meaningful metrics, automatically track HTTP server metrics, and manage
data efficiently by filtering out unnecessary metrics.

We then examined how to send these metrics to an OpenTelemetry Collector,
creating a flexible pipeline that can route telemetry data to multiple backends
for advanced analysis and visualization. This setup offers a powerful way to
gain insight into application performance, identify bottlenecks, and monitor
resource usage over time.

With OpenTelemetry, you have a unified framework for handling distributed
tracing, metrics, and logs, making it easier to adopt observability as an
integral part of your application's lifecycle.

By leveraging these tools, you can build more resilient applications, improve
performance, and enhance the user experience. The next steps could include
exploring distributed tracing with OpenTelemetry or configuring custom
processors in the OpenTelemetry Collector for even more control over data flows.

Thanks for reading, and happy monitoring!