# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: go
# Normalized: go
# Block index: 22

var latencyHistogram = prometheus.NewHistogramVec(prometheus.HistogramOpts{
	Name: "http_request_duration_seconds",
	Help: "Duration of HTTP requests",
[highlight]
	Buckets: []float64{0.1, 0.5, 1, 2.5, 5, 10},
[/highlight]
}, []string{"status", "path", "method"})