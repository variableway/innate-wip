# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 68

[label logger/logger.go]
. . .
var output io.Writer = zerolog.ConsoleWriter{
  Out:        os.Stdout,
  TimeFormat: time.RFC3339,
  [highlight]
  FieldsExclude: []string{
    "user_agent",
    "git_revision",
    "go_version",
  },
  [/highlight]
}
. . .