# Source: https://betterstack.com/community/guides/logging/golang-contextual-logging/
# Original language: go
# Normalized: go
# Block index: 3

package main

import (
	"log/slog"
	"net/http"
)

func main() {
	slog.Debug("Starting authentication service")

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		slog.Error("failed to login")
	})

	if err := http.ListenAndServe(":8080", nil); err != nil {
		slog.Error("the server crashed")
	}
}