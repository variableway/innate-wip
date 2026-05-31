# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 34

burstSampler := &zerolog.BurstSampler{
	Burst:       3,
	Period:      1 * time.Second,
	NextSampler: &zerolog.BasicSampler{N: 5},
}

l := zerolog.New(os.Stdout).
	With().
	Timestamp().
	Logger().
	Sample(zerolog.LevelSampler{
		WarnSampler: burstSampler,
		InfoSampler: burstSampler,
	})