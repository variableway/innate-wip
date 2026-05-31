# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 55

func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

[highlight]
	sl := slog.New(zapslog.NewHandler(zapL.Core(), nil))
[/highlight]

	sl.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}