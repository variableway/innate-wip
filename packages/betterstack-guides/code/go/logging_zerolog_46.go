# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 46

err := errors.New("failed to connect to database")
logger.Fatal().Err(err).Msg("something catastrophic happened!")