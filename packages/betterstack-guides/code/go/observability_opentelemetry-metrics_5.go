# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 5

package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
	otelMetric "go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

func main() {
	// 1. Create a Resource.
	res, err := newResource()
	if err != nil {
		panic(err)
	}

	// 2. Create a MeterProvider.
	meterProvider, err := newMeterProvider(res)
	if err != nil {
		panic(err)
	}

	// Handle shutdown properly so nothing leaks.
	defer func() {
		if err := meterProvider.Shutdown(context.Background()); err != nil {
			log.Println(err)
		}
	}()

	otel.SetMeterProvider(meterProvider)

	// 3. Create a Meter
	meter := meterProvider.Meter(
		"example-meter",
		otelMetric.WithInstrumentationVersion("0.1.0"),
	)

	// 4. Create a Counter Instrument
	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests_total",
		otelMetric.WithDescription("Total number of HTTP requests received."),
		otelMetric.WithUnit("{requests}"),
	)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// 5. Create a Measurement on each HTTP Request
		httpRequestsCounter.Add(r.Context(), 1)
	})

	http.ListenAndServe(":8000", mux)
}

func newResource() (*resource.Resource, error) {
	return resource.Merge(resource.Default(),
		resource.NewWithAttributes(semconv.SchemaURL,
			semconv.ServiceName("my-service"),
			semconv.ServiceVersion("0.1.0"),
		))
}

func newMeterProvider(res *resource.Resource) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New()
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