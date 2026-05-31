# Source: https://betterstack.com/community/guides/logging/golang-contextual-logging/
# Original language: go
# Normalized: go
# Block index: 18

package main

import (
	"log/slog"
	"net/http"
	"os"
)

func init() {
	// Setup and configure you're logger how you want it
    logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))
	// You can set the default logger using the Slog package, it will modify all calls to slog to use the configured logger
	slog.SetDefault(logger)
}

func main() {
	slog.Debug("Starting authentication service")

	http.HandleFunc("/login", loginHandler)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		slog.Error("the server crashed")
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	slog.Error("failed to login")
}