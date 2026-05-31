# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 2

func main() {
    [highlight]
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    [/highlight]
	logger.Debug("Debug message")
	logger.Info("Info message")
	logger.Warn("Warning message")
	logger.Error("Error message")
}