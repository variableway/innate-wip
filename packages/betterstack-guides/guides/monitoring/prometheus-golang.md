# Instrumenting & Monitoring Go Apps with Prometheus

This article offers a comprehensive guide to integrating [Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) metrics in
your Go application.

It covers essential concepts such as instrumenting your code with different
metric types, tracking HTTP server activity, and efficiently exposing metrics
for Prometheus to scrape.

You'll find the complete source code for this tutorial in
[this GitHub repository](https://github.com/betterstack-community/prometheus-golang/tree/final).

Let's dive in!

[ad-logs]

## Prerequisites

- Prior Go development experience and a
  [recent version](https://go.dev/doc/install) installed.
- Familiarity with [Docker](https://www.docker.com/) and [Docker
  Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/).
- Basic familiarity with the [Prometheus metric
  types](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/).

<iframe width="100%" height="315" src="https://www.youtube.com/embed/jN9YpPOom3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Step 1 — Setting up the demo project

Let's begin by setting up the
[demo project](https://github.com/betterstack-community/prometheus-golang),
which is a simple "Hello World" server. Clone the following GitHub repository to
your local machine using the command below:

```command
git clone https://github.com/betterstack-community/prometheus-golang
```

Next, navigate to the project directory:

```command
cd prometheus-golang
```

This project includes a `docker-compose.yml` file that defines two services:

```yaml
[label docker-compose.yml]
services:
  app:
    build:
      context: .
      target: ${GO_ENV}
    container_name: golang-demo
    environment:
      PORT: ${PORT}
      LOG_LEVEL: ${LOG_LEVEL}
    env_file:
      - ./.env
    ports:
      - 8000:8000
    networks:
      - prometheus-golang
    volumes:
      - .:/app

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --web.console.libraries=/etc/prometheus/console_libraries
      - --web.console.templates=/etc/prometheus/consoles
      - --web.enable-lifecycle
    expose:
      - 9090
    ports:
      - 9090:9090
    networks:
      - prometheus-golang

networks:
  prometheus-golang:

volumes:
  prometheus_data:
```

- `app`: This service runs the application on port 8000 and uses
  [air](https://github.com/air-verse/air) to enable live reloading whenever
  files are changed.

- `prometheus`: This service runs the Prometheus server, configured using the  
  `prometheus.yml` file.

Before starting the services, rename the `.env.example` file to `.env`. This
file contains basic configuration settings for the application:

```text
[label .env]
GO_ENV=development
PORT=8000
LOG_LEVEL=info
```

Use the following command to rename the file:

```command
mv .env.example .env
```

Now, start both services in the background with this command:

```command
docker compose up -d
```

You should observe output similar to this:

```text
[output]
[+] Running 3/3
 ✔ Network prometheus-golang_prometheus-golang  Created              0.2s
 ✔ Container golang-demo                        Started              0.6s
 ✔ Container prometheus                         Started              0.6s
```

To verify the application is working, send a request to the root endpoint using
`curl`:

```command
curl http://localhost:8000
```

This should return the following response:

```text
[output]
Hello world
```

You can also navigate to `http://localhost:9090/targets` to view the Prometheus
UI and confirm that your `golang-demo` application is accessible:

![Golang Demo target in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9f1f5eeb-6d9f-4034-7afc-adfd16033c00/md2x =1862x416)

With the services running successfully, we can proceed to integrate the
Prometheus packages in the next step.

## Step 2 — Exposing the default metrics

Before you can instrument your application with Prometheus, you need to install
the necessary packages first:

```command
go get github.com/prometheus/client_golang/prometheus \
  github.com/prometheus/client_golang/prometheus/promhttp
```

This command installs the
[prometheus](https://pkg.go.dev/github.com/prometheus/client_golang/prometheus)
and
[promhttp](https://pkg.go.dev/github.com/prometheus/client_golang/prometheus)
packages. The former is the core library for defining and managing metrics,
while the latter provides an HTTP handler for exposing metrics in a
Prometheus-compatible format.

To integrate them into your Go application, modify your `main.go` file as
follows:

```go
[label main.go]
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
    [highlight]
	"github.com/prometheus/client_golang/prometheus/promhttp"
    [/highlight]
)

func init() {
	_ = godotenv.Load()
}

func main() {
	mux := http.NewServeMux()

    [highlight]
	mux.Handle("/metrics", promhttp.Handler())
    [/highlight]

    . . .
}
```

This imports the `promhttp` package which provides an HTTP handler that serves
metrics in a format that Prometheus can scrape.

If you visit the `http://localhost:8000/metrics` in your browser, you will see
the following output:

```text
# HELP go_gc_duration_seconds A summary of the wall-time pause (stop-the-world) duration in garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 0
go_gc_duration_seconds{quantile="0.25"} 0
go_gc_duration_seconds{quantile="0.5"} 0
go_gc_duration_seconds{quantile="0.75"} 0
go_gc_duration_seconds{quantile="1"} 0
go_gc_duration_seconds_sum 0
go_gc_duration_seconds_count 0
# HELP go_gc_gogc_percent Heap size target percentage configured by the user, otherwise 100. This value is set by the GOGC environment variable, and the runtime/debug.SetGCPercent function. Sourced from /gc/gogc:percent
# TYPE go_gc_gogc_percent gauge
go_gc_gogc_percent 100
. . .
```

![Screenshot of default Go Prometheus metrics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/52102f04-be23-472d-9a54-0428cf83c000/public =2520x1436)

By default, Prometheus uses the global registry, which automatically registers
standard Go runtime metrics and process metrics. While Prometheus gathers a wide
range of default metrics, they're not usually essential for typical monitoring
needs.

To disable these, you must create a custom registry and register only the
metrics you care about. Then pass your custom registry to
`promhttp.HandlerFor()` to expose only the metrics you explicitly register:

```go
[label main.go]
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
[highlight]
	"github.com/prometheus/client_golang/prometheus"
[/highlight]
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func init() {
	_ = godotenv.Load()
}

func main() {
	mux := http.NewServeMux()

[highlight]
	reg := prometheus.NewRegistry()

	handler := promhttp.HandlerFor(
		reg,
		promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)
[/highlight]

    . . .
}
```

Since we haven't explicitly registered any custom metrics, the `/metrics` route
will return an empty response. In the following sections, you will instrument
the Counter, Gauge, Histogram, and Summary metric in turn.

## Step 3 — Instrumenting a Counter metric

Let's start with a rather basic metric that keeps track of the total number of
HTTP requests made to the server. Since this number always goes up, it is best
represented as a Counter.

Edit your `main.go` file to include the counter instrumentation:

```go
[label main.go]
package main

import (
	"log"
	"net/http"
	"os"
[highlight]
	"strconv"
[/highlight]

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func init() {
	_ = godotenv.Load()
}

[highlight]
var httpRequestCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "http_requests_total",
	Help: "Total number of HTTP requests received",
}, []string{"status", "path", "method"})

// Middleware to count HTTP requests
func prometheusMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Wrap the ResponseWriter to capture the status code
		recorder := &statusRecorder{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		// Process the request
		next.ServeHTTP(recorder, r)

		method := r.Method
		path := r.URL.Path // Path can be adjusted for aggregation (e.g., `/users/:id` → `/users/{id}`)
		status := strconv.Itoa(recorder.statusCode)

		// Increment the counter
		httpRequestCounter.WithLabelValues(status, path, method).Inc()
	})
}

// Helper to capture HTTP status codes
type statusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (rec *statusRecorder) WriteHeader(code int) {
	rec.statusCode = code
	rec.ResponseWriter.WriteHeader(code)
}
[/highlight]

func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

[highlight]
	reg.MustRegister(httpRequestCounter)
[/highlight]

	handler := promhttp.HandlerFor(
		reg,
		promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello world!"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

[highlight]
	promHandler := prometheusMiddleware(mux)
[/highlight]

	log.Println("Starting HTTP server on port", port)

[highlight]
	if err := http.ListenAndServe(":"+port, promHandler); err != nil {
[/highlight]
		log.Fatal("Server failed to start:", err)
	}
}
```

In this snippet, the `httpRequestCounter` metric is created using a `CounterVec`
which is a Prometheus metric type that tracks a cumulative count of events and
supports labels for categorization. The `prometheus` package also exposes a
`Counter` type, but it does not support using labels.

The `CounterOpts` struct specifies the metric's name, and provides a short
description of its purpose. The metric is then labeled with HTTP status code,
requested URL path, and the HTTP method like GET or POST.

These labels allow you to distinguish between different types of requests and
provide detailed breakdowns for analysis when [querying with PromQL](https://betterstack.com/community/guides/monitoring/promql/) later on.

To automatically increment the request count for all current and future HTTP
routes, you created a `prometheusMiddleware()` function that wraps the existing
HTTP handler. It uses a `statusRecorder` to capture the HTTP status code, which
is not directly accessible during request handling.

After processing the request with `next.ServeHTTP()`, the middleware extracts
the HTTP method, path, and status code, then increments the counter using
`httpRequestCounter.WithLabelValues.Inc()`. This ensures that every HTTP request
is counted and categorized by its attributes.

Finally, the `httpRequestCounter` must be explicitly registered with the custom
Prometheus registry, and the existing HTTP multiplexer (`mux`) is wrapped with
the `prometheusMiddleware()`.

By doing this, every incoming HTTP request will pass through the middleware,
ensuring that request counter metrics are updated as part of the request
lifecycle.

Once you've saved the file, you may refresh the `http://localhost:8000/metrics`
page a couple of times. You will see the following results:

```text
[output]
# HELP http_requests_total Total number of HTTP requests received
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/",status="200"} 6
http_requests_total{method="GET",path="/favicon.ico",status="200"} 4
http_requests_total{method="GET",path="/metrics",status="200"} 4
```

To send a steady stream of requests to a route, you can use a benchmarking tool
like [wrk](https://github.com/wg/wrk):

```command
wrk -t 1 -c 1 -d 300s --latency "http://localhost:8000
```

You can visit the Prometheus web interface at `http://localhost:9090` to see
your metrics in action. Typing `http_requests_total` in the expression input and
clicking **Execute** will display the raw metric values:

![Prometheus raw metric table for http requests](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/222b3743-78db-4204-1b6d-8de12a714400/lg2x =1228x564)

You can then switch to the **Graph** tab to see the counter increasing
continually as long as the service continues to handle HTTP requests:

![Prometheus counter metric graph](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bcdc3466-c380-4668-6c4a-7e7a646fac00/md2x =1706x1058)

Let's look at how to instrument a Gauge metric next.

## Step 4 — Instrumenting a Gauge metric

A Gauge represents a value that can go up or down, making it ideal for tracking
values like active connections, queue sizes, or memory usage.

In this section, we'll use a Prometheus Gauge to monitor the number of active
connections to the service.

Here's what you need to add to your `main.go` file:

```go
[label main.go]
package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

. . .

[highlight]
var activeRequestsGauge = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name: "http_active_requests",
		Help: "Number of active connections to the service",
	},
)
[/highlight]

// Middleware to count HTTP requests.
func prometheusMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
[highlight]
		activeRequestsGauge.Inc()
[/highlight]
		// Wrap the ResponseWriter to capture the status code
		recorder := &statusRecorder{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

[highlight]
		time.Sleep(1 * time.Second)
[/highlight]

		// Process the request
		next.ServeHTTP(recorder, r)

[highlight]
		activeRequestsGauge.Dec()
[/highlight]

        . . .
	})
}

. . .

func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

	reg.MustRegister(httpRequestCounter)
[highlight]
	reg.MustRegister(activeRequestsGauge)
[/highlight]

    . . .
}
```

The `activeRequestsGauge` metric is created with `prometheus.NewGauge()` to keep
track of the number of active HTTP requests being processed at any given time.
If you want to add labels, use `NewGaugeVec()` instead.

At the start of the middleware function, the `activeRequestsGauge.Inc()` method
is called to increment the gauge when a new HTTP request arrives.

The `time.Sleep()` method is then used to simulate a delay of one second. In
real-world scenarios, the time taken to process the request would depend on
factors such as database queries, external API calls, and other business logic.

Finally, once the request handler returns, the `activeRequestsGauge.Dec()`
method is called to decrement the gauge, indicating that the has finished
processing and is no longer active.

Ensure to register the `activeRequestsGauge` and save the file, then send some
load to your server with:

```command
wrk -t 10 -c 400 -d 5m --latency "http://localhost:8000"
```

When you visit your metric endpoint, you'll see the following output:

```text
# HELP http_active_requests Number of active users in the system
# TYPE http_active_requests gauge
http_active_requests 407
```

This indicates that there are currently 407 active connections to the service.

You may query this metric and see the **Graph** tab to check how this number is
changing over time.

![Graph of how a Guage metric is changing over time](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a8efa1b0-b07a-4f3c-809c-83861ee9f000/lg2x =1706x1058)

Next up, you'll instrument a Histogram metric to track the HTTP request latency
for your routes.

## Step 5 — Instrumenting an Histogram metric

Histograms are helpful for tracking distributions of measurements, such as the
duration of HTTP requests. In Prometheus, creating a Histogram metric is
straightforward with the `prometheus.NewHistogramVec()` method:

```go
[label main.go]
package main

import (
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

. . .

[highlight]
var latencyHistogram = prometheus.NewHistogramVec(prometheus.HistogramOpts{
	Name: "http_request_duration_seconds",
	Help: "Duration of HTTP requests",
}, []string{"status", "path", "method"})
[/highlight]

// Middleware to count HTTP requests.
func prometheusMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		. . .

[highlight]
		now := time.Now()

		delay := time.Duration(rand.Intn(900)) * time.Millisecond

		time.Sleep(delay)
[/highlight]

		. . .

[highlight]
		latencyHistogram.With(prometheus.Labels{
			"method": method, "path": path, "status": status,
		}).
			Observe(time.Since(now).Seconds())
[/highlight]

		// Increment the counter
		httpRequestCounter.WithLabelValues(status, path, method).Inc()
	})
}

. . .

func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

	reg.MustRegister(httpRequestCounter)
	reg.MustRegister(activeRequestsGauge)
[highlight]
	reg.MustRegister(latencyHistogram)
[/highlight]

	. . .
}
```

Instead of a fixed delay of one second, we've introduced a random delay between
0ms and 1s using `rand.Intn()` so that you can observe a range of values.

After the request is processed, the duration is calculated as the difference
between the current and recorded start times. This value is then converted to
seconds and recorded into the histogram.

Once the histogram is registered, it will be exposed at the `/metrics` endpoint.
By generating some load to your endpoints, you'll see the following output in
`/metrics`:

```text
[output]
. . .
# HELP http_request_duration_seconds Duration of the request.
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.005"} 0
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.01"} 0
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.025"} 4
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.05"} 5
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.1"} 13
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.25"} 43
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.5"} 85
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="1"} 154
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="2.5"} 154
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="5"} 154
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="10"} 154
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="+Inf"} 154
http_request_duration_seconds_sum{method="GET",path="/",status="200"} 68.487667757
http_request_duration_seconds_count{method="GET",path="/",status="200"} 154
```

Each `_bucket` line shows the cumulative count of requests completed in less
than or equal to a specific duration. For example:

- `le="0.005"`: No requests completed within 5 milliseconds.
- `le="0.025"`: 4 requests completed within 25 milliseconds.
- `le="0.5"`: 85 requests completed within 0.5 seconds (500ms).
- `le="+Inf"`: 154 requests completed in total (all durations).

The default buckets for a histogram metric are:

```text
[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, +Inf]
```

If this doesn't make sense for your use case, you can define a custom bucket
with:

```go
var latencyHistogram = prometheus.NewHistogramVec(prometheus.HistogramOpts{
	Name: "http_request_duration_seconds",
	Help: "Duration of HTTP requests",
[highlight]
	Buckets: []float64{0.1, 0.5, 1, 2.5, 5, 10},
[/highlight]
}, []string{"status", "path", "method"})
```

In the Prometheus UI, you can use the following PromQL query to calculate the
99th percentile latency for HTTP requests over a 1-minute window:

```text
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))
```

![Visualizing 99th percentile for Histogram metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/046fafec-5cdc-414a-4099-b5d5884cc100/lg1x =1706x1057)

## Step 6 — Instrumenting a Summary metric

A Summary metric in Prometheus is useful for capturing pre-aggregated quantiles
(e.g., median, 95th, or 99th percentile) and providing overall counts and sums
for specific observations.

A key feature of summaries is their ability to calculate quantiles directly on
the client side, which makes them particularly valuable in scenarios where you
need quantiles for individual instances and don't want to rely on Prometheus for
these computations.

While the histogram is usually preferred for tracking request latency, the
Summary can be used for precomputing quantiles for response times of critical
API endpoints where aggregation isn't required.

Here's how to set it up:

```go
[label main.go]
package main

import (
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

. . .

[highlight]
var postsLatencySummary = prometheus.NewSummary(prometheus.SummaryOpts{
	Name: "post_request_duration_seconds",
	Help: "Duration of requests to https://jsonplaceholder.typicode.com/posts",
	Objectives: map[float64]float64{
		0.5:  0.05,  // Median (50th percentile) with a 5% tolerance
		0.9:  0.01,  // 90th percentile with a 1% tolerance
		0.99: 0.001, // 99th percentile with a 0.1% tolerance
	},
})
[/highlight]

. . .

func main() {
. . .

[highlight]
	reg.MustRegister(postsLatencySummary)
[/highlight]

	handler := promhttp.HandlerFor(
		reg,
		promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)

[highlight]
	mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		url := "https://jsonplaceholder.typicode.com/posts"

		now := time.Now()

		resp, err := http.Get(url)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		postsLatencySummary.Observe(time.Since(now).Seconds())

		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, "request failed", resp.StatusCode)
			return
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	})
[/highlight]

	. . .
}
```

The `postLatencySummary` metric is used here to measure and monitor the latency
of requests to the external API endpoint
`https://jsonplaceholder.typicode.com/posts`.

The `Objectives` field in the `SummaryOpts` structure specifies the quantiles to
calculate. Each quantile is associated with a **tolerance** value, which defines
the allowable margin of error for the quantile calculation.

- For `0.5: 0.05`, the actual quantile value may have up to a 5% error margin.
- For `0.9: 0.01`, the margin of error is stricter at 1%.

When choosing tolerances, keep in mind that lower values require more memory and
processing power.

In `/posts` handler, the duration for the request is calculated and recorded
into the summary metric.

Once you've saved the file, send some requests to the `/posts` endpoint:

```command
wrk -t 1 -c 5 -d 10s --latency "http://localhost:8000/posts"
```

When you scrape your application metrics now, you'll see an output that looks
like this:

```text
[output]
. . .
# HELP post_request_duration_seconds Duration of requests to https://jsonplaceholder.typicode.com/posts
# TYPE post_request_duration_seconds summary
post_request_duration_seconds{quantile="0.5"} 0.1095123
post_request_duration_seconds{quantile="0.9"} 0.127119377
post_request_duration_seconds{quantile="0.99"} 0.5448496
post_request_duration_seconds_sum 11.270166696
post_request_duration_seconds_count 86
```

This shows the shows precomputed quantiles (50th, 90th, and 99th percentiles)
and overall statistics (sum and count) for request durations to
`https://jsonplaceholder.typicode.com/posts`.

From the results, we can deduce that:

- Half of all requests completed in less than or equal to **0.1095 seconds**
  (about 110 milliseconds),
- 90% of all requests completed in less than or equal to **0.1271 seconds**
  (about 127 milliseconds),
- and 99% of all requests completed in less than or equal to **0.5448 seconds**
  (about 545 milliseconds).

This 0.99 quantile is much higher than the 0.9 quantile, which indicates the
presence of a few slower requests.

![The Summary Metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/51bf0d68-2a4a-4394-2538-400d7f083b00/md1x =1862x1199)

## Final thoughts

In this tutorial, we explored the fundamentals of setting up and using
Prometheus metrics in a Go application, covering key concepts such as defining
and registering counters, gauges, histograms, and summaries.

As the next steps, consider integrating alerting with [Prometheus
Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) or visualizing metrics using tools like
[Grafana](https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/) and
[Better Stack](https://betterstack.com/dashboards).

Exploring advanced PromQL queries can also help you unlock powerful ways to
analyze and act on your application's data.

Thanks for reading, and happy monitoring!
