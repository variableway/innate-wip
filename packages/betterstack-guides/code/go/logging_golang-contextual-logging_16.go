# Source: https://betterstack.com/community/guides/logging/golang-contextual-logging/
# Original language: go
# Normalized: go
# Block index: 16

package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
)

// ContextKey is an alias for string type
type ContextKey string

const (
	// LoggerCtxKey is the string used to extract logger
	LoggerCtxKey ContextKey = "logger"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))

	loginHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Fetch the Logger from Context
		ctx := r.Context()
		// Grab the Logger from the context
		logger := ctx.Value(LoggerCtxKey).(*slog.Logger)
		logger.ErrorContext(ctx, "failed to login")

		w.WriteHeader(http.StatusOK)
	})

	// Wrap your handler with the LoggerMiddleware
	http.Handle("/login", LoggerMiddleware(loginHandler, logger))
}

// LoggerMiddleware adds a logger to the requests
func LoggerMiddleware(next http.Handler, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add the logger to the context using our special Logger
		ctx := context.WithValue(r.Context(), LoggerCtxKey, logger)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}