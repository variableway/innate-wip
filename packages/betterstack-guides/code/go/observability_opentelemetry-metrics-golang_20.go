# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 20

[label otel.go]
. . .

func newMeterProvider(
	ctx context.Context,
	res *resource.Resource,
) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New(stdoutmetric.WithPrettyPrint())
	if err != nil {
		return nil, err
	}

    [highlight]
	re := regexp.MustCompile(`http\.server\.(request|response)\.size`)
	var dropMetricsView metric.View = func(i metric.Instrument) (metric.Stream, bool) {
		// In a custom View function, you need to explicitly copy
		// the name, description, and unit.
		s := metric.Stream{
			Name:        i.Name,
			Description: i.Description,
			Unit:        i.Unit,
			Aggregation: metric.AggregationDrop{},
		}

		if re.MatchString(i.Name) {
			return s, true
		}

		return s, false
	}
    [/highlight]

	meterProvider := metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			metric.WithInterval(3*time.Second))),
    [highlight]
			metric.WithView(dropMetricsView),
    [/highlight]
	)

	return meterProvider, nil
}