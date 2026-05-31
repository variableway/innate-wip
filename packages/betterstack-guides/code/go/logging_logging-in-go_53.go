# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 53

[highlight]
err := xerrors.New("something happened")
[/highlight]

logger.ErrorContext(ctx, "upload failed", slog.Any("error", err))