# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 9

_, err = meter.Int64ObservableGauge(
	"system.memory.heap",
	metric.WithDescription(
		"Memory usage of the allocated heap objects.",
	),
	metric.WithUnit("By"),
	metric.WithInt64Callback(
		func(ctx context.Context, o otelMetric.Int64Observer) error {
			memoryUsage := getMemoryUsage()
			o.Observe(int64(memoryUsage))
			return nil
		},
	),
)