# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 16

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