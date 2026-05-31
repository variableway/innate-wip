# Source: https://betterstack.com/community/guides/logging/log-sampling/
# Original language: go
# Normalized: go
# Block index: 0

package main

import (
	"os"

	"github.com/rs/zerolog"
)

func main() {
	log := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger().
[highlight]
		Sample(&zerolog.BasicSampler{N: 5})
[/highlight]

	for i := 1; i <= 10; i++ {
		log.Info().Msgf("an info message: %d", i)
	}
}