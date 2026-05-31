# Source: https://betterstack.com/community/guides/logging/log-sampling/
# Original language: go
# Normalized: go
# Block index: 2

. . .
	for i := 1; i <= 10; i++ {
		log.Info().Msgf("an info message: %d", i)
		log.Debug().Msgf("a debug message: %d", i)
		log.Warn().Msgf("a warning message: %d", i)
	}
. . .