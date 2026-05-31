# Source: https://betterstack.com/community/guides/logging/golang-contextual-logging/
# Original language: go
# Normalized: go
# Block index: 13

package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"

	slogctx "github.com/veqryn/slog-context"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.20.0"
	"go.opentelemetry.io/otel/trace"
)

const (
	OtelTraceID = "TraceID"
	OtelSpanID  = "SpanID"
)

// InitTracer returns an Mock Tracer
func InitTracer(ctx context.Context, service string) trace.Tracer {
	client := otlptracegrpc.NewClient(
		otlptracegrpc.WithInsecure(),
	)
	exporter, err := otlptrace.New(ctx, client)
	if err != nil {
		log.Fatal("creating OTLP trace exporter: %w", err)
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(newResource(service)),
	)

	return tp.Tracer(service)
}

func newResource(service string) *resource.Resource {
	return resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceName(service),
		semconv.ServiceVersion("0.0.1"),
	)
}

// TracingMiddleware extracts OTEL headers and adds them to the request context.
func TracingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract headers
		spanID := r.Header.Get(OtelSpanID)
		traceID := r.Header.Get(OtelTraceID)

		// Add values to the request context
		ctx := r.Context()
		if spanID != "" {
			ctx = slogctx.Append(ctx, OtelSpanID, spanID)
		}
		if traceID != "" {
			ctx = slogctx.Append(ctx, OtelTraceID, traceID)
		}

		// Pass the request with the updated context to the next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
func main() {
	// Add a few default environmental attributes that always are included
	rootCtx := context.Background()
	tracer := InitTracer(rootCtx, "authService")
	// Create a Logger and apply the Default attrs to the handler
	baseHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true})
	// Wrap the base handler with slogctx to handle context logging
	customHandler := slogctx.NewHandler(baseHandler, nil)
	logger := slog.New(customHandler)
	logger.Debug("Starting authentication service")

	loginHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Create Trace
		ctx, span := tracer.Start(r.Context(), "login")
		defer span.End()
		// Add Contextual information for this Function call
		logger.ErrorContext(ctx, "failed to login",
			slog.Group("payload",
				slog.String("username", "Harry Potter"),
				slog.String("auth_method", "password"),
			),
		)

		w.WriteHeader(http.StatusOK)
	})

	// Wrap your handler with the TracingMiddleware
	http.Handle("/login", TracingMiddleware(loginHandler))

	// Start the HTTP server
	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Error("the server crashed")
	}
}