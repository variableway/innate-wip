# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 16

// The zerolog.Event is finalized twice here. Don't do this
event := logger.Info()
event.Msg("Info message")
event.Msg("Info message")