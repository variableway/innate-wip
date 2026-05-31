# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 28

logger.Fatal("Something went terribly wrong",
    zap.String("context", "main"),
    zap.Int("code", 500),
    zap.Error(errors.New("An error occurred")),
)