# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 18

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