# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 19

func main() {
	logger := zerolog.New(os.Stdout).With().Timestamp().Caller().Logger()

	logger.Info().Msg("info message")
	logger.Debug().Str("username", "joshua").Send()
}