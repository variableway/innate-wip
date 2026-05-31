# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 28

func main() {
	[highlight]
	logLevel := &slog.LevelVar{} // INFO

	opts := &slog.HandlerOptions{
		Level: logLevel,
	}
	[/highlight]

	handler := slog.NewJSONHandler(os.Stdout, opts)

	. . .
}