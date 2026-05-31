# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 4

logger := slog.New(slog.NewTextHandler(os.Stdout, nil))