# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 1

package main

import (
	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog global logger")
}