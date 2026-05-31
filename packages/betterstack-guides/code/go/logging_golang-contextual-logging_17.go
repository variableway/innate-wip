# Source: https://betterstack.com/community/guides/logging/golang-contextual-logging/
# Original language: go
# Normalized: go
# Block index: 17

package main

import (
	"log/slog"
	"net/http"
	"os"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))

	as := &AuthService{
		logger: logger,
	}
	// Regular Login handler
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		loginHandler(w, r, logger)
	})
	// Logging with Struct
	http.HandleFunc("/login-struct", as.loginHandler)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}

// loginHandler that accepts the logger as a parameter
func loginHandler(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	logger.Error("failed to login")
}

// A struct holding the Logger to reduce dependency and avoid verbositiy
type AuthService struct {
	logger *slog.Logger
}

func (as *AuthService) loginHandler(w http.ResponseWriter, r *http.Request) {
	as.logger.Error("failed to login")
}