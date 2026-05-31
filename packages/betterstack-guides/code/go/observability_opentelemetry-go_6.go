# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 6

[label main.go]
package main

import (
	"context"
	"embed"
[highlight]
	"errors"
[/highlight]
	"log"
	"net/http"
	"os"

	"github.com/betterstack-community/go-image-upload/db"
	"github.com/betterstack-community/go-image-upload/redisconn"
	"github.com/joho/godotenv"
[highlight]
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
[/highlight]
)

. . .

func main() {
[highlight]
	ctx := context.Background()

	otelShutdown, err := setupOTelSDK(ctx)
	if err != nil {
		log.Fatal(err)
	}

	defer func() {
		err = errors.Join(err, otelShutdown(ctx))
		log.Println(err)
	}()
[/highlight]

	mux := http.NewServeMux()

	mux.HandleFunc("GET /auth/github/callback", completeGitHubAuth)

	mux.HandleFunc("GET /auth/github", redirectToGitHubLogin)

	mux.HandleFunc("GET /auth/logout", logout)

	mux.HandleFunc("GET /auth", renderAuth)

	mux.HandleFunc("GET /", getUser)

[highlight]
	httpSpanName := func(operation string, r *http.Request) string {
		return fmt.Sprintf("HTTP %s %s", r.Method, r.URL.Path)
	}

	handler := otelhttp.NewHandler(
		mux,
		"/",
		otelhttp.WithSpanNameFormatter(httpSpanName),
	)

	log.Println("Server started on port 8000")

	log.Fatal(http.ListenAndServe(":8000", handler))
[/highlight]
}