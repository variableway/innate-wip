# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 24

[label main.go]
mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    m.httpRequestCounter.Add(
        r.Context(),
        1,
        metric.WithAttributes(
            attribute.String("http.route", r.URL.Path),
        ),
    )

    [highlight]
    m.activeRequestUpDownCounter.Add(r.Context(), 1)

    time.Sleep(1 * time.Second)
    [/highlight]

    w.Write([]byte("Hello world!"))

    [highlight]
    m.activeRequestUpDownCounter.Add(r.Context(), -1)
    [/highlight]
})