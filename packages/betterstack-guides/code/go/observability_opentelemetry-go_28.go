# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 28

[label handler.go]
package main

import (
	. . .
    [highlight]
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
    [/highlight]

	"github.com/betterstack-community/go-image-upload/models"
)

. . .

func requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        [highlight]
		ctx, span := tracer.Start(
			r.Context(),
			"requireAuth",
			trace.WithSpanKind(trace.SpanKindServer),
		)
        [/highlight]

		cookie, err := r.Cookie(sessionCookieKey)
		if err != nil {
			http.Redirect(w, r, "/auth", http.StatusSeeOther)
            [highlight]
			span.AddEvent(
				"redirecting to /auth",
				trace.WithAttributes(
					attribute.String("reason", "missing session cookie"),
				),
			)
			span.End()
            [/highlight]
			return
		}

        [highlight]
		span.SetAttributes(
			attribute.String("app.cookie.value", cookie.Value),
		)
        [/highlight]

		email, err := redisConn.GetSessionToken(ctx, cookie.Value)
		if err != nil {
			http.Redirect(w, r, "/auth", http.StatusSeeOther)
            [highlight]
			span.AddEvent(
				"redirecting to /auth",
				trace.WithAttributes(
					attribute.String("reason", err.Error()),
				))
			span.End()
            [/highlight]
			return
		}

		ctx = context.WithValue(r.Context(), "email", email)

		req := r.WithContext(ctx)

        [highlight]
		span.SetStatus(codes.Ok, "authenticated successfully")

		span.End()
        [/highlight]

		next.ServeHTTP(w, req)
	})
}

. . .