# Source: https://betterstack.com/community/guides/logging/golang-contextual-logging/
# Original language: go
# Normalized: go
# Block index: 7

package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/google/uuid"
)

[highlight]
type ContextHandler struct {
	slog.Handler
}

// Handle overrides the default Handle method to add context values.
func (h *ContextHandler) Handle(ctx context.Context, r slog.Record) error {
	if requestID, ok := ctx.Value("request_id").(string); ok {
		r.AddAttrs(slog.String("request_id", requestID))
	}
	if userID, ok := ctx.Value("user_id").(string); ok {
		r.AddAttrs(slog.String("user_id", userID))
	}
	return h.Handler.Handle(ctx, r)
}
[/highlight]

func main() {
	// Add a few default environmental attributes that always are included
	defaultAttrs := []slog.Attr{
		slog.String("service", "authService"),
		slog.String("node", "auth-node-1"),
		slog.String("environment", "production"),
	}

	// Create a Logger and apply the Default attrs to the handler
[highlight]
	baseHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}).WithAttrs(defaultAttrs)
	customHandler := &ContextHandler{Handler: baseHandler}
	logger := slog.New(customHandler)

	logger.Debug("Starting authentication service")
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		// Create Request ID for tracing
		request_id := uuid.NewString()
		user_id := uuid.NewString()
		ctx := r.Context()

		ctx = context.WithValue(ctx, "request_id", request_id)
		ctx = context.WithValue(ctx, "user_id", user_id)
		// Pass contextual information using the context
		logger.ErrorContext(ctx, "failed to login",
			slog.Group("payload",
				slog.String("username", "Harry Potter"),
				slog.String("auth_method", "password"),
			),
		)
	})
[/highlight]

	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}