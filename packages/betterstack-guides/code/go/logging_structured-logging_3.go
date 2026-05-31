# Source: https://betterstack.com/community/guides/logging/structured-logging/
# Original language: go
# Normalized: go
# Block index: 3

slog.Error("Error processing request", slog.String("request_id", r.ID),
    slog.Any("err_msg", err))