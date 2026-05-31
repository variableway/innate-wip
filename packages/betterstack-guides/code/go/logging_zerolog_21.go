# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 21

package main

import (
	"os"

	"github.com/rs/zerolog"
)

var logger = zerolog.New(os.Stdout).With().Timestamp().Logger()

func main() {
	mainLogger := logger.With().Str("service", "main").Logger()
	mainLogger.Info().Msg("main logger message")

	auth()
	admin()
}

func auth() {
	authLogger := logger.With().Str("service", "auth").Logger()
	authLogger.Info().Msg("auth logger message")
}

func admin() {
	adminLogger := logger.With().Str("service", "admin").Logger()
	adminLogger.Info().Msg("admin logger message")
}