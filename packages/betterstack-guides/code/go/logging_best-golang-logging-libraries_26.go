# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 26

func main() {
	handler := log.StreamHandler(os.Stdout, log.JsonFormat())
	logger := log.New()
	logger.SetHandler(handler)

 	. . .
}