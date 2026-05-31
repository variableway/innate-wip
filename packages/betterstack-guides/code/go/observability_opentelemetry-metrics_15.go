# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 15

view := metric.NewView(
	metric.Instrument{
		Name:  "*",
		Scope: instrumentation.Scope{Name: "example-meter"},
	},
	metric.Stream{
        [highlight]
		Aggregation: metric.AggregationExplicitBucketHistogram{
			Boundaries: []float64{0, 20, 50, 100, 200, 500, 1000},
		},
        [/highlight]
	},
)