# Source: https://betterstack.com/community/guides/observability/opentelemetry-sdk/
# Original language: go
# Normalized: go
# Block index: 0

package main

import (
    "context"
    "log"

    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
    "go.opentelemetry.io/otel/metric/global"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/otel/sdk/metric"
    "go.opentelemetry.io/otel/sdk/resource"
    "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

func main() {
    // Set up trace exporter to console (stdout)
    exporter, err := stdouttrace.New(stdouttrace.WithPrettyPrint())
    if err != nil {
        log.Fatal(err)
    }

    // Create a resource describing the service
    res, err := resource.New(context.Background(),
        resource.WithAttributes(
            semconv.ServiceNameKey.String("notifications"),
            semconv.ServiceVersionKey.String("v42"),
        ),
    )
    if err != nil {
        log.Fatal(err)
    }

    // Create trace provider with batching and the exporter
    bsp := trace.NewBatchSpanProcessor(exporter)
    tracerProvider := trace.NewTracerProvider(
        trace.WithSampler(trace.AlwaysSample()), // Sample all traces for this example
        trace.WithResource(res),
        trace.WithSpanProcessor(bsp),
    )

    // Set the global trace provider and text map propagator
    otel.SetTracerProvider(tracerProvider)
    otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))

    // Create a meter provider with a stdout exporter
    // (You might want a different exporter for real-world scenarios)
    metricExporter, err := metric.NewExporter(metric.WithReader(metric.NewPeriodicReader(metric.WithExporter(metric.NewManualReader())))
    if err != nil {
        log.Fatal(err)
    }
    meterProvider := metric.NewMeterProvider(metric.WithReader(metricExporter))
    global.SetMeterProvider(meterProvider)

    // Now you can use `otel.Tracer("...")` and `global.Meter("...")`
    // to instrument your code

    // ... your application logic ...

    // Clean up
    if err := tracerProvider.Shutdown(context.Background()); err != nil {
        log.Fatal(err)
    }
    if err := meterProvider.Shutdown(context.Background()); err != nil {
        log.Fatal(err)
    }
}