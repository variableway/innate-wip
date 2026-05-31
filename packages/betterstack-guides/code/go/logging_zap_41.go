# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 41

child := logger.With(zap.String("name", "main"))
child.Info("an info log", zap.Any("user", u))