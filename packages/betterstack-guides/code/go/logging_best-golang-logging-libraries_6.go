# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 6

func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	// only strongly typed fields can be used with a `Logger`
	logger.Info("user signed in",
		zap.Int("userid", 123456),
		zap.String("provider", "facebook"),
	)

	sugar := logger.Sugar()

	// `SugaredLogger` supports weakly typed contextual fields
	sugar.Infow("user signed in", "userid", 123456, "provider", "facebook")
}