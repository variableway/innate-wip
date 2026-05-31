# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 3

// A Counter Instrument
httpRequestsCounter, _ := meter.Int64Counter(
	"http.server.requests_total",
	metric.WithDescription("Total number of HTTP requests received."),
	metric.WithUnit("{requests}"),
)

// A Histogram Instrument
requestDurHistogram, err := meter.Float64Histogram(
	"http.request.duration",
	otelMetric.WithDescription("The duration of an HTTP request."),
	otelMetric.WithUnit("s"),
)