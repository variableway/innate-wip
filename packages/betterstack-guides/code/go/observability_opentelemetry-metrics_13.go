# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 13

requestDurHistogram, err := meter.Float64Histogram(
	"http.request.duration",
	metric.WithDescription("The duration of an HTTP request."),
	metric.WithUnit("s"),
[highlight]
	metric.WithExplicitBucketBoundaries(0, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2),
[/highlight]
)