# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 32

func main() {
	l := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
		Sample(&zerolog.BurstSampler{
			Burst:  3,
			Period: 1 * time.Second,
		})

	for i := 1; i <= 10; i++ {
		l.Info().Msgf("a message from the gods: %d", i)
		l.Warn().Msgf("warn message: %d", i)
		l.Error().Msgf("error message: %d", i)
	}
}