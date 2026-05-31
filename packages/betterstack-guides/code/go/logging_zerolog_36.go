# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 36

func main() {
	infoSampler := &zerolog.BurstSampler{
		Burst:  3,
		Period: 1 * time.Second,
	}

	warnSampler := &zerolog.BurstSampler{
		Burst:  3,
		Period: 1 * time.Second,
		// Log every 5th message after exceeding the burst rate of 3 messages per
		// second
		NextSampler: &zerolog.BasicSampler{N: 5},
	}

	errorSampler := &zerolog.BasicSampler{N: 2}

	l := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
		Sample(zerolog.LevelSampler{
			WarnSampler:  warnSampler,
			InfoSampler:  infoSampler,
			ErrorSampler: errorSampler,
		})

	for i := 1; i <= 10; i++ {
		l.Info().Msgf("a message from the gods: %d", i)
		l.Warn().Msgf("warn message: %d", i)
		l.Error().Msgf("error message: %d", i)
	}
}