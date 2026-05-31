# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: go
# Normalized: go
# Block index: 12

func main() {
	// this logger is set to the INFO level
	logger := zerolog.New(os.Stdout).
		Level(zerolog.InfoLevel).
		With().
		Timestamp().
		Logger()

	logger.Trace().Msg("Trace message")
	logger.Debug().Msg("Debug message")
	logger.Info().Msg("Info message")
	logger.Warn().Msg("Warn message")
	logger.Warn().Msg("Error message")
	logger.Fatal().Msg("Fatal message")
}