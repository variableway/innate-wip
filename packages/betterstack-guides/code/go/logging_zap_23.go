# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 23

func main() {
	logger := zap.Must(zap.NewProduction())

	defer logger.Sync()

	childLogger := logger.With(
		zap.String("service", "userService"),
		zap.String("requestID", "abc123"),
	)

	childLogger.Info("user registration successful",
		zap.String("username", "john.doe"),
		zap.String("email", "john@example.com"),
	)

	childLogger.Info("redirecting user to admin dashboard")
}