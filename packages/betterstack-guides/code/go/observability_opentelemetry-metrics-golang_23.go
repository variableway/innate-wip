# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 23

[label main.go]

. . .

type metrics struct {
	httpRequestCounter         metric.Int64Counter
[highlight]
	activeRequestUpDownCounter metric.Int64UpDownCounter
[/highlight]
}

func newMetrics(meter metric.Meter) (*metrics, error) {
	var m metrics

	httpRequestsCounter, err := meter.Int64Counter(
		"http.server.requests",
		metric.WithDescription("Total number of HTTP requests received."),
		metric.WithUnit("{requests}"),
	)
	if err != nil {
		return nil, err
	}

[highlight]
	activeRequestUpDownCounter, err := meter.Int64UpDownCounter(
		"http.server.active_requests",
		metric.WithDescription("Number of in-flight requests."),
		metric.WithUnit("{requests}"),
	)
	if err != nil {
		return nil, err
	}
[/highlight]

	m.httpRequestCounter = httpRequestsCounter
[highlight]
	m.activeRequestUpDownCounter = activeRequestUpDownCounter
[/highlight]

	return &m, nil
}

. . .