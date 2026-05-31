# Source: https://betterstack.com/community/guides/observability/opentelemetry-sdk/
# Original language: go
# Normalized: go
# Block index: 3

ctx, span := tracer.Start(context.Background(), "users:get-info")
defer span.End()

span.SetAttributes(attribute.String("user_id", "..."))

// Nested span
_, childSpan := tracer.Start(ctx, "users:get-info:check-permissions")
defer childSpan.End()

// ... your logic for checking permissions ...