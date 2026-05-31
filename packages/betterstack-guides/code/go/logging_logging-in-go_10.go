# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 10

func main() {
	handler := slog.NewJSONHandler(os.Stdout, nil)

	logger := slog.NewLogLogger(handler, slog.LevelError)

	_ = http.Server{
		// this API only accepts `log.Logger`
		ErrorLog: logger,
	}
}