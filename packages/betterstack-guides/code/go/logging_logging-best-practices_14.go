# Source: https://betterstack.com/community/guides/logging/logging-best-practices/
# Original language: go
# Normalized: go
# Block index: 14

func main() {
	l := slog.New(slog.NewJSONHandler(io.Discard, nil))

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		l.Info(
			"User login event recorded",
			slog.Int("user_id", 42),
			slog.String("event", "login"),
			slog.String("ip_address", "192.168.1.100"),
		)

		fmt.Fprintf(w, "Login successful")
	})

    . . .
}