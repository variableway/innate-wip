# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 8

func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	logger.Info("User logged in",
		zap.String("username", "johndoe"),
		zap.Int("userid", 123456),
		zap.String("provider", "google"),
	)
}