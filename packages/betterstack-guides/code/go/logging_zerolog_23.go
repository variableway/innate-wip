# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 23

func main() {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

  [highlight]
	logger.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("name", "john")
	})
  [/highlight]

	logger.Info().Msg("info message")
}