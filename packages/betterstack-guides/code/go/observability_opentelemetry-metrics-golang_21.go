# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 21

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