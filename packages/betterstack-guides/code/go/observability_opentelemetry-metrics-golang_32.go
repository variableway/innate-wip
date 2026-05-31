# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 32

requestDurHistogram, err := meter.Float64Histogram(
    "http.server.request.duration",
    metric.WithDescription("The duration of an HTTP request."),
    metric.WithUnit("s"),
[highlight]
    metric.WithExplicitBucketBoundaries(0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10),
[/highlight]
)