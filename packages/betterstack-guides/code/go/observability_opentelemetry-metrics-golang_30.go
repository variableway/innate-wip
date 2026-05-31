# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 30

http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  start := time.Now()

  // do some work in an API call

  duration := time.Since(start)
[highlight]
  requestDurHistogram.Record(r.Context(), duration.Seconds())
[/highlight]
})