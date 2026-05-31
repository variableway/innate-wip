# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 81

[label logger/logger.go]
log = zerolog.New(output).
  Level(zerolog.Level(logLevel)).
  With().
  Timestamp().
  Str("git_revision", gitRevision).
  Str("go_version", buildInfo.GoVersion).
  Logger()

[highlight]
zerolog.DefaultContextLogger = &log
[/highlight]