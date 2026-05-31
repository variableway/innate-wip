# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 13

logger.Info(
  "incoming request",
  "method", "GET",
  "time_taken_ms", // the value for this key is missing
)