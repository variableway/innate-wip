# Source: https://betterstack.com/community/guides/logging/log-sampling/
# Original language: go
# Normalized: go
# Block index: 4

package main

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

func main() {
	log := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
[highlight]
		Sample(&zerolog.BurstSampler{Period: 1 * time.Second, Burst: 3})
[/highlight]

	for i := 1; i <= 10; i++ {
		log.Info().Msgf("an info message: %d", i)
		log.Debug().Msgf("a debug message: %d", i)
		log.Warn().Msgf("a warning message: %d", i)
		log.Error().Msgf("an error message: %d", i)
	}
}