# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 38

type Hook interface {
	// Run runs the hook with the event.
	Run(e *zerolog.Event, level zerolog.Level, message string)
}