# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 11

logger.Info().
  Str("name", "john").
  Int("age", 22).
  Bool("registered", true).
  Msg("new signup!")