# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 40

logger.Error().
  Err(errors.New("file open failed")).
  Msg("something happened!")