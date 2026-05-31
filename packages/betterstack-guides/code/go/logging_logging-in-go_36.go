# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 36

opts := &slog.HandlerOptions{
[highlight]
    AddSource: true,
[/highlight]
    Level:     slog.LevelDebug,
}