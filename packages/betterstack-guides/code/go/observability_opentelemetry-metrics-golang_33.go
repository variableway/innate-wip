# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 33

// Don't do this
serverDurationView := metric.NewView(
    metric.Instrument{
        Name: "http.server.duration",
        Scope: instrumentation.Scope{
            Name: "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp",
        },
    },
    metric.Stream{
        Name: "http.server.request.duration",
        Unit: "s",
        Aggregation: metric.AggregationExplicitBucketHistogram{
            Boundaries: []float64{0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10},
        },
    },
)