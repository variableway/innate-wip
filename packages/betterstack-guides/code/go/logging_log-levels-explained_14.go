# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: go
# Normalized: go
# Block index: 14

// set the log level from the environment
logLevel, err := zerolog.ParseLevel(os.Getenv("APP_LOG_LEVEL"))
if err != nil {
	// default to INFO if log level is not set in the environment
	logLevel = zerolog.InfoLevel
}

logger := zerolog.New(os.Stdout).
	Level(logLevel).
	With().
	Timestamp().
	Logger()