# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 25

func createLogger() *zap.Logger {
	. . .

	buildInfo, _ := debug.ReadBuildInfo()

	return zap.New(samplingCore.With([]zapcore.Field{
		zap.String("go_version", buildInfo.GoVersion),
		zap.Int("pid", os.Getpid()),
	},
	))
}