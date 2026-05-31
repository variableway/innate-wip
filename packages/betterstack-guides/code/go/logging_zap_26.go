# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 26

logger.Error("Failed to perform an operation",
    zap.String("operation", "someOperation"),
    zap.Error(errors.New("something happened")), // the key will be `error` here
    zap.Int("retryAttempts", 3),
    zap.String("user", "john.doe"),
)