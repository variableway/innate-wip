# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 29

var output io.Writer = zerolog.ConsoleWriter{...}
if os.Getenv("GO_ENV") != "development" {
  output = os.Stderr
}