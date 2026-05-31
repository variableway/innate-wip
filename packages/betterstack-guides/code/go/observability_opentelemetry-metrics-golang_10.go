# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 10

package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)


func init() {
	_ = godotenv.Load()
}

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
    [highlight]

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello world!"))
	})

	log.Println("Starting HTTP server on port 8000")

	if err := http.ListenAndServe(":8000", mux); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}