# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 27

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