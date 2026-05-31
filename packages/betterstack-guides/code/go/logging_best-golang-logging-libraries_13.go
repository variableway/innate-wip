# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 13

logger.Info(
	"incoming request",
	"method", "GET",
	"time_taken_ms", 158,
	"path", "/hello/world?q=search",
	"status", 200,
)

logger.LogAttrs(
	context.Background(),
	slog.LevelInfo,
	"incoming request",
	slog.String("method", "GET"),
	slog.Int("time_taken_ms", 158),
	slog.String("path", "/hello/world?q=search"),
	slog.Int("status", 200),
)