# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 44

package main

import (
	"os"

	"github.com/pkg/errors"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
)

func main() {
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	logger.Error().
		Stack().
		Err(errors.New("file open failed!")).
		Msg("something happened!")
}