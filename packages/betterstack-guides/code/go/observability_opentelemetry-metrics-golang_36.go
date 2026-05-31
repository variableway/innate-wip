# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 36

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