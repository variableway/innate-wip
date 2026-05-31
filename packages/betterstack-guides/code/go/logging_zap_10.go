# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 10

func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	sugar := logger.Sugar()

	sugar.Info("Hello from Zap logger!")
	sugar.Infoln(
		"Hello from Zap logger!",
	)
	sugar.Infof(
		"Hello from Zap logger! The time is %s",
		time.Now().Format("03:04 AM"),
	)

	sugar.Infow("User logged in",
		"username", "johndoe",
		"userid", 123456,
		zap.String("provider", "google"),
	)
}