# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 9

func main() {
	a := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	b := slog.New(slog.NewTextHandler(os.Stdout, nil))

	a.Info("Info message")
	b.Info("Info message")
}