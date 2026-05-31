# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 6

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

  [highlight]
	slog.SetDefault(logger)
  [/highlight]

	slog.Info("Info message")
}