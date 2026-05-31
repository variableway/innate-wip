# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 33

func main() {
	logger := createLogger()

	defer logger.Sync()

	for i := 1; i <= 10; i++ {
		logger.Info("an info message")
		logger.Warn("a warning")
	}
}