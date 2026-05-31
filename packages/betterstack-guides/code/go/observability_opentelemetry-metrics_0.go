# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics/
# Original language: go
# Normalized: go
# Block index: 0

meterProvider, _ := newMeterProvider(res)

// Register as global meter provider so that it can be used via otel.Meter
// and accessed using otel.GetMeterProvider.
// Most instrumentation libraries use the global meter provider as default.
// If the global meter provider is not set then a no-op implementation
// is used, which fails to generate data.
otel.SetMeterProvider(meterProvider)