# Source: https://betterstack.com/community/guides/logging/logging-best-practices/
# Original language: go
# Normalized: go
# Block index: 12

func main() {
	l := logrus.New()
	l.Out = io.Discard
	l.Level = logrus.InfoLevel
	l.SetFormatter(&logrus.JSONFormatter{})

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		l.WithFields(logrus.Fields{
			"user_id":    42,
			"event":      "login",
			"ip_address": "192.168.1.100",
		}).Info("User login event recorded")

		fmt.Fprintf(w, "Login successful")
	})

    . . .
}