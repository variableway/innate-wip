# Source: https://betterstack.com/community/guides/observability/opentelemetry-sdk/
# Original language: go
# Normalized: go
# Block index: 1

res, err := resource.New(context.Background(),
    resource.WithAttributes(
        semconv.ServiceNameKey.String("notifications"),
        semconv.ServiceVersionKey.String("v42"),
    ),
)
if err != nil {
    log.Fatal(err)
}