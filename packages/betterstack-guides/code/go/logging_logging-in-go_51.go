# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 51

err := errors.New("something happened")

logger.ErrorContext(ctx, "upload failed", slog.Any("error", err))