# Source: https://betterstack.com/community/guides/logging/golang-contextual-logging/
# Original language: go
# Normalized: go
# Block index: 10

package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/google/uuid"
	slogctx "github.com/veqryn/slog-context"
)

func main() {
	// Add a few default environmental attributes that always are included
	defaultAttrs := []slog.Attr{
		slog.String("service", "authService"),
		slog.String("node", "auth-node-1"),
		slog.String("environment", "production"),
	}

	// Create a Logger and apply the Default attrs to the handler
	baseHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}).
		WithAttrs(defaultAttrs)
    [highlight]
	customHandler := slogctx.NewHandler(baseHandler, nil)
    [/highlight]
	logger := slog.New(customHandler)

	logger.Debug("Starting authentication service")
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		// Create Request ID for tracing
		request_id := uuid.NewString()
		user_id := uuid.NewString()
		ctx := r.Context()

		// You can add arbitrary key/value pairs to the context
    [highlight]
		ctx = slogctx.Append(ctx, "request_id", request_id)
		ctx = slogctx.Append(ctx, "user_id", user_id)
    [/highlight]

		// Pass contextual information using the context
		logger.ErrorContext(ctx, "failed to login",
			slog.Group("payload",
				slog.String("username", "Harry Potter"),
				slog.String("auth_method", "password"),
			),
		)
	})

	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}