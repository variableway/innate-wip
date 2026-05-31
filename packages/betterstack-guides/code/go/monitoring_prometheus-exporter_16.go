# Source: https://betterstack.com/community/guides/monitoring/prometheus-exporter/
# Original language: go
# Normalized: go
# Block index: 16

[label main.go]
. . .
func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

	NewCollector("nginx", reg)

	handler := promhttp.HandlerFor(reg, promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)

	http.ListenAndServe(":9113", mux)
}