# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 48

err := errors.New("failed to connect to database")
logger.WithLevel(zerolog.FatalLevel).
  Err(err).
  Msg("something catastrophic happened!")