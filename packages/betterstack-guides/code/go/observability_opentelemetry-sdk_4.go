# Source: https://betterstack.com/community/guides/observability/opentelemetry-sdk/
# Original language: go
# Normalized: go
# Block index: 4

// Globally defined custom metric
userInfoCacheMissCounter := global.Meter("users").NewInt64Counter(
    "users.cache.miss",
    metric.WithDescription("The number of cache misses when fetching user's info"),
)

// Later on, you can import the metric and measure what you need
userInfoCacheMissCounter.Add(context.Background(), 1, attribute.String("user.org_id", "..."))