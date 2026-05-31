# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 8

import (
	"context"
	"runtime"

	"go.opentelemetry.io/otel/metric"
)

var queueSizeCounter metric.Int64UpDownCounter // Use an UpDownCounter for the current queue size

func main() {
    [highlight]
    var err error
	queueSizeCounter, err = meter.Int64UpDownCounter(
		"queue.size",
		metric.WithDescription("Current size of the queue."),
		metric.WithUnit("{items}"),
	)
    [/highlight]
	if err != nil {
		panic(err)
	}

    [highlight]
	_ , err = meter.Int64ObservableUpDownCounter(
		"system.memory.heap_allocation",
		metric.WithDescription("Memory usage of the allocated heap objects."),
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
	if err != nil {
		panic(err)
	}
}

func getMemoryUsage() uint64 {
	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)

	// Current memory usage in bytes
	currentMemoryUsage := memStats.HeapAlloc

	return currentMemoryUsage
}

func enqueue(items []any{}) {
	// Adds items to the queue
	queueSizeCounter.Add(context.Background(), len(items))
}

func dequeue(items []any{}) {
	// Remove items from the queue
	queueSizeCounter.Add(context.Background(), -len(items))
}