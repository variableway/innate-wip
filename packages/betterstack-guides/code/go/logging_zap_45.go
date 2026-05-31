# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 45

[highlight]
child := logger.With(zap.String("name", "main"), zap.Any("user", u))
[/highlight]
child.Info("an info log")