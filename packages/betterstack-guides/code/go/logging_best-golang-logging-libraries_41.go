# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 41

log.V(0).Info("level 0") // the default, mappped to zerolog.InfoLevel
log.V(1).Info("level 1") // mapped to zerolog.DebugLevel
log.V(2).Info("level 2") // mapped to zerolog.TraceLevel