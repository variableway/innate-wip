# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 14

view := metric.NewView(metric.Instrument{
	Name: "http.server.requests_total",
	Scope: instrumentation.Scope{
		Name:    "example-meter",
		Version: "0.1.0",
	},
}, metric.Stream{Name: "http.server.total_requests"})