# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 17

metric.WithReader(metric.NewPeriodicReader(metricExporter,
	// Default is 1m. Set to 3s for demonstrative purposes.
	metric.WithInterval(3*time.Second))),
)