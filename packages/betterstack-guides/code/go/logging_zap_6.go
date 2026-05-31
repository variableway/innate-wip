# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 6

logger := zap.Must(zap.NewProduction())
if os.Getenv("APP_ENV") == "development" {
	logger = zap.Must(zap.NewDevelopment())
}