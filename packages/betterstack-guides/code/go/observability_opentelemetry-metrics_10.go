# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 10

func main() {
    [highlight]
	requestDurHistogram, err := meter.Float64Histogram(
		"http.request.duration",
		metric.WithDescription("The duration of an HTTP request."),
		metric.WithUnit("s"),
	)
    [/highlight]
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// do some work in an API call

		duration := time.Since(start)
        [highlight]
		requestDurHistogram.Record(r.Context(), duration.Seconds())
        [/highlight]
	})
}