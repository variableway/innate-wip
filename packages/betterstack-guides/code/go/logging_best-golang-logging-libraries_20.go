# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 20

func main() {
	log.SetFormatter(&log.JSONFormatter{})

	log.WithFields(log.Fields{
		"file":       "image.jpg",
		"size_bytes": 132932,
	}).Info("upload successful!")
}