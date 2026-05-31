# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 30

func main() {
	log := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
		Sample(&zerolog.BasicSampler{N: 5})

	for i := 1; i <= 10; i++ {
		log.Info().Msgf("a message from the gods: %d", i)
	}
}