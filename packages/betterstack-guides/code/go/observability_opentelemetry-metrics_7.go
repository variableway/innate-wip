# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 7

package main

import (
	"net/http"

	"go.opentelemetry.io/otel/metric"
)

func main() {
	start := time.Now()

    [highlight]
	// 1. Create a counter to track the number of HTTP requests received.
	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests_total",  // More descriptive and standard metric name
		metric.WithDescription("Total number of HTTP requests received."),
		metric.WithUnit("{requests}"),
	)
    [/highlight]
	if err != nil {
		panic(err)
	}

    [highlight]
	// 2. Create an observable counter to track application uptime
	if _, err := meter.Float64ObservableCounter(
		"uptime",
		metric.WithDescription("The duration since the application started."),
		metric.WithUnit("s"),
		metric.WithFloat64Callback(func(_ context.Context, o metric.Float64Observer) error {
			// Notice that the absolute value is what is observed here
			o.Observe(float64(time.Since(start).Seconds()))
			return nil
		}),
    [/highlight]
	); err != nil {
		panic(err)
	}

	// Instrument the HTTP handler to increment the counter for each request.
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        [highlight]
		// A counter metric expects an increment value (a.k.a delta)
		httpRequestsCounter.Add(r.Context(), 1)
        [/highlight]

		// Handle the API request...
	})
}