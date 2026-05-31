# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 24

func main() {
	logger := log.New("env", "prod", "go_version", "1.20")

	logger.Info("Hello from Log15", "name", "John", "age", 20)
	logger.Error("Something unexpected happened", log.Ctx{
		"error": errors.New("an error"),
	})
}