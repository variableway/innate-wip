# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 57

func main() {
    [highlight]
	sl := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    [/highlight]

	sl.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}