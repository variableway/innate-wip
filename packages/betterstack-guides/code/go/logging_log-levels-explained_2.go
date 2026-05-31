# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: go
# Normalized: go
# Block index: 2

func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

    [highlight]
	err := someThingThatCanFail()
	if err != nil {
		logger.Error(
			"an error occurred while doing something that can fail",
			zap.Error(err),
		)
	}
    [/highlight]
}