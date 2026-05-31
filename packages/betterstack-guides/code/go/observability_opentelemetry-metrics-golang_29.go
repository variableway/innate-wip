# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 29

requestDurHistogram, _ := meter.Float64Histogram(
    "http.server.request.duration",
    metric.WithDescription("The duration of an HTTP request."),
    metric.WithUnit("s"),
)